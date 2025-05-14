import { rechercherJoueurs,estRechercheValide } from '../outilsGestionTeams/outilsRecherche';
import axios from 'axios';
import { describe, it, expect, vi, beforeEach } from 'vitest';



vi.mock('axios');

describe('rechercherJoueurs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retourne les joueurs si la requête réussit', async () => {
    axios.get.mockResolvedValue({
      data: { data: [{ _id: '1', pseudo: 'Player1' }, { _id: '2', pseudo: 'Player2' }] }
    });

    const result = await rechercherJoueurs('Player');

    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('search=Player'));
    expect(result).toEqual([{ _id: '1', pseudo: 'Player1' }, { _id: '2', pseudo: 'Player2' }]);
  });

  it('propagate l\'erreur si axios échoue', async () => {
    axios.get.mockRejectedValue(new Error('Erreur API'));

    await expect(rechercherJoueurs('Player')).rejects.toThrow('Erreur API');
  });
});



describe('estRechercheValide', () => {
  it('retourne false si la recherche est vide', () => {
    expect(estRechercheValide('')).toBe(false);
  });

  it('retourne false si la recherche contient seulement des espaces', () => {
    expect(estRechercheValide('   ')).toBe(false);
  });

  it('retourne true si la recherche est valide', () => {
    expect(estRechercheValide('test')).toBe(true);
    expect(estRechercheValide(' joueur ')).toBe(true);
  });
});
