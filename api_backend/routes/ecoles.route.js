// routes/ecoles.js
import express from 'express';
import Ecole from '../models/ecole.model.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const ecoles = await Ecole.find();
        res.status(200).json(ecoles);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des écoles." });
    }
});

export default router;
