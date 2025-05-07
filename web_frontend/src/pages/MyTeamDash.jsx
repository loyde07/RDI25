import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import SupprimerTeam from '../composants/gestionTeam/deleteTeam.jsx';
import UpdateTeam from '../composants/gestionTeam/updateTeam.jsx';



const API = import.meta.env.VITE_API;

function MyTeam () {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [joueurs, setJoueurs] = useState([]);
  const [selectedAction, setSelectedAction] = useState(null);
  

  useEffect(() => {
    if (!id) return;

    axios.get(`${API}/api/teams/${id}`)
      .then(res => {
        setTeam(res.data.data);
        setJoueurs(res.data.data.joueurs || []);
      })
      .catch(err => console.error("Erreur chargement équipe :", err));
  }, [id]);

  if (!team) return <p>Chargement de l'équipe...</p>;

  return (
    <div className="max-w-4xl w-full mx-auto p-6 bg-gray-800/40 backdrop-blur-md rounded-2xl shadow-md mt-10">
      <h2 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-indigo-400 
                text-transparent bg-clip-text">{team.nom}</h2>
      <img src={team.logo || "/val.png"} alt={team.nom} className="team-logo" />
      <h3 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-indigo-400 
                text-transparent bg-clip-text">Membres de l'équipe</h3>
      <ul className="player-list">
        {joueurs.slice(0, 5).map((j) => (
          <li key={j._id} className="player-card">
            <strong>{j.prenom} {j.nom}</strong> — {j.email}<br />
            <strong>École :</strong> {j.ecole_id?.nom || "Non renseigné"}
          </li>
        ))}
      </ul>
      <motion.button
            onClick={() => setSelectedAction('update')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`mt-5 w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white 
                        font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-indigo-700 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                        focus:ring-offset-gray-900 transition duration-200`}
            >
            Modifier mon équipe
            </motion.button>
            <div id="action-container" className="action-container">      
          {selectedAction === 'delete' && <SupprimerTeam /> }
          {selectedAction === 'update' && <UpdateTeam /> }
          </div>
    </div>


    
  );
}

export default MyTeam;
