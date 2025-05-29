import Match from '../models/match.model.js';
import Inscription from '../models/inscription.model.js';
import Team from '../models/team.model.js';

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
const tournoisId = req.params.id;

  try {
    // Récupérer max 8 équipes inscrites dans ce tournoi
const inscriptions = await Inscription.find({ tournois_id: tournoisId }).populate('team_id');

const teams = inscriptions.map(inscription => inscription.team_id);

if (teams.length < 2) {
  return res.status(400).json({ message: "Pas assez d'équipes inscrites" });
}

// Supprimer anciens matchs
await Match.deleteMany({ tournois_id: tournoisId });

// Créer les matchs par paires
const matchs = [];
for (let i = 0; i < teams.length; i += 2) {
  if (teams[i+1]) {
    matchs.push({
      tournois_id: tournoisId,
      team1_id: teams[i]._id,
      team2_id: teams[i+1]._id,
      round: 1,
      winner_id: null,
    });
  }
}

// Enregistrer en base
const inserted = await Match.insertMany(matchs);

res.status(201).json({ matchs: inserted });

  } catch (error) {
    console.error("Erreur génération matchs :", error);
    res.status(500).json({ message: "Erreur serveur lors de la génération des matchs" });
  }
};


export const getMatchsAvecEquipes = async (req, res) => {
  try {
    const tournoisId = req.params.id;

    if (!tournoisId) {
      return res.status(400).json({ message: "ID du tournoi manquant" });
    }

    const matches = await Match.find({ tournois_id: tournoisId })
      .populate('team1_id')
      .populate('team2_id')
      .populate('winner_id');

    res.json({ matchs: matches });
  } catch (err) {
    console.error("Erreur lors du chargement des matchs :", err);
    res.status(500).json({ message: "Erreur lors du chargement des matchs" });
  }
};


export const resetTournois = async (req, res) => {  
  try {
    await Match.deleteMany({ tournois_id: req.params.id });
    res.status(200).json({ message: 'Matchs supprimés' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur suppression matchs' });
  }
};