import React, {useState} from "react";
import axios from 'axios';

const api = import.meta.env.VITE;

const CreationTeam = () => {
  const [nom, setNom] = useState('');
  const [logo, setLogo] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(api +'/api/teams', {
        nom,
        logo
      });

      console.log('Équipe créée :', response.data);
      alert('Équipe créée avec succès !');
    } catch (error) {
        // Récupération du message d'erreur du back si dispo
        const message = error.response?.data?.message;
    
        if (message === "Une équipe avec ce nom existe déjà.") {
          alert(' Ce nom d’équipe est déjà utilisé. Choisis-en un autre.');
        } else {
          alert(' Erreur lors de la création de l’équipe. Veuillez réessayer plus tard.');
        }
    
        console.error('Erreur lors de la création de l’équipe :', error.response?.data || error.message);
      }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Créer une nouvelle équipe</h2>
      <input
        type="text"
        placeholder="Nom de l'équipe"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Lien du logo"
        value={logo}
        onChange={(e) => setLogo(e.target.value)}
      />
      <button type="submit">Créer</button>
    </form>
  );
};

export default CreationTeam;
