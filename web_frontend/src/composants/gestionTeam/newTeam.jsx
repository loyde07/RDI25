import React, {useState} from "react";
import axios from 'axios';
import {motion} from 'framer-motion'

const API = import.meta.env.VITE_API || "http://localhost:5000";



const CreationTeam = () => {
  const [nom, setNom] = useState('');
  const [logo, setLogo] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(API +'/api/teams', {
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
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full mx-auto bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-2xl shadow-xl p-8"
    >
      <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-indigo-400 text-transparent bg-clip-text">
        Créer une nouvelle équipe
      </h2>

      <input
        type="text"
        placeholder="Nom de l'équipe"
        className="w-full px-4 py-3 bg-gray-700 text-white placeholder-gray-400 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Lien du logo"
        className="w-full px-4 py-3 bg-gray-700 text-white placeholder-gray-400 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={logo}
        onChange={(e) => setLogo(e.target.value)}
      />
      <motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
      >
        Créer
      </motion.button>
    </motion.form>
  );
};

export default CreationTeam;
