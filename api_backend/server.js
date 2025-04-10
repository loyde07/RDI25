import express from "express" //version js const express = require('express');
import dotenv from "dotenv";
import { connectDB } from "../config/db.js";

//import routesLocal from "../routes/routes.local.js";
import userRoutes from './routes/user.route.js'
import ecoleRoutes from './routes/ecoles.route.js';


import cors from 'cors'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({origin: 'http://localhost:5173'}));

app.use(express.json()); //permet d'accepeter du JSOn dans le req.body

app.use("/api/user", userRoutes);
app.use('/api/ecoles', ecoleRoutes);

//app.use("/api/locals", routesLocal); //origine des routes pour les locaux


app.listen(PORT, () => {
    connectDB();
    console.log("serveur lancé sur http://localhost:"+PORT);
    
}); 