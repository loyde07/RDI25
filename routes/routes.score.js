//LISTE DES ROUTES UTILISEES 
//chaque route ext prefixé a l'origine /api/locals


import express from "express";

import { creationScore, deleteScore, getScore, updateScore } from "../api_backend/controllers/controller.local.js";
const router = express.Router();

export default router;

router.get("/", getScore); 

router.post("/", creationScore);

router.put("/:id", updateScore);

router.delete("/:id", deleteScore);