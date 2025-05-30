import { User } from "../models/user.model.js";

// Récupérer tous les utilisateurs
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().populate('ecole_id');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Mettre à jour un utilisateur
export const updateUser = async (req, res) => {
    try {
        const { fName, lName, pseudo, droit, email, niveau, ecole_id } = req.body;
        
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { fName, lName, pseudo, droit, email, niveau, ecole_id },
            { new: true }
        ).populate('ecole_id');

        if (!updatedUser) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Récupérer un utilisateur par ID
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('ecole_id');
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Supprimer un utilisateur
export const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        res.json({ message: 'Utilisateur supprimé avec succès' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};