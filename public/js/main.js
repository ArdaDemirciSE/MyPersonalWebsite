;(function () {
	
	'use strict';



	var isMobile = {
		Android: function() {
			return navigator.userAgent.match(/Android/i);
		},
			BlackBerry: function() {
			return navigator.userAgent.match(/BlackBerry/i);
		},
			iOS: function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
			Opera: function() {
			return navigator.userAgent.match(/Opera Mini/i);
		},
			Windows: function() {
			return navigator.userAgent.match(/IEMobile/i);
		},
			any: function() {
			return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
		}
	};

	var fullHeight = function() {

		if ( !isMobile.any() ) {
			$('.js-fullheight').css('height', $(window).height());
			$(window).resize(function(){
				$('.js-fullheight').css('height', $(window).height());
			});
		}

	};


	var counter = function() {
		$('.js-counter').countTo({
			 formatter: function (value, options) {
	      return value.toFixed(options.decimals);
	    },
		});
	};


	var counterWayPoint = function() {
		if ($('#colorlib-counter').length > 0 ) {
			$('#colorlib-counter').waypoint( function( direction ) {
										
				if( direction === 'down' && !$(this.element).hasClass('animated') ) {
					setTimeout( counter , 400);					
					$(this.element).addClass('animated');
				}
			} , { offset: '90%' } );
		}
	};

	var contentWayPoint = function() {
		var i = 0;
		$('.animate-box').waypoint( function( direction ) {

			if( direction === 'down' && !$(this.element).hasClass('animated') ) {
				
				i++;

				$(this.element).addClass('item-animate');
				setTimeout(function(){

					$('body .animate-box.item-animate').each(function(k){
						var el = $(this);
						setTimeout( function () {
							var effect = el.data('animate-effect');
							if ( effect === 'fadeIn') {
								el.addClass('fadeIn animated');
							} else if ( effect === 'fadeInLeft') {
								el.addClass('fadeInLeft animated');
							} else if ( effect === 'fadeInRight') {
								el.addClass('fadeInRight animated');
							} else {
								el.addClass('fadeInUp animated');
							}

							el.removeClass('item-animate');
						},  k * 200, 'easeInOutExpo' );
					});
					
				}, 100);
				
			}

		} , { offset: '85%' } );
	};


	var burgerMenu = function() {

		$('.js-colorlib-nav-toggle').on('click', function(event){
			event.preventDefault();
			var $this = $(this);

			if ($('body').hasClass('offcanvas')) {
				$this.removeClass('active');
				$('body').removeClass('offcanvas');	
			} else {
				$this.addClass('active');
				$('body').addClass('offcanvas');	
			}
		});



	};

	var mobileMenuOutsideClick = function() {

		$(document).click(function (e) {
	    var container = $("#colorlib-aside, .js-colorlib-nav-toggle");
	    if (!container.is(e.target) && container.has(e.target).length === 0) {

	    	if ( $('body').hasClass('offcanvas') ) {

    			$('body').removeClass('offcanvas');
    			$('.js-colorlib-nav-toggle').removeClass('active');
			
	    	}
	    	
	    }
		});

		$(window).scroll(function(){
			if ( $('body').hasClass('offcanvas') ) {

    			$('body').removeClass('offcanvas');
    			$('.js-colorlib-nav-toggle').removeClass('active');
			
	    	}
		});

	};

	var clickMenu = function() {

		$('#navbar a:not([class="external"])').click(function(event){
			var section = $(this).data('nav-section'),
				navbar = $('#navbar');

				if ( $('[data-section="' + section + '"]').length ) {
			    	$('html, body').animate({
			        	scrollTop: $('[data-section="' + section + '"]').offset().top - 55
			    	}, 500);
			   }

		    if ( navbar.is(':visible')) {
		    	navbar.removeClass('in');
		    	navbar.attr('aria-expanded', 'false');
		    	$('.js-colorlib-nav-toggle').removeClass('active');
		    }

		    event.preventDefault();
		    return false;
		});


	};

	var navActive = function(section) {

		var $el = $('#navbar > ul');
		$el.find('li').removeClass('active');
		$el.each(function(){
			$(this).find('a[data-nav-section="'+section+'"]').closest('li').addClass('active');
		});

	};

	var navigationSection = function() {

		var $section = $('section[data-section]');
		
		$section.waypoint(function(direction) {
		  	
		  	if (direction === 'down') {
		    	navActive($(this.element).data('section'));
		  	}
		}, {
	  		offset: '150px'
		});

		$section.waypoint(function(direction) {
		  	if (direction === 'up') {
		    	navActive($(this.element).data('section'));
		  	}
		}, {
		  	offset: function() { return -$(this.element).height() + 155; }
		});

	};






	var sliderMain = function() {
		
	  	$('#colorlib-hero .flexslider').flexslider({
			animation: "fade",
			slideshowSpeed: 5000,
			directionNav: true,
			start: function(){
				setTimeout(function(){
					$('.slider-text').removeClass('animated fadeInUp');
					$('.flex-active-slide').find('.slider-text').addClass('animated fadeInUp');
				}, 500);
			},
			before: function(){
				setTimeout(function(){
					$('.slider-text').removeClass('animated fadeInUp');
					$('.flex-active-slide').find('.slider-text').addClass('animated fadeInUp');
				}, 500);
			}

	  	});

	};

	var stickyFunction = function() {
		if (typeof jQuery !== 'undefined' && jQuery.fn && typeof jQuery.fn.stick_in_parent !== 'undefined') {
			try {
				var h = $('.image-content').outerHeight();
				
				if ($(window).width() <= 992) {
					$("#sticky_item").trigger("sticky_kit:detach");
				} else {
					$('.sticky-parent').removeClass('stick-detach');
					$("#sticky_item").stick_in_parent();
				}

				$(window).resize(function(){
					if ($(window).width() <= 992) {
						$("#sticky_item").trigger("sticky_kit:detach");
					} else {
						$('.sticky-parent').removeClass('stick-detach');
						$("#sticky_item").stick_in_parent();
					}
				});
			} catch (error) {
				console.warn('Sticky-kit initialization failed:', error);
			}
		}
	};

	var owlCrouselFeatureSlide = function() {
		$('.owl-carousel').owlCarousel({
			animateOut: 'fadeOut',
		   animateIn: 'fadeIn',
		   autoplay: true,
		   loop:true,
		   margin:0,
		   nav:true,
		   dots: false,
		   autoHeight: true,
		   items: 1,
		   navText: [
		      "<i class='icon-arrow-left3 owl-direction'></i>",
		      "<i class='icon-arrow-right3 owl-direction'></i>"
	     	]
		})
	};

	$(function(){
		fullHeight();
		counter();
		counterWayPoint();
		contentWayPoint();
		burgerMenu();

		clickMenu();
		navigationSection();


		mobileMenuOutsideClick();
		sliderMain();
		stickyFunction();
		owlCrouselFeatureSlide();
	});

	const translations = {
	  tr: {
	    position: "YAZILIM MÜHENDİSİ",
	    about: "HAKKIMDA",
	    skills: "YETENEKLERİM",
	    education: "EĞİTİM",
	    experience: "DENEYİM",
	    contact: "İLETİŞİM",
	    
	    aboutMe: "HAKKIMDA",
	    whoAmI: "BEN KİMİM?",
	    aboutText: "21 yaşında, Mehmet Akif Ersoy Üniversitesi'nde son sınıf Yazılım Mühendisliği öğrencisiyim ve yazılım alanında sürekli gelişime odaklanıyorum. Web geliştirme yolculuğum ikinci sınıfta Node.js ile başladı ve ölçeklenebilir web uygulamaları geliştirmeye olan tutkum o günden beri devam ediyor. IFS Türkiye'deki değerli yaz stajım sırasında Node.js ve Express.js kullanarak kurumsal düzeyde bir e-fatura web projesi geliştirdim, veritabanı altyapısını kurdum ve modern web teknolojileri ile tam kapsamlı bir çözüm oluşturdum.",
	    aboutText2: "Üçüncü yılımda mobil geliştirme ve yapay zeka alanlarında deneyim kazandıktan sonra, backend teknolojilerinde uzmanlaşmaya karar verdim. Şu anda, ASP.NET Core ile mikroservis tabanlı uygulamalar geliştiriyorum. Docker ve Kubernetes ile konteynerizasyon süreçlerini yönetirken, RabbitMQ ve Redis gibi gelişmiş araçları kullanarak dağıtık sistemler tasarlıyorum. DevOps pratiklerini benimseyerek CI/CD süreçlerini oluşturuyor, Clean Architecture ve SOLID prensipleri ile yüksek performanslı ve ölçeklenebilir sistemler geliştiriyorum.",
	    
	    mySkills: "YETENEKLERİM",
	    programmingLanguages: "Programlama Dilleri",
	    frameworks: "Frameworks & Kütüphaneler",
	    databases: "Veritabanları",
	    tools: "Araçlar",

	    myEducation: "EĞİTİM BİLGİLERİM",
	    bachelorDegree: "LİSANS DERECESİ",
	    university: "Mehmet Akif Ersoy Üniversitesi",
	    department: "Yazılım Mühendisliği",
	    educationPeriod: "Eyl 2021 - Haz 2025",
	    course1: "Veri Yapıları ve Algoritmalar",
	    course2: "HTML5, CSS3, Javascript",
	    course3: "Java, Python",
	    course4: "Veritabanı Yönetim Sistemleri",
	    activities: "Kulüp ve Aktiviteler: IEEE, Google Developer Student Clubs - Üye",

	    workExperience: "İŞ DENEYİMİ",
	    internshipTitle: "IFS Türkiye - Yazılım Mühendisi Yaz Stajı",
	    internshipDate: "2023",
	    internshipDesc: "IFS'deki yaz stajım sırasında, kurumsal düzeyde web teknolojileri ile çalışma fırsatı buldum. IFS Developer Studio'da varlıklar ve projeksiyonlar oluşturarak e-fatura web projesi için gerekli veritabanı altyapısını kurdum. Projenin ön yüz geliştirmesini HTML5 ve CSS3 kullanarak modern ve kullanıcı dostu bir tasarımla gerçekleştirdim. Arka uç geliştirmesinde Node.js ve Express.js teknolojilerini kullanarak, kullanıcı kimlik doğrulama, veri yönetimi, fatura oluşturma ve görüntüleme gibi temel işlevleri implemente ettim. IFS sisteminin RESTful API'si ile entegrasyon sağlayarak, veritabanı işlemlerini güvenli ve etkili bir şekilde yönettim.",

	    contactMe: "İLETİŞİME GEÇİN",
	    name: "İsminiz",
	    email: "E-posta Adresiniz",
	    subject: "Konu",
	    message: "Mesajınız",
	    send: "Gönder",
	    namePlaceholder: "Adınızı giriniz",
	    emailPlaceholder: "E-posta adresinizi giriniz",
	    subjectPlaceholder: "Konuyu giriniz",
	    messagePlaceholder: "Mesajınızı giriniz",
	    fullName: "Arda DEMİRCİ",
	    
	    softwareEngineering: "Yazılım Mühendisliği",
	    backend: "Backend",
	    developer: "Geliştirici",
	    databaseAdmin: "Veritabanı Yöneticisi",
	    languageTitle: "Dil Seçimi",
	    themeToggleText: "Karanlık Moda Geç",
	    lightModeText: "Karanlık Moda Geç",
	    darkModeText: "Açık Moda Geç",
	    downloadCV: "CV'mi İndir",
	    sendButton: "Mesaj Gönder",
	    sending: "Gönderiliyor...",
	    messageSent: "Mesajınız başarıyla gönderildi!",
	    messageError: "Mesaj gönderilemedi. Lütfen tekrar deneyin.",
	    formValidation: {
	      nameRequired: "İsim alanı zorunludur",
	      emailRequired: "E-posta alanı zorunludur",
	      emailInvalid: "Geçerli bir e-posta adresi giriniz",
	      subjectRequired: "Konu alanı zorunludur",
	      messageRequired: "Mesaj alanı zorunludur"
	    }
	  },
	  en: {
	    position: "SOFTWARE ENGINEER",
	    about: "About",
	    skills: "Skills",
	    education: "Education",
	    experience: "Experience",
	    contact: "Contact",
	    
	    aboutMe: "About Me",
	    whoAmI: "Who Am I?",
	    aboutText: "I am a 21-year-old final-year Software Engineering student at Mehmet Akif Ersoy University, dedicated to continuous growth and development in the field. My journey into web development began in my second year with Node.js, igniting a lasting passion for building scalable web applications. During my valuable summer internship at IFS Turkey, I developed an enterprise-level e-invoice web project using Node.js and Express.js, established the database infrastructure, and created a comprehensive solution using modern web technologies.",
	    aboutText2: "After gaining experience in mobile development and artificial intelligence during my third year, I decided to specialize in backend technologies. Currently, I'm developing microservice-based applications using ASP.NET Core. While managing containerization processes with Docker and Kubernetes, I design distributed systems using advanced tools like RabbitMQ and Redis. By embracing DevOps practices, I establish CI/CD pipelines and develop high-performance, scalable systems following Clean Architecture and SOLID principles.",
	    
	    mySkills: "My Skills",
	    programmingLanguages: "Programming Languages",
	    frameworks: "Frameworks & Libraries",
	    databases: "Databases",
	    tools: "Tools",

	    myEducation: "My Education",
	    bachelorDegree: "BACHELOR'S DEGREE",
	    university: "Mehmet Akif Ersoy University",
	    department: "Software Engineering",
	    educationPeriod: "Sep 2021 - Jun 2025",
	    course1: "Data Structures and Algorithms",
	    course2: "HTML5, CSS3, Javascript",
	    course3: "Java, Python",
	    course4: "Database Management Systems",
	    activities: "Clubs and Activities: IEEE, Google Developer Student Clubs - Member",

	    workExperience: "Work Experience",
	    internshipTitle: "IFS Türkiye - Software Engineer Summer Intern",
	    internshipDate: "2023",
	    internshipDesc: "During my summer internship at IFS, I had the opportunity to work with enterprise-level web technologies. I established the database infrastructure for an e-invoice web project by creating entities and projections in IFS Developer Studio. I developed the front-end using HTML5 and CSS3, implementing a modern and user-friendly design. For the back-end, I utilized Node.js and Express.js to implement core functionalities including user authentication, data management, invoice generation, and viewing capabilities. I managed database operations efficiently and securely by integrating with the IFS system's RESTful API.",

	    contactMe: "Contact Me",
	    name: "Your Name",
	    email: "Your Email",
	    subject: "Subject",
	    message: "Message",
	    send: "Send",
	    namePlaceholder: "Enter your name",
	    emailPlaceholder: "Enter your email",
	    subjectPlaceholder: "Enter subject",
	    messagePlaceholder: "Enter your message",
	    fullName: "Arda Demirci",
	    
	    softwareEngineering: "Software Engineering",
	    backend: "Backend",
	    developer: "Developer",
	    databaseAdmin: "Database Administrator",
	    languageTitle: "Language Choose",
	    themeToggleText: "Switch to Dark Mode",
	    lightModeText: "Switch to Dark Mode",
	    darkModeText: "Switch to Light Mode",
	    downloadCV: "Download my CV",
	    sendButton: "Send Message",
	    sending: "Sending...",
	    messageSent: "Your message has been sent successfully!",
	    messageError: "Message could not be sent. Please try again.",
	    formValidation: {
	      nameRequired: "Name field is required",
	      emailRequired: "Email field is required",
	      emailInvalid: "Please enter a valid email address",
	      subjectRequired: "Subject field is required",
	      messageRequired: "Message field is required"
	    }
	  }
	};

	function updateThemeText(isDark) {
	    const lang = localStorage.getItem('language') || 'tr';
	    const themeText = document.querySelector('.theme-text');
	    if (isDark) {
	        themeText.textContent = translations[lang]['darkModeText'];
	    } else {
	        themeText.textContent = translations[lang]['lightModeText'];
	    }
	}

	function setTheme(isDark) {
	    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
	    localStorage.setItem('theme', isDark ? 'dark' : 'light');
	    updateThemeText(isDark);
	}

	$(document).ready(function() {
		let isOpen = true;
		
		$('.education-header').on('click', function() {
			isOpen = !isOpen;
			const content = $('#lisansContent');
			const icon = $('.toggle-icon');
			
			if (!isOpen) {
				content.hide();
				icon.text('+');
			} else {
				content.show();
				icon.text('−');
			}
		});
	});

	function updateCVLanguage(lang) {
	    const cvBtn = document.getElementById('cvDownloadBtn');
	    cvBtn.href = lang === 'tr' ? 'documents/Arda_Demirci_CV_TR.pdf' : 'documents/Arda_Demirci_CV_EN.pdf';
	}

	document.getElementById("contactForm").addEventListener("submit", async function(event) {
	  event.preventDefault();
	  
	  const currentLang = localStorage.getItem('language') || 'tr';
	  const submitButton = this.querySelector('button[type="submit"]');
	  const statusMessage = document.getElementById("statusMessage");
	  
	  const formData = {
	    from_name: this.from_name.value.trim(),
	    reply_to: this.reply_to.value.trim(),
	    subject: this.subject.value.trim(),
	    message: this.message.value.trim()
	  };

	  const errors = validateForm(formData, currentLang);
	  if (errors.length > 0) {
	    statusMessage.style.color = 'red';
	    statusMessage.innerHTML = errors.join('<br>');
	    return;
	  }

	  submitButton.disabled = true;
	  submitButton.textContent = translations[currentLang].sending;
	  
	  try {
	    const response = await fetch('/api/send-email', {
	      method: 'POST',
	      headers: {
	        'Content-Type': 'application/json'
	      },
	      body: JSON.stringify(formData)
	    });

	    const data = await response.json();
	    
	    if (response.ok) {
	      statusMessage.style.color = 'green';
	      statusMessage.textContent = translations[currentLang].messageSent;
	      this.reset();
	    } else {
	      throw new Error(data.error);
	    }
	  } catch (error) {
	    statusMessage.style.color = 'red';
	    statusMessage.textContent = translations[currentLang].messageError;
	  } finally {
	    submitButton.disabled = false;
	    submitButton.textContent = translations[currentLang].sendButton;
	  }
	});

	function validateForm(formData, lang) {
	  const errors = [];
	  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	  
	  if (!formData.from_name) {
	    errors.push(translations[lang].formValidation.nameRequired);
	  }
	  if (!formData.reply_to) {
	    errors.push(translations[lang].formValidation.emailRequired);
	  } else if (!emailRegex.test(formData.reply_to)) {
	    errors.push(translations[lang].formValidation.emailInvalid);
	  }
	  if (!formData.subject) {
	    errors.push(translations[lang].formValidation.subjectRequired);
	  }
	  if (!formData.message) {
	    errors.push(translations[lang].formValidation.messageRequired);
	  }
	  
	  return errors;
	}

	function initializeThemeAndLanguage() {
	  const themeToggle = document.getElementById('theme-toggle');
	  const themeText = document.querySelector('.theme-text');
	  
	  function setTheme(isDark) {
	    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
	    localStorage.setItem('theme', isDark ? 'dark' : 'light');
	    const lang = localStorage.getItem('language') || 'tr';
	    themeText.textContent = isDark ? translations[lang].darkModeText : translations[lang].lightModeText;
	  }

	  let isDark = localStorage.getItem('theme') === 'dark';
	  setTheme(isDark);
	  
	  themeToggle.addEventListener('click', () => {
	    isDark = !isDark;
	    setTheme(isDark);
	  });

	  const langButtons = document.querySelectorAll('.lang-btn');
	  
	  function changeLanguage(lang) {
	    document.querySelectorAll('[data-translate]').forEach(element => {
	      const key = element.getAttribute('data-translate');
	      if (translations[lang][key]) {
	        element.textContent = translations[lang][key];
	      }
	    });

	    langButtons.forEach(btn => {
	      btn.classList.remove('active');
	      if (btn.dataset.lang === lang) {
	        btn.classList.add('active');
	      }
	    });

	    localStorage.setItem('language', lang);
	    updateCVLanguage(lang);
	    document.documentElement.lang = lang;
	  }

	  langButtons.forEach(btn => {
	    btn.addEventListener('click', () => {
	      changeLanguage(btn.dataset.lang);
	    });
	  });

	  const savedLanguage = localStorage.getItem('language') || 'tr';
	  changeLanguage(savedLanguage);
	}

	document.addEventListener('DOMContentLoaded', initializeThemeAndLanguage);

}());