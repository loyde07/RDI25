import express from "express";
import { getEcoleByJoueur, getAllEcoles } from "../controller/controller.ecole.js";


const route = express.Router();

route.get("/", getAllEcoles);
route.get("/joueur/:joueurId", getEcoleByJoueur);

export default route;
