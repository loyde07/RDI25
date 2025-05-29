export function validateSignup({ lName, fName, pseudo, email, password, ecole_id, niveau }) {
    const errors = {};

    // Normalisation et extraction des valeurs (en cas d'objet pour Select)
    const trimmedLName = lName?.trim();
    const trimmedFName = fName?.trim();
    const trimmedPseudo = pseudo?.trim();
    const trimmedEmail = email?.trim();
    const trimmedPassword = password;
    const selectedEcoleId = typeof ecole_id === 'object' && ecole_id !== null ? ecole_id.value : ecole_id;
    const selectedNiveau = typeof niveau === 'object' && niveau !== null ? niveau.value : niveau;

    // Vérification de champs vides
    if (!trimmedLName || !trimmedFName || !trimmedPseudo || !trimmedEmail || !trimmedPassword || !selectedEcoleId || !selectedNiveau) {
        errors.global = 'Veuillez remplir tous les champs';
        return errors;
    }

    // Nom & prénom
    if (trimmedLName.length < 2) {
        errors.lName = 'Le nom doit contenir au moins 2 caractères';
    }
    if (trimmedFName.length < 2) {
        errors.fName = 'Le prénom doit contenir au moins 2 caractères';
    }

    // Pseudo
    if (trimmedPseudo.length < 3 || trimmedPseudo.length > 20) {
        errors.pseudo = 'Le pseudo doit contenir entre 3 et 20 caractères';
    } else if (/^\d+$/.test(trimmedPseudo)) {
        errors.pseudo = 'Le pseudo ne peut pas être uniquement composé de chiffres';
    } else if (/[^a-zA-Z0-9_-]/.test(trimmedPseudo)) {
        errors.pseudo = 'Le pseudo ne peut contenir que lettres, chiffres, tirets et underscores';
    }

     // École
     if (!selectedEcoleId || typeof selectedEcoleId !== 'string') {
        errors.ecole_id = 'Veuillez sélectionner une école valide';
    }

    // Niveau
    if (!selectedNiveau || isNaN(selectedNiveau)) {
        console.log(typeof selectedNiveau !== Number);
        console.log(selectedNiveau, isNan(selectedNiveau));
        console.log(!selectedNiveau);
        errors.niveau = 'Veuillez sélectionner un niveau valide';
    }


    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
        errors.email = 'Veuillez entrer une adresse email valide';
    } else {
        const tempEmailDomains = ['yopmail.com', 'mailinator.com', 'tempmail.com', '10minutemail.com'];
        const domain = trimmedEmail.split('@')[1];
        if (tempEmailDomains.includes(domain)) {
            errors.email = 'Les adresses email temporaires ne sont pas autorisées';
        }
    }

    // Mot de passe
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
        if (trimmedPassword.includes(' ')) {
            errors.password = 'Le mot de passe ne doit pas contenir d\'espaces';
        }
        if (trimmedPassword.length > 20) {
            errors.password = 'Le mot de passe ne doit pas dépasser 20 caractères';
        }
        if (trimmedPassword === trimmedPseudo || trimmedPassword === trimmedEmail) {
            errors.password = 'Le mot de passe ne doit pas être identique au pseudo ou à l\'email';
        }
    }

    return errors;
}
