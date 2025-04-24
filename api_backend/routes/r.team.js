import express from "express";
import {getTeamById, joinTeam, updateTeam, getTeams, creationTeams, deleteTeam} from "../controller/controller.team.js";
import Inscription from "../models/inscription.model.js";


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




export default routes;