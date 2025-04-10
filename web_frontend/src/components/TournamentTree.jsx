import { useEffect, useState } from "react";
import axios from "axios";

const TournamentTree = ({ tournoisId }) => {
  const [matchesByRound, setMatchesByRound] = useState({});

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await axios.get(`/api/matches?tournois_id=${tournoisId}`);
        const matches = res.data;

        // Grouper les matchs par round
        const grouped = {};
        matches.forEach((match) => {
          const round = match.round || 1;
          if (!grouped[round]) grouped[round] = [];
          grouped[round].push(match);
        });

        setMatchesByRound(grouped);
      } catch (err) {
        console.error("Erreur lors du chargement des matchs :", err);
      }
    };

    fetchMatches();
  }, [tournoisId]);

  return (
    <div className="flex gap-8 overflow-auto p-4">
      {Object.keys(matchesByRound).map((round) => (
        <div key={round} className="flex flex-col items-center">
          <h2 className="text-xl font-bold mb-2">Round {round}</h2>
          {matchesByRound[round].map((match) => (
            <div key={match._id} className="mb-4 border p-2 rounded shadow w-48 text-center">
              <div
                className={`p-1 ${
                  match.winner_id?._id === match.team1_id._id ? "bg-green-200 font-semibold" : ""
                }`}
              >
                {match.team1_id?.nom || "??"}
              </div>
              <div
                className={`p-1 ${
                  match.winner_id?._id === match.team2_id._id ? "bg-green-200 font-semibold" : ""
                }`}
              >
                {match.team2_id?.nom || "??"}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default TournamentTree;
