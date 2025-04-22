import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';

import ecoleRoutes from './routes/ecoles.route.js';
import authRoutes from './routes/auth.route.js';
import matchRoutes from "./routes/match.routes.js";
import tournoisRoutes from './routes/tournois.routes.js';
import teamsRoutes from './routes/team.routes.js';

import { connectDB } from '../config/db.js';




dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(cors({ origin: 'http://localhost:3000', credentials:true }));

app.use(express.json()); //permet d'accepeter du JSOn dans le req.body
app.use(cookieParser()); // Middleware pour analyser les cookies

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/ecoles", ecoleRoutes);
app.use('/api/teams', teamsRoutes);
app.use('/api/tournois', tournoisRoutes);
app.use("/api/matches", matchRoutes);

app.listen(process.env.PORT, () => {
    connectDB();
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
