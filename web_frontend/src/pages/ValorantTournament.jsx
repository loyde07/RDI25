import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrophy, FaUsers, FaCalendarAlt, FaGamepad, FaCheckCircle, FaClock, FaPlus, FaSignInAlt, FaChevronDown } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

import { useAuthStore } from '../store/authStore';

const API_URL = import.meta.env.MODE === 'production' ? '/api/tournois' : 'http://localhost:5000/api/tournois';
const API_TEAMS = import.meta.env.MODE === 'production' ? '/api/teams' : 'http://localhost:5000/api/teams';

const ValorantTournament = () => {
  const { user } = useAuthStore();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userTeam, setUserTeam] = useState(null);
  const [nextMatch, setNextMatch] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [bracketStages, setBracketStages] = useState([]);
  const [valorantTournaments, setValorantTournaments] = useState([]);
  const [selectedTournamentId, setSelectedTournamentId] = useState(null);
  const [showTournamentDropdown, setShowTournamentDropdown] = useState(false);

  // Récupérer tous les tournois Valorant
  useEffect(() => {
    const fetchValorantTournaments = async () => {
      try {
        const response = await axios.get(`${API_URL}?jeu=Valorant`);
        setValorantTournaments(response.data);
        
        // Sélectionner le premier tournoi par défaut si disponible
        if (response.data.length > 0) {
          setSelectedTournamentId(response.data[0]._id);
        }
      } catch (error) {
        toast.error('Erreur lors du chargement des tournois Valorant');
        console.error('Error fetching Valorant tournaments:', error);
      }
    };

    fetchValorantTournaments();
  }, []);

  // Charger les données du tournoi sélectionné
  useEffect(() => {
    const fetchTournamentData = async () => {
      if (!selectedTournamentId) return;

      try {
        setLoading(true);
        // Récupération des données du tournoi
        const tournamentRes = await axios.get(`${API_URL}/${selectedTournamentId}`);
        setTournament(tournamentRes.data);

        // Récupération des équipes participantes
        if (tournamentRes.data.equipesParticipantes?.length > 0) {
          const teamsRes = await axios.get(`${API_TEAMS}?ids=${tournamentRes.data.equipesParticipantes.join(',')}`);
          setParticipants(teamsRes.data);
        } else {
          setParticipants([]);
        }

        // Récupération de l'équipe de l'utilisateur s'il est connecté
        if (user) {
          try {
            const userTeamRes = await axios.get(`${API_TEAMS}/user/${user.id}`);
            setUserTeam(userTeamRes.data);
          } catch (error) {
            setUserTeam(null);
          }
        }

        // Générer l'arbre du tournoi
        const matches = generateBracket(tournamentRes.data.equipesParticipantes || []);
        setBracketStages(matches.stages);
        setNextMatch(findNextMatch(matches.stages));

      } catch (error) {
        toast.error('Erreur lors du chargement du tournoi');
        console.error('Error fetching tournament:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTournamentData();
  }, [selectedTournamentId, user]);

  // Fonction pour trouver le prochain match à venir
  const findNextMatch = (stages) => {
    for (const stage of stages) {
      for (const match of stage.matches) {
        if (match.score1 === null || match.score2 === null) {
          return {
            ...match,
            stageName: stage.name,
            date: match.date
          };
        }
      }
    }
    return null;
  };

  // Fonction pour générer l'arbre du tournoi
  const generateBracket = (teams) => {
    const teamNames = teams.map(team => team.nom || `Équipe ${teams.indexOf(team) + 1}`);
    
    return {
      stages: [
        {
          name: 'Quarts de finale',
          matches: [
            { team1: teamNames[0] || 'À déterminer', score1: null, team2: teamNames[1] || 'À déterminer', score2: null, date: tournament?.dateDebut },
            { team1: teamNames[2] || 'À déterminer', score1: null, team2: teamNames[3] || 'À déterminer', score2: null }
          ]
        },
        {
          name: 'Demi-finales',
          matches: [
            { team1: null, score1: null, team2: null, score2: null }
          ]
        },
        {
          name: 'Finale',
          matches: [
            { team1: null, score1: null, team2: null, score2: null }
          ]
        }
      ]
    };
  };

  const handleRegisterTeam = async () => {
    if (!user) {
      toast.error('Vous devez être connecté pour inscrire une équipe');
      return;
    }

    if (!userTeam) {
      toast.error('Vous devez créer une équipe avant de pouvoir vous inscrire');
      return;
    }

    try {
      await axios.post(`${API_URL}/${selectedTournamentId}/register`, { teamId: userTeam._id });
      toast.success('Votre équipe a été inscrite avec succès');
      // Recharger les données
      const updatedRes = await axios.get(`${API_URL}/${selectedTournamentId}`);
      setTournament(updatedRes.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur lors de l'inscription");
    }
  };

  const handleTournamentSelect = (tournamentId) => {
    setSelectedTournamentId(tournamentId);
    setShowTournamentDropdown(false);
  };

  if (loading && !tournament) {
    return (
      <div className="bg-valorant-dark text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-valorant-red mx-auto mb-4"></div>
          <p>Chargement du tournoi...</p>
        </div>
      </div>
    );
  }

  if (!tournament && valorantTournaments.length === 0) {
    return (
      <div className="bg-valorant-dark text-white min-h-screen flex items-center justify-center">
        <p>Aucun tournoi Valorant disponible pour le moment</p>
      </div>
    );
  }

  return (
    <div className="bg-valorant-dark text-white min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Sélecteur de tournoi */}
        <div className="relative mb-6">
          <button
            onClick={() => setShowTournamentDropdown(!showTournamentDropdown)}
            className="bg-valorant-red hover:bg-valorant-red-dark text-white py-2 px-4 rounded flex items-center"
          >
            {tournament ? tournament.nom : 'Sélectionner un tournoi'}
            <FaChevronDown className="ml-2" />
          </button>
          
          {showTournamentDropdown && (
            <div className="absolute z-10 mt-1 w-full bg-valorant-card rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {valorantTournaments.map((tournoi) => (
                <button
                  key={tournoi._id}
                  onClick={() => handleTournamentSelect(tournoi._id)}
                  className={`w-full text-left px-4 py-2 hover:bg-valorant-red ${selectedTournamentId === tournoi._id ? 'bg-valorant-red' : ''}`}
                >
                  {tournoi.nom} - {new Date(tournoi.dateDebut).toLocaleDateString()}
                </button>
              ))}
            </div>
          )}
        </div>

        {tournament && (
          <>
            <h1 className="text-3xl md:text-4xl font-bold text-valorant-red mb-2">{tournament.nom}</h1>
            
            {/* État du tournoi et actions */}
            <div className="bg-valorant-card p-4 rounded-lg mb-8 border-l-4 border-valorant-red">
              <div className="flex justify-between items-start flex-wrap">
                <div className="mb-4 md:mb-0">
                  <div className="flex items-center mb-2">
                    {tournament.status === 'en cours' ? (
                      <FaGamepad className="text-valorant-red mr-2" />
                    ) : (
                      <FaClock className="text-valorant-red mr-2" />
                    )}
                    <h2 className="text-xl font-bold">
                      Statut: <span className="text-valorant-red capitalize">{tournament.status}</span>
                    </h2>
                  </div>
                  
                  {tournament.status === 'en cours' && nextMatch ? (
                    <p>Prochain match: <span className="font-bold">{nextMatch.team1} vs {nextMatch.team2}</span></p>
                  ) : (
                    <p>Début du tournoi: <span className="font-bold">
                      {new Date(tournament.dateDebut).toLocaleDateString()} à {new Date(tournament.dateDebut).toLocaleTimeString()}
                    </span></p>
                  )}
                </div>

                {tournament.status !== 'terminé' && (
                  <div className="flex space-x-3">
                    {userTeam && tournament.equipesParticipantes?.includes(userTeam._id) ? (
                      <button 
                        className="bg-gray-600 text-white py-2 px-4 rounded flex items-center"
                        disabled
                      >
                        <FaCheckCircle className="mr-2" /> Déjà inscrit
                      </button>
                    ) : tournament.equipesParticipantes?.length < 8 ? (
                      userTeam ? (
                        <button 
                          onClick={handleRegisterTeam}
                          className="bg-valorant-red hover:bg-valorant-red-dark text-white py-2 px-4 rounded flex items-center"
                        >
                          <FaPlus className="mr-2" /> Inscrire mon équipe
                        </button>
                      ) : (
                        <button 
                          onClick={() => toast.error('Vous devez créer une équipe avant de vous inscrire')}
                          className="bg-valorant-red hover:bg-valorant-red-dark text-white py-2 px-4 rounded flex items-center"
                        >
                          <FaSignInAlt className="mr-2" /> S'inscrire
                        </button>
                      )
                    ) : (
                      <button 
                        className="bg-gray-600 text-white py-2 px-4 rounded"
                        disabled
                      >
                        Tournoi complet
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Liste des participants */}
              <div className="bg-valorant-card p-6 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold flex items-center">
                    <FaUsers className="text-valorant-red mr-2" /> Participants
                    <span className="ml-2 text-sm font-normal bg-valorant-red px-2 py-1 rounded">
                      {participants.length}/8 équipes
                    </span>
                  </h2>
                </div>
                
                {participants.length > 0 ? (
                  <div className="space-y-6">
                    {participants.map((team) => (
                      <div key={team._id} className="bg-valorant-dark p-4 rounded-lg">
                        <h3 className="text-xl font-bold text-valorant-red mb-3">{team.nom}</h3>
                        
                        {team.joueurs?.length > 0 ? (
                          <ul className="space-y-2">
                            {team.joueurs.map((player) => (
                              <li key={player._id} className="flex items-center space-x-3">
                                <img 
                                  src={player.avatar || 'https://via.placeholder.com/40'} 
                                  alt={player.pseudo} 
                                  className="w-8 h-8 rounded-full border border-valorant-red"
                                />
                                <div>
                                  <p className="font-medium">{player.pseudo?.split('#')[0] || player.pseudo}</p>
                                  {player.rank && <p className="text-sm text-gray-400">{player.rank}</p>}
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500">Aucun joueur dans cette équipe</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Aucun participant pour le moment</p>
                )}
              </div>

              {/* Arbre du tournoi */}
              <div className="bg-valorant-card p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <FaTrophy className="text-valorant-red mr-2" /> Arbre du Tournoi
                </h2>
                
                {nextMatch && (
                  <div className="bg-valorant-dark p-4 rounded-lg mb-6 border border-valorant-red">
                    <h3 className="text-lg font-bold text-valorant-red mb-2">Prochain match</h3>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold">{nextMatch.team1} vs {nextMatch.team2}</p>
                        <p className="text-sm text-gray-400">
                          {nextMatch.date ? new Date(nextMatch.date).toLocaleString() : 'Date à déterminer'}
                        </p>
                      </div>
                      <span className="bg-valorant-red text-white px-3 py-1 rounded text-sm">
                        {nextMatch.stageName}
                      </span>
                    </div>
                  </div>
                )}
                
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
          </>
        )}
      </div>
    </div>
  );
};

export default ValorantTournament;