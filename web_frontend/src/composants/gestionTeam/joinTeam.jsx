import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API || "http://localhost:5000";
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
    <form onSubmit={handleJoin} style={{ marginTop: '30px', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ color: '#382c2c', textAlign: 'center' }}>Rejoindre une équipe</h2>

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
      >
        <option value="">Sélectionner une équipe</option>
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
        Rejoindre
      </button>
    </form>
  );
}

export default RejoindreTeam;
