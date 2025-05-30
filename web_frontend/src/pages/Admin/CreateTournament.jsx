import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const API_TEAM = import.meta.env.MODE === 'production' ? '/api/teams' : 'http://localhost:5000/api/teams';
const API_TOURNOIS = import.meta.env.MODE === 'production' ? '/api/tournois' : 'http://localhost:5000/api/tournois';

const CreateTournament = () => {
  const [formData, setFormData] = useState({
    nom: '',
    jeu: '',
    equipesParticipantes: [],
    dateDebut: null,
    dateFin: null
  });
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get(API_TEAM);
        const teamsData = response.data.data || response.data;
        setTeams(Array.isArray(teamsData) ? teamsData : []);
      } catch (error) {
        toast.error('Erreur lors du chargement des équipes');
        console.error('Error fetching teams:', error);
        setTeams([]);
      }
    };
    fetchTeams();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTeamSelect = (teamId) => {
    setFormData(prev => {
      const alreadySelected = prev.equipesParticipantes.includes(teamId);
      if (alreadySelected) {
        return {
          ...prev,
          equipesParticipantes: prev.equipesParticipantes.filter(id => id !== teamId)
        };
      } else if (prev.equipesParticipantes.length < 8) {
        return {
          ...prev,
          equipesParticipantes: [...prev.equipesParticipantes, teamId]
        };
      } else {
        toast.error('Maximum 8 équipes peuvent participer');
        return prev;
      }
    });
  };

  const handleDateChange = (date, field) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: date };
      
      // Si on change la date de début et que la date de fin est antérieure
      if (field === 'dateDebut' && newData.dateFin && date > newData.dateFin) {
        newData.dateFin = date;
      }
      // Si on change la date de fin et qu'elle est antérieure à la date de début
      else if (field === 'dateFin' && newData.dateDebut && date < newData.dateDebut) {
        newData.dateFin = newData.dateDebut;
      }
      
      return newData;
    });
  };

  const formatDateForAPI = (date) => {
    if (!date) return null;
    return date.toISOString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.dateDebut || !formData.dateFin) {
      toast.error('Veuillez sélectionner les dates de début et de fin');
      return;
    }

    if (formData.dateFin < formData.dateDebut) {
      toast.error('La date de fin ne peut pas être antérieure à la date de début');
      return;
    }

    setLoading(true);
    console.log('Submitting form data:', formData);
    try {
      const dataToSend = {
        ...formData,
        dateDebut: formatDateForAPI(formData.dateDebut),
        dateFin: formatDateForAPI(formData.dateFin)
        
      };

      console.log('Data to send:', dataToSend);
      
      await axios.post(API_TOURNOIS, dataToSend);
      toast.success('Tournoi créé avec succès');
      setFormData({
        nom: '',
        jeu: '',
        equipesParticipantes: [],
        dateDebut: null,
        dateFin: null
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la création du tournoi');
      console.error('Error creating tournament:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Créer un Tournoi</h2>
      <form onSubmit={handleSubmit} className="max-w-lg">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Nom du tournoi</label>
          <input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Jeu</label>
          <input
            type="text"
            name="jeu"
            value={formData.jeu}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Date et heure de début</label>
          <DatePicker
            selected={formData.dateDebut}
            onChange={(date) => handleDateChange(date, 'dateDebut')}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="dd/MM/yyyy HH:mm"
            className="w-full p-2 border rounded"
            placeholderText="Sélectionnez la date et l'heure"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Date et heure de fin</label>
          <DatePicker
            selected={formData.dateFin}
            onChange={(date) => handleDateChange(date, 'dateFin')}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="dd/MM/yyyy HH:mm"
            className="w-full p-2 border rounded"
            placeholderText="Sélectionnez la date et l'heure"
            minDate={formData.dateDebut}
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Équipes participantes ({formData.equipesParticipantes.length}/8 maximum)
          </label>
          {teams.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto p-2 border rounded">
              {teams.map(team => (
                <div key={team._id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`team-${team._id}`}
                    checked={formData.equipesParticipantes.includes(team._id)}
                    onChange={() => handleTeamSelect(team._id)}
                    className="mr-2"
                    disabled={!formData.equipesParticipantes.includes(team._id) && formData.equipesParticipantes.length >= 8}
                  />
                  <label htmlFor={`team-${team._id}`}>
                    {team.nom} ({team.joueurs?.length || 0} joueurs)
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Aucune équipe disponible</p>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Création en cours...' : 'Créer le tournoi'}
        </button>
      </form>
    </div>
  );
};

export default CreateTournament;