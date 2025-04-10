import React, { useEffect, useState } from "react";
import './Team.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Team() {
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate();

  const fetchTeams = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/teams"); 

      setTeams(response.data.data); 
    } catch (error) {
      console.error("Erreur lors de la récupération des équipes :", error);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <div className="team-container">
      <h1>Nos équipes</h1>
    <div className="team-list">
        {teams.length === 0 ? (
          <p>Aucune équipe trouvée.</p>
        ) : (
          teams.map((team) => (
            <div key={team._id} className="team-card" onClick={() => navigate(`/team/${team._id}`)} style={{ cursor: "pointer", width: "160px"}}>
              <img src={team.logo} alt={team.nom} style={{ width: "150px", borderRadius: "8px" }} />
              <p><strong>{team.nom}</strong></p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Team;
