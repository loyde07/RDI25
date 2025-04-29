export function validateSignup({ lName, fName, pseudo, email, password }) {
    const errors = {};

    // Trim tous les champs
    const trimmedLName = lName.trim();
    const trimmedFName = fName.trim();
    const trimmedPseudo = pseudo.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password;

    // Vérification de champs vides
    if (!trimmedLName || !trimmedFName || !trimmedPseudo || !trimmedEmail || !trimmedPassword) {
        errors.global = 'Veuillez remplir tous les champs';
        return errors;
    }

    // Vérification Nom/Prénom
    if (trimmedLName.length < 2) {
        errors.lName = 'Le nom doit contenir au moins 2 caractères';
    }
    if (trimmedFName.length < 2) {
        errors.fName = 'Le prénom doit contenir au moins 2 caractères';
    }

    // Vérification Pseudo
    if (trimmedPseudo.length < 3 || trimmedPseudo.length > 30) {
        errors.pseudo = 'Le pseudo doit contenir entre 3 et 30 caractères';
    } else if (/^\d+$/.test(trimmedPseudo)) {
        errors.pseudo = 'Le pseudo ne peut pas être uniquement des chiffres';
    } else if (/[^a-zA-Z0-9_-]/.test(trimmedPseudo)) {
        errors.pseudo = 'Le pseudo ne peut contenir que des lettres, chiffres, tirets et underscores';
    }

    // Vérification Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
        errors.email = 'Veuillez entrer une adresse email valide';
    } else {
        const tempEmailDomains = ['yopmail.com', 'mailinator.com', 'tempmail.com', '10minutemail.com'];
        const emailDomain = trimmedEmail.split('@')[1];
        if (tempEmailDomains.includes(emailDomain)) {
            errors.email = 'Adresse email temporaire non autorisée';
        }
    }

    // Vérification Mot de passe
    if (trimmedPassword.length < 6) {
        errors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    } else {
        if (!/[A-Z]/.test(trimmedPassword)) {
            errors.password = 'Le mot de passe doit contenir au moins une majuscule';
        }
        if (!/[0-9]/.test(trimmedPassword)) {
            errors.password = 'Le mot de passe doit contenir au moins un chiffre';
        }
        if (!/[^a-zA-Z0-9]/.test(trimmedPassword)) {
            errors.password = 'Le mot de passe doit contenir au moins un caractère spécial';
        }
        if (trimmedPassword === trimmedPseudo || trimmedPassword === trimmedEmail) {
            errors.password = 'Le mot de passe ne doit pas être identique au pseudo ou à l\'email';
        }
    }

    return errors;
}
