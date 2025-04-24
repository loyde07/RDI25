import Team from "../models/team.model.js";

export const getTeams = async (req, res) => {

    try{
        const teams = await Team.find({});
        res.status(200).json({success: true, data: teams})
    }catch (error){
        console.error("erreur de récupération teams:" , error.message);
        res.status(500).json({success: false, message: "erreur récupération data"});
    }

}

export const creationTeams = async (req, res) => {
    const team = req.body;
  
    try {
      // Vérifie si une équipe avec le même nom existe déjà
      const existingTeam = await Team.findOne({ nom: team.nom });
  
      if (existingTeam) {
        return res.status(400).json({
          success: false,
          message: "Une équipe avec ce nom existe déjà."
        });
      }
  
      // Sinon, on peut créer la nouvelle équipe
      const newTeam = new Team(team);
      await newTeam.save();
  
      res.status(201).json({ success: true, data: newTeam });
  
    } catch (error) {
      console.error("Erreur de création d'une team:", error.message);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }

  export const joinTeam = async (req, res) => {
    const { id } = req.params;
    const { playerId } = req.body;
  
    try {
      const team = await Team.findById(id);
      if (!team) return res.status(404).json({ success: false, message: "Team introuvable" });
  
      // Ajouter le joueur (évite les doublons)
      if (!team.joueurs.includes(playerId)) {
        team.joueurs.push(playerId);
        await team.save();
      }
  
      res.status(200).json({ success: true, message: "Joueur ajouté à l'équipe" });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  }
  

  export const deleteTeam = async (req, res)  => {

    const {id} = req.params;

    try{

      const team =await Team.findById(id);
      if(!team) return res.status(404).json({success: false, message: "Team introuvable"});

      await team.deleteOne();

      res.status(200).json({ success: true, message: "Joueur ajouté à l'équipe" });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ success: false, message: "Erreur serveur" });
  }
}


// PATCH /api/teams/:id/update
export const updateTeam = async (req, res) => {
  const { id } = req.params;
  const { nom, logo, joueurs } = req.body;

  try {
    const team = await Team.findById(id);
    if (!team) {
      return res.status(404).json({ success: false, message: "Équipe introuvable" });
    }

    if (nom) team.nom = nom;
    if (logo) team.logo = logo;
    if (joueurs) {
      if (joueurs.length > 5) {
        return res.status(400).json({ success: false, message: "Une équipe ne peut pas avoir plus de 5 joueurs." });
      }
      // Vérifier unicité
      const uniqueJoueurs = [...new Set(joueurs.map(id => id.toString()))];
      if (uniqueJoueurs.length !== joueurs.length) {
        return res.status(400).json({ success: false, message: "Un joueur ne peut apparaître qu'une seule fois." });
      }
      team.joueurs = joueurs;
    }

    await team.save();
    res.status(200).json({ success: true, message: "Équipe mise à jour", data: team });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};


export const getTeamById = async (req, res) => {
  const { id } = req.params;
  try {
    const team = await Team.findById(id).populate('joueurs');

    if (!team) {
      return res.status(404).json({ success: false, message: "Équipe introuvable" });
    }

    res.status(200).json({ success: true, data: team });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};
