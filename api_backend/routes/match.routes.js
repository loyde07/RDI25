import express from 'express';
import Match from '../models/match.model.js';
import Team from '../models/team.model.js';

const router = express.Router();

router.post('/init/:tournoisId', async (req, res) => {
  try {
    const { tournoisId } = req.params;
    const teams = await Team.find({ tournois_id: tournoisId });

    if (teams.length % 2 !== 0) {
      return res.status(400).json({ message: "Nombre d'équipes impair, impossible de créer les matchs." });
    }

    const shuffled = teams.sort(() => Math.random() - 0.5);

    const matches = [];
    for (let i = 0; i < shuffled.length; i += 2) {
      matches.push({
        tournois_id: tournoisId,
        team1_id: shuffled[i]._id,
        team2_id: shuffled[i + 1]._id,
        winner_id: null,
        round: 1,
      });
    }

    const createdMatches = await Match.insertMany(matches);

    res.status(201).json(createdMatches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.put('/:id/winner', async (req, res) => {
  try {
    const { id } = req.params;
    const { winner_id } = req.body;

    // Récupère le match
    const match = await Match.findById(id);
    if (!match) {
      return res.status(404).json({ message: 'Match non trouvé' });
    }

    // Met à jour le gagnant
    match.winner_id = winner_id;
    await match.save();

    // Renvoie juste le match mis à jour
    res.status(200).json(match);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.put('/:id/winnerr/testtt', async (req, res) => {
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
          if (winners[i] && winners[i + 1]) {
            const newMatch = new Match({
              tournois_id: match.tournois_id,
              team1_id: winners[i],
              team2_id: winners[i + 1],
              winner_id: null,
              round: nextRound
            });
            await newMatch.save();
            newMatches.push(newMatch);
          } else {
            // Si nombre impair, gérer le cas (bye, passage direct, etc.) ou ignorer
          }
        }

  
      res.status(200).json({ match, newMatches });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });
  
router.get('/check', async (req, res) => {
  try {
    const { team1_id, team2_id, round } = req.query;

    const match = await Match.findOne({
      team1_id,
      team2_id,
      round: Number(round)
    });
    res.json({ exists: !!match });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.post('/new', async (req, res) => {
  try {
    const { tournois_id, team1_id, team2_id, round } = req.body;

    if (!tournois_id || !team1_id || !team2_id || round === undefined) {
      return res.status(400).json({ message: "Paramètres manquants" });
    }

    const newMatch = new Match({
      tournois_id,
      team1_id,
      team2_id,
      round
    });

    await newMatch.save();
    res.status(201).json(newMatch);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur lors de la création du match' });
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
