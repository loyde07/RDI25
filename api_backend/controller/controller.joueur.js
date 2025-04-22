// controllers/controller.joueur.js
import Joueur from "../models/joueur.model.js";

export const getAllJoueurs = async (req, res) => {
  try {
    const joueurs = await Joueur.find().select("nom prenom email ");
    res.status(200).json(joueurs);
  } catch (error) {
    console.error("Erreur récupération des joueurs :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
