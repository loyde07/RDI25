import express from 'express'
import {checkAuth, signup, login, logout, verifyEmail, forgotPassword, resetPassword, updatePic, updateProfile} from '../controllers/auth.controller.js' 
import { verifyToken } from '../middleware/verifyToken.js';
const router = express.Router();

router.get("/checkAuth", verifyToken, checkAuth)

router.put("/updatePic",verifyToken, updatePic)
router.put("/updateProfile",verifyToken, updateProfile)

router.post("/signup", signup)
router.post("/login",login)
router.post("/logout", logout)
router.post("/verifyEmail", verifyEmail)
router.post("/forgotPassword", forgotPassword)
router.post('/resetPassword/:token', resetPassword)

export default router