/**
 * Composant principal du tournoi (arbre à 8 équipes : quart -> demi -> finale)
 */


import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trophy, Swords } from "lucide-react";
import { Link } from "react-router-dom";
import Match from "./tournoisMatch.jsx";

const API = import.meta.env.VITE_API;

const Tournament = () => {
  const [round1, setRound1] = useState([]);            // 8 équipes
  const [round2, setRound2] = useState(Array(4).fill(null));
  const [semis, setSemis]  = useState(Array(2).fill(null));
  const [final, setFinal]  = useState(null);
  const [tournamentStarted, setTournamentStarted] = useState(false);

  /* ------------------------------------------------------------------ */
  /* Chargement initial (équipes + state précédent)                      */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    // Round 1 — on regarde d'abord le localStorage
    const savedTeams = JSON.parse(localStorage.getItem("round1"));
    if (savedTeams && savedTeams.length) {
      setRound1(savedTeams);
      setTournamentStarted(true); // Si déjà généré, on montre le tournoi

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
        `${API}/api/teams/67f8c2993634ef292b6a5d0b/teams`
        
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
  const [resetId, setResetId] = useState(0);
  const resetTournament = () => {
    setRound1([]);
    setRound2(Array(4).fill(null));
    setSemis(Array(2).fill(null));
    setFinal(null);
    localStorage.clear();
    setResetId((prev) => prev + 1);
    fetchTeams();
  };



const generateMatches = async () => {
  try {
    const { data } = await axios.post(
      `${API}/api/tournois/67f8c2993634ef292b6a5d0b/generate-matches`
    );
    
    const noms = data.matchs.map(m => [m.team1.nom, m.team2.nom]).flat();
    const uniques = [...new Set(noms)].slice(0, 8); // Juste pour être sûr d’avoir 8 noms
    localStorage.clear();

    setRound1(uniques);
    localStorage.setItem("round1", JSON.stringify(uniques));
    alert('Matchs créés avec succès !');
  } catch (err) {
    alert(err.response?.data?.message || 'Erreur');
  }
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
                    key={`R1-${idx}-${resetId}`}
                    matchId={`R1-${idx}-${resetId}`}
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
            <div key={`R2-${idx}-${resetId}`} className="mt-[76px]">
                <Match
                key={`R2-${idx}-${resetId}`}
                matchId={`R2-${idx}-${resetId}`}
                team1={round2[i]}
                team2={round2[i + 1]}
                onWinner={updateNextRound(setSemis, "semis", idx)}
                />
            </div>
            
          ))}
        </div>

        {/* -------------------- Finale --------------------- */}
        <div className="flex flex-col items-center flex-1 min-w-[250px]">
          <h2 className="text-xl font-semibold mb-4">Finale</h2>
          <div className="mt-[345px]">
                <Match
                    key={`Final-${resetId}`}
                    matchId={`Final-${resetId}`}
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
      {/* Génère */}
        <button
          disabled={round1.length === 8}
          className={`mt-12 px-6 py-3 rounded-md text-white transition 
            ${round1.length === 8 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-blue-600 hover:bg-blue-900"}
          `}
          onClick={() => {
            fetchTeams();
            setTournamentStarted(true);
          }}
        >
          {round1.length === 8 ? "Tournoi déjà généré" : "Générer le tournoi"}
        </button>

        <Link to="/inscriptionTournois">
        
          <button
            className="mt-12 px-6 py-3 bg-blue-600 hover:bg-blue-900 rounded-md text-white"

          >Inscrire des équipes au tournois</button>
        </Link>
    </div>
  );
};


export default Tournament;