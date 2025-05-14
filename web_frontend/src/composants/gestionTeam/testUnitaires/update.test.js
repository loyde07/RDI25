import { ajouterJoueurAListe, retirerJoueurDeListe, toggleSuppressionLogic,ajouterJoueurDansEquipe, handleUpdateTeam } from '../outilsGestionTeams/outilsUpdate.jsx';
import {describe, it, expect,vi, beforeEach} from 'vitest';
import axios from 'axios';
import { toggleJoueurASupprimer } from '../outilsGestionTeams/outilsUpdate.jsx';


describe("ajouterJoueurAListe", () => {
    it("ajoute un joueur s'il n'est pas déjà présent", () => {
      expect(ajouterJoueurAListe(['1'], '2')).toEqual(['1', '2']);
    });
    it("jette une erreur si joueur déjà présent", () => {
      expect(() => ajouterJoueurAListe(['1'], '1')).toThrow("Joueur déjà présent");
    });
  });
  
  describe("retirerJoueurDeListe", () => {
    it("retire un joueur existant", () => {
      expect(retirerJoueurDeListe(['1', '2'], '1')).toEqual(['2']);
    });
    it("jette une erreur si joueur absent", () => {
      expect(() => retirerJoueurDeListe(['1'], '3')).toThrow("Joueur introuvable");
    });
  });
  
  describe("toggleSuppressionLogic", () => {
    it("ajoute un joueur si non marqué", () => {
      expect(toggleSuppressionLogic([], '1')).toEqual(['1']);
    });
    it("retire un joueur déjà marqué", () => {
      expect(toggleSuppressionLogic(['1'], '1')).toEqual([]);
    });
  });




vi.mock('axios');
vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() },
  success: vi.fn(),
  error: vi.fn()
}));

describe('outilsUpdateTeam', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('ajouterJoueurDansEquipe ajoute le joueur et met à jour le form', async () => {
    axios.patch.mockResolvedValue({});

    const setForm = vi.fn(prev => prev);
    const setShowAddPlayer = vi.fn();
    const setJoueurSelectionne = vi.fn();
    const joueur = { _id: 'joueur1' };

    await ajouterJoueurDansEquipe('http://api', 'team1', joueur, setForm, setShowAddPlayer, setJoueurSelectionne);

    expect(axios.patch).toHaveBeenCalledWith('http://api/api/teams/team1/join', { playerId: 'joueur1' });
    expect(setShowAddPlayer).toHaveBeenCalledWith(false);
    expect(setJoueurSelectionne).toHaveBeenCalledWith(null);
    expect(setForm).toHaveBeenCalled();
  });

  it('handleUpdateTeam met à jour l\'équipe et recharge les données', async () => {
    axios.patch.mockResolvedValue({});
    axios.get.mockResolvedValue({
      data: {
        data: { nom: 'Équipe X', logo: 'logo.png', joueurs: [{ _id: 'j1' }] }
      }
    });

    const setForm = vi.fn();
    const setJoueursÀRetirer = vi.fn();
    const setTeamData = vi.fn();
    const updateProfile = vi.fn().mockResolvedValue({});

    const form = { nom: 'Team', logo: 'logo', joueurs: ['j1', 'j2'] };
    const joueursÀRetirer = ['j2'];

    await handleUpdateTeam('http://api', 'team1', form, joueursÀRetirer, setForm, setJoueursÀRetirer, setTeamData, updateProfile);

    expect(axios.patch).toHaveBeenCalledWith('http://api/api/teams/team1/update', {
      nom: 'Team',
      logo: 'logo',
      joueurs: ['j1']
    });
    expect(updateProfile).toHaveBeenCalledWith({ droit: '' });
    expect(setJoueursÀRetirer).toHaveBeenCalledWith([]);
    expect(setForm).toHaveBeenCalledWith({
      nom: 'Équipe X',
      logo: 'logo.png',
      joueurs: ['j1']
    });
    expect(setTeamData).toHaveBeenCalledWith({ nom: 'Équipe X', logo: 'logo.png', joueurs: [{ _id: 'j1' }] });
  });


});



describe('toggleJoueurASupprimer', () => {
  it('ajoute un joueur si non présent dans la liste', () => {
    const setJoueursÀRetirer = vi.fn();
    toggleJoueurASupprimer(['1'], '2', setJoueursÀRetirer);

    expect(setJoueursÀRetirer).toHaveBeenCalledWith(['1', '2']);
  });

  it('ne modifie pas la liste et log une erreur si le joueur est déjà présent', () => {
    const setJoueursÀRetirer = vi.fn();
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    toggleJoueurASupprimer(['1'], '1', setJoueursÀRetirer);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Erreur dans toggleJoueurASupprimer:',
      expect.any(Error)
    );
    expect(setJoueursÀRetirer).not.toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it('lance une erreur claire si joueurId est invalide (undefined)', () => {
    const setJoueursÀRetirer = vi.fn();
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    toggleJoueurASupprimer(['1'], undefined, setJoueursÀRetirer);

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(setJoueursÀRetirer).not.toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});

