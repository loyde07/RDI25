import express from "express";
import {updateTeam,getTeams, creationTeams} from "../controller/controller.team.js";


const routes = express.Router();

routes.get("/", getTeams);

routes.post("/", creationTeams);

routes.patch('/:id/join', updateTeam);

export default routes;