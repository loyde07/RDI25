import express from "express" //version js const express = require('express');
import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import joueursRoutes from "./routes/route.joueurs.js";
import routesTeam from "./routes/r.team.js";
import ecoleRoutes from "./routes/ecoles.route.js"
import cors from 'cors'

dotenv.config();

const app = express();
//{origin: 'http://localhost:5173'}
app.use(cors());

app.use(express.json()); //permet d'accepeter du JSOn dans le req.body

//app.use("/api/locals", routesLocal); //origine des routes pour les locaux
app.use("/api/teams", routesTeam);

app.use("/api/joueurs", joueursRoutes);

app.use("/api/ecoles", ecoleRoutes); 
    



app.get("/", (req, res) => {
    res.send("Server is ready");
});


app.listen(process.env.PORT, () => {
    connectDB();
    console.log("serveur lancé sur http://localhost:5000 ");

});
