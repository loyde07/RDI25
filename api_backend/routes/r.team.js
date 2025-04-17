import express from "express";
import {getTeams, creationTeams} from "../controller/controller.team.js";


const routes = express.Router();

routes.get("/", getTeams);

routes.post("/", creationTeams);

export default routes;