import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {motion} from 'framer-motion'
import { useNavigate } from "react-router-dom";
import { validerSelectionEquipe, genererOptionsEquipes, fetchTeams, rejoindreEquipe } from './outilsGestionTeams/outilsJoin.jsx';



const API = import.meta.env.VITE_API ;
// ou avec CRA : process.env.REACT_APP_API_URL
import { useAuthStore } from "../../store/authStore";
import toast from 'react-hot-toast';


function RejoindreTeam() {
    const [teams, setTeams] = useState([]);
    const [selectedTeamId, setSelectedTeamId] = useState('');
    const { user } = useAuthStore();
      const navigate = useNavigate();


      useEffect(() => {
        fetchTeams(API)
          .then(setTeams)
          .catch((error) => toast.error(error.message));
      }, []);

  const handleJoin = async (e) => {
    e.preventDefault();


    try {

      const userDejaDansUneEquipe = teams.some(team =>
          team.joueurs.includes(user._id)
      );

      if (userDejaDansUneEquipe) {
          toast.error("Tu fais déjà partie d'une équipe.");
          return;
      }


      validerSelectionEquipe(teams, selectedTeamId);
      await rejoindreEquipe(API, selectedTeamId, user._id);
      toast.success("Tu as rejoint l'équipe !");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <motion.form
      onSubmit={handleJoin}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full mx-auto bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-2xl shadow-xl p-8"
    >
      <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-indigo-400 text-transparent bg-clip-text">
        Rejoindre une équipe
      </h2>
  
      <select
        value={selectedTeamId}
        onChange={(e) => setSelectedTeamId(e.target.value)}
        required
        className="w-full px-4 py-3 mb-6 bg-gray-700 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Sélectionner une équipe</option>
          {genererOptionsEquipes(teams).map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>        ))}
      </select>
  
      <motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
      >
        Rejoindre
      </motion.button>
    </motion.form>
  );}

export default RejoindreTeam;
