import axios from 'axios';

const API = import.meta.env.VITE_API;

/**
 * Appelle l'API pour rechercher des joueurs.
 * @param {string} recherche
 * @returns {Promise<Array>} Liste des joueurs
 */
export async function rechercherJoueurs(recherche) {
  if (!recherche || recherche.trim().length === 0) {
    return [];
  }

  try {
    const res = await axios.get(`${API}/api/joueurs/joueurs?search=${recherche}`);
    return res.data.data;
  } catch (error) {
    console.error('Erreur API joueurs :', error);
    throw error;
  }
}


/**
 * Valide une chaîne de recherche.
 * @param {string} recherche
 * @returns {boolean}
 */
export function estRechercheValide(recherche) {
  return typeof recherche === 'string' && recherche.trim().length > 0;
}
