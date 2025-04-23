import express from "express";
import { getAllJoueurs, getJoueurByPseudo , seachJoueurs} from "../controller/controller.joueur.js";
import { getJoueursByTeam} from "../controller/controller.joueur.js";

const router = express.Router();

router.get("/", getAllJoueurs);

router.get('/pseudo/:pseudo', getJoueurByPseudo);


// GET /api/joueurs?search=nom
router.get('/joueurs', seachJoueurs);

router.get("/team/:teamId", getJoueursByTeam);

export default router;