import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import userRoutes from './routes/user.route.js';
import ecoleRoutes from './routes/ecoles.route.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url'; // Importation de fileURLToPath pour obtenir __dirname

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Utiliser fileURLToPath pour obtenir __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS configuration
app.use(cors({ origin: 'http://localhost:5173' }));

// Middleware pour analyser les JSON
app.use(express.json());

// Servir les fichiers statiques dans 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/user', userRoutes);
app.use('/api/ecoles', ecoleRoutes);

// Lancer le serveur
app.listen(PORT, () => {
    connectDB();
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
