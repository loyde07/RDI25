import express from "express" //version js const express = require('express');
import dotenv from "dotenv";
import { connectDB } from "../config/db.js";

import routesScore from "../routes/routes.local.js";
import cors from 'cors'

dotenv.config();
// get pour récupérer des infos
//post pour créer des nouvelles data
//put ou patch pour mettre à jour 
//delete pour supprimer
const app = express();

app.use(cors({origin: 'http://localhost:5173'}));

app.use(express.json()); //permet d'accepeter du JSOn dans le req.body

app.use("/api/score", routesScore); //origine des routes pour les locaux

app.get("/", (req, res) => {
    res.send("Server is ready");

});



app.listen(process.env.PORT, () => {
    connectDB();
    console.log("serveur lancé sur http://localhost:5000 ");

});