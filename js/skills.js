// Skills JavaScript - Gestion des tooltips interactifs
document.addEventListener('DOMContentLoaded', function() {
    
    // Gestion des tooltips interactifs
    function initSkillTooltips() {
        const interactiveSkills = document.querySelectorAll('.interactive-skill');
        
        interactiveSkills.forEach(skill => {
            const tooltip = skill.querySelector('.skill-tooltip');
            
            if (tooltip) {
                // Gestion du hover pour desktop
                skill.addEventListener('mouseenter', function() {
                    if (window.innerWidth > 768) {
                        tooltip.classList.add('show');
                    }
                });
                
                skill.addEventListener('mouseleave', function() {
                    if (window.innerWidth > 768) {
                        tooltip.classList.remove('show');
                    }
                });
                
                // Gestion du clic pour mobile ET desktop (pour forcer l'affichage)
                skill.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Fermer tous les autres tooltips
                    interactiveSkills.forEach(otherSkill => {
                        if (otherSkill !== skill) {
                            const otherTooltip = otherSkill.querySelector('.skill-tooltip');
                            if (otherTooltip) {
                                otherTooltip.classList.remove('show');
                            }
                        }
                    });
                    
                    // Toggle le tooltip actuel
                    tooltip.classList.toggle('show');
                });
            }
        });
        
        // Fermer les tooltips en cliquant ailleurs
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.interactive-skill')) {
                interactiveSkills.forEach(skill => {
                    const tooltip = skill.querySelector('.skill-tooltip');
                    if (tooltip) {
                        tooltip.classList.remove('show');
                    }
                });
            }
        });
    }

    // Animation des compétences au hover
    function initSkillsAnimation() {
        const skillItems = document.querySelectorAll('.skill-item');
        
        skillItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-3px) scale(1.05)';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    // Animation des étoiles de niveau
    function initStarAnimation() {
        const expertiseCards = document.querySelectorAll('.expertise-card');
        
        expertiseCards.forEach(card => {
            const stars = card.querySelectorAll('.star');
            const filledStars = card.querySelectorAll('.star.filled');
            
            card.addEventListener('mouseenter', function() {
                filledStars.forEach((star, index) => {
                    setTimeout(() => {
                        star.style.transform = 'scale(1.2)';
                        setTimeout(() => {
                            star.style.transform = 'scale(1)';
                        }, 100);
                    }, index * 100);
                });
            });
        });
    }

    // Animation des catégories de compétences
    function initCategoryAnimation() {
        const categories = document.querySelectorAll('.skill-category');
        
        categories.forEach(category => {
            category.addEventListener('mouseenter', function() {
                const items = this.querySelectorAll('.skill-item');
                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.transform = 'scale(1.02)';
                        setTimeout(() => {
                            item.style.transform = 'scale(1)';
                        }, 200);
                    }, index * 50);
                });
            });
        });
    }

    // Initialisation de toutes les fonctionnalités skills
    function initSkills() {
        initSkillTooltips();
        initSkillsAnimation();
        initStarAnimation();
        initCategoryAnimation();
    }

    // Démarrer l'initialisation
    initSkills();

    // Gestion du redimensionnement pour les tooltips
    window.addEventListener('resize', function() {
        const tooltips = document.querySelectorAll('.skill-tooltip.show');
        tooltips.forEach(tooltip => {
            tooltip.classList.remove('show');
        });
    });
});