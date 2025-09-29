// Fonctions pour les pop-ups de contact dans la navigation
function showContactPopup(type) {
    const popup = document.getElementById('contact-popup');
    const title = document.getElementById('popup-title');
    const description = document.getElementById('popup-description');
    const info = document.getElementById('popup-info');
    const copyBtn = document.getElementById('copy-btn');

    if (type === 'email') {
        title.textContent = 'Email';
        description.textContent = 'Contactez-moi directement par email :';
        info.textContent = 'thievon.francois@gmail.com';
        copyBtn.setAttribute('data-copy', 'thievon.francois@gmail.com');
    } else if (type === 'phone') {
        title.textContent = 'Téléphone';
        description.textContent = 'Appelez-moi au :';
        info.textContent = '+33 7 81 44 22 28';
        copyBtn.setAttribute('data-copy', '+33 7 81 44 22 28');
    }

    popup.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function hideContactPopup() {
    const popup = document.getElementById('contact-popup');
    if (popup) {
        popup.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function copyToClipboard() {
    const copyBtn = document.getElementById('copy-btn');
    const textToCopy = copyBtn.getAttribute('data-copy');
    
    navigator.clipboard.writeText(textToCopy).then(() => {
        copyBtn.textContent = 'Copié !';
        setTimeout(() => {
            copyBtn.textContent = 'Copier';
        }, 2000);
    }).catch(() => {
        // Fallback pour les navigateurs plus anciens
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        copyBtn.textContent = 'Copié !';
        setTimeout(() => {
            copyBtn.textContent = 'Copier';
        }, 2000);
    });
}

// Initialisation des événements
document.addEventListener('DOMContentLoaded', function() {
    // Fermer le popup avec Echap
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideContactPopup();
        }
    });

    // Ajouter le HTML du popup s'il n'existe pas déjà
    if (!document.getElementById('contact-popup')) {
        const popupHTML = `
            <div id="contact-popup" class="contact-popup" onclick="hideContactPopup()">
                <div class="contact-popup-content" onclick="event.stopPropagation()">
                    <h3 id="popup-title"></h3>
                    <p id="popup-description"></p>
                    <div class="popup-contact-info" id="popup-info"></div>
                    <div class="popup-buttons">
                        <button class="popup-btn copy" id="copy-btn" onclick="copyToClipboard()">Copier</button>
                        <button class="popup-btn close" onclick="hideContactPopup()">Fermer</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', popupHTML);
    }
});