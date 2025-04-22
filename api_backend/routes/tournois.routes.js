import express from 'express';
import Tournois from '../models/tournois.model.js';  // Assure-toi d'avoir ce modèle dans models/tournois.model.js

const router = express.Router();

// Créer un tournoi
router.post('/', async (req, res) => {
  try {
    const { nom, date_debut, date_fin } = req.body;

    const newTournois = new Tournois({
      nom,
      date_debut,
      date_fin
    });

    await newTournois.save();
    res.status(201).json(newTournois);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur lors de la création du tournoi' });
  }
});

router.get('/:id/complet', async (req, res) => {
    try {
      const { id } = req.params;
  
      const tournois = await Tournois.findById(id).populate('teams');
  
      if (!tournois) {
        return res.status(404).json({ message: 'Tournoi introuvable' });
      }
  
      res.status(200).json(tournois);
    } catch (error) {
      console.error("Erreur lors de la récupération du tournoi :", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

export default router;
