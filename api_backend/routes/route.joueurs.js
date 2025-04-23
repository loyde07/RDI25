import express from "express";
import { getAllJoueurs, getJoueurByPseudo , seachJoueurs} from "../controller/controller.joueur.js";

const router = express.Router();

router.get("/", getAllJoueurs);

router.get('/pseudo/:pseudo', getJoueurByPseudo);


// GET /api/joueurs?search=nom
router.get('/joueurs', seachJoueurs);

export default router;