import React, {useEffect, useState} from "react";
import axios from 'axios';

const API = import.meta.env.VITE_API || "http://localhost:5000";

function SupprimerTeam(){
    const [teams, setTeams] = useState([]);
    const [selectedTeamId, setSelectedTeamId] = useState('');


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
        await axios.delete(`${API}/api/teams/${selectedTeamId}/delete`);
        setTeams(prev => prev.filter(team => team._id !== selectedTeamId));

        setSelectedTeamId('');;
        alert("Équipe supprimée avec succès !");
    }catch (error){
        console.error("erreur de la suppression:", error.response?.data || error.message);
        alert("Erreur de suppression")
    }
};


return <form onSubmit={handleDelete} style={{ marginTop: '30px', maxWidth: '600px', margin: '0 auto' }}>
    <h2 style={{ color: '#382c2c', textAlign: 'center' }}> Supprimer une équipe</h2>

    <select
        value={selectedTeamId}
        onChange={(e) => setSelectedTeamId(e.target.value)}
        required
        style={{
        width: '100%',
        padding: '12px',
        borderRadius: '8px',
        border: '2px solid #8d695d',
        backgroundColor: '#e9d9d9',
        color: '#382c2c',
        marginBottom: '20px',
        fontSize: '16px'
        }}
    ><option value="">Sélectionner une équipe</option>
    {teams.map((team) => (
      <option key={team._id} value={team._id}>{team.nom}</option>
    ))}
  </select>

  <button
        type="submit"
        style={{
          padding: '15px 30px',
          backgroundColor: '#8d695d',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '18px',
          cursor: 'pointer',
          width: '100%'
        }}
      >
        Supprimer
      </button>


</form>
}
export default SupprimerTeam;