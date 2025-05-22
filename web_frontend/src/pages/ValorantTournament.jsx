import React from 'react';
import { FaTrophy, FaUsers, FaCalendarAlt, FaGamepad, FaCheckCircle, FaClock } from 'react-icons/fa';

const ValorantTournament = () => {
  // Données simulées
  const tournamentState = {
    status: 'en cours', // ou 'à venir'
    currentMatch: 'Team Phoenix vs. Dragon Squad',
    nextMatchDate: '15 Nov 2023 - 20:00 CET'
  };

  const participants = [
    {
      teamName: 'Team Phoenix',
      players: [
        { pseudo: 'Phoenix#RISE', rank: 'Diamond 2', avatar: 'https://via.placeholder.com/40' },
        { pseudo: 'Blaze#FIRE', rank: 'Platinum 3', avatar: 'https://via.placeholder.com/40' },
        { pseudo: 'Ember#ASH', rank: 'Diamond 1', avatar: 'https://via.placeholder.com/40' },
        { pseudo: 'Inferno#HEAT', rank: 'Gold 3', avatar: 'https://via.placeholder.com/40' },
        { pseudo: 'Flare#BURN', rank: 'Platinum 2', avatar: 'https://via.placeholder.com/40' }
      ]
    },
    {
      teamName: 'Dragon Squad',
      players: [
        { pseudo: 'Dragoon#WING', rank: 'Immortal 1', avatar: 'https://via.placeholder.com/40' },
        { pseudo: 'Wyvern#CLAW', rank: 'Diamond 3', avatar: 'https://via.placeholder.com/40' },
        { pseudo: 'Serpent#FANG', rank: 'Ascendant 2', avatar: 'https://via.placeholder.com/40' },
        { pseudo: 'Lindworm#SCALE', rank: 'Platinum 1', avatar: 'https://via.placeholder.com/40' },
        { pseudo: 'Hydra#HEAD', rank: 'Gold 2', avatar: 'https://via.placeholder.com/40' }
      ]
    },
    // Ajoutez d'autres équipes...
  ];

  // Données simulées pour l'arbre du tournoi
  const bracketStages = [
    {
      name: 'Quarts de finale',
      matches: [
        { team1: 'Team Phoenix', score1: 2, team2: 'Viper Mains', score2: 1 },
        { team1: 'Dragon Squad', score1: 2, team2: 'Reyna Fan Club', score2: 0 }
      ]
    },
    {
      name: 'Demi-finales',
      matches: [
        { team1: 'Team Phoenix', score1: null, team2: 'Dragon Squad', score2: null }
      ]
    },
    {
      name: 'Finale',
      matches: [
        { team1: null, score1: null, team2: null, score2: null }
      ]
    }
  ];

  return (
    <div className="bg-valorant-dark text-white min-h-screen p-4 md:p-8">
      {/* En-tête */}
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-valorant-red mb-2">Tournoi Valorant</h1>
        
        {/* État du tournoi */}
        <div className="bg-valorant-card p-4 rounded-lg mb-8 border-l-4 border-valorant-red">
          <div className="flex items-center mb-2">
            {tournamentState.status === 'en cours' ? (
              <FaGamepad className="text-valorant-red mr-2" />
            ) : (
              <FaClock className="text-valorant-red mr-2" />
            )}
            <h2 className="text-xl font-bold">
              Statut: <span className="text-valorant-red">{tournamentState.status}</span>
            </h2>
          </div>
          
          {tournamentState.status === 'en cours' ? (
            <p>Match en cours: <span className="font-bold">{tournamentState.currentMatch}</span></p>
          ) : (
            <p>Prochain match: <span className="font-bold">{tournamentState.nextMatchDate}</span></p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Liste des participants */}
          <div className="bg-valorant-card p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <FaUsers className="text-valorant-red mr-2" /> Participants
            </h2>
            
            <div className="space-y-6">
              {participants.map((team, index) => (
                <div key={index} className="bg-valorant-dark p-4 rounded-lg">
                  <h3 className="text-xl font-bold text-valorant-red mb-3">{team.teamName}</h3>
                  
                  <ul className="space-y-2">
                    {team.players.map((player, pIndex) => (
                      <li key={pIndex} className="flex items-center space-x-3">
                        <img 
                          src={player.avatar} 
                          alt={player.pseudo} 
                          className="w-8 h-8 rounded-full border border-valorant-red"
                        />
                        <div>
                          <p className="font-medium">{player.pseudo.split('#')[0]}</p>
                          <p className="text-sm text-gray-400">{player.rank}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Arbre du tournoi */}
          <div className="bg-valorant-card p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <FaTrophy className="text-valorant-red mr-2" /> Arbre du Tournoi
            </h2>
            
            <div className="space-y-8">
              {bracketStages.map((stage, stageIndex) => (
                <div key={stageIndex}>
                  <h3 className="font-bold mb-3 text-valorant-red">{stage.name}</h3>
                  
                  <div className="space-y-3">
                    {stage.matches.map((match, matchIndex) => (
                      <div key={matchIndex} className="bg-valorant-dark p-3 rounded">
                        <div className="grid grid-cols-3 items-center">
                          <div className={`text-right pr-2 ${match.score1 !== null && match.score1 > match.score2 ? 'font-bold' : ''}`}>
                            {match.team1 || 'À déterminer'}
                          </div>
                          
                          <div className="text-center px-2">
                            {match.score1 !== null ? (
                              <span className="font-mono">
                                {match.score1} - {match.score2}
                              </span>
                            ) : (
                              <span className="text-gray-500">vs</span>
                            )}
                          </div>
                          
                          <div className={`text-left pl-2 ${match.score2 !== null && match.score2 > match.score1 ? 'font-bold' : ''}`}>
                            {match.team2 || 'À déterminer'}
                          </div>
                        </div>
                        
                        {match.score1 !== null && (
                          <div className="text-center mt-1 text-xs text-gray-400">
                            {match.score1 > match.score2 ? (
                              <span className="text-green-400 flex items-center justify-center">
                                <FaCheckCircle className="mr-1" /> Vainqueur
                              </span>
                            ) : null}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValorantTournament;