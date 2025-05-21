/**
 * Composant principal du tournoi (arbre à 8 équipes : quart -> demi -> finale)
 */


import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trophy, Swords } from "lucide-react";
import { Link } from "react-router-dom";
import Match from "./tournoisMatch.jsx";
import toast from "react-hot-toast";

const API = import.meta.env.VITE_API;

const Tournament = () => {
  const [round1, setRound1] = useState([]);            // 8 équipes
  const [round2, setRound2] = useState(Array(4).fill(null));
  const [semis, setSemis]  = useState(Array(2).fill(null));
  const [final, setFinal]  = useState(null);
  const [tournamentStarted, setTournamentStarted] = useState(false);
  const [matches, setMatches] = useState([]);
  const round1Matches = matches.filter((m) => m.round === 1);
  const round2Matches = matches.filter((m) => m.round === 2);
  const round3Matches = matches.filter((m) => m.round === 3);


  const id = localStorage.getItem("tournoisId") || "67f8c2993634ef292b6a5d0b";
  const [resetId, setResetId] = useState(0);

  /* ------------------------------------------------------------------ */
  /* Chargement initial (équipes + state précédent)                      */
  /* ------------------------------------------------------------------ */

  console.log("tournamentStarted:", tournamentStarted);
  console.log("round1Matches:", round1Matches);
useEffect(() => {
  axios.get(`${API}/api/tournois/${id}/matches`)
    .then(res => {
      const matchs = res.data.matchs;
      setMatches(matchs);

      // Round 1
      const round1Teams = matchs
        .filter(m => m.round === 1)
        .map(m => [m.team1_id.nom, m.team2_id.nom])
        .flat()
        .filter(Boolean);
      setRound1([...new Set(round1Teams)]);

      // Round 2 (demi-finales)
      const round2Teams = matchs
        .filter(m => m.round === 2)
        .map(m => [m.team1_id.nom, m.team2_id.nom])
        .flat()
        .filter(Boolean);
      setRound2([...new Set(round2Teams)]);

      // Round 3 (finale)
      const finalTeams = matchs
        .filter(m => m.round === 3)
        .map(m => [m.team1_id.nom, m.team2_id.nom])
        .flat()
        .filter(Boolean);
      setFinal([...new Set(finalTeams)]);

      setTournamentStarted(true);
    })
    .catch(console.error);
}, [id]);

  
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
const updateNextRound = (roundSetter, storageKey, index, nextRound, roundNumber) => async (winner) => {
  roundSetter((prev) => {
    const updated = [...prev];
    updated[index] = winner;
    localStorage.setItem(storageKey, JSON.stringify(updated));
    return updated;
  });

  
  setTimeout(async () => {
    const current = JSON.parse(localStorage.getItem(storageKey));
   if (!current || current.length < 2) {
      console.log("Plus assez d'équipes pour continuer (tournoi terminé ?)");
      return;
    }
    if (!roundNumber || isNaN(Number(roundNumber))) {
    console.log("Round invalide ou tournoi terminé");
    return;
  }
    const i = index % 2 === 0 ? index : index - 1;
    const team1 = current[i];
    const team2 = current[i + 1];

    if (team1 && team2) {
      try {
        const check = await axios.get(`${API}/api/matches/check`, {
          params: {
            team1_id: team1,
            team2_id: team2,
            round: Number(roundNumber)
          }
        });

        if (!check.data.exists) {
          const { data } = await axios.post(`${API}/api/matches/new`, {
            tournois_id: id,
            team1_id: team1,
            team2_id: team2,
            round: Number(roundNumber)
          });

          if (typeof nextRound === "function" && nextRound !== (() => {})) {
            nextRound((prev) => {
              const copy = [...prev];
              copy[Math.floor(i / 2)] = null;
              localStorage.setItem(`round${roundNumber}`, JSON.stringify(copy));
              return copy;
            });
          }

          toast.success("✅ Match créé pour le round " + roundNumber);
        } else {
          toast.success("⏭️ Match déjà existant, on ne fait rien.");
        }
      } catch (err) {
        toast.error("❌ Erreur création match :", err);
      }
    }
  }, 100);
};




  /* ------------------------------------------------------------------ */
  /* RESET / RESTART                                                    */
  /* ------------------------------------------------------------------ */
  const resetTournament = async () => {
    try {
      // 1. Supprime tous les matchs du tournoi en base
      await axios.delete(`${API}/api/tournois/${id}/reset`);

      // 2. Réinitialise tous les rounds côté client
      setRound1([]);
      setRound2(Array(4).fill(null));
      setSemis(Array(2).fill(null));
      setFinal(null);
      setMatches([]); // ← SUPER IMPORTANT
      localStorage.clear();
      setResetId((prev) => prev + 1);
      setTournamentStarted(false);


    // 3. Recharge les équipes si besoin
    setMatches([]); // vide les anciens matchs

    toast.success("Tournoi réinitialisé avec succès.");
  } catch (err) {
    console.error("Erreur lors du reset :", err);
    alert("Erreur lors du reset du tournoi.");
  }
};



const generateMatches = async () => {
  try {
    await axios.post(`${API}/api/tournois/${id}/generate-matches`);
    // Après la création côté serveur, refetch pour mettre à jour le front
    const { data } = await axios.get(`${API}/api/tournois/${id}/matches`);
    setMatches(data.matchs);

    const round1Teams = data.matchs
      .filter(m => m.round === 1)
      .map(m => [m.team1_id.nom, m.team2_id.nom]) 
      .flat()
      .filter(Boolean);

    setRound1([...new Set(round1Teams)]);
    setTournamentStarted(true);
    toast.success('Matchs créés avec succès !');
  } catch (err) {
    toast.error(err.response?.data?.message || 'Erreur');
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
          {tournamentStarted && round1Matches.length > 0 ? (

       <div className="flex w-full justify-center items-start gap-32 px-4 overflow-x-auto">
        {/* -------------------- Round 1 -------------------- */}
        <div className="flex flex-col items-center flex-1 min-w-[250px]">
          <h2 className="text-xl font-semibold mb-4">1er tour</h2>
          <div className="flex flex-col gap-12">
            {round1Matches.map((match, idx) => {
              if (!match.team1_id || !match.team2_id) return null;
              return (
                <Match
                  key={match._id}
                  matchDbId={match._id}
                  team1={match.team1_id}
                  team2={match.team2_id}
                  onWinner={updateNextRound(setRound2, "round2", idx, setSemis, 2)}
                />
              );
            })}
          </div>
        </div>

        {/* ---------------- Demi-finales ------------------- */}
        <div className="flex flex-col items-center gap-24 flex-1 min-w-[250px]">
          <h2 className="text-xl font-semibold mb-4">Demi-finales</h2>
        {round2Matches.map((match, idx) => (
          <Match
            key={match._id}
            matchDbId={match._id}
            team1={match.team1_id}
            team2={match.team2_id}
            onWinner={updateNextRound(setSemis, "semis", idx, setFinal, 3)}
          />
        ))}


        </div>


        {/* -------------------- Finale --------------------- */}
        <div className="flex flex-col items-center flex-1 min-w-[250px]">
          <h2 className="text-xl font-semibold mb-4">Finale</h2>
          <div className="mt-[345px]">
        {round3Matches.map((match, idx) => (
          <Match
            key={match._id}
            matchDbId={match._id}
            team1={match.team1_id}
            team2={match.team2_id}
            onWinner={updateNextRound(setFinal, "final", 0, 1, 4)} // round 4 = finale
            />

        ))}
          </div>
          {final && (
            <div className="mt-10 text-2xl font-bold text-yellow-400 flex items-center gap-2">
              <Trophy size={28} /> Vainqueur : {final}
            </div>
          )}
        </div>
      </div>
          ) : (
            <p>Aucun match à afficher</p> // ou rien du tout
          )}
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
            onClick={generateMatches}

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