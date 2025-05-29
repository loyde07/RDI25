export const validateProfileUpdate = (formData, user, showPasswordSection) => {
  const { nom, prenom, pseudo, niveau, ecole_id, password, confirmPassword } = formData;
  const modifiedFields = {};
  const errors = [];

  const trimmedNom = nom?.trim();
  if (trimmedNom && trimmedNom !== user.lName) {
    if (trimmedNom.length < 2) errors.push("Le nom doit contenir au moins 2 caractères.");
    else if (!/^[a-zA-ZÀ-ÿ -]{2,30}$/.test(trimmedNom)) errors.push("Nom invalide.");
    else modifiedFields.nom = trimmedNom;
  }

  const trimmedPrenom = prenom?.trim();
  if (trimmedPrenom && trimmedPrenom !== user.fName) {
    if (trimmedPrenom.length < 2) errors.push("Le prénom doit contenir au moins 2 caractères.");
    else if (!/^[a-zA-ZÀ-ÿ -]{2,30}$/.test(trimmedPrenom)) errors.push("Prénom invalide.");
    else modifiedFields.prenom = trimmedPrenom;
  }

  const trimmedPseudo = pseudo?.trim();
  if (trimmedPseudo && trimmedPseudo !== user.pseudo) {
    if (trimmedPseudo.length < 3 || trimmedPseudo.length > 20) errors.push("Le pseudo doit contenir entre 3 et 20 caractères.");
    else if (/^\d+$/.test(trimmedPseudo)) errors.push("Le pseudo ne peut pas être uniquement composé de chiffres.");
    else if (/[^a-zA-Z0-9_-]/.test(trimmedPseudo)) errors.push("Le pseudo ne peut contenir que lettres, chiffres, tirets et underscores.");
    else if (/\s/.test(trimmedPseudo)) errors.push("Le pseudo ne peut pas contenir d'espaces.");
    else modifiedFields.pseudo = trimmedPseudo;
  }

  const selectedNiveau = typeof niveau === 'object' ? niveau.value : niveau;
  if (selectedNiveau && selectedNiveau !== user.niveau) {
    if (isNaN(selectedNiveau)) errors.push("Veuillez sélectionner un niveau valide.");
    else modifiedFields.niveau = selectedNiveau;
  }

  const selectedEcoleId = typeof ecole_id === 'object' ? ecole_id.value : ecole_id;
  if (selectedEcoleId && selectedEcoleId !== user.ecole_id?._id) {
    if (typeof selectedEcoleId !== 'string') errors.push("Veuillez sélectionner une école valide.");
    else modifiedFields.ecole_id = selectedEcoleId;
  }

  if (showPasswordSection && password && confirmPassword) {
    if (password !== confirmPassword) errors.push("Les mots de passe ne correspondent pas.");
    else if (password === pseudo || password === user.email) errors.push("Le mot de passe ne doit pas être identique au pseudo ou à l'email.");
    else if (password.length < 6) errors.push("Le mot de passe doit contenir au moins 6 caractères.");
    else if (password.length > 20) errors.push("Le mot de passe ne doit pas dépasser 20 caractères.");
    else if (!/[A-Z]/.test(password)) errors.push("Le mot de passe doit contenir au moins une majuscule.");
    else if (!/[0-9]/.test(password)) errors.push("Le mot de passe doit contenir au moins un chiffre.");
    else if (!/[^a-zA-Z0-9]/.test(password)) errors.push("Le mot de passe doit contenir au moins un caractère spécial.");
    else if (password.includes(" ")) errors.push("Le mot de passe ne doit pas contenir d'espaces.");
    else modifiedFields.password = password;
  }

  return { modifiedFields, errors };
};
