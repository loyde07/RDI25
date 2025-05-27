import axios from 'axios';
import toast from 'react-hot-toast';
import { ajouterJoueurAListe, toggleSuppressionLogic } from './outilsUpdate.jsx';



  export function genererOptionsEquipes(teams) {
    if (!Array.isArray(teams)) {
      throw new Error("Paramètre invalide : teams doit être un tableau");
    }
    return teams.map(team => ({
      label: team.nom,
      value: team._id
    }));
  }
  


export async function ajouterJoueurDansEquipe(API, selectedTeamId, joueurSelectionne, setForm, setShowAddPlayer, setJoueurSelectionne) {
  try {
    await axios.patch(`${API}/api/teams/${selectedTeamId}/join`, {
      playerId: joueurSelectionne._id
    });
    toast.success("Joueur ajouté !");
    setJoueurSelectionne(null);
    setShowAddPlayer(false);

    setForm(prev => ({
      ...prev,
      joueurs: ajouterJoueurAListe(prev.joueurs, joueurSelectionne._id)
    }));
  } catch (err) {
    console.error(err);
    toast.error("Erreur lors de l'ajout du joueur");
  }
}

export async function handleUpdateTeam(API, selectedTeamId, form, joueursÀRetirer, setForm, setJoueursÀRetirer, setTeamData, updateProfile) {
  const nouvelleListe = form.joueurs.filter(id => !joueursÀRetirer.includes(id));
  try {
    await axios.patch(`${API}/api/teams/${selectedTeamId}/update`, {
      ...form,
      joueurs: nouvelleListe
    });

    toast.success("Équipe mise à jour !");
    setJoueursÀRetirer([]);

    await updateProfile({ droit: "" });

    const updatedTeam = await axios.get(`${API}/api/teams/${selectedTeamId}`);
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

export function toggleJoueurASupprimer(joueursÀRetirer, joueurId, setJoueursÀRetirer) {
  try {
    setJoueursÀRetirer(prev => toggleSuppressionLogic(prev, joueurId));
  } catch (err) {
    console.error(err);
    toast.error(err.message);
  }
}



export async function fetchTeams(API) {
  try {
    const res = await axios.get(`${API}/api/teams`);
    return res.data.data;
  } catch (error) {
    throw new Error("Erreur lors de la récupération des équipes : " + error.message);
  }
}

export function validerSelectionEquipe(teams, selectedId) {
  if (!selectedId) {
    throw new Error("Aucune équipe sélectionnée");
  }
  const teamExiste = teams.some(team => team._id === selectedId);
  if (!teamExiste) {
    throw new Error("Équipe invalide sélectionnée");
  }
  return true;
}


export async function rejoindreEquipe(API, selectedTeamId, playerId) {
  try {
    await axios.patch(`${API}/api/teams/${selectedTeamId}/join`, {
      playerId
    });
  } catch (error) {
    throw new Error("Erreur lors de la tentative de rejoindre l'équipe : " + error.message);
  }
}
