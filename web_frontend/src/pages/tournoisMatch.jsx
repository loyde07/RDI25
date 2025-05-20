import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trophy, Swords } from "lucide-react";
import { Link } from "react-router-dom";

// Utilisez si vous voulez passer l'URL via une variable d'environnement
const API = import.meta.env.VITE_API;

/**
 * Composant générique pour gérer un match (score + gagnant)
 */

const Match = ({ team1 = "?", team2 = "?", onWinner, matchDbId }) => {
  const handleWinner = async (winnerTeam) => {
    onWinner(winnerTeam); // met à jour l'UI localement

    try {
      await axios.put(`${API}/api/matchs/${matchDbId}/winner`, {
        winner_id: winnerTeam._id,
      });
    } catch (error) {
      console.error("Erreur enregistrement gagnant :", error);
    }
  };

 
 
  return (
    <div className="bg-gray-800 text-white rounded-lg p-4 shadow-lg w-full max-w-xs flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <span>{team1}</span>
        <button
          className="px-3 py-1 bg-green-800 hover:bg-green-600 rounded-md"
          disabled={!team1 || team1 === "?"}
          onClick={() => handleWinner(team1)}
        >
          Gagnant
        </button>
      </div>
      <div className="flex justify-between items-center">
        <span>{team2}</span>
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