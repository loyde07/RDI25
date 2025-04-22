import express from "express";
import { getAllJoueurs } from "../controller/controller.joueur.js";

const router = express.Router();

router.get("/", getAllJoueurs);

export default router;
