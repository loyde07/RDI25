import express from "express";
import {getTeamById, joinTeam, updateTeam, getTeams, creationTeams, deleteTeam} from "../controller/controller.team.js";
import Inscription from "../models/inscription.model.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import Team from "../models/team.model.js"; // Assurez-vous d'importer le modèle Team

const routes = express.Router();

routes.get("/", getTeams);

routes.get("/:id", getTeamById);  

routes.post("/", creationTeams);

routes.patch('/:id/join', joinTeam);

routes.delete('/:id/delete', deleteTeam);

routes.patch('/:id/update', updateTeam);


routes.get("/:tournois_id/teams", async (req, res) => {
  try {
    const { tournois_id } = req.params;  // Récupérer l'ID du tournoi depuis les paramètres de la route

    // On récupère toutes les inscriptions liées à ce tournoi
    const inscriptions = await Inscription.find({ tournois_id }).populate('team_id');

    // On extrait les teams complètes
    const teams = inscriptions.map(i => i.team_id);

    res.status(200).json(teams);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});







// Destination et nom du fichier
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), 'uploads'));
    },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });


routes.post('/upload-logo', upload.single('logo'), (req, res) => {
    const imagePath = `/uploads/${req.file.filename}`;
    return res.status(200).json({ success: true, path: imagePath });
  });
  

routes.delete('/delete-logo/:teamId', async (req, res) => {
  const teamId = req.params.teamId;

  try {
    // 1. Chercher l'équipe et vérifier l'existence du logo
    const team = await Team.findById(teamId); // adapte si tu utilises Mongoose: Team.findById(teamId)
    if (!team ) {
      return res.status(404).json({ success: false, message: ' équipe inexistante.' });
    }

    if (team.logo) {
      const filePath = path.join(process.cwd(), team.logo);
      if (fs.existsSync(filePath)) {
        const stat = fs.statSync(filePath);
        if (stat.isFile()) {
          fs.unlinkSync(filePath);
          console.log('Logo supprimé :', filePath);
        } else {
          console.warn('Le chemin trouvé n\'est pas un fichier mais un dossier, suppression ignorée :', filePath);
        }
      } else {
        console.warn('Fichier logo non trouvé :', filePath);
      }

      // Nettoyer le champ en base même si le fichier n'existe pas
      team.logo = null;
      await team.save();
    } else {
      console.log('Aucun logo à supprimer pour cette équipe.');
    }
    return res.status(200).json({ success: true, message: 'Logo supprimé avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression du logo :', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});
  

export default routes;