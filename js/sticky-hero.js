// Gestion du header hero sticky progressif - bloquer le scroll pendant le rétrécissement
document.addEventListener('DOMContentLoaded', function() {
    // Vérifier si on est sur une page secondaire
    const body = document.body;
    const isSecondaryPage = body.classList.contains('secondary-page');
    
    if (!isSecondaryPage) {
        return; // Ne rien faire sur la page d'accueil
    }
    
    const heroSection = document.querySelector('.page-hero');
    if (!heroSection) {
        return; // Pas de section hero trouvée
    }
    
    // Trouver TOUTES les sections après le hero
    const allSectionsAfterHero = [];
    let currentElement = heroSection.nextElementSibling;
    while (currentElement) {
        if (currentElement.tagName === 'SECTION' || currentElement.tagName === 'MAIN' || currentElement.tagName === 'FOOTER') {
            allSectionsAfterHero.push(currentElement);
        }
        currentElement = currentElement.nextElementSibling;
    }
    
    // Configuration des tailles
    const maxHeight = window.innerHeight * 0.6; // 60vh en pixels
    const minHeight = 120; // Taille minimale en pixels
    const scrollRange = 400; // Distance de scroll pour la transformation complète
    
    // DEBUG: Calculer la réduction réelle
    console.log('maxHeight:', maxHeight, 'minHeight:', minHeight);
    const totalReduction = maxHeight - minHeight; // Total des pixels à réduire
    console.log('totalReduction calculée:', totalReduction);
    
    function handleScroll() {
        const scrollY = window.scrollY;
        
        // Calculer le pourcentage de transformation (0 = début, 1 = fin)
        const scrollProgress = Math.min(scrollY / scrollRange, 1);
        
        // Interpoler entre maxHeight et minHeight
        const currentHeight = maxHeight - (totalReduction * scrollProgress);
        
        // Appliquer la hauteur calculée
        heroSection.style.minHeight = `${currentHeight}px`;
        
        // LOGIQUE SIMPLE ET CORRECTE : Appliquer l'offset à TOUTES les sections
        if (allSectionsAfterHero.length > 0) {
            if (scrollProgress < 1) {
                // Phase 1 : Bandeau en cours de rétrécissement
                // COMPENSER le scroll naturel en poussant TOUT le contenu vers le BAS
                allSectionsAfterHero.forEach(section => {
                    section.style.transform = `translateY(${scrollY}px)`;
                    section.style.transition = 'none';
                });
            } else {
                // Phase 2 : Bandeau à taille minimale
                // COMPENSATION CONSTANTE = hauteur totale perdue par le bandeau (ajustée)
                const constantCompensation = totalReduction * 0.9; // Réduction de 10% pour ajustement
                allSectionsAfterHero.forEach(section => {
                    section.style.transform = `translateY(${constantCompensation}px)`;
                    section.style.transition = 'none';
                });
            }
        }
        
        // Gérer les styles du contenu en fonction du progress
        const heroText = heroSection.querySelector('.page-hero-content p');
        const heroTitle = heroSection.querySelector('.page-hero-content h1');
        const floatingElements = heroSection.querySelectorAll('.floating-bubbles, .floating-shapes');
        
        if (heroText && heroTitle) {
            if (scrollProgress > 0.3) {
                // Commencer à masquer le texte quand on a scrollé 30% du chemin
                const textOpacity = Math.max(0, 1 - (scrollProgress - 0.3) / 0.4);
                heroText.style.opacity = textOpacity;
                heroText.style.height = textOpacity > 0 ? 'auto' : '0';
                heroText.style.margin = textOpacity > 0 ? '' : '0';
            }
            
            if (scrollProgress > 0.2) {
                // Réduire progressivement la taille du titre
                const titleScale = 1 - (scrollProgress - 0.2) * 0.4; // Réduction de 40% max
                const fontSize = 3.5 * Math.max(titleScale, 0.6); // Entre 3.5rem et 2.1rem
                heroTitle.style.fontSize = `${fontSize}rem`;
                heroTitle.style.marginBottom = scrollProgress > 0.7 ? '0' : '';
            }
        }
        
        // Réduire l'opacity des éléments flottants
        floatingElements.forEach(el => {
            if (scrollProgress > 0.4) {
                const opacity = Math.max(0.2, 1 - (scrollProgress - 0.4) * 1.3);
                el.style.opacity = opacity;
            }
        });
    }
    
    // Écouter le scroll avec throttling pour les performances
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
    
    // Vérifier l'état initial
    handleScroll();
});