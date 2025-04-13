// routes/user.route.js
import dotenv from 'dotenv';
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Joueur from '../models/joueur.model.js';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import auth from '../middleware/auth.js';

const router = express.Router();
dotenv.config();

// Multer config pour les logos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/logos');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });



// 🔒 GET Profil
router.get('/profile', auth, async (req, res) => {
    try {
        const joueur = req.joueur;
        res.status(200).json(joueur);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
});

// 🔄 PUT Mise à jour
router.put('/update', auth, upload.single('logo'), async (req, res) => {
    const { pseudo, password, niveau, team_id } = req.body;

    const updateData = {};

    if (pseudo) updateData.pseudo = pseudo;
    if (niveau) updateData.niveau = niveau;
    if (team_id) updateData.team_id = team_id;

    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateData.password = hashedPassword;
    }

    if (req.file) {
        updateData.logo = req.file.filename; // au lieu de req.file.path

    }

    try {
        const joueur = await Joueur.findByIdAndUpdate(
            req.joueur._id,
            updateData,
            { new: true }
        )
        .populate('ecole_id')
        .populate('team_id');

        res.status(200).json(joueur);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour du profil.' });
    }
});

// 🆕 POST Inscription
router.post('/register', async (req, res) => {
    const { nom, prenom, email, password, ecole_id, niveau } = req.body;

    try {
        const joueurExist = await Joueur.findOne({ email });
        if (joueurExist) {
            return res.status(400).json({ message: "Email déjà utilisé." });
        }

        const nouveauJoueur = new Joueur({
            nom,
            prenom,
            email,
            password, // pas de hash ici
            ecole_id,
            niveau
        });

        await nouveauJoueur.save();

        res.status(201).json({ message: "Inscription réussie." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur pendant l'inscription." });
    }
});


// 🔐 POST Connexion
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const joueur = await Joueur.findOne({ email });
        if (!joueur) {
            return res.status(400).json({ message: "Email non trouvé." });
        }

        const passwordMatch = await bcrypt.compare(password, joueur.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: "Mot de passe incorrect." });
        }

        const token = jwt.sign({ id: joueur._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token,
            joueur: {
                id: joueur._id,
                nom: joueur.nom,
                prenom: joueur.prenom,
                email: joueur.email,
                niveau: joueur.niveau,
                pseudo: joueur.pseudo,
                team_id: joueur.team_id,
                logo: joueur.logo,
                ecole_id: joueur.ecole_id,
                    }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur pendant la connexion." });
    }
});

export default router;
