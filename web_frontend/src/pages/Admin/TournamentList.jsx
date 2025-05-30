import React, { useEffect } from 'react';
import useTournamentStore from '../../store/tournamentStore';
import { toast } from 'react-hot-toast';

const TournamentsList = () => {
  const { tournaments, loading, error, fetchTournaments, deleteTournament } = useTournamentStore();

  useEffect(() => {
    fetchTournaments();
  }, [fetchTournaments]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce tournoi ?')) {
      await deleteTournament(id);
      toast.success('Tournoi supprimé avec succès');
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Liste des Tournois</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-2 px-4">Nom</th>
              <th className="py-2 px-4">Jeu</th>
              <th className="py-2 px-4">Équipes</th>
              <th className="py-2 px-4">Statut</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {tournaments.map((tournament) => (
              <tr key={tournament._id} className="border-b">
                <td className="py-2 px-4">{tournament.nom}</td>
                <td className="py-2 px-4">{tournament.jeu}</td>
                <td className="py-2 px-4">{tournament.equipesParticipantes?.length || 0}</td>
                <td className="py-2 px-4">{tournament.status || 'Non commencé'}</td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => handleDelete(tournament._id)}
                    className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TournamentsList;