//LISTE DES ROUTES UTILISEES 
//chaque route ext prefixé a l'origine /api/locals


import express from "express";

import { creationLocal, deleteLocal, getLocal, updateLocal } from "../api_backend/controllers/controller.local.js";
const router = express.Router();

export default router;

router.get("/", getLocal); 

router.post("/", creationLocal);

router.put("/:id", updateLocal);

router.delete("/:id", deleteLocal);