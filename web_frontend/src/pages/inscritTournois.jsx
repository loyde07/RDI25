import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const API = import.meta.env.VITE_API;

export default function InscriptionTourn() {
  const [teams, setTeams] = useState([]);
  const [registeredTeams, setRegisteredTeams] = useState([]);
  const [message, setMessage] = useState('');

  const TOURNAMENT_ID = "67f8c2993634ef292b6a5d0b";

  useEffect(() => {
    const fetchTeams = async () => {
      const { data } = await axios.get(`${API}/api/teams`);
      setTeams(data.data);
    };

    const fetchInscriptions = async () => {
      const { data } = await axios.get(`${API}/api/inscription/tournoi/${TOURNAMENT_ID}`);
      setRegisteredTeams(data.data.map((item) => item.team_id)); // ← tableau des IDs des équipes déjà inscrites
    };

    fetchTeams();
    fetchInscriptions();
  }, []);

  const inscrireEquipe = async (teamId) => {
    try {
      await axios.post(`${API}/api/inscription/add`, {
        team_id: teamId,
        tournois_id: TOURNAMENT_ID,
      });
      setMessage(`Équipe inscrite avec succès`);
      setRegisteredTeams((prev) => [...prev, teamId]);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Erreur lors de l\'inscription');
    }
  };

  const desinscrireEquipe = async (teamId) => {
    try {
      await axios.delete(`${API}/api/inscription/remove`, {
        data: {
          team_id: teamId,
          tournois_id: TOURNAMENT_ID,
        },
      });
      setMessage(`Équipe désinscrite avec succès`);
      setRegisteredTeams((prev) => prev.filter(id => id !== teamId));
    } catch (error) {
      setMessage(error.response?.data?.message || 'Erreur lors de la désinscription');
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-4">Inscription au tournoi</h1>
      {message && <p className="mb-4 text-sm text-green-400">{message}</p>}
      <ul className="space-y-3">
        {teams.map(team => {
          const isRegistered = registeredTeams.includes(team._id);
          return (
            <li key={team._id} className="flex justify-between items-center bg-gray-800 p-4 rounded shadow">
              <div>
                <h2 className="text-xl font-semibold">{team.nom}</h2>
              </div>
              <button
                onClick={() => isRegistered ? desinscrireEquipe(team._id) : inscrireEquipe(team._id)}
                className={`px-4 py-2 rounded text-white ${
                  isRegistered ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isRegistered ? "Désinscrire" : "Inscrire"}
              </button>
            </li>
          );
        })}
      </ul>

      <Link to="/tournois">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="py-3 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white 
          font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-indigo-700 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
          focus:ring-offset-gray-900 transition duration-200 mt-6"
        >
          <ArrowLeft className="w-5 h-5" />
        </motion.button>
      </Link>
    </div>
  );
}
