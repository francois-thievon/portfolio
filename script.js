// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
    
    // Variables globales
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section');
    
    // Navigation mobile - Toggle menu hamburger
    function toggleMobileMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    }

    // Fermer le menu mobile lors du clic sur un lien
    function closeMobileMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }

    // Event listeners pour le menu mobile
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Effet de scroll sur la navbar
    function handleNavbarScroll() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.classList.remove('scrolled');
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    }

    // Navigation active selon la section visible
    function updateActiveNavLink() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    }

    // Smooth scroll pour les liens de navigation
    function initSmoothScroll() {
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const navbarHeight = navbar.offsetHeight;
                    const targetPosition = targetSection.offsetTop - navbarHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Animation fade-in au scroll
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observer tous les éléments avec la classe fade-in
        const fadeElements = document.querySelectorAll('.fade-in');
        fadeElements.forEach(el => observer.observe(el));

        // Ajouter la classe fade-in aux éléments qui doivent s'animer
        const animatedElements = [
            '.about-content',
            '.skill-category',
            '.project-card',
            '.contact-content'
        ];

        animatedElements.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                el.classList.add('fade-in');
                observer.observe(el);
            });
        });
    }

    // Animation de typing pour le titre principal
    function initTypingAnimation() {
        const heroTitle = document.querySelector('.hero-title');
        if (!heroTitle) return;

        const originalText = heroTitle.innerHTML;
        heroTitle.innerHTML = '';
        
        let i = 0;
        let isTag = false;
        let text = '';
        
        function typeWriter() {
            if (i < originalText.length) {
                let char = originalText.charAt(i);
                
                if (char === '<') {
                    isTag = true;
                }
                
                text += char;
                
                if (char === '>') {
                    isTag = false;
                }
                
                heroTitle.innerHTML = text;
                
                if (!isTag) {
                    setTimeout(typeWriter, 100);
                } else {
                    setTimeout(typeWriter, 0);
                }
                
                i++;
            }
        }
        
        setTimeout(typeWriter, 1000);
    }

    // Animation des compteurs dans la section about
    function initCounterAnimation() {
        const counters = document.querySelectorAll('.stat h3');
        const speed = 200; // Plus bas = plus rapide

        const countUp = (counter) => {
            const target = parseInt(counter.innerText.replace('+', '').replace('%', ''));
            const count = +counter.getAttribute('data-count') || 0;
            const inc = target / speed;

            if (count < target) {
                counter.setAttribute('data-count', Math.ceil(count + inc));
                const suffix = counter.innerText.includes('+') ? '+' : 
                             counter.innerText.includes('%') ? '%' : '';
                counter.innerText = Math.ceil(count + inc) + suffix;
                setTimeout(() => countUp(counter), 1);
            } else {
                const suffix = counter.innerText.includes('+') ? '+' : 
                             counter.innerText.includes('%') ? '%' : '';
                counter.innerText = target + suffix;
            }
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    if (!counter.hasAttribute('data-animated')) {
                        counter.setAttribute('data-animated', 'true');
                        counter.setAttribute('data-count', '0');
                        countUp(counter);
                    }
                }
            });
        });

        counters.forEach(counter => observer.observe(counter));
    }

    // Gestion du formulaire de contact
    function initContactForm() {
        const contactForm = document.querySelector('.contact-form');
        
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Récupérer les données du formulaire
                const formData = new FormData(this);
                const name = formData.get('name');
                const email = formData.get('email');
                const subject = formData.get('subject');
                const message = formData.get('message');
                
                // Validation simple
                if (!name || !email || !subject || !message) {
                    showNotification('Veuillez remplir tous les champs', 'error');
                    return;
                }
                
                if (!isValidEmail(email)) {
                    showNotification('Veuillez entrer une adresse email valide', 'error');
                    return;
                }
                
                // Simuler l'envoi du message
                showNotification('Message envoyé avec succès!', 'success');
                this.reset();
            });
        }
    }

    // Validation email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Système de notifications
    function showNotification(message, type = 'info') {
        // Supprimer les notifications existantes
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Créer la notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Styles de la notification
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 350px;
        `;
        
        const notificationContent = notification.querySelector('.notification-content');
        notificationContent.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
        `;
        
        const closeButton = notification.querySelector('.notification-close');
        closeButton.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            opacity: 0.8;
        `;
        
        // Ajouter au DOM
        document.body.appendChild(notification);
        
        // Animation d'entrée
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Fermeture automatique
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
        
        // Fermeture manuelle
        closeButton.addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        });
    }

    // Animation des compétences au hover
    function initSkillsAnimation() {
        const skillItems = document.querySelectorAll('.skill-item');
        
        skillItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.05) rotateY(5deg)';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1) rotateY(0deg)';
            });
        });
    }

    // Animation parallax légère pour le hero
    function initParallaxEffect() {
        const hero = document.querySelector('.hero');
        const heroContent = document.querySelector('.hero-content');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            
            if (scrolled < hero.offsetHeight) {
                heroContent.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
            }
        });
    }

    // Effet de particules animées (optionnel)
    function initParticleEffect() {
        const hero = document.querySelector('.hero');
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                pointer-events: none;
                animation: float ${Math.random() * 3 + 2}s linear infinite;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation-delay: ${Math.random() * 2}s;
            `;
            hero.appendChild(particle);
        }
        
        // Ajouter l'animation CSS pour les particules
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float {
                0% { transform: translateY(0px) rotate(0deg); opacity: 1; }
                100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    // Initialisation de toutes les fonctionnalités
    function init() {
        initSmoothScroll();
        initScrollAnimations();
        initTypingAnimation();
        initCounterAnimation();
        initContactForm();
        initSkillsAnimation();
        initParallaxEffect();
        initParticleEffect();
        
        // Event listeners pour le scroll
        window.addEventListener('scroll', () => {
            handleNavbarScroll();
            updateActiveNavLink();
        });
        
        // Trigger initial pour les fonctions de scroll
        handleNavbarScroll();
        updateActiveNavLink();
    }

    // Démarrer l'initialisation
    init();

    // Loading screen (optionnel)
    window.addEventListener('load', function() {
        const loader = document.querySelector('.loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }
    });

    // Gestion du redimensionnement de la fenêtre
    window.addEventListener('resize', function() {
        // Fermer le menu mobile si ouvert lors du redimensionnement
        if (window.innerWidth > 768) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // Effet de cursor personnalisé (optionnel)
    function initCustomCursor() {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: rgba(102, 126, 234, 0.8);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease;
            display: none;
        `;
        document.body.appendChild(cursor);

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX - 10 + 'px';
            cursor.style.top = e.clientY - 10 + 'px';
            cursor.style.display = 'block';
        });

        document.addEventListener('mouseenter', () => {
            cursor.style.display = 'block';
        });

        document.addEventListener('mouseleave', () => {
            cursor.style.display = 'none';
        });

        // Effet sur les éléments interactifs
        const interactiveElements = document.querySelectorAll('a, button, .btn, .project-card, .skill-item');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(1.5)';
                cursor.style.background = 'rgba(118, 75, 162, 0.8)';
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                cursor.style.background = 'rgba(102, 126, 234, 0.8)';
            });
        });
    }

    // Initialiser le curseur personnalisé seulement sur desktop
    if (window.innerWidth > 768) {
        initCustomCursor();
    }
});
