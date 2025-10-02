# Configuration EmailJS pour le formulaire de contact

## 📧 Guide de configuration EmailJS

EmailJS permet d'envoyer des emails directement depuis le frontend sans serveur backend.

### 1. Créer un compte EmailJS

1. Allez sur [EmailJS.com](https://www.emailjs.com/)
2. Créez un compte gratuit
3. Confirmez votre email

### 2. Configurer un service d'email

1. Dans le dashboard EmailJS, allez dans **"Email Services"**
2. Cliquez sur **"Add New Service"**
3. Choisissez votre fournisseur d'email :
   - **Gmail** (recommandé pour commencer)
   - **Outlook**
   - **SendGrid**
   - Etc.

4. Pour Gmail :
   - Entrez votre adresse Gmail
   - Générez un "App Password" depuis votre compte Google
   - Copiez le **Service ID** généré

### 3. Créer un template d'email

1. Allez dans **"Email Templates"**
2. Cliquez sur **"Create New Template"**
3. Configurez le template comme suit :

**Template Settings:**
- **Template Name:** Contact Portfolio François
- **Subject:** `{{subject}} - Contact Portfolio`
- **To Email:** votre-email@gmail.com

**Template Content:**
```
Nouveau message depuis votre portfolio !

De : {{from_name}} ({{from_email}})
Entreprise : {{company}}
Sujet : {{subject}}

Message :
{{message}}

---
Reçu le {{date}} à {{time}}

Pour répondre directement, répondez à cet email.
```

4. Testez le template avec des données d'exemple
5. Copiez le **Template ID**

### 4. Obtenir votre clé publique

1. Allez dans **"Account"** > **"General"**
2. Copiez votre **Public Key**

### 5. Mettre à jour le fichier JavaScript

Ouvrez le fichier `js/contact-form.js` et remplacez :

```javascript
const EMAIL_CONFIG = {
    serviceID: 'YOUR_SERVICE_ID',     // Remplacez par votre Service ID
    templateID: 'YOUR_TEMPLATE_ID',   // Remplacez par votre Template ID
    publicKey: 'YOUR_PUBLIC_KEY'      // Remplacez par votre Public Key
};
```

### 6. Exemple de configuration complète

```javascript
const EMAIL_CONFIG = {
    serviceID: 'service_abc123',      // Ex: service_gmail_xyz
    templateID: 'template_def456',    // Ex: template_contact_form
    publicKey: 'ghi789jkl012'         // Ex: votre clé publique
};
```

## 🔒 Sécurité et limitations

### Plan gratuit EmailJS :
- **200 emails/mois** inclus
- **Public Key visible** dans le code (normal)
- **Limitation de domaine** possible

### Pour un usage professionnel :
- Considérez un plan payant EmailJS
- Ou une solution backend avec Node.js/PHP

## 🎨 Personnalisation du template

Vous pouvez personnaliser le template avec du HTML :

```html
<h2>Nouveau contact depuis votre portfolio</h2>

<div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
    <h3>Informations du contact</h3>
    <p><strong>Nom :</strong> {{from_name}}</p>
    <p><strong>Email :</strong> {{from_email}}</p>
    <p><strong>Entreprise :</strong> {{company}}</p>
    <p><strong>Sujet :</strong> {{subject}}</p>
</div>

<div style="margin-top: 20px;">
    <h3>Message</h3>
    <p style="background: white; padding: 15px; border-left: 4px solid #ff6b35;">
        {{message}}
    </p>
</div>

<hr>
<small>Reçu le {{date}} à {{time}}</small>
```

## 🚀 Test et déploiement

1. **Test local :** Ouvrez votre portfolio et testez le formulaire
2. **Vérification :** Vérifiez que vous recevez bien l'email
3. **Déploiement :** Une fois configuré, ça marche sur tous les domaines

## 📞 Dépannage

### Erreurs courantes :
- **"Template not found"** : Vérifiez le Template ID
- **"Service not found"** : Vérifiez le Service ID  
- **"Unauthorized"** : Vérifiez la Public Key
- **Email non reçu** : Vérifiez les spams

### Console du navigateur :
Ouvrez F12 pour voir les erreurs détaillées.

## 🎯 Fonctionnalités implémentées

✅ **Validation en temps réel** des champs
✅ **Messages d'erreur** visuels
✅ **Bouton de loading** pendant l'envoi  
✅ **Messages de succès/erreur**
✅ **Template d'email formaté**
✅ **Données complètes** (nom, email, entreprise, sujet, message, date/heure)
✅ **Reset automatique** du formulaire après envoi
✅ **Compatible mobile** et responsive

Le formulaire est maintenant prêt à fonctionner dès que vous aurez configuré EmailJS ! 🚀