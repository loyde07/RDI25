import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./team.css";

const API = import.meta.env.VITE_API || "http://localhost:5000";
function TeamCarousel() {
  const [teams, setTeams] = useState([]);
  const logoRefs = useRef([]);
  const carouselZoneRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [joueurs, setJoueurs] = useState([]);

  const fetchTeams = async () => {
    try {
      const response = await axios.get(`${API}/api/teams`);
      setTeams(response.data.data || response.data); // selon ton backend
    } catch (error) {
      console.error("Erreur lors de la récupération des équipes :", error);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    if (logoRefs.current[selectedIndex]) {
      logoRefs.current[selectedIndex].scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [selectedIndex]);
  useEffect(() => {
    if (!selectedTeamId) return;
  
    const fetchJoueurs = async () => {
      try {
        const res = await axios.get(`${API}/api/joueurs/team/${selectedTeamId}`);
        setJoueurs(res.data);
        console.log("✅ Joueurs récupérés :", res.data);
      } catch (err) {
        console.error("Erreur chargement des joueurs :", err);
      }
    };
  
    fetchJoueurs();
  }, [selectedTeamId]);
  

  useEffect(() => {
    if (teams[selectedIndex]?._id) {
      setSelectedTeamId(teams[selectedIndex]._id);
      console.log("✅ Team sélectionnée :", teams[selectedIndex]._id);
    }
  }, [selectedIndex, teams]);
  
  
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
          <button onClick={() => handleScroll("left")} className="carousel-btn left">⬅</button>

          <div className="carousel-zone" ref={carouselZoneRef}>
            {teams.map((team, index) => (
              <div
                key={team._id}
                ref={(el) => logoRefs.current[index] = el}
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

          <button onClick={() => handleScroll("right")} className="carousel-btn right">➡</button>
        </div>

        {selectedTeam && (
          <div className="team-detail-container">
            <h2 className="section-title">{selectedTeam.nom}</h2>
            <img src={selectedTeam.logo} alt={selectedTeam.nom} className="team-logo" />
            <h3 className="section-title">Membres de l'équipe</h3>
            <ul className="player-list">
            {joueurs.slice(0, 5).map((j) => (
                  <li key={j._id} className="player-card">
                    <strong>Joueur : {j.prenom} {j.nom}</strong> — {j.email}<br />
                    Établissement scolaire : {j.ecole_id?.nom || "Non renseigné"}
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
