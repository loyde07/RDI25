import React, { useEffect, useState } from "react";
import axios from "axios";
import "./team.css";

const API = "http://localhost:5000";
;

function Team() {
  const [teams, setTeams] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [joueurs, setJoueurs] = useState([]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await axios.get(`${API}/api/teams`);
        setTeams(res.data.data || res.data);

      } catch (err) {
        console.error("Erreur récupération équipes :", err);
      }
    };

    fetchTeams();
  }, []);

  useEffect(() => {
    if (!selectedTeamId) return;

    const fetchJoueurs = async () => {
      try {
        const res = await axios.get(`${API}/api/joueurs/team/${selectedTeamId}`);
        setJoueurs(res.data);
      } catch (err) {
        console.error("Erreur récupération joueurs :", err);
      }
    };

    fetchJoueurs();
  }, [selectedTeamId]);

  useEffect(() => {
    if (teams[selectedIndex]?._id) {
      setSelectedTeamId(teams[selectedIndex]._id);
    }
  }, [selectedIndex, teams]);

  const rotateLeft = () => {
    setSelectedIndex((prev) => (prev - 1 + teams.length) % teams.length);
  };

  const rotateRight = () => {
    setSelectedIndex((prev) => (prev + 1) % teams.length);
  };

  const handleLogoClick = (index) => {
    setSelectedIndex(index);
  };

  const angleStep = 360 / teams.length;

  return (
    <div className="main-wrapper py-64" >
      <h1 className="text-5xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-indigo-400 
                    text-transparent bg-clip-text">Équipes</h1>

      <div className="carousel3D-wrapper">
        <div className="carousel3D">
          {teams.map((team, index) => {
            const angle = angleStep * (index - selectedIndex);
            return (
              <div
                key={team._id}
                className={`carousel3D-item ${index === selectedIndex ? "active" : ""}`}
                style={{
                  transform: `translateX(-50%) rotateY(${angle}deg) translateZ(600px)`
                }}
                onClick={() => handleLogoClick(index)}
              >
                <img src={team.logo ? team.logo : "/val.png"} alt={team.nom} className="carousel3D-img" />
              </div>
            );
          })}
        </div>
      </div>

      <div className="carousel3D-controls">
        <button onClick={rotateLeft} className="carousel3D-btn">{'<'}</button>
        <button onClick={rotateRight} className="carousel3D-btn">{'>'}</button>
      </div>

      {teams[selectedIndex] && (
        <div className="max-w-4xl w-full mx-auto p-6 bg-gray-800/40 backdrop-blur-md rounded-2xl shadow-md mt-10">


          <h2 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-indigo-400 
                    text-transparent bg-clip-text">{teams[selectedIndex].nom}</h2>
          <img src={teams[selectedIndex].logo || "/val.png"} alt={teams[selectedIndex].nom} className="team-logo" />
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
        </div>
      )}
    </div>
  );
}

export default Team;
