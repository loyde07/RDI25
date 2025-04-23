import jwt from 'jsonwebtoken';
import Joueur from '../models/joueur.model.js';

const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Accès non autorisé.' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const joueur = await Joueur.findById(decoded.id).populate('ecole_id');
        if (!joueur) return res.status(404).json({ message: "Utilisateur introuvable." });

        req.joueur = joueur;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token invalide.' });
    }
};

export default auth;


