import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const API = import.meta.env.VITE_API;

function RajouterJoueur({ onJoueurSelectionne }) {
  const [recherche, setRecherche] = useState('');
  const [resultats, setResultats] = useState([]);

  useEffect(() => {
    if (recherche.length === 0) {
      setResultats([]);
      return;
    }

    const fetchJoueurs = async () => {
      try {
        const res = await axios.get(`${API}/api/joueurs/joueurs?search=${recherche}`);
        setResultats(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchJoueurs();
  }, [recherche]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#1e1e2f] p-6 rounded-xl shadow-lg w-full max-w-xl mx-auto"
    >
      <h2 className="text-2xl font-semibold text-white mb-4 text-center">Ajouter un joueur</h2>

      <input
        type="text"
        placeholder=" Rechercher un pseudo..."
        value={recherche}
        onChange={(e) => setRecherche(e.target.value)}
        className="w-full p-3 rounded-lg bg-[#2e2e3e] text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {Array.isArray(resultats) && resultats.length > 0 && (
        <ul className="mt-4 space-y-2">
          {resultats.map(joueur => (
            <motion.li
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              key={joueur._id}
              onClick={() => onJoueurSelectionne(joueur)}
              className="cursor-pointer px-4 py-2 bg-[#2b2b3c] text-white rounded-lg hover:bg-[#38384d] transition-all"
            >
              {joueur.pseudo}
            </motion.li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}

export default RajouterJoueur;
