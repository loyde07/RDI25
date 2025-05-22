import {User} from "../models/user.model.js";
import Team from "../models/team.model.js";


export const getAllJoueurs = async (req, res) => {
  try {
    const joueurs = await User.find().select("nom prenom email ");
    res.status(200).json(joueurs);

  } catch (error) {
    console.error("Erreur récupération des joueurs :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }

}

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

}


export const getJoueurByPseudo =  async (req, res) => {
    try {
        const joueur = await User.findOne({ pseudo: req.params.pseudo });
        if (!joueur) {
          return res.status(404).json({ message: 'Joueur non trouvé' });
        }
        res.json({ data: joueur });
      } catch (err) {
        res.status(500).json({ message: 'Erreur serveur' });
      }
    };




export const seachJoueurs =  async (req, res) => {
        const { search } = req.query;
      
        try {
          let query = {};
      
          if (search) {
            // Regex pour insensibilité à la casse
            query.pseudo = { $regex: search, $options: 'i' };
          }
      
          const joueurs = await User.find(query);
          res.status(200).json({ success: true, data: joueurs });
        } catch (error) {
          console.error("Erreur lors de la récupération des joueurs :", error.message);
          res.status(500).json({ success: false, message: "Erreur serveur" });
        }
      
    
    }

