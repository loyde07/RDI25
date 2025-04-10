import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>{team.nom}</h1>

      {team.logo && ( 
      <img
        src={team.logo}
        alt={team.nom}
        style={{ width: "200px", borderRadius: "8px", marginBottom: "30px" }}
      />
      )}

      <h3>Mmebres de l'équipes:</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {team.joueurs.map((player, index) => (
          <li key={index} style={{ marginBottom: "15px" }}>
            <strong> Joueur : {player.nom} {player.prenom} </strong><br />
            École : {player.ecole}
          </li>
        ))}
      </ul>

      <button onClick={() => navigate("/team")} style={{ marginTop: "30px" }}>
        Retour aux équipes
      </button>
    </div>
  );
}

export default TeamDetail;
