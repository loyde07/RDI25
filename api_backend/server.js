import express from "express" //version js const express = require('express');
import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import Team from "./models/team.model.js";
import joueursRoutes from "./routes/route.joueurs.js";
import routesTeam from "./routes/r.team.js";

import cors from 'cors'

dotenv.config();

const app = express();
//{origin: 'http://localhost:5173'}
app.use(cors());

app.use(express.json()); //permet d'accepeter du JSOn dans le req.body

//app.use("/api/locals", routesLocal); //origine des routes pour les locaux
app.use("/api/teams", routesTeam);

app.use("/api/joueurs", joueursRoutes);
    



app.get("/", (req, res) => {
    res.send("Server is ready");
});


app.listen(process.env.PORT, () => {
    connectDB();
    console.log("serveur lancé sur http://localhost:5000 ");

});
