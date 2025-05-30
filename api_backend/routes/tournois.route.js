// routes/tournois.js
import express from 'express';
import {
    createTournois,
    getAllTournois,
    getTournoisById,
    updateTournois,
    deleteTournois,
    addMatchToTournois,
    setCurrentMatch,
    addTeamToTournois,
    getMatchsAvecEquipes,
    resetTournois,
    genereMatchs
} from '../controllers/tournois.controller.js';

const router = express.Router();

// Routes de base pour les tournois
router.post('/', createTournois);

router.get('/', getAllTournois);
router.get('/:id', getTournoisById);

router.put('/:id', updateTournois);
router.delete('/:id', deleteTournois);

// Routes spécifiques pour les tournois
router.post('/:id/matches', addMatchToTournois);
router.put('/:id/current-match', setCurrentMatch);
router.post('/:id/teams', addTeamToTournois);

router.get('/:id/matches', getMatchsAvecEquipes);

router.post('/:id/generate-matches', genereMatchs);

router.get('/:id/matches', getMatchsAvecEquipes);

router.delete('/:id/reset', resetTournois);

export default router;
