import React, {useEffect, useState} from "react";
import axios from 'axios';
import "../tournois.css"; 



const Match = ({ team1, team2, onWinner, matchId }) => {
    const [score1, setScore1] = useState("");
    const [score2, setScore2] = useState("");

    useEffect(() => {
      const savedScores = JSON.parse(localStorage.getItem(`scores-${matchId}`));
      if (savedScores) {
        setScore1(savedScores.score1);
        setScore2(savedScores.score2);
      }
    }, [matchId]);
  
    const handleScore1Change = (e) => {
      const value = e.target.value;
      setScore1(value);
      localStorage.setItem(`scores-${matchId}`, JSON.stringify({ score1: value, score2 }));
    };
  
    const handleScore2Change = (e) => {
      const value = e.target.value;
      setScore2(value);
      localStorage.setItem(`scores-${matchId}`, JSON.stringify({ score1, score2: value }));
    };
  
    const handleWinner = () => {
      const s1 = parseInt(score1, 10);
      const s2 = parseInt(score2, 10);
      if (
        !isNaN(s1) &&
        !isNaN(s2) &&
        s1 >= 0 &&
        s2 >= 0
      ) {
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
            onChange={handleScore1Change }
          />
        </div>
        <div className="team">
          {team2}
          <input
            type="number"
            value={score2}
            onChange={handleScore2Change}
          />
        </div>
        <button onClick={handleWinner}>Valider</button>
      </div>
    );
  };
  
  const Tournament = () => {
    const [round1, setRound1] = useState([]);
    const [round2, setRound2] = useState(Array(4).fill(null));
    const [semis, setSemis] = useState(Array(2).fill(null));
    const [final, setFinal] = useState(null);
  
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/teams/67f8c2993634ef292b6a5d0b/teams");
  
        const nomsDesTeams = response.data.map(team => team.nom);
  
        setRound1(nomsDesTeams);
      } catch (error) {
        console.error("Erreur lors de la récupération :", error);
      }
    };

    useEffect(() => {
      // Charger les équipes depuis localStorage ou depuis l'API
      const savedTeams = JSON.parse(localStorage.getItem("teams"));
        if (savedTeams) {
          setRound1(savedTeams);  // Si elles sont déjà dans localStorage
        } else {
          fetchData();  // Sinon, on récupère depuis l'API
        }
  
      // Charger les rounds et le final depuis localStorage
      const savedRound2 = JSON.parse(localStorage.getItem("round2"));
      const savedSemis = JSON.parse(localStorage.getItem("semis"));
      const savedFinal = JSON.parse(localStorage.getItem("final"));
  
      if (savedRound2) setRound2(savedRound2);
      if (savedSemis) setSemis(savedSemis);
      if (savedFinal) setFinal(savedFinal);
    }, []);
  
    const updateNextRound = (roundSetter, roundKey, index) => (winner) => {
      roundSetter((prev) => {
        const updated = [...prev];
        updated[index] = winner;
        localStorage.setItem(roundKey, JSON.stringify(updated));
        return updated;
      });
    };
    
    const handleSetFinal = (winner) => {
      setFinal(winner);
      localStorage.setItem("final", JSON.stringify(winner));
    };
    
    const handleResetTournament = () => {
      // Réinitialiser les autres rounds (round2, semis, final)
      setRound1([]);  // Réinitialiser aussi les équipes du round 1
      setRound2(Array(4).fill(null));
      setSemis(Array(2).fill(null));
      setFinal(null);
    
      /*localStorage.removeItem("round2");
      localStorage.removeItem("semis");
      localStorage.removeItem("final");

      // Supprimer les scores de tous les matchs
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("scores-")) {
          localStorage.removeItem(key);
        }
      });*/
      localStorage.clear();  
    };

    

    return (
      <div className="bracket-container">
        <div className="round">
          {[0, 2, 4, 6].map((i, idx) => (
            <Match
              key={`R1-M${idx}`}
              matchId={`R1-M${idx}`}
              team1={round1[i]}
              team2={round1[i + 1]}
              onWinner={updateNextRound(setRound2, "round2", idx)}
            />
          ))}
        </div>
        <div className="round">
          {[0, 2].map((i, idx) => (
            <Match
              key={`R2-M${idx}`}
              matchId={`R2-M${idx}`}
              team1={round2[i]}
              team2={round2[i + 1]}
              onWinner={updateNextRound(setSemis, "semis", idx)}
            />
          ))}
        </div>
        <div className="round">
          <Match
            matchId="Final"
            team1={semis[0]}
            team2={semis[1]}
            onWinner={handleSetFinal}
          />
          {final && <div className="winner">🏆 Vainqueur : {final}</div>}
        </div>
        <button className="reset-btn" onClick={handleResetTournament}> Reset le tournoin </button>
      </div>
    );
  };
  
  export default Tournament;

