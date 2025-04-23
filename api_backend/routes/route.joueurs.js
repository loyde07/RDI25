import express from "express";
import { getJoueursByTeam} from "../controller/controller.joueur.js";

const router = express.Router();

router.get("/team/:teamId", getJoueursByTeam);

export default router;