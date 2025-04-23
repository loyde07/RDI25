// controllers/controller.joueur.js
import Joueur from "../models/joueur.model.js";
import Team from "../models/team.model.js";


export const getJoueursByTeam = async (req, res) => {
  const { teamId } = req.params;

  try {
    const team = await Team.findById(teamId).populate({
      path: 'joueurs',
      populate: {
        path: 'ecole_id', 
        model: 'Ecole' 
      }
    });

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    res.status(200).json(team.joueurs);
  } catch (error) {
    console.error("Erreur récupération des joueurs :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
