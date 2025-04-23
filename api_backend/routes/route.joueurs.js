import express from "express";
import { getAllJoueurs, getJoueurByPseudo } from "../controller/controller.joueur.js";

const router = express.Router();

router.get("/", getAllJoueurs);

router.get('/:pseudo', getJoueurByPseudo);

export default router;
