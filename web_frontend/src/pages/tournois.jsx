import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trophy, Swords } from "lucide-react";

// Utilisez si vous voulez passer l'URL via une variable d'environnement
// const API = import.meta.env.VITE_API;

/**
 * Composant générique pour gérer un match (score + gagnant)
 */
const Match = ({ team1 = "?", team2 = "?", onWinner, matchId }) => {
  const [score1, setScore1] = useState("");
  const [score2, setScore2] = useState("");

  /* ------------------------------------------------------------------ */
  /* Chargement / persistance des scores                                 */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(`scores-${matchId}`));
    if (saved) {
      setScore1(saved.score1);
      setScore2(saved.score2);
    }
  }, [matchId]);

  const saveScores = (s1, s2) => {
    localStorage.setItem(`scores-${matchId}`, JSON.stringify({ score1: s1, score2: s2 }));
  };

  const handleScore1Change = (e) => {
    const value = e.target.value;
    setScore1(value);
    saveScores(value, score2);
  };

  const handleScore2Change = (e) => {
    const value = e.target.value;
    setScore2(value);
    saveScores(score1, value);
  };

  /* ------------------------------------------------------------------ */
  /* Validation du gagnant                                               */
  /* ------------------------------------------------------------------ */
  const handleValidate = () => {
    const s1 = parseInt(score1, 10);
    const s2 = parseInt(score2, 10);

    if (!isNaN(s1) && !isNaN(s2) && s1 >= 0 && s2 >= 0) {
      onWinner(s1 > s2 ? team1 : team2);
    }
  };

  /* ------------------------------------------------------------------ */
  /* UI                                                                 */
  /* ------------------------------------------------------------------ */
  return (
    <div className="bg-gray-800 text-white rounded-lg p-4 shadow-lg flex flex-col items-center gap-2 w-full max-w-xs">
      <div className="w-full flex justify-between items-center">
        <span>{team1}</span>
        <input
          type="number"
          value={score1}
          onChange={handleScore1Change}
          className="w-16 px-2 py-1 bg-gray-700 text-white rounded-md"
        />
      </div>
      <div className="w-full flex justify-between items-center">
        <span>{team2}</span>
        <input
          type="number"
          value={score2}
          onChange={handleScore2Change}
          className="w-16 px-2 py-1 bg-gray-700 text-white rounded-md"
        />
      </div>
      <button
        onClick={handleValidate}
        className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white"
      >
        Valider
      </button>
    </div>
  );
};

/**
 * Composant principal du tournoi (arbre à 8 équipes : quart -> demi -> finale)
 */
const Tournament = () => {
  const [round1, setRound1] = useState([]);            // 8 équipes
  const [round2, setRound2] = useState(Array(4).fill(null));
  const [semis, setSemis]  = useState(Array(2).fill(null));
  const [final, setFinal]  = useState(null);

  /* ------------------------------------------------------------------ */
  /* Chargement initial (équipes + state précédent)                      */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    // Round 1 — on regarde d'abord le localStorage
    const savedTeams = JSON.parse(localStorage.getItem("round1"));
    if (savedTeams && savedTeams.length) {
      setRound1(savedTeams);
    } else {
      fetchTeams(); // API fallback
    }

    // Autres rounds / finale
    const savedRound2 = JSON.parse(localStorage.getItem("round2"));
    const savedSemis  = JSON.parse(localStorage.getItem("semis"));
    const savedFinal  = JSON.parse(localStorage.getItem("final"));

    if (savedRound2) setRound2(savedRound2);
    if (savedSemis)  setSemis(savedSemis);
    if (savedFinal)  setFinal(savedFinal);
  }, []);

  
  /* ------------------------------------------------------------------ */
  /* Récupération des équipes serveur                                   */
  /* ------------------------------------------------------------------ */
  const fetchTeams = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/teams/67f8c2993634ef292b6a5d0b/teams"
      );

      // On extrait max 8 noms valides
      const names = data.filter((t) => t?.nom).map((t) => t.nom).slice(0, 8);
      setRound1(names);
      localStorage.setItem("round1", JSON.stringify(names));
    } catch (err) {
      console.error("Erreur lors de la récupération des équipes :", err);
    }
  };

  /* ------------------------------------------------------------------ */
  /* Helpers pour propager les gagnants                                  */
  /* ------------------------------------------------------------------ */
  const updateNextRound = (roundSetter, storageKey, index) => (winner) => {
    roundSetter((prev) => {
      const updated = [...prev];
      updated[index] = winner;
      localStorage.setItem(storageKey, JSON.stringify(updated));
      return updated;
    });
  };

  /* ------------------------------------------------------------------ */
  /* RESET / RESTART                                                    */
  /* ------------------------------------------------------------------ */
  const resetTournament = () => {
    setRound1([]);
    setRound2(Array(4).fill(null));
    setSemis(Array(2).fill(null));
    setFinal(null);
    localStorage.clear();
    fetchTeams();
  };

  /* ------------------------------------------------------------------ */
  /* UI                                                                 */
  /* ------------------------------------------------------------------ */
  return (
     <div className="min-h-screen w-screen bg-[#1e1e1e] text-white overflow-x-auto overflow-y-auto flex flex-col items-center p-6">
      {/* Titre */}
      <h1 className="text-4xl font-bold mb-10 flex items-center gap-3">
        <Swords size={32} /> Tournoi Valo
      </h1>

       <div className="flex w-full justify-center items-start gap-32 px-4 overflow-x-auto">
        {/* -------------------- Round 1 -------------------- */}
        <div className="flex flex-col items-center flex-1 min-w-[250px]">
          <h2 className="text-xl font-semibold mb-4">1er tour</h2>
          <div className="flex flex-col gap-12">
                {[0, 2, 4, 6].map((i, idx) => (
                    <Match
                    key={`R1-${idx}`}
                    matchId={`R1-${idx}`}
                    team1={round1[i]}
                    team2={round1[i + 1]}
                    onWinner={updateNextRound(setRound2, "round2", idx)}
                    />
                ))}
            </div>
        </div>

        {/* ---------------- Demi-finales ------------------- */}
        <div className="flex flex-col items-center gap-24 flex-1 min-w-[250px]">
          <h2 className="text-xl font-semibold mb-4">Demi-finales</h2>
          {[0, 2].map((i, idx) => (
            <Match
              key={`R2-${idx}`}
              matchId={`R2-${idx}`}
              team1={round2[i]}
              team2={round2[i + 1]}
              onWinner={updateNextRound(setSemis, "semis", idx)}
            />
          ))}
        </div>

        {/* -------------------- Finale --------------------- */}
        <div className="flex flex-col items-center flex-1 min-w-[250px]">
          <h2 className="text-xl font-semibold mb-4">Finale</h2>
          <div className="mt-[180px]">
                <Match
                    matchId="Final"
                    team1={semis[0] ?? "?"}
                    team2={semis[1] ?? "?"}
                    onWinner={(winner) => {
                        setFinal(winner);
                        localStorage.setItem("final", JSON.stringify(winner));
                    }}
                />
            </div>
          {final && (
            <div className="mt-10 text-2xl font-bold text-yellow-400 flex items-center gap-2">
              <Trophy size={28} /> Vainqueur : {final}
            </div>
          )}
        </div>
      </div>

      {/* Bouton Reset */}
      <button
        className="mt-12 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-md text-white"
        onClick={resetTournament}
      >
        Réinitialiser le tournoi
      </button>
    </div>
  );
};

export default Tournament;