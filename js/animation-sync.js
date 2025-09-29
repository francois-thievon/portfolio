// Gestion de la continuité des animations entre les pages
document.addEventListener('DOMContentLoaded', function() {
    const ANIMATION_KEY = 'portfolio_animation_time';
    const BUBBLE_KEY = 'portfolio_bubble_time';

    // Récupérer le temps d'animation sauvegardé
    function getAnimationTime() {
        const savedTime = sessionStorage.getItem(ANIMATION_KEY);
        return savedTime ? parseFloat(savedTime) : 0;
    }

    // Sauvegarder le temps d'animation
    function saveAnimationTime(time) {
        sessionStorage.setItem(ANIMATION_KEY, time.toString());
    }

    // Récupérer le temps des bulles sauvegardé
    function getBubbleTime() {
        const savedTime = sessionStorage.getItem(BUBBLE_KEY);
        return savedTime ? parseFloat(savedTime) : 0;
    }

    // Sauvegarder le temps des bulles
    function saveBubbleTime(time) {
        sessionStorage.setItem(BUBBLE_KEY, time.toString());
    }

    // Synchroniser les animations de fond
    function syncBackgroundAnimations() {
        const heroSection = document.querySelector('.page-hero');
        if (!heroSection) return;

        const startTime = getAnimationTime();
        const currentTime = Date.now();
        
        // Calculer le décalage depuis la dernière page
        const timeOffset = ((currentTime - startTime) / 1000) % 1000; // Modulo pour éviter les grands nombres

        // Appliquer le décalage aux animations CSS
        const beforeElement = heroSection;
        if (beforeElement) {
            beforeElement.style.setProperty('--animation-delay', `-${timeOffset}s`);
        }

        // Mettre à jour l'animation avec le décalage
        heroSection.style.animationDelay = `-${timeOffset}s`;
    }

    // Synchroniser les bulles flottantes
    function syncBubbleAnimations() {
        const bubbles = document.querySelectorAll('.floating-bubbles span');
        if (bubbles.length === 0) return;

        const startTime = getBubbleTime();
        const currentTime = Date.now();
        
        bubbles.forEach((bubble, index) => {
            const originalDelay = parseFloat(getComputedStyle(bubble).animationDelay) || 0;
            const timeOffset = ((currentTime - startTime) / 1000 + originalDelay) % 1000;
            
            bubble.style.animationDelay = `-${timeOffset}s`;
        });
    }

    // Démarrer les animations synchronisées
    function startSyncedAnimations() {
        const currentTime = Date.now();
        
        // Si c'est la première page ou si trop de temps s'est écoulé, réinitialiser
        const lastTime = getAnimationTime();
        if (!lastTime || (currentTime - lastTime) > 30000) { // 30 secondes max
            saveAnimationTime(currentTime);
            saveBubbleTime(currentTime);
        }

        // Synchroniser les animations
        syncBackgroundAnimations();
        syncBubbleAnimations();

        // Démarrer le tracking continu
        startAnimationTracking();
    }

    // Tracker le temps d'animation en continu
    function startAnimationTracking() {
        setInterval(() => {
            saveAnimationTime(Date.now());
            saveBubbleTime(Date.now());
        }, 1000); // Mettre à jour chaque seconde
    }

    // Améliorer la transition avec un fade fluide
    function setupPageTransition() {
        const links = document.querySelectorAll('a[href$=".html"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                // Sauvegarder l'état actuel avant de changer de page
                saveAnimationTime(Date.now());
                saveBubbleTime(Date.now());
                
                // Optionnel : effet de transition
                document.body.style.opacity = '0.95';
                setTimeout(() => {
                    document.body.style.opacity = '1';
                }, 100);
            });
        });
    }

    // Synchronisation avancée pour les formes flottantes
    function syncFloatingShapes() {
        const shapes = document.querySelectorAll('.floating-shapes span');
        if (shapes.length === 0) return;

        const startTime = getAnimationTime();
        const currentTime = Date.now();
        
        shapes.forEach((shape, index) => {
            const originalDelay = index * 0.5; // Décalage original
            const timeOffset = ((currentTime - startTime) / 1000 + originalDelay) % 1000;
            
            shape.style.animationDelay = `-${timeOffset}s`;
        });
    }

    // Initialiser tout
    function initializeContinuousAnimations() {
        // Attendre que les CSS soient chargés
        setTimeout(() => {
            startSyncedAnimations();
            syncFloatingShapes();
            setupPageTransition();
            
            // Ajouter une classe pour indiquer que les animations sont synchronisées
            document.body.classList.add('animations-synced');
        }, 100);
    }

    // Démarrer l'initialisation
    initializeContinuousAnimations();

    // Nettoyer les données anciennes au changement de session
    window.addEventListener('beforeunload', function() {
        // Garder les données pour la session, mais les nettoyer après 1 heure
        setTimeout(() => {
            sessionStorage.removeItem(ANIMATION_KEY);
            sessionStorage.removeItem(BUBBLE_KEY);
        }, 3600000); // 1 heure
    });
});

// CSS personnalisé pour améliorer la synchronisation
const style = document.createElement('style');
style.textContent = `
    /* Amélioration de la fluidité des animations */
    .page-hero::before,
    .page-hero::after {
        animation-fill-mode: both;
        animation-timing-function: linear;
    }

    .floating-bubbles span,
    .floating-shapes span {
        animation-fill-mode: both;
        animation-timing-function: linear;
    }

    /* Transition plus fluide entre les pages */
    body {
        transition: opacity 0.2s ease;
    }

    /* Assurer la continuité visuelle */
    .animations-synced .page-hero::before {
        animation-play-state: running;
    }

    /* Optimisation des performances */
    .page-hero,
    .floating-bubbles,
    .floating-shapes {
        transform: translateZ(0);
        backface-visibility: hidden;
        perspective: 1000px;
    }
`;
document.head.appendChild(style);