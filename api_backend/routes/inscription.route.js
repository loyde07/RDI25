import express from "express";
import { inscriptionTournois } from "../controller/controller.tournois.js";
const router = express.Router();
import Inscription from "../models/inscription.model.js";

// Ajouter une équipe à un tournoi
router.post("/add", inscriptionTournois);

router.get('/tournoi/:tournoiId', async (req, res) => {
  try {
    const inscriptions = await Inscription.find({ tournois_id: req.params.tournoiId });
    res.json({ data: inscriptions });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


router.delete('/remove', async (req, res) => {
  const { team_id, tournois_id } = req.body;
  try {
    await Inscription.findOneAndDelete({ team_id, tournois_id });
    res.json({ message: 'Désinscription réussie' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});
export default router;