import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

function shuffleArray(array) {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

function generateFirstRound(teams) {
  const shuffled = shuffleArray(teams);
  const matches = [];

  for (let i = 0; i < shuffled.length; i += 2) {
    matches.push({
      id: uuidv4(),
      teamA: shuffled[i],
      teamB: shuffled[i + 1],
      scoreA: 0,
      scoreB: 0,
      winner: null,
      round: 1,
    });
  }

  return matches;
}

function Tournament() {
  const [teams, setTeams] = useState([
    { id: uuidv4(), name: 'Team Mario' },
    { id: uuidv4(), name: 'Team Luigi' },
    { id: uuidv4(), name: 'Team Peach' },
    { id: uuidv4(), name: 'Team Bowser' },
    { id: uuidv4(), name: 'Team Yoshi' },
    { id: uuidv4(), name: 'Team Toad' },
    { id: uuidv4(), name: 'Team DK' },
    { id: uuidv4(), name: 'Team Wario' },
  ]);

  const [rounds, setRounds] = useState([]);

  useEffect(() => {
    if (teams.length % 2 !== 0) return;
    const firstRound = generateFirstRound(teams);
    setRounds([firstRound]);
  }, [teams]);

  const updateScore = (matchId, team, score) => {
    setRounds(prevRounds =>
      prevRounds.map((round, i) =>
        round.map(match => {
          if (match.id !== matchId) return match;

          const updatedMatch = { ...match };
          if (team === 'A') updatedMatch.scoreA = score;
          else updatedMatch.scoreB = score;

          if (updatedMatch.scoreA > updatedMatch.scoreB) {
            updatedMatch.winner = updatedMatch.teamA;
          } else if (updatedMatch.scoreB > updatedMatch.scoreA) {
            updatedMatch.winner = updatedMatch.teamB;
          } else {
            updatedMatch.winner = null;
          }

          return updatedMatch;
        })
      )
    );
  };

  useEffect(() => {
    const lastRound = rounds[rounds.length - 1];
    if (!lastRound || lastRound.some(m => !m.winner)) return;

    const winners = lastRound.map(m => m.winner);
    if (winners.length < 2) return;

    const newRound = [];
    for (let i = 0; i < winners.length; i += 2) {
      newRound.push({
        id: uuidv4(),
        teamA: winners[i],
        teamB: winners[i + 1],
        scoreA: 0,
        scoreB: 0,
        winner: null,
        round: rounds.length + 1,
      });
    }

    setRounds(prev => [...prev, newRound]);
  }, [rounds]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Tournoi LAN 🕹️</h2>

      {rounds.map((round, i) => (
        <div key={i} className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Tour {i + 1}</h3>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {round.map(match => (
              <div key={match.id} className="border p-4 rounded-lg shadow bg-white">
                <div className="mb-2 font-bold">Match</div>
                <div className="flex justify-between mb-2">
                  <span>{match.teamA.name}</span>
                  <input
                    type="number"
                    value={match.scoreA}
                    onChange={(e) => updateScore(match.id, 'A', parseInt(e.target.value))}
                    className="w-16 text-center border rounded"
                  />
                </div>
                <div className="flex justify-between">
                  <span>{match.teamB.name}</span>
                  <input
                    type="number"
                    value={match.scoreB}
                    onChange={(e) => updateScore(match.id, 'B', parseInt(e.target.value))}
                    className="w-16 text-center border rounded"
                  />
                </div>
                {match.winner && (
                  <div className="mt-2 text-green-600 font-semibold">
                    ✅ Gagnant : {match.winner.name}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {rounds.length > 0 &&
        rounds[rounds.length - 1].length === 1 &&
        rounds[rounds.length - 1][0].winner && (
          <div className="text-center text-2xl font-bold text-blue-600 mt-6">
            🏆 Le champion est : {rounds[rounds.length - 1][0].winner.name}
          </div>
        )}
    </div>
  );
}

export default Tournament;
