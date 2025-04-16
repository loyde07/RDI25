import express from "express" //version js const express = require('express');
import dotenv from "dotenv";
import { connectDB } from "../config/db.js";

//import routesLocal from "../routes/routes.local.js";
import cors from 'cors'
import matchRoutes from "./routes/match.routes.js";
import tournoisRoutes from './routes/tournois.routes.js';
import teamsRoutes from './routes/team.routes.js';





dotenv.config();

const app = express();

app.use(cors({origin: 'http://localhost:5173'}));

app.use(express.json()); //permet d'accepeter du JSOn dans le req.body

app.use('/api/teams', teamsRoutes);
app.use('/api/tournois', tournoisRoutes);
app.use("/api/matches", matchRoutes);

app.get("/", (req, res) => {
    res.send("Server is ready");
});


app.listen(process.env.PORT, () => {
    connectDB();
    console.log("serveur lancé sur http://localhost:5000 ");

});