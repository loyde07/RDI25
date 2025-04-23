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
}


export const getJoueurByPseudo =  async (req, res) => {
    try {
        const joueur = await Joueur.findOne({ pseudo: req.params.pseudo });
        if (!joueur) {
          return res.status(404).json({ message: 'Joueur non trouvé' });
        }
        res.json({ data: joueur });
      } catch (err) {
        res.status(500).json({ message: 'Erreur serveur' });
      }
    };