// routes/tournois.js
import express from 'express';
import { genereMatchs, getMatchsAvecEquipes, resetTournois } from '../controller/controller.tournois.js';
const router = express.Router();


router.post('/:id/generate-matches', genereMatchs);

router.get('/:id/matches', getMatchsAvecEquipes);

router.delete('/:id/reset', resetTournois);

export default router;
