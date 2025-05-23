import React, {useEffect, useState} from "react";
import axios from 'axios';
import {motion} from 'framer-motion'
import toast from "react-hot-toast";
import { useAuthStore} from "../../store/authStore";
import { useParams, useNavigate } from 'react-router-dom';


const API = import.meta.env.VITE_API ;

function SupprimerTeam(){
    const [teams, setTeams] = useState([]);
    const [selectedTeamId, setSelectedTeamId] = useState('');
    const { user } = useAuthStore();
    const {id} = useParams();
    const navigate = useNavigate();

    const teamToDelete = user.droit === "admin" ? selectedTeamId : id;


useEffect(() => {

    const fetchTeams = async () => {
        try{
            const res = await axios.get(API + '/api/teams' );
            setTeams(res.data.data);


        }catch (error){
            console.error("Erreur lors de la récupération des teams :", error.message)
        }
    };

    fetchTeams();


}, []);


const handleDelete = async (e) => {

    e.preventDefault();


    try{
        

        await axios.delete(`${API}/api/teams/delete-logo/${selectedTeamId}`);

        await axios.delete(`${API}/api/teams/${teamToDelete}/delete`);
      
        setTeams(prev => prev.filter(team => team._id !== teamToDelete));

        setSelectedTeamId('');;
        toast.success("Équipe supprimée avec succès !");

        navigate("/dashboard");

    }catch (error){
        console.error("erreur de la suppression:", error.response?.data || error.message);
        toast.error("Erreur de suppression")
    }
};


return (
    <motion.form
      onSubmit={handleDelete}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full mx-auto bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-2xl shadow-xl p-8"
    >

    {user.droit == "admin" ? (
      <div>
      <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-indigo-400 text-transparent bg-clip-text">
        Supprimer une équipe
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
      </div>
      ) : (

        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-indigo-400 text-transparent bg-clip-text">
        Confirmer la suppression
        </h2>
      )}
  
      <motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 px-4 bg-gradient-to-r from-red-500 to-red-700 text-white font-bold rounded-lg shadow-lg hover:from-red-600 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
      >
        Supprimer
      </motion.button>
    </motion.form>
  );}


export default SupprimerTeam;