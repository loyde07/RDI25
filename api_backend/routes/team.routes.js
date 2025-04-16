import express from 'express';
import Team from "../models/team.model.js";
import Inscription from "../models/inscription.model.js";

const router = express.Router();

// Route pour récupérer toutes les équipes d'un tournoi par ID
router.get("/:tournois_id/teams", async (req, res) => {
  try {
    const { tournois_id } = req.params;  // Récupérer l'ID du tournoi depuis les paramètres de la route

    // On récupère toutes les inscriptions liées à ce tournoi
    const inscriptions = await Inscription.find({ tournois_id }).populate('team_id');

    // On extrait les teams complètes
    const teams = inscriptions.map(i => i.team_id);

    res.status(200).json(teams);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

export default router;
