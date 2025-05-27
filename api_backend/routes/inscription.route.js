import express from "express";
import { inscriptionTournois } from "../controller/controller.tournois.js";
const router = express.Router();

// Ajouter une équipe à un tournoi
router.post("/add", inscriptionTournois);


export default router;