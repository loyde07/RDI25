import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RajouterJoueur from "./rajouterJoueurTeam.jsx"
const API = import.meta.env.VITE_API || "http://localhost:5000";
import {motion} from 'framer-motion'

function UpdateTeam() {
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [teamData, setTeamData] = useState(null);
  const [joueurs, setJoueurs] = useState([]);
  const [joueursÀRetirer, setJoueursÀRetirer] = useState([]);
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [joueurSelectionne, setJoueurSelectionne] = useState(null);

const ajouterJoueurDansEquipe = async () => {
  try {
    await axios.patch(`${API}/api/teams/${selectedTeamId}/join`, {
      playerId: joueurSelectionne._id
    });
    alert("Joueur ajouté !");
    setJoueurSelectionne(null);
    setShowAddPlayer(false);

    setForm(prev => ({
      ...prev,
      joueurs: [...prev.joueurs, joueurSelectionne._id]
    }));
    
  } catch (err) {
    console.error(err);
    alert("Erreur lors de l'ajout du joueur");
  }
};


  const [form, setForm] = useState({
    nom: '',
    logo: '',
    joueurs: []
  });

  //  Charger toutes les équipes
  useEffect(() => {
    axios.get(`${API}/api/teams`)
      .then(res => setTeams(res.data.data || res.data)) // dépend de ton format
      .catch(err => console.error("Erreur chargement équipes :", err));
  }, []);

  //  Charger l'équipe sélectionnée
  useEffect(() => {
    if (!selectedTeamId) return;

    const fetchDetails = async () => {
      try {
        const teamRes = await axios.get(`${API}/api/teams/${selectedTeamId}`);
        const joueursRes = await axios.get(`${API}/api/joueurs`);
        setTeamData(teamRes.data.data);
        setJoueurs(joueursRes.data);

        setForm({
          nom: teamRes.data.data.nom,
          logo: teamRes.data.data.logo,
          joueurs: teamRes.data.data.joueurs.map(j => j._id)
        });
      } catch (err) {
        console.error("Erreur chargement team ou joueurs :", err);
      }
    };

    fetchDetails();
  }, [selectedTeamId]);

  const handleUpdate = async (e) => {
    e.preventDefault();
  
    const nouvelleListe = form.joueurs.filter(id => !joueursÀRetirer.includes(id));
  
    try {
      const res = await axios.patch(`${API}/api/teams/${selectedTeamId}/update`, {
        ...form,
        joueurs: nouvelleListe
      });
  
      alert(" Équipe mise à jour !");
      setJoueursÀRetirer([]);
  
      //  recharger les données de l’équipe pour que l’UI soit à jour
      const updatedTeam = await axios.get(`${API}/api/teams/${selectedTeamId}`);
      setTeamData(updatedTeam.data.data);
      setForm({
        nom: updatedTeam.data.data.nom,
        logo: updatedTeam.data.data.logo,
        joueurs: updatedTeam.data.data.joueurs.map(j => j._id)
      });
  
    } catch (err) {
      console.error("Erreur modification :", err);
      alert(" Erreur lors de la mise à jour");
    }
  };
  
  

  const toggleSuppression = (joueurId) => {
    setJoueursÀRetirer((prev) =>
      prev.includes(joueurId)
        ? prev.filter(id => id !== joueurId) // déjà marqué → on annule
        : [...prev, joueurId]                // sinon on le marque à retirer
    );
  };
  
  

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-xl w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl p-8 mx-auto"
    >
      <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-indigo-400 
        text-transparent bg-clip-text">
        Modifier une équipe
      </h2>
  
      <label className="block mb-2 text-gray-300">Choisir une équipe :</label>
      <select
        value={selectedTeamId}
        onChange={(e) => setSelectedTeamId(e.target.value)}
        className="mb-6 w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Sélectionner</option>
        {teams.map(team => (
          <option key={team._id} value={team._id}>
            {team.nom}
          </option>
        ))}
      </select>
  
      {teamData && (
        <form onSubmit={handleUpdate}>
          <label className="block mb-2 text-gray-300">Nom :</label>
          <input
            type="text"
            value={form.nom}
            onChange={(e) => setForm({ ...form, nom: e.target.value })}
            className="w-full px-4 py-3 mb-4 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
  
          <label className="block mb-2 text-gray-300">Logo (URL) :</label>
          <input
            type="text"
            value={form.logo}
            onChange={(e) => setForm({ ...form, logo: e.target.value })}
            className="w-full px-4 py-3 mb-4 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
  
          <label className="block mb-4 text-gray-300">Joueurs :</label>
          <div className="flex flex-col gap-2">
            <h4 className="text-gray-200 font-semibold mb-2">Membres de l’équipe :</h4>
            <ul className="space-y-2">
              {joueurs
                .filter(j => form.joueurs.includes(j._id))
                .map(j => {
                  const estMarqué = joueursÀRetirer.includes(j._id);
                  return (
                    <li
                      key={j._id}
                      className={`flex items-center justify-between px-4 py-2 rounded-md bg-gray-700 
                        ${estMarqué ? 'opacity-50' : ''}`}
                    >
                      <span className="text-white">{j.prenom} {j.nom} — {j.email}</span>
                      <button
                        type="button"
                        onClick={() => toggleSuppression(j._id)}
                        className={`px-3 py-1 rounded-md font-medium 
                          ${estMarqué ? 'bg-yellow-500' : 'bg-red-600'} text-white hover:opacity-90`}
                      >
                        {estMarqué ? 'Annuler' : 'Retirer'}
                      </button>
                    </li>
                  );
                })}
            </ul>
  
            <motion.button
              type="button"
              onClick={() => setShowAddPlayer(true)}
              className="mt-4 py-2 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-lg 
                shadow-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 
                focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Rajouter un joueur
            </motion.button>
  
            {showAddPlayer && (
              <>
                <RajouterJoueur onJoueurSelectionne={setJoueurSelectionne} />
                {joueurSelectionne && (
                  <div className="mt-4 text-white">
                    <p>
                      Joueur sélectionné : <strong>{joueurSelectionne.pseudo}</strong>
                    </p>
                    <motion.button
                      type="button"
                      onClick={ajouterJoueurDansEquipe}
                      className="mt-2 py-2 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold 
                        rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-700 transition duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Confirmer l'ajout
                    </motion.button>
                  </div>
                )}
              </>
            )}
          </div>
  
          <motion.button
            type="submit"
            className="mt-6 w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white 
              font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-indigo-700 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
              focus:ring-offset-gray-900 transition duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Enregistrer les modifications
          </motion.button>
        </form>
      )}
    </motion.div>
  )
}  
export default UpdateTeam;
