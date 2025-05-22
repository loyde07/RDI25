import { validerSelectionEquipe, genererOptionsEquipes, fetchTeams, rejoindreEquipe,
  ajouterJoueurDansEquipe, handleUpdateTeam, toggleJoueurASupprimer } from "../outilsGestionTeams/outilsJoin.jsx";
import {describe, it, expect, vi, beforeEach} from 'vitest';
import axios from 'axios';
import toast from 'react-hot-toast';


vi.mock('axios');
vi.mock('react-hot-toast');

describe('utilsRejoindreTeam', () => {
  
  describe('validerSelectionEquipe', () => {
    const teams = [
      { _id: '1', nom: 'Team A' },
      { _id: '2', nom: 'Team B' },
      { _id: '3', nom: 'Team C' }
    ];

    it('devrait passer si l\'équipe est valide', () => {
      expect(() => validerSelectionEquipe(teams, '1')).not.toThrow();
    });

    it('devrait lancer une erreur si aucune équipe n\'est sélectionnée', () => {
      expect(() => validerSelectionEquipe(teams, '')).toThrow('Aucune équipe sélectionnée');
    });

    it('devrait lancer une erreur si l\'équipe sélectionnée n\'existe pas', () => {
      expect(() => validerSelectionEquipe(teams, '999')).toThrow('Équipe invalide sélectionnée');
    });
  });

  describe('genererOptionsEquipes', () => {
    it('devrait retourner un tableau d\'options formatées', () => {
      const teams = [
        { _id: '1', nom: 'Team A' },
        { _id: '2', nom: 'Team B' },
        { _id: '3', nom: 'Team C' }
      ];
      
      const options = genererOptionsEquipes(teams);
      expect(options).toEqual([
        { label: 'Team A', value: '1' },
        { label: 'Team B', value: '2' },
        { label: 'Team C', value: '3' }
      ]);
    });

    it('devrait lancer une erreur si teams n\'est pas un tableau', () => {
      expect(() => genererOptionsEquipes('not an array')).toThrow('Paramètre invalide : teams doit être un tableau');
    });
  });
});



describe('fetchTeams', () => {
  it('doit retourner les données des équipes', async () => {
    const fakeData = [{ _id: '1', nom: 'Team 1' }];
    axios.get.mockResolvedValueOnce({ data: { data: fakeData } });

    const result = await fetchTeams('http://api');
    expect(result).toEqual(fakeData);
    expect(axios.get).toHaveBeenCalledWith('http://api/api/teams');
  });

  it('doit lancer une erreur personnalisée en cas d\'échec', async () => {
    axios.get.mockRejectedValueOnce(new Error('Erreur API'));

    await expect(fetchTeams('http://api')).rejects.toThrow('Erreur lors de la récupération des équipes : Erreur API');
  });
});

describe('rejoindreEquipe', () => {
  it('doit faire un appel PATCH avec les bons paramètres', async () => {
    axios.patch.mockResolvedValueOnce({});

    await expect(rejoindreEquipe('http://api', 'teamId', 'playerId')).resolves.toBeUndefined();
    expect(axios.patch).toHaveBeenCalledWith('http://api/api/teams/teamId/join', { playerId: 'playerId' });
  });

  it('doit lancer une erreur personnalisée si axios échoue', async () => {
    axios.patch.mockRejectedValueOnce(new Error('Erreur API'));

    await expect(rejoindreEquipe('http://api', 'teamId', 'playerId')).rejects.toThrow('Erreur lors de la tentative de rejoindre l\'équipe : Erreur API');
  });
});



vi.mock('axios');
vi.mock('react-toastify', () => ({
  toast: { success: vi.fn(), error: vi.fn() }
}));

