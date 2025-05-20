import Ecole from "../models/ecole.model.js"; 
import Joueur from "../models/joueur.model.js";


export const getAllEcoles = async (req, res) => {
  try {
    const ecoles = await Ecole.find();
    res.json(ecoles);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};


export const getEcoleByJoueur = async (req, res) => {
  const { joueurId } = req.params;
  try {
    const joueur = await Joueur.findById(joueurId).populate("ecole_id");

    if (!joueur) {
      return res.status(404).json({ message: "Joueur non trouvé" });
    }

    res.json(joueur.ecole_id);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};
