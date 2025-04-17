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
  };
  