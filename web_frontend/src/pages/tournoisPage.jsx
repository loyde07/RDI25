/**
 * Composant principal du tournoi (arbre à 8 équipes : quart -> demi -> finale)
 */


import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trophy, Swords } from "lucide-react";
import { Link } from "react-router-dom";
import Match from "./tournoisMatch.jsx";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";

const API = import.meta.env.VITE_API;

const Tournament = () => {
  const [round1, setRound1] = useState([]);            // 8 équipes
  const [round2, setRound2] = useState(Array(4).fill(null));
  const [semis, setSemis]  = useState(Array(2).fill(null));
  const [final, setFinal]  = useState(Array(1).fill(null));
  const [tournamentStarted, setTournamentStarted] = useState(false);
  const [matches, setMatches] = useState([]);
  const round1Matches = matches.filter((m) => m.round === 1);
  const round2Matches = matches.filter((m) => m.round === 2);
  const round3Matches = matches.filter((m) => m.round === 3);
  const [finalWinner, setFinalWinner] = useState(null);
  const { user } = useAuthStore();
  const isAdmin = user?.droit === "admin";



  const id = localStorage.getItem("tournoisId") || "67f8c2993634ef292b6a5d0b";
  const [resetId, setResetId] = useState(0);

  /* ------------------------------------------------------------------ */
  /* Chargement initial (équipes + state précédent)                      */
  /* ------------------------------------------------------------------ */

  
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

  const fetchFinalWinner = async () => {
    try {
      const { data } = await axios.get(`${API}/api/tournois/${id}/matches`);
      const finale = data.matchs.find(m => m.round === 3 && m.winner_id);

      if (finale) {
        setFinalWinner(finale.winner_id.nom);

      }
    } catch (err) {
      console.error("Erreur lors de la récupération du gagnant final :", err);
    }
  };




  const refetchMatches = async () => {
    try {
      const { data } = await axios.get(`${API}/api/tournois/${id}/matches`);
      setMatches(data.matchs);
    } catch (err) {
      console.error("Erreur lors du rafraîchissement des matchs :", err);
    }
  };




  /* ------------------------------------------------------------------ */
  /* Helpers pour propager les gagnants                                  */
  /* ------------------------------------------------------------------ */
const updateNextRound = (roundSetter, storageKey, index, nextRound, roundNumber, bigWinner) => async (winner) => {
    roundSetter((prev) => {
      const updated = [...(prev)];
      updated[index] = winner;
      localStorage.setItem(storageKey, JSON.stringify(updated));
      if (roundNumber === 4 || roundSetter === "final") {
       localStorage.setItem("finalWinner", JSON.stringify(updated));

        fetchFinalWinner(); // ← ajoute ceci ici
      }
      return updated;
    });

    if (typeof bigWinner === "function") {
      bigWinner(winner.nom);
    }


  
  setTimeout(async () => {

    const current = JSON.parse(localStorage.getItem(storageKey));
   if (!current || current.length < 2) {
      return;
    }


    const i = index % 2 === 0 ? index : index - 1;
    const team1 = current[i];
    const team2 = current[i +1];

    if (team1 && team2) {
      try {
        const check = await axios.get(`${API}/api/matches/check`, {
          params: {
            team1_id: team1._id,
            team2_id: team2._id,
            round: Number(roundNumber)
          }
        }
      );

        if (!check.data.exists) {
          const { data } = await axios.post(`${API}/api/matches/new`, {
            tournois_id: id,
            team1_id: team1,
            team2_id: team2,
            round: Number(roundNumber)
          });


          if (typeof nextRound === "function" ) {
            nextRound((prev) => {
              const copy = [...prev];
              copy[Math.floor(i / 2)] = null;
              localStorage.setItem(`round${roundNumber}`, JSON.stringify(copy));
              return copy;
            });
          }



          toast.success(" Match créé pour le round " + roundNumber);

        } else {
          toast.success(" Match déjà existant, on ne fait rien.");
        }


      } catch (err) {
        toast.error(" Erreur création match :", err);
      }
    }


    await refetchMatches();
    fetchFinalWinner();
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
      setFinal(Array(1).fill(null));
      setMatches([]); // ← SUPER IMPORTANT
      localStorage.clear();
      setResetId((prev) => prev + 1);
      setTournamentStarted(false);
      setFinalWinner(null);


    // 3. Recharge les équipes si besoin
    setMatches([]); // vide les anciens matchs

    toast.success("Tournoi réinitialisé avec succès.");
  } catch (err) {
    console.error("Erreur lors du reset :", err);
    toast.error("Erreur lors du reset du tournoi.");
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
<div className="min-h-screen w-full bg-[#1e1e1e] text-white p-6 overflow-auto">
  {/* Titre */}
  <h1 className="text-4xl font-bold mb-10 flex items-center gap-3 justify-center">
    <Swords size={32} /> Tournoi Valo
  </h1>

  {tournamentStarted && matches.length > 0 ? (
    <div className="flex justify-center gap-16 w-full relative overflow-x-auto">
      {/* Ligne centrale verticale */}
      <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-gray-700 z-0" />

      {/* Colonne Round 1 */}
      <div className="flex flex-col gap-16 z-10">
        <h2 className="text-xl text-center mb-4">1er tour</h2>
        {Array.from({ length: 4 }).map((_, idx) => {
          const match = round1Matches[idx];
          const team1 = match?.team1_id || "en attente...";
          const team2 = match?.team2_id || "en attente...";
          return (
            <motion.div key={idx} className="relative">
              <Match
                matchDbId={match?._id}
                team1={team1}
                team2={team2}
                winnerId={match.winner_id}
                onWinner={updateNextRound(setRound2, "round2", idx, setSemis, 2)}
              />
              <div className="absolute right-[-24px] top-1/2 w-6 h-0.5 bg-white" />
            </motion.div>
          );
        })}

      </div>

      {/* Colonne Demi-finales */}
      <div className="flex flex-col gap-24 z-10">
        <h2 className="text-xl text-center mb-4">Demi-finales</h2>
      {Array.from({ length: 2 }).map((_, idx) => {
        const match = round2Matches[idx];
        const team1 = match?.team1_id || "en attente...";
        const team2 = match?.team2_id || "en attente...";
        return (
          <motion.div key={idx} className={`relative ${idx === 0 ? "mt-15" : "mt-35"}`}>
            <Match
              matchDbId={match?._id}
              team1={team1}
              team2={team2}
              winnerId={match?.winner_id} 
              onWinner={updateNextRound(setSemis, "semis", idx, setFinal, 3)}
            />
            <div className="absolute right-[-24px] top-1/2 w-6 h-0.5 bg-white" />
          </motion.div>
        );
      })}

      </div>

      {/* Colonne Finale */}
      <div className="flex flex-col justify-center gap-12 z-10">
        <h2 className="text-xl text-center mb-4">Finale</h2>
      {Array.from({ length: 1 }).map((_, idx) => {
        const match = round3Matches[idx];
        const team1 = match?.team1_id || "en attente...";
        const team2 = match?.team2_id || "en attente...";
        return (
          <motion.div key={idx} className="relative mt-1 ">
            <Match
              matchDbId={match?._id}
              team1={team1}
              team2={team2}
              winnerId={match?.winner_id} 
              onWinner={updateNextRound(setFinal, "final", idx, null, 4, setFinalWinner)}
            />
          </motion.div>
        );
      })}


        {finalWinner && (
          <motion.div
            className="mt-5 text-2xl font-bold text-yellow-400 flex items-center gap-2 justify-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Trophy size={28} /> Vainqueur : {finalWinner}
          </motion.div>
        )}
      </div>
    </div>
  ) : (
    <p className="text-center">Aucun match à afficher</p>
  )}

  {/* Boutons bas */}
  {isAdmin && (
  <div className="mt-12 flex flex-col gap-4 items-center">
    <button
      className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-md"
      onClick={resetTournament}
    >
      Réinitialiser le tournoi
    </button>

    <button
      disabled={round1.length === 8}
      className={`px-6 py-3 rounded-md transition ${
        round1.length === 8
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-900"
      }`}
      onClick={generateMatches}
    >
      {round1.length === 8 ? "Tournoi déjà généré" : "Générer le tournoi"}
    </button>

    <Link to="/inscriptionTournois">
      <button className="px-6 py-3 bg-blue-600 hover:bg-blue-900 rounded-md">
        Inscrire des équipes au tournoi
      </button>
    </Link>
  </div>

  )}
</div>  );
};


export default Tournament;