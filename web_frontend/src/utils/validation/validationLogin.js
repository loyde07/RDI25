export function validateLogin({ email, password }) {
    const errors = {};

    // Trim tous les champs
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // Vérification de champs vides
    if (!trimmedEmail || !trimmedPassword) {
        errors.global = 'Veuillez remplir tous les champs';
        return errors;
    }

    // Vérification Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
        errors.email = 'Veuillez entrer une adresse email valide';
    }


    return errors;
}
