import express from "express";
import {getTeamById, joinTeam, updateTeam, getTeams, creationTeams, deleteTeam} from "../controller/controller.team.js";


const routes = express.Router();

routes.get("/", getTeams);

routes.get("/:id", getTeamById);  

routes.post("/", creationTeams);

routes.patch('/:id/join', joinTeam);

routes.delete('/:id/delete', deleteTeam);

routes.patch('/:id/update', updateTeam);

export default routes;