describe('ajouterJoueurDansEquipe', () => {
  const API = 'http://fakeapi';
  const selectedTeamId = 'team123';
  const joueurSelectionne = { _id: 'player123' };
  let setForm, setShowAddPlayer, setJoueurSelectionne;

  beforeEach(() => {
    setForm = vi.fn();
    setShowAddPlayer = vi.fn();
    setJoueurSelectionne = vi.fn();
    vi.clearAllMocks();
  });

  it('ajoute un joueur avec succès', async () => {
    axios.patch.mockResolvedValueOnce({});

    await ajouterJoueurDansEquipe(API, selectedTeamId, joueurSelectionne, setForm, setShowAddPlayer, setJoueurSelectionne);

    expect(axios.patch).toHaveBeenCalledWith(`${API}/api/teams/${selectedTeamId}/join`, {
      playerId: joueurSelectionne._id
    });
    expect(toast.success).toHaveBeenCalledWith('Joueur ajouté !');
    expect(setJoueurSelectionne).toHaveBeenCalledWith(null);
    expect(setShowAddPlayer).toHaveBeenCalledWith(false);
    expect(setForm).toHaveBeenCalled();
  });

  it('affiche une erreur si l\'ajout échoue', async () => {
    axios.patch.mockRejectedValueOnce(new Error('Erreur'));

    await ajouterJoueurDansEquipe(API, selectedTeamId, joueurSelectionne, setForm, setShowAddPlayer, setJoueurSelectionne);

    expect(toast.error).toHaveBeenCalledWith('Erreur lors de l\'ajout du joueur');
  });
});

describe('handleUpdateTeam', () => {
  const API = 'http://fakeapi';
  const selectedTeamId = 'team123';
  const form = { nom: 'Team X', logo: 'logo.png', joueurs: ['a', 'b', 'c'] };
  const joueursÀRetirer = ['b'];
  let setForm, setJoueursÀRetirer, setTeamData, updateProfile;

  beforeEach(() => {
    setForm = vi.fn();
    setJoueursÀRetirer = vi.fn();
    setTeamData = vi.fn();
    updateProfile = vi.fn().mockResolvedValue();
    axios.get.mockResolvedValue({
      data: {
        data: { nom: 'Team X', logo: 'logo.png', joueurs: [{ _id: 'a' }, { _id: 'c' }] }
      }
    });
    vi.clearAllMocks();
  });

  it('met à jour l\'équipe avec succès', async () => {
    axios.patch.mockResolvedValueOnce({});

    await handleUpdateTeam(API, selectedTeamId, form, joueursÀRetirer, setForm, setJoueursÀRetirer, setTeamData, updateProfile);

    expect(axios.patch).toHaveBeenCalledWith(`${API}/api/teams/${selectedTeamId}/update`, {
      ...form,
      joueurs: ['a', 'c']
    });
    expect(toast.success).toHaveBeenCalledWith('Équipe mise à jour !');
    expect(setJoueursÀRetirer).toHaveBeenCalledWith([]);
    expect(updateProfile).toHaveBeenCalledWith({ droit: '' });
    expect(setTeamData).toHaveBeenCalledWith({
      nom: 'Team X',
      logo: 'logo.png',
      joueurs: [{ _id: 'a' }, { _id: 'c' }]
    });
    expect(setForm).toHaveBeenCalledWith({
      nom: 'Team X',
      logo: 'logo.png',
      joueurs: ['a', 'c']
    });
  });

  it('affiche une erreur si la mise à jour échoue', async () => {
    axios.patch.mockRejectedValueOnce(new Error('Erreur'));

    await handleUpdateTeam(API, selectedTeamId, form, joueursÀRetirer, setForm, setJoueursÀRetirer, setTeamData, updateProfile);

    expect(toast.error).toHaveBeenCalledWith('Erreur lors de la mise à jour');
  });
});

describe('toggleJoueurASupprimer', () => {
  let setJoueursÀRetirer;

  beforeEach(() => {
    setJoueursÀRetirer = vi.fn();
    vi.clearAllMocks();
  });

  it('appelle setJoueursÀRetirer avec toggleSuppressionLogic', () => {
    const joueursÀRetirer = ['a', 'b'];
    const joueurId = 'b';

    toggleJoueurASupprimer(joueursÀRetirer, joueurId, setJoueursÀRetirer);

    expect(setJoueursÀRetirer).toHaveBeenCalled();
  });

  it('affiche une erreur si une exception est levée', () => {
    const joueursÀRetirer = null; // Simuler un cas incorrect qui ferait échouer toggleSuppressionLogic
    const joueurId = 'b';

    // Pour forcer l'erreur, on simule une fonction qui lance directement
    setJoueursÀRetirer = vi.fn(() => {
      throw new Error('Erreur custom');
    });

    toggleJoueurASupprimer(joueursÀRetirer, joueurId, setJoueursÀRetirer);

    expect(toast.error).toHaveBeenCalledWith('Erreur custom');
  });
});
