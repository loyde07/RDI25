import express from 'express';
import Match from '../models/match.model.js';
import Team from '../models/team.model.js';

const router = express.Router();

router.post('/init/:tournoisId', async (req, res) => {
  try {
    const { tournoisId } = req.params;

    // Récupérer les équipes du tournoi
    const teams = await Team.find({tournois_id: tournoisId}); // Tu peux ajouter un filtre par tournoi si nécessaire

    if (teams.length % 2 !== 0) {
      return res.status(400).json({ message: "Nombre d'équipes impair, impossible de créer les matchs." });
    }

    // Mélanger les équipes
    const shuffled = teams.sort(() => Math.random() - 0.5);

    const matches = [];
    for (let i = 0; i < shuffled.length; i += 2) {
      const match = new Match({
        tournois_id: tournoisId,
        team1_id: shuffled[i]._id,
        team2_id: shuffled[i + 1]._id,
        winner_id: null
      });
      await match.save();
      matches.push(match);
    }

    res.status(201).json(matches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.put('/:id/winner', async (req, res) => {
    try {
      const { id } = req.params;
      const { winner_id } = req.body;
  
      const match = await Match.findById(id);
      if (!match) return res.status(404).json({ message: 'Match non trouvé' });
  
      match.winner_id = winner_id;
      await match.save();
  
      // Vérifie si tous les matchs du même tour sont terminés
      const sameRoundMatches = await Match.find({
        tournois_id: match.tournois_id,
        round: match.round
      });
  
      const allFinished = sameRoundMatches.every(m => m.winner_id);
      if (!allFinished) return res.status(200).json(match);
  
      // Si tous les matchs sont terminés, créer le round suivant
      const winners = sameRoundMatches.map(m => m.winner_id);
  
      if (winners.length < 2) {
        return res.status(200).json({ message: "Tournoi terminé", winner: winners[0] });
      }
  
      const nextRound = match.round + 1;
      const newMatches = [];
      for (let i = 0; i < winners.length; i += 2) {
        const newMatch = new Match({
          tournois_id: match.tournois_id,
          team1_id: winners[i],
          team2_id: winners[i + 1],
          winner_id: null,
          round: nextRound
        });
        await newMatch.save();
        newMatches.push(newMatch);
      }
  
      res.status(200).json({ match, newMatches });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });
  
  router.get('/', async (req, res) => {
    const { tournois_id } = req.query;
    const matches = await Match.find({ tournois_id })
      .populate('team1_id')
      .populate('team2_id')
      .populate('winner_id')
      .sort({ round: 1 }); // On trie par round
    res.json(matches);
  });

export default router;
