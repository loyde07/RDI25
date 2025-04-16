import React, { useState } from "react";
import "../tournois.css"; 

const Match = ({ team1, team2, onWinner }) => {
    const [score1, setScore1] = useState("");
    const [score2, setScore2] = useState("");
  
    const handleWinner = () => {
      const s1 = parseInt(score1, 10);
      const s2 = parseInt(score2, 10);
      if (!isNaN(s1) && !isNaN(s2)) {
        onWinner(s1 > s2 ? team1 : team2);
      }
    };
  
    return (
      <div className="match">
        <div className="team">
          {team1}
          <input
            type="number"
            value={score1}
            onChange={(e) => setScore1(e.target.value)}
          />
        </div>
        <div className="team">
          {team2}
          <input
            type="number"
            value={score2}
            onChange={(e) => setScore2(e.target.value)}
          />
        </div>
        <button onClick={handleWinner}>Valider</button>
      </div>
    );
  };
  
  const Tournament = () => {
    const [round1, setRound1] = useState([
      "TEAM DACH",
      "TEAM NORDICS",
      "TEAM POLAND",
      "TEAM FRANCE",
      "TEAM UK/IRELAND",
      "TEAM BALKANS/ITALY",
      "TEAM BENELUX",
      "TEAM IBERIA",
    ]);
  
    const [round2, setRound2] = useState(Array(4).fill(null));
    const [semis, setSemis] = useState(Array(2).fill(null));
    const [final, setFinal] = useState(null);
  
    const updateNextRound = (roundSetter, index) => (winner) => {
      roundSetter((prev) => {
        const updated = [...prev];
        updated[index] = winner;
        return updated;
      });
    };
  
    return (
      <div className="bracket-container">
        <div className="round">
          {[0, 2, 4, 6].map((i, idx) => (
            <Match
              key={i}
              team1={round1[i]}
              team2={round1[i + 1]}
              onWinner={updateNextRound(setRound2, idx)}
            />
          ))}
        </div>
        <div className="round">
          {[0, 2].map((i, idx) => (
            <Match
              key={i}
              team1={round2[i]}
              team2={round2[i + 1]}
              onWinner={updateNextRound(setSemis, idx)}
            />
          ))}
        </div>
        <div className="round">
          {semis[0] && semis[1] ? (
            <Match
              team1={semis[0]}
              team2={semis[1]}
              onWinner={setFinal}
            />
          ) : (
            <div className="placeholder">En attente des demi-finales...</div>
          )}
          {final && <div className="winner">🏆 Vainqueur : {final}</div>}
        </div>
      </div>
    );
  };
  
  export default Tournament;