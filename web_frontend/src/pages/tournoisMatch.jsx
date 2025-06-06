import axios from "axios";
import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";

// Utilisez si vous voulez passer l'URL via une variable d'environnement
const API = import.meta.env.VITE_API;



/**
 * Composant générique pour gérer un match (score + gagnant)
 */


const Match = ({ team1 = "?", team2 = "?",  winnerId ,onWinner, matchDbId}) => {
  const [winnerTeam, setWinnerTeam] = useState(null); // ← état pour le gagnant
  const { user } = useAuthStore();
  const isAdmin = user?.droit === "admin";
  const isTeam1Winner = winnerTeam?._id === (team1?._id || team1);
  const isTeam2Winner = winnerTeam?._id === (team2?._id || team2);

useEffect(() => {
  if (winnerId && winnerId._id) {
    if (typeof team1 === "object" && team1?._id === winnerId._id) {
      setWinnerTeam(team1);
    } else if (typeof team2 === "object" && team2?._id === winnerId._id) {
      setWinnerTeam(team2);
    } else {
      setWinnerTeam(null);
    }
  } else {
    setWinnerTeam(null);
  }
}, [winnerId, team1, team2]);



    const getTeamName = (team) => {
    if (!team || typeof team === "string") return team || "?";
    return team.nom || "?";
  };



  const handleWinner = async (winnerTeam) => {
    setWinnerTeam(winnerTeam); // mise à jour locale immédiate

    onWinner(winnerTeam); // mise à jour UI immédiate

    try {
      const response = await axios.put(`${API}/api/matches/${matchDbId}/winner`, {
        winner_id: winnerTeam._id,
      });
    } catch (err) {
      console.error("Erreur enregistrement gagnant :", err.response?.data || err.message);
    }

  };
 // Plus bas dans le composant, avant le return, ajoute aussi :

 return (
    <div className="bg-gray-800 text-white rounded-lg p-4 shadow-lg w-full max-w-xs flex flex-col gap-4">
      {/* Équipe 1 */}
      <div className="flex justify-between items-center">
          <span className={
            isTeam1Winner
              ? "text-yellow-500"
              : ""
          }>
            {getTeamName(team1)}
          </span>
          {(team1  !== "en attente..." && isAdmin )&& (
          <button
            className={`px-3 py-1 rounded-md transition ${
            isTeam2Winner
                  ? "bg-red-900 cursor-not-allowed"
                : "bg-green-800 hover:bg-green-600"
            }`}
            disabled={winnerTeam !== null}
            onClick={() => handleWinner(team1)}
          >
            Gagnant
          </button>
        )}
      </div>

      {/* Équipe 2 */}
      <div className="flex justify-between items-center">
        <span className={
            isTeam2Winner
            ? "text-yellow-500"
            : ""
        }>
          {getTeamName(team2)}
        </span>
        {(team2  !== "en attente..." && isAdmin) && (
          <button
            className={`px-3 py-1 rounded-md transition ${
            isTeam1Winner
                ? "bg-red-900 cursor-not-allowed"
                : "bg-green-800 hover:bg-green-600"
            }`}
            disabled={winnerTeam !== null}
            onClick={() => handleWinner(team2)}
          >
            Gagnant
          </button>
        )}
      </div>
    </div>
  );
};



export default Match;