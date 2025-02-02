const express = require('express');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const dns = require('dns');
const { promisify } = require('util');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const resolveMx = promisify(dns.resolveMx);

async function isEmailValid(email) {
  try {
    const blockedDomains = ['tempmail.com', 'throwawaymail.com'];
    const domain = email.split('@')[1];
    
    if (blockedDomains.includes(domain)) {
      return false;
    }

    const mxRecords = await resolveMx(domain);
    if (!mxRecords || mxRecords.length === 0) {
      return false;
    }

    if (domain === 'gmail.com') {
      const [localPart] = email.split('@');
      const normalizedLocal = localPart.replace(/\./g, '').split('+')[0];
      if (normalizedLocal.length < 6) { 
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Email doğrulama hatası:', error);
    return false;
  }
}

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:", "http:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https:", "http:"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "https:", "http:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  xssFilter: true,
  noSniff: true,
  referrerPolicy: { policy: 'same-origin' }
}));

app.use(cors()); 
app.use(express.json({ limit: '10kb' }));

app.get('/fonts/flaticon/font/flaticon.css', (req, res) => {
  try {
    const filePath = path.join(__dirname, 'public/fonts/flaticon/font/flaticon.css');
    console.log('Flaticon CSS dosya yolu:', filePath);
    
    if (!require('fs').existsSync(filePath)) {
      console.error('Dosya bulunamadı:', filePath);
      return res.status(404).send('Dosya bulunamadı');
    }

    res.setHeader('Content-Type', 'text/css');
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('Flaticon CSS gönderme hatası:', err);
        if (!res.headersSent) {
          res.status(500).send('Dosya gönderilemedi');
        }
      }
    });
  } catch (error) {
    console.error('Flaticon CSS route hatası:', error);
    if (!res.headersSent) {
      res.status(500).send('Sunucu hatası');
    }
  }
});

app.get('/fonts/flaticon/font/*', (req, res, next) => {
  try {
    const filePath = path.join(__dirname, 'public', req.path);
    console.log('Font dosya yolu:', filePath);
    
    if (!require('fs').existsSync(filePath)) {
      console.error('Dosya bulunamadı:', filePath);
      return res.status(404).send('Dosya bulunamadı');
    }

    if (req.path.endsWith('.woff')) {
      res.setHeader('Content-Type', 'application/font-woff');
    } else if (req.path.endsWith('.woff2')) {
      res.setHeader('Content-Type', 'application/font-woff2');
    } else if (req.path.endsWith('.ttf')) {
      res.setHeader('Content-Type', 'application/x-font-ttf');
    } else if (req.path.endsWith('.eot')) {
      res.setHeader('Content-Type', 'application/vnd.ms-fontobject');
    } else if (req.path.endsWith('.svg')) {
      res.setHeader('Content-Type', 'image/svg+xml');
    }
    
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('Font dosyası gönderme hatası:', err);
        if (!res.headersSent) {
          next(err);
        }
      }
    });
  } catch (error) {
    console.error('Font route hatası:', error);
    if (!res.headersSent) {
      next(error);
    }
  }
});

app.use(express.static('public', {
  setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    } else if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Çok fazla istek gönderdiniz, lütfen daha sonra tekrar deneyin.' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.ip;
  }
});

app.use('/api/send-email', limiter);

const validateInput = async (req, res, next) => {
  try {
    const { from_name, reply_to, subject, message } = req.body;

    if (!from_name?.trim() || !reply_to?.trim() || !subject?.trim() || !message?.trim()) {
      return res.status(400).json({ error: 'Tüm alanlar zorunludur' });
    }

    if (from_name.length > 50) {
      return res.status(400).json({ error: 'İsim çok uzun' });
    }
    if (subject.length > 100) {
      return res.status(400).json({ error: 'Konu çok uzun' });
    }
    if (message.length > 1000) {
      return res.status(400).json({ error: 'Mesaj çok uzun' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(reply_to)) {
      return res.status(400).json({ error: 'Geçersiz email formatı' });
    }

    const isValid = await isEmailValid(reply_to);
    if (!isValid) {
      return res.status(400).json({ error: 'Geçersiz email adresi' });
    }

    req.body.from_name = escapeHtml(from_name);
    req.body.subject = escapeHtml(subject);
    req.body.message = escapeHtml(message);

    next();
  } catch (error) {
    console.error('Doğrulama hatası:', error);
    res.status(500).json({ error: 'Doğrulama işlemi başarısız' });
  }
};

async function sendEmail(mailOptions) {
  try {
    console.log('Email gönderme başlatılıyor...');
    console.log('Email kullanıcısı:', process.env.EMAIL_USER);
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    console.log('SMTP bağlantısı doğrulanıyor...');
    await transporter.verify();
    console.log('SMTP bağlantısı başarılı');

    console.log('Email gönderiliyor...', mailOptions);
    const info = await transporter.sendMail(mailOptions);
    console.log('Email başarıyla gönderildi:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email gönderme hatası detayı:', error);
    throw error;
  }
}

app.post('/api/send-email', async (req, res) => {
  try {
    const { from_name, reply_to, subject, message } = req.body;
    
    if (!from_name || !reply_to || !subject || !message) {
      return res.status(400).json({ error: 'Tüm alanlar zorunludur.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(reply_to)) {
      return res.status(400).json({ error: 'Geçersiz email adresi.' });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECIPIENT_EMAIL,
      subject: `Portfolio Contact: ${subject}`,
      text: `
        İsim: ${from_name}
        Email: ${reply_to}
        Konu: ${subject}
        Mesaj: ${message}
      `
    };

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email başarıyla gönderildi' });

  } catch (error) {
    console.error('Email gönderme hatası:', error);
    res.status(500).json({ error: 'Email gönderilemedi. Lütfen daha sonra tekrar deneyin.' });
  }
});

app.get('/documents/:file', (req, res) => {
    const file = req.params.file;
    const filePath = path.join(__dirname, 'public', 'documents', file);
    
    if (!file.endsWith('.pdf')) {
        return res.status(400).send('Sadece PDF dosyaları indirilebilir');
    }
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${file}`);
    
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('PDF dosyası gönderme hatası:', err);
            res.status(404).send('Dosya bulunamadı');
        }
    });
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public'));

app.get('/', (req, res) => {
    res.render('index', {
        GOOGLE_TAG_MANAGER_ID: process.env.GOOGLE_TAG_MANAGER_ID,
        GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID
    });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Sayfa bulunamadı' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Sunucu hatası' });
});

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
}); 