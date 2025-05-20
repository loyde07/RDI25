import Match from '../models/match.model.js';
import Inscription from '../models/inscription.model.js';


export const inscriptionTournois = async (req, res) => {
  try {
    const { team_id, tournois_id } = req.body;

    // Vérifie si cette équipe est déjà inscrite à ce tournoi
    const exists = await Inscription.findOne({ team_id, tournois_id });
    if (exists) {
      return res.status(400).json({ message: "Cette équipe est déjà inscrite à ce tournoi." });
    }

    const inscription = new Inscription({ team_id, tournois_id });
    await inscription.save();

    res.status(201).json({ message: "Équipe inscrite avec succès.", inscription });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
}



export const genereMatchs = async (req, res) => {
  try {
    const tournoisId = req.params.id;

    // 1. Récupérer les 8 équipes inscrites
    const inscriptions = await Inscription.find({ tournois_id: tournoisId }).populate('team_id');
    const equipes = inscriptions.map(ins => ins.team_id);

    if (equipes.length !== 8) {
      return res.status(400).json({ message: 'Il faut exactement 8 équipes pour générer les matchs.' });
    }

    // 2. Mélanger les équipes
    equipes.sort(() => Math.random() - 0.5);

    // 3. Générer les 4 matchs du 1er tour
    const matchs = [];
    for (let i = 0; i < equipes.length; i += 2) {
      matchs.push({
        tournois_id: tournoisId,
        team1_id: equipes[i]._id,
        team2_id: equipes[i + 1]._id,
        round: 1
      });
    }

    const savedMatches = await Match.insertMany(matchs);

    res.status(201).json({ message: 'Matchs du premier tour créés avec succès.', matchs: savedMatches });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la génération des matchs.', error: err.message });
  }
}