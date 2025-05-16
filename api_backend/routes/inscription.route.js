import express from "express";
import Inscription from "../models/inscription.model.js"; // ton modèle
const router = express.Router();

// Ajouter une équipe à un tournoi
router.post("/add", async (req, res) => {
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
});

export default router;
