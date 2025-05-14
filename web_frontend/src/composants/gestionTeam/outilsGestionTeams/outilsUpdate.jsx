import axios from 'axios';
import toast from 'react-hot-toast';



 export function ajouterJoueurAListe(joueursActuels, joueurId) {
    if (!joueurId) throw new Error('ID joueur invalide');
    if (joueursActuels.includes(joueurId)) throw new Error('Joueur déjà présent');
    return [...joueursActuels, joueurId];
  }
  
  export function retirerJoueurDeListe(joueursActuels, joueurId) {
    if (!joueurId) throw new Error('ID joueur invalide');
    if (!joueursActuels.includes(joueurId)) throw new Error('Joueur introuvable');
    return joueursActuels.filter(id => id !== joueurId);
  }
  
  export function toggleSuppressionLogic(joueursÀRetirer, joueurId) {
    if (!joueurId) throw new Error('ID joueur invalide');
    return joueursÀRetirer.includes(joueurId)
      ? joueursÀRetirer.filter(id => id !== joueurId)
      : [...joueursÀRetirer, joueurId];
  }
  

/**
 * Ajoute un joueur à l'équipe côté serveur et met à jour le form localement.
 * @param {string} apiUrl
 * @param {string} teamId
 * @param {object} joueur
 * @param {Function} setForm
 * @param {Function} setShowAddPlayer
 * @param {Function} setJoueurSelectionne
 */
export async function ajouterJoueurDansEquipe(apiUrl, teamId, joueur, setForm, setShowAddPlayer, setJoueurSelectionne) {
  try {
    await axios.patch(`${apiUrl}/api/teams/${teamId}/join`, {
      playerId: joueur._id
    });
    toast.success("Joueur ajouté !");
    setJoueurSelectionne(null);
    setShowAddPlayer(false);

    setForm(prev => ({
      ...prev,
      joueurs: ajouterJoueurAListe(prev.joueurs, joueur._id)
    }));

  } catch (err) {
    console.error(err);
    toast.error("Erreur lors de l'ajout du joueur");
  }
}

/**
 * Met à jour les informations de l'équipe et recharge les données.
 * @param {string} apiUrl
 * @param {string} teamId
 * @param {object} form
 * @param {Array} joueursÀRetirer
 * @param {Function} setForm
 * @param {Function} setJoueursÀRetirer
 * @param {Function} setTeamData
 * @param {Function} updateProfile
 */
export async function handleUpdateTeam(apiUrl, teamId, form, joueursÀRetirer, setForm, setJoueursÀRetirer, setTeamData, updateProfile) {
  const nouvelleListe = form.joueurs.filter(id => !joueursÀRetirer.includes(id));

  try {
    await axios.patch(`${apiUrl}/api/teams/${teamId}/update`, {
      ...form,
      joueurs: nouvelleListe
    });

    toast.success("Équipe mise à jour !");
    setJoueursÀRetirer([]);

    const updatePayload = { droit: "" };
    await updateProfile(updatePayload);

    // Recharger l'équipe
    const updatedTeam = await axios.get(`${apiUrl}/api/teams/${teamId}`);
    setTeamData(updatedTeam.data.data);
    setForm({
      nom: updatedTeam.data.data.nom,
      logo: updatedTeam.data.data.logo,
      joueurs: updatedTeam.data.data.joueurs.map(j => j._id)
    });

  } catch (err) {
    console.error("Erreur modification :", err);
    toast.error("Erreur lors de la mise à jour");
  }
}

/**
 * Toggle logique pour marquer ou dé-marquer un joueur à retirer.
 * @param {Array} joueursÀRetirer
 * @param {string} joueurId
 * @param {Function} setJoueursÀRetirer
 */
export const toggleJoueurASupprimer = (joueurs, joueur, setJoueursÀRetirer) => {
  try {
    if (!joueur) throw new Error('ID joueur invalide');

    if (joueurs.includes(joueur)) {
      throw new Error('Erreur dans la logique'); // Simuler une erreur dans la logique
    }

    const nouveauxJoueurs = [...joueurs, joueur];
    setJoueursÀRetirer(nouveauxJoueurs);

  } catch (error) {
    console.error('Erreur dans toggleJoueurASupprimer:', error);
  }
};



