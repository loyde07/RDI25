import React, { useEffect, useState } from "react";
import axios from "axios";
import "./team.css";

function TeamCarousel() {
  const [teams, setTeams] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

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

  const handleScroll = (direction) => {
    if (direction === "left") {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : teams.length - 1));
    } else {
      setSelectedIndex((prev) => (prev < teams.length - 1 ? prev + 1 : 0));
    }
  };

  const selectedTeam = teams[selectedIndex];

  return (
    <div className="main-wrapper">
      <div className="carousel-container">
        <h1 className="section-title">Équipes</h1>

        <div className="carousel-track">
          <button onClick={() => handleScroll("left")} className="carousel-btn">⬅</button>

          <div className="carousel-zone">
            {teams.map((team, index) => (
              <div
                key={team._id}
                className={`carousel-logo-wrapper ${index === selectedIndex ? 'active' : ''}`}
                onClick={() => setSelectedIndex(index)}
              >
                <img
                  src={team.logo}
                  alt={team.nom}
                  className={`carousel-logo ${index === selectedIndex ? 'active' : ''}`}
                />
              </div>
            ))}
          </div>

          <button onClick={() => handleScroll("right")} className="carousel-btn">➡</button>
        </div>

        {selectedTeam && (
          <div className="team-detail-container">
            <h2 className="section-title">{selectedTeam.nom}</h2>
            <img src={selectedTeam.logo} alt={selectedTeam.nom} className="team-logo" />
            <h3 className="section-title">Membres de l'équipe</h3>
            <ul className="player-list">
              {selectedTeam.joueurs.map((player, i) => (
                <li key={i} className="player-card">
                  <strong>Joueur : {player.nom} {player.prenom}</strong><br />
                  École : {player.ecole}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default TeamCarousel;
