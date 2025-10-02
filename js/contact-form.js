// Gestion du formulaire de contact avec EmailJS
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Script de contact chargé');
    
    // Vérifier si EmailJS est disponible
    if (typeof emailjs === 'undefined') {
        console.error('❌ EmailJS n\'est pas chargé! Vérifiez le script EmailJS.');
        return;
    }
    console.log('✅ EmailJS est disponible');
    
    // Configuration EmailJS (à remplacer par vos vraies clés)
    const EMAIL_CONFIG = {
        serviceID: 'service_kla2iwg',     // Remplacez par le nouveau Service ID
        templateID: 'template_9nuxiuj',      // Gardez le même Template ID
        publicKey: 'ymJmJDbdi-1YJnraw'       // Gardez la même Public Key
    };

    // Initialiser EmailJS
    console.log('🔑 Initialisation d\'EmailJS avec la clé:', EMAIL_CONFIG.publicKey);
    emailjs.init(EMAIL_CONFIG.publicKey);

    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.querySelector('.submit-btn');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        console.log('✅ Formulaire de contact trouvé');
        
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('📧 Formulaire soumis, début du traitement...');
            
            // Changer l'état du bouton
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
            
            try {
                // Récupérer les données du formulaire
                const formData = {
                    firstName: document.getElementById('firstName').value,
                    lastName: document.getElementById('lastName').value,
                    email: document.getElementById('email').value,
                    company: document.getElementById('company').value || 'Non spécifiée',
                    subject: document.getElementById('subject').value,
                    message: document.getElementById('message').value,
                    date: new Date().toLocaleDateString('fr-FR'),
                    time: new Date().toLocaleTimeString('fr-FR')
                };

                // Valider les données
                console.log('📝 Données du formulaire:', formData);
                
                if (!validateForm(formData)) {
                    console.error('❌ Validation échouée');
                    throw new Error('Veuillez remplir tous les champs obligatoires.');
                }
                
                console.log('✅ Validation réussie, envoi en cours...');

                // Envoyer l'email via EmailJS
                console.log('🚀 Tentative d\'envoi avec EmailJS...');
                console.log('Service ID:', EMAIL_CONFIG.serviceID);
                console.log('Template ID:', EMAIL_CONFIG.templateID);
                
                const response = await emailjs.send(
                    EMAIL_CONFIG.serviceID,
                    EMAIL_CONFIG.templateID,
                    {
                        to_name: 'François Thievon',
                        from_name: `${formData.firstName} ${formData.lastName}`,
                        from_email: formData.email,
                        company: formData.company,
                        subject: formData.subject,
                        message: formData.message,
                        date: formData.date,
                        time: formData.time,
                        reply_to: formData.email
                    }
                );

                console.log('✅ Email envoyé avec succès!', response);
                
                // Succès
                showFormStatus('success', 'Message envoyé avec succès ! Je vous répondrai dans les plus brefs délais.');
                contactForm.reset();
                
                // Analytics (optionnel)
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_submit', {
                        event_category: 'Contact',
                        event_label: 'Contact Form Submission'
                    });
                }

            } catch (error) {
                console.error('❌ Erreur détaillée:', error);
                console.error('Message d\'erreur:', error.message);
                console.error('Statut:', error.status);
                console.error('Texte:', error.text);
                
                showFormStatus('error', 'Une erreur est survenue lors de l\'envoi. Veuillez réessayer ou me contacter directement.');
            } finally {
                // Restaurer le bouton
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Envoyer le message';
            }
        });
    }

    // Validation du formulaire
    function validateForm(data) {
        return data.firstName && 
               data.lastName && 
               data.email && 
               data.subject && 
               data.message &&
               isValidEmail(data.email);
    }

    // Validation email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Affichage du statut du formulaire
    function showFormStatus(type, message) {
        if (!formStatus) {
            // Créer l'élément de statut s'il n'existe pas
            const statusDiv = document.createElement('div');
            statusDiv.id = 'form-status';
            contactForm.appendChild(statusDiv);
        }
        
        const statusElement = document.getElementById('form-status');
        statusElement.className = `form-status ${type}`;
        statusElement.textContent = message;
        statusElement.style.display = 'block';
        
        // Masquer après 5 secondes
        setTimeout(() => {
            statusElement.style.display = 'none';
        }, 5000);
    }

    // Validation en temps réel
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            // Supprimer les messages d'erreur pendant la saisie
            this.classList.remove('error');
        });
    });

    function validateField(field) {
        const value = field.value.trim();
        const isRequired = field.hasAttribute('required');
        
        if (isRequired && !value) {
            field.classList.add('error');
            return false;
        }
        
        if (field.type === 'email' && value && !isValidEmail(value)) {
            field.classList.add('error');
            return false;
        }
        
        field.classList.remove('error');
        return true;
    }
});

// Styles CSS pour les erreurs (à ajouter si pas déjà présent)
const style = document.createElement('style');
style.textContent = `
    .form-group input.error,
    .form-group textarea.error {
        border-color: #e53e3e !important;
        box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.1) !important;
    }
    
    .form-status {
        margin-top: 1rem;
        padding: 1rem;
        border-radius: 8px;
        text-align: center;
        display: none;
    }
    
    .form-status.success {
        background-color: #f0fff4;
        color: #38a169;
        border: 1px solid #9ae6b4;
    }
    
    .form-status.error {
        background-color: #fff5f5;
        color: #e53e3e;
        border: 1px solid #feb2b2;
    }
`;
document.head.appendChild(style);