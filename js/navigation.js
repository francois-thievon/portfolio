// Navigation JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');
    
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

    // Event listeners pour le scroll
    window.addEventListener('scroll', handleNavbarScroll);
    
    // Trigger initial pour les fonctions de scroll
    handleNavbarScroll();

    // Gestion du redimensionnement de la fenêtre
    window.addEventListener('resize', function() {
        // Fermer le menu mobile si ouvert lors du redimensionnement
        if (window.innerWidth > 768) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // Marquer la page actuelle dans la navigation
    function setCurrentPage() {
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop() || 'index.html';
        
        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            if (linkPath === currentPage) {
                link.classList.add('current-page');
            }
        });
    }

    setCurrentPage();
});