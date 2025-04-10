import { useEffect, useState } from "react";
import axios from "axios";

const AdminMatchManager = ({ tournoisId }) => {
  const [matchesByRound, setMatchesByRound] = useState({});
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await axios.get(`/api/matches?tournois_id=${tournoisId}`);
        const matches = res.data;

        const grouped = {};
        matches.forEach((match) => {
          const round = match.round || 1;
          if (!grouped[round]) grouped[round] = [];
          grouped[round].push(match);
        });

        setMatchesByRound(grouped);
      } catch (err) {
        console.error("Erreur chargement matchs :", err);
      }
    };

    fetchMatches();
  }, [tournoisId, refresh]);

  const handleWinner = async (matchId, teamId) => {
    try {
      await axios.put(`/api/matches/${matchId}/winner`, { winnerId: teamId });
      setRefresh(!refresh); // Rafraîchir les données
    } catch (err) {
      console.error("Erreur enregistrement gagnant :", err);
    }
  };

  return (
    <div className="flex gap-8 overflow-auto p-4">
      {Object.keys(matchesByRound).map((round) => (
        <div key={round} className="flex flex-col items-center">
          <h2 className="text-xl font-bold mb-2">Round {round}</h2>
          {matchesByRound[round].map((match) => (
            <div key={match._id} className="mb-4 border p-2 rounded shadow w-64 text-center">
              <button
                className={`block w-full p-2 my-1 rounded ${
                  match.winner_id?._id === match.team1_id._id
                    ? "bg-green-300 font-bold"
                    : "bg-gray-100"
                }`}
                disabled={!!match.winner_id}
                onClick={() => handleWinner(match._id, match.team1_id._id)}
              >
                {match.team1_id?.nom || "??"}
              </button>

              <button
                className={`block w-full p-2 my-1 rounded ${
                  match.winner_id?._id === match.team2_id._id
                    ? "bg-green-300 font-bold"
                    : "bg-gray-100"
                }`}
                disabled={!!match.winner_id}
                onClick={() => handleWinner(match._id, match.team2_id._id)}
              >
                {match.team2_id?.nom || "??"}
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default AdminMatchManager;
