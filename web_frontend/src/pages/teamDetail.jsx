import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./teamDetail.css"; 
import axios from "axios";


function TeamDetail() {
  const { id } = useParams(); // ID de l'équipe depuis l'URL
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);

  const fetchTeamDetail = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/teams/${id}`); 
      setTeam(response.data.data)
    } catch (error) {
      console.error("Erreur lors de la récupération des détails :", error);
    }
  };

  useEffect(() => {
    fetchTeamDetail();
  }, [id]);

  if (!team) {
    return <p>Chargement...</p>;
  }

  return (
    <div className="team-detail-container">
      <h1>{team.nom}</h1>

      {team.logo && ( 
      <img
        src={team.logo}
        alt={team.nom}
        className="team-logo"
      />
      )}

      <h3>Membres de l'équipes:</h3>
      <ul className="player-list">
        {team.joueurs.map((player, index) => (
          <li key={index} className="player-card" >
            <strong> Joueur : {player.nom} {player.prenom} </strong><br />
            École : {player.ecole}
          </li>
        ))}
      </ul>

      <button className="back-button" onClick={() => navigate("/team")}>
        Retour aux équipes
      </button>
    </div>
  );
}

export default TeamDetail;
