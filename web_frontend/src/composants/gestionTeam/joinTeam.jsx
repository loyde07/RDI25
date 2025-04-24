import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {motion} from 'framer-motion'

const API = import.meta.env.VITE_API ;
// ou avec CRA : process.env.REACT_APP_API_URL


function RejoindreTeam() {
    const [teams, setTeams] = useState([]);
    const [selectedTeamId, setSelectedTeamId] = useState('');
  const hardcodedPlayerId = '67f962182988c6aad9f20c51'; // à remplacer par un vrai ID


  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await axios.get(API +'/api/teams');
        setTeams(res.data.data); // selon ton backend
        
      } catch (error) {
        console.error("Erreur lors de la récupération des teams :", error.message);
      }
    };

    fetchTeams();
  }, []);

  const handleJoin = async (e) => {
    e.preventDefault();

    try {
      await axios.patch(`${API}/api/teams/${selectedTeamId}/join`, {
        playerId: hardcodedPlayerId,
      });

      alert("Tu as rejoint l'équipe !");
    } catch (error) {
      console.error("Erreur lors de la tentative de rejoindre une équipe :", error.message);
      alert("Erreur lors de la tentative de rejoindre l'équipe.");
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
        {teams.map((team) => (
          <option key={team._id} value={team._id}>{team.nom}</option>
        ))}
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
