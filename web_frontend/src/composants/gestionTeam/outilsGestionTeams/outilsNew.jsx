import axios from 'axios';
import toast from 'react-hot-toast';

// Fonction pour gérer l'upload d'une image (logo)
export const uploadLogo = async (file) => {
  if (!file) return;

  const formData = new FormData();
  formData.append('logo', file);

  try {
    const res = await axios.post(`${import.meta.env.VITE_API}/api/teams/upload-logo`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return res.data.path; // Retourne le chemin du logo
  } catch (err) {
    toast.error("Erreur lors de l'upload du logo");
    console.error(err);
    throw new Error("Erreur lors de l'upload du logo");
  }
};


export const createTeamAndJoin = async (nom, logo, user, updateProfile) => {
    try {
      // Création de l'équipe
      const response = await axios.post(`${import.meta.env.VITE_API}/api/teams`, { nom, logo });
  
      if (user.droit !== "admin") {
        const createdTeam = response.data.data;
  
        // Ajout du joueur à l'équipe
        await axios.patch(`${import.meta.env.VITE_API}/api/teams/${createdTeam._id}/join`, {
          playerId: user._id,
        });
  
        // Mise à jour du profil utilisateur avec le rôle de "capitaine"
        const updatePayload = { droit: "capitaine" };
        await updateProfile(updatePayload);
  
        return createdTeam;
      }
  
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message;
      if (message === "Une équipe avec ce nom existe déjà.") {
        toast.error('Ce nom d’équipe est déjà utilisé. Choisis-en un autre.');
      } else {
        toast.error('Erreur lors de la création de l’équipe. Veuillez réessayer plus tard.');
      }
      throw new Error("Erreur lors de la création de l'équipe");
    }
  };