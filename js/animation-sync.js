// Synchronisation continue des animations entre les pages
document.addEventListener('DOMContentLoaded', function() {
    const ANIMATION_DURATION = 30; // 30 secondes - durée de l'animation horizontalSweep
    
    // Calculer la position actuelle dans le cycle d'animation basée sur le temps absolu
    function getCurrentAnimationOffset() {
        // Vérifier s'il y a un timestamp sauvegardé (navigation entre pages)
        const savedTimestamp = sessionStorage.getItem('portfolio_animation_timestamp');
        
        let now;
        if (savedTimestamp && (Date.now() - parseInt(savedTimestamp)) < 1000) {
            // Si on vient juste de naviguer (moins d'1 seconde), utiliser le timestamp sauvé
            now = parseInt(savedTimestamp) / 1000;
        } else {
            // Sinon, utiliser le temps actuel
            now = Date.now() / 1000;
        }
        
        const cyclePosition = now % ANIMATION_DURATION; // Position dans le cycle de 30s
        return cyclePosition;
    }

    // Synchroniser l'animation de fond principal
    function syncBackgroundAnimation() {
        const heroSection = document.querySelector('.page-hero');
        if (!heroSection) return;

        const offset = getCurrentAnimationOffset();
        const delay = -offset; // Décalage négatif pour reprendre à la bonne position
        
        // Créer ou mettre à jour le style pour l'animation synchronisée
        let syncStyle = document.getElementById('sync-animation-style');
        if (!syncStyle) {
            syncStyle = document.createElement('style');
            syncStyle.id = 'sync-animation-style';
            document.head.appendChild(syncStyle);
        }
        
        syncStyle.textContent = `
            .page-hero::before {
                animation: horizontalSweep 30s ease-in-out infinite;
                animation-delay: ${delay}s !important;
            }
        `;
    }

    // Synchroniser les bulles flottantes avec le même principe
    function syncFloatingElements() {
        const bubbles = document.querySelectorAll('.floating-bubbles span');
        const shapes = document.querySelectorAll('.floating-shapes span');
        
        [...bubbles, ...shapes].forEach((element, index) => {
            // Chaque élément a sa propre durée d'animation (récupérée du CSS)
            const computedStyle = getComputedStyle(element);
            const duration = parseFloat(computedStyle.animationDuration) || 8; // fallback 8s
            const originalDelay = parseFloat(computedStyle.animationDelay) || 0;
            
            const now = Date.now() / 1000;
            const cyclePosition = (now + originalDelay) % duration;
            const newDelay = -cyclePosition;
            
            element.style.animationDelay = `${newDelay}s`;
        });
    }

    // Synchroniser l'overlay pulse
    function syncOverlayAnimation() {
        const overlay = document.querySelector('.page-hero::after');
        if (!overlay) return;
        
        const OVERLAY_DURATION = 4; // 4 secondes pour overlayPulse
        const now = Date.now() / 1000;
        const cyclePosition = now % OVERLAY_DURATION;
        const delay = -cyclePosition;
        
        // Ajouter le style pour l'overlay
        let overlayStyle = document.getElementById('sync-overlay-style');
        if (!overlayStyle) {
            overlayStyle = document.createElement('style');
            overlayStyle.id = 'sync-overlay-style';
            document.head.appendChild(overlayStyle);
        }
        
        overlayStyle.textContent = `
            .page-hero::after {
                animation: overlayPulse 4s ease-in-out infinite;
                animation-delay: ${delay}s !important;
            }
        `;
    }

    // Fonction principale de synchronisation
    function synchronizeAllAnimations() {
        syncBackgroundAnimation();
        syncFloatingElements();
        syncOverlayAnimation();
        
        // Ajouter une classe pour indiquer que tout est synchronisé
        document.body.classList.add('animations-synchronized');
    }

    // Améliorer les transitions entre pages et empêcher le reload de la page actuelle
    function setupSmoothPageTransitions() {
        // Obtenir le nom de la page actuelle
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        // Sélectionner tous les liens de navigation
        const navLinks = document.querySelectorAll('nav a[href$=".html"], .nav-links a[href$=".html"]');
        
        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href').split('/').pop();
            
            // Si le lien pointe vers la page actuelle, empêcher le rechargement
            if (linkPage === currentPage) {
                link.addEventListener('click', function(e) {
                    e.preventDefault(); // Empêcher la navigation
                    
                    // Optionnel : effet visuel pour indiquer qu'on est déjà sur cette page
                    link.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        link.style.transform = 'scale(1)';
                    }, 150);
                    
                    return false;
                });
            } else {
                // Pour les autres pages, ajouter un effet de transition subtil
                link.addEventListener('click', function(e) {
                    // Sauvegarder l'état de l'animation avant de changer de page
                    const currentTime = Date.now();
                    sessionStorage.setItem('portfolio_animation_timestamp', currentTime.toString());
                    
                    // Effet de transition subtil
                    document.body.style.transition = 'opacity 0.1s ease-out';
                    document.body.style.opacity = '0.98';
                    
                    // Restaurer l'opacité après un court délai
                    setTimeout(() => {
                        document.body.style.opacity = '1';
                    }, 50);
                });
            }
        });
    }

    // Démarrer la synchronisation après un court délai pour laisser le CSS se charger
    setTimeout(initSync, 100);
    
    // Re-synchroniser quand la page redevient visible
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            setTimeout(synchronizeAllAnimations, 50);
        }
    });

    // Exposer la fonction pour usage externe (navigation AJAX, etc.)
    window.resyncAnimations = synchronizeAllAnimations;
});

// Styles pour améliorer la synchronisation
const syncStyles = document.createElement('style');
syncStyles.textContent = `
    /* Assurer que les animations sont bien configurées pour la synchronisation */
    .page-hero::before,
    .page-hero::after,
    .floating-bubbles span,
    .floating-shapes span {
        animation-fill-mode: both;
        will-change: transform, opacity, background-position;
        transform: translateZ(0); /* Optimisation GPU */
    }

    /* Transition fluide entre les pages */
    body {
        transition: opacity 0.15s ease-out;
    }

    /* Indicateur visuel que les animations sont synchronisées */
    .animations-synchronized .page-hero {
        opacity: 1;
    }

    /* Optimisations de performance */
    .page-hero {
        contain: layout style paint;
        transform: translateZ(0);
    }
`;
document.head.appendChild(syncStyles);