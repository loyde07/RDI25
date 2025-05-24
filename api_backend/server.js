
// Modules

import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';

// database mongo
import { connectDB } from './config/db.js';


// api/routes
import routesTeam from "./routes/r.team.js";
import joueurRoutes from "./routes/route.joueurs.js";


import ecoleRoutes from './routes/ecoles.route.js';
import authRoutes from './routes/auth.route.js';
import matchRoutes from "./routes/match.routes.js";




dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// CORS configuration
// app.use(cors({ origin: 'http://localhost:3000', credentials:true }));


app.use(express.json()); //permet d'accepeter du JSOn dans le req.body
app.use(cookieParser()); // Middleware pour analyser les cookies



// Routes des api
app.use("/api/auth", authRoutes);
app.use("/api/ecoles", ecoleRoutes);

app.use("/api/teams", routesTeam);

app.use("/api/matches", matchRoutes);
app.use("/api/joueurs", joueurRoutes);

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use("/api/ecoles", ecoleRoutes); 
    

app.get("/", (req, res) => {
    res.send("Server is ready");
});

//lancement du serveur
app.listen(process.env.PORT, () => {
    connectDB();
    console.log(`Serveur lancé sur http://localhost:${PORT}`);

});
