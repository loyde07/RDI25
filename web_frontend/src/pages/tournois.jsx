import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trophy, Swords, Shield } from "lucide-react";

const API = import.meta.env.VITE_API ;

const Match = ({ team1, team2, onWinner }) => {
  const [score1, setScore1] = useState("");
  const [score2, setScore2] = useState("");

  const handleWinner = () => {
    const s1 = parseInt(score1, 10);
    const s2 = parseInt(score2, 10);
    if (!isNaN(s1) && !isNaN(s2) && s1 >= 0 && s2 >= 0) {
      onWinner(s1 > s2 ? team1 : team2);
    }
  };

  return (
    <div className="bg-gray-800 text-white rounded-lg p-4 shadow-lg flex flex-col items-center gap-2 mb-6 w-full max-w-xs">
      <div className="w-full flex justify-between items-center">
        <span>{team1 || "?"}</span>
        <input
          type="number"
          value={score1}
          onChange={(e) => setScore1(e.target.value)}
          className="w-16 px-2 py-1 bg-gray-700 text-white rounded-md"
        />
      </div>
      <div className="w-full flex justify-between items-center">
        <span>{team2 || "?"}</span>
        <input
          type="number"
          value={score2}
          onChange={(e) => setScore2(e.target.value)}
          className="w-16 px-2 py-1 bg-gray-700 text-white rounded-md"
        />
      </div>
      <button
        onClick={handleWinner}
        className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white"
      >
        Valider
      </button>
    </div>
  );
};

const Tournament = () => {
  const [round1, setRound1] = useState([]);
  const [round2, setRound2] = useState(Array(4).fill(null));
  const [semis, setSemis] = useState(Array(2).fill(null));
  const [final, setFinal] = useState(null);

  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await axios.get( `${API}/api/teams/67f8c2993634ef292b6a5d0b/teams`
        );
        const nomsDesTeams = response.data.map((team) => team.nom);
        setRound1(nomsDesTeams);
      } catch (error) {
        console.error("Erreur lors de la récupération :", error);
      }
    };
    fetchData();
  }, []);


  const updateNextRound = (roundSetter, index) => (winner) => {
    roundSetter((prev) => {
      const updated = [...prev];
      updated[index] = winner;
      return updated;
    });

  
  };

  return (
    <div className="flex flex-col items-center min-h-screen pt-64 px-6 bg-[#1e1e1e] text-white">
      <h1 className="text-4xl font-bold mb-10 flex items-center gap-3">
        <Swords size={32} /> Tournoi Valo
      </h1>

      <div className="flex justify-center items-start min-h-screen pt-40 px-6 bg-[#1e1e1e] text-white">
  <div className="flex gap-20">
    {/* Round 1 */}
    <div className="flex flex-col items-center gap-20">
      <h2 className="text-xl font-semibold mb-4">1er tour</h2>
      {[0, 2, 4, 6].map((i, idx) => (
        <Match
          key={i}
          team1={round1[i]}
          team2={round1[i + 1]}
          onWinner={updateNextRound(setRound2, idx)}
        />
      ))}
    </div>

    {/* Demi-finales */}
    <div className="flex flex-col items-center gap-40 mt-20">
      <h2 className="text-xl font-semibold mb-4">Demi-finales</h2>
      {[0, 2].map((i, idx) => (
        <Match
          key={i}
          team1={round2[i]}
          team2={round2[i + 1]}
          onWinner={updateNextRound(setSemis, idx)}
        />
      ))}
    </div>

    {/* Finale */}
    <div className="flex flex-col items-center mt-52">
      <h2 className="text-xl font-semibold mb-4">Finale</h2>
      {semis[0] && semis[1] ? (
        <Match team1={semis[0]} team2={semis[1]} onWinner={setFinal} />
      ) : (
        <div className="text-gray-400 italic mt-10">
          En attente des demi-finales...
        </div>
      )}
      {final && (
        <div className="mt-10 text-2xl font-bold text-yellow-400 flex items-center gap-2">
          <Trophy size={28} /> Vainqueur : {final}
        </div>
      )}
    </div>
  </div>
</div>

    </div>
  );
};

export default Tournament;
