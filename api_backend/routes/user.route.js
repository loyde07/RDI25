// routes/user.route.js
import express from 'express';

import {getAllUsers, deleteUser, updateUser} from '../controllers/user.controller.js';

const router = express.Router();

router.get('/', getAllUsers); // Récupérer tous les utilisateurs
router.put('/:id', updateUser); // Mettre à jour un utilisateur par ID
router.delete('/:id', deleteUser); // Supprimer un utilisateur par ID

export default router;
