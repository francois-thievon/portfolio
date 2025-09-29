// Animations JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
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
    }

    // Animation de typing pour les titres (si présents)
    function initTypingAnimation() {
        const typingElements = document.querySelectorAll('.typing-effect');
        
        typingElements.forEach(element => {
            const originalText = element.innerHTML;
            element.innerHTML = '';
            
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
                    
                    element.innerHTML = text;
                    
                    if (!isTag) {
                        setTimeout(typeWriter, 100);
                    } else {
                        setTimeout(typeWriter, 0);
                    }
                    
                    i++;
                }
            }
            
            setTimeout(typeWriter, 1000);
        });
    }

    // Animation des compteurs
    function initCounterAnimation() {
        const counters = document.querySelectorAll('.stat-number, .stat h3');
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

    // Animation parallax légère
    function initParallaxEffect() {
        const parallaxElements = document.querySelectorAll('.parallax');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            
            parallaxElements.forEach(element => {
                const yPos = -(scrolled * parallaxSpeed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }

    // Effet de cursor personnalisé (optionnel)
    function initCustomCursor() {
        // Vérifier si l'utilisateur est sur desktop
        if (window.innerWidth <= 768) return;
        
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: rgba(255, 107, 53, 0.8);
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
        const interactiveElements = document.querySelectorAll('a, button, .btn, .skill-item, .section-card, .project-card');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(1.5)';
                cursor.style.background = 'rgba(233, 30, 99, 0.8)';
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                cursor.style.background = 'rgba(255, 107, 53, 0.8)';
            });
        });
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

    // Initialisation de toutes les animations
    function init() {
        initScrollAnimations();
        initTypingAnimation();
        initCounterAnimation();
        initParallaxEffect();
        initCustomCursor();
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

    // Exposer showNotification globalement
    window.showNotification = showNotification;
});