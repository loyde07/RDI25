// routes/user.route.js
import dotenv from 'dotenv';
import express from 'express';
import bcrypt from 'bcrypt'; // module qui permet de hasher le mot de passe
import jwt from 'jsonwebtoken';
import Joueur from '../models/joueur.model.js';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import auth from '../middleware/auth.js';

const router = express.Router();
dotenv.config();

// Configuration pour multer (upload des fichiers)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/logos');  // Dossier pour stocker les logos
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Route pour obtenir les données de profil
router.get('/profile', auth, async (req, res) => {
    try {
        console.log("→ Accès à /profile avec :", req.joueur);
        res.status(200).json(req.joueur);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
});



// Route pour mettre à jour les informations de l'utilisateur
router.put('/update', auth, upload.single('logo'), async (req, res) => {
    const { pseudo, password, niveau } = req.body;
    let updateData = { pseudo, niveau };

    // Si le mot de passe est modifié, on le hash
    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateData.password = hashedPassword;
    }

    // Si un logo est téléchargé, on l'ajoute aux données de l'utilisateur
    if (req.file) {
        updateData.logo = req.file.path;  // Stocke le chemin du fichier
    }

    try {
        const joueur = await Joueur.findByIdAndUpdate(req.userId, updateData, { new: true });
        res.status(200).json(joueur);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour du profil.' });
    }
});


router.post('/register', async (req, res) => {
    const { nom, prenom, email, password, ecole_id, niveau } = req.body;

    try {
        // Vérifie si l'email existe déjà
        const joueurExist = await Joueur.findOne({ email });
        if (joueurExist) {
            return res.status(400).json({ message: "Email déjà utilisé." });
        }

        // Hash du mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Création du joueur
        const nouveauJoueur = new Joueur({
            nom,
            prenom,
            email,
            password: hashedPassword, // <- important
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

        const token = jwt.sign({ id: joueur._id },process.env.JWT_SECRET,{ expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur pendant la connexion." });
    }
});

export default router;
