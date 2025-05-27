import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trophy, Swords } from "lucide-react";
import { Link } from "react-router-dom";

// Utilisez si vous voulez passer l'URL via une variable d'environnement
const API = import.meta.env.VITE_API;


function getTeamName(team) {
  if (!team) return "?";
  if (typeof team === "string") return team;
  if (typeof team === "object" && team.nom) return team.nom;
  return "?";
}

/**
 * Composant générique pour gérer un match (score + gagnant)
 */


const Match = ({ team1 = "?", team2 = "?", onWinner, matchDbId }) => {

  
  const handleWinner = async (winnerTeam) => {
    console.log("Appel handleWinner avec:", winnerTeam); 
    console.log("matchDbId envoyé :", matchDbId);
    console.log("Requête PUT vers :", `${API}/api/matches/${matchDbId}/winner`);
    onWinner(winnerTeam); // mise à jour UI immédiate

    try {
      const response = await axios.put(`${API}/api/matches/${matchDbId}/winner`, {
        winner_id: winnerTeam._id,
      });
      console.log("✅ Réponse du serveur :", response.data);
    } catch (err) {
      console.error("Erreur enregistrement gagnant :", err.response?.data || err.message);
    }

  };
 
 
  return (
    <div className="bg-gray-800 text-white rounded-lg p-4 shadow-lg w-full max-w-xs flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <span>{getTeamName(team1)}</span>
        <button
          className="px-3 py-1 bg-green-800 hover:bg-green-600 rounded-md"
          disabled={!team1 || team1 === "?"}
          onClick={() => handleWinner(team1)}
        >
          Gagnant
        </button>
      </div>
      <div className="flex justify-between items-center">
       <span>{getTeamName(team2)}</span>
        <button
          className="px-3 py-1 bg-green-800 hover:bg-green-600 rounded-md"
          disabled={!team2 || team2 === "?"}
          onClick={() => handleWinner(team2)}
        >
          Gagnant
        </button>
      </div>
    </div>
  );
};



export default Match;