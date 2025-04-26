import bcrypt from 'bcryptjs';
import crypto from 'crypto';

import { User } from "../models/user.model.js";
import { generateTokenAndSetCookie} from '../utils/generateTokenAndSetCookie.js';
import {    sendPasswordResetRequest,
            sendResetSuccessEmail,
            sendWelcomeEmail,
            sendVerificationEmail } from "../mailtrap/emails.js";

import cloudinary from '../cloudinary/cloudinary.js';
import { console } from 'inspector/promises';

export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password"); // On récupère l'user de la DB
        if (!user){
            return res.status(400).json({success:false, message:"User not found"});
        }
        res.status(200).json({success:true, user}); // On envoie l'user comme réponse
    } catch (error) {
        console.log("Error in checkAuth ", error);
        res.status(400).json({success:false, message: error.message});
    }

}

export const signup = async  (req, res) => {
    const {lName, fName,pseudo, email, password} = req.body;
    try {

        // les champs requis doivent etre entrée
        if(!lName, !fName, !pseudo, !email, !password){
            throw new Error("All fields are required")
        }

        // Error si l'email existe déja dans la db
        const userAlreadyExists = await User.findOne({email});
        console.log("userAlreadyExists", userAlreadyExists)
        if (userAlreadyExists){
            return res.status(400).json({sucess:false, message: "User already exists"});
        }

        const pseudoAlreadyExists = await User.findOne({pseudo});
        console.log("pseudoAlreadyExists", pseudoAlreadyExists)
        if (pseudoAlreadyExists){
            return res.status(400).json({sucess:false, message: "pseudo already exists"});
        }

        // permet de hashé le mot de passe pour qu'il ne soit pas stocké une fois enregistré
        const hashedPassword = await bcrypt.hash(password, 12);

        // generation d'un Token random pour l'authentification
        const verificationToken = Math.floor(100000 + Math.random() * 900000 );toString();
        const user = new User({
            lName,
            fName,
            pseudo,
            email,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 heures
        })

        // sauvegarde dans la db
        user.isVerified = true
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        //jwt
        generateTokenAndSetCookie(res, user._id);

        // await sendVerificationEmail(user.email, verificationToken);

        res.status(201).json({
            sucess: true,
            message: "User created successfully",
            user: {
                ...user._doc,
                password: undefined //  empèche le client de voire le mot de passe en le supprimant de la réponse
            }
        })

    } catch (error) {
        return res.status(400).json({sucess:false, message: error.message});
    }
}

export const verifyEmail = async (req, res) => {
    const {code} = req.body;
    try {
        const user = await User.findOne({
            // s'assure qu'il y a un utilisateur avec ce Token et que le token n'est pas expiré

            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now()}
        })
        if (!user){
            return res.status(400).json({sucess:false, message: "Invalid or expired verification code"})
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        await sendWelcomeEmail(user.email, user.fName);
        res.status(200).json({sucess:true,
             message:"Email verified successfully",
             user: {
                ...user._doc,
                password: undefined
             }
        })
    } catch (error) {
        console.log("Error in verifyEmail ", error)
        res.status(500).json({success:false,  message: "Server error"})
    }
}

export const login = async  (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email});
        if (!user){
            return res.status(400).json({sucess:false, message:"Invalid credentials"})
        }

        const ispasswordValid = await bcrypt.compare(password, user.password);
        if (!ispasswordValid){
            return res.status(400).json({sucess:false, message:"Invalid password"})
        }

        generateTokenAndSetCookie(res, user._id);
        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({
            success:true,
            message: "Logged in sucessfully",
            user: {
                ...user._doc,
                password: undefined,
            }

        })
    } 
    catch (error) {
        console.log("Error in login, ", error)
        return res.status(400).json({sucess:false, message: error.message});
    }
}

export const logout = async  (req, res) => {
    res.clearCookie("token");
    res.status(200).json({success: true, message: "Logged out successfully" });
}

export const forgotPassword = async (req, res) => {
    const {email} = req.body;
    try {
        const user = await User.findOne({email});
        if (!user){
            return res.status(400).json({success:false, message:"Email does not exist"})
        }

        // génère un nouveau token pour le reset du mot de passe
        const resetToken = crypto.randomBytes(20).toString("hex");

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = Date.now() + 1 * 60 * 60 * 1000; //1 heure 

        await user.save();

        // envoie de l'email 
        await sendPasswordResetRequest(user.email, `${process.env.CLIENT_URL}/resetPassword/${resetToken}`);
        res.status(200).json({success: true, message: "password reset link sent to your email" });

    } catch (error) {
        console.log("Error in forgotPassword ", error);
        res.status(400).json({sucess: false, message: error.message});
        
    }
}

export const resetPassword = async (req, res) => {
    try {
        const {token} = req.params;
        const {password} = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: {$gt: Date.now()},
        });

        if (!user){
            return res.status(400).json({success: false, message: "invalid or expired reset token"})
        }

        // Nouveau mot de passe récupéré sera haché à nouveau
        const hashedPassword = await bcrypt.hash(password,10);

        user.password = hashedPassword
        user.resetPasswordToken = undefined
        user.resetPasswordExpiresAt = undefined
        await user.save();

        await sendResetSuccessEmail(user.email)

        res.status(200).json({success:true, message:"Password reset successful"})
    } catch (error) {
        console.log("Error in resetPassword ", error)
        res.status(400).json({success:false, message:error.message})
        
    }

}

export const updatePic = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password"); // On récupère l'user de la DB
        if (!user){
            return res.status(400).json({success:false, message:"User not found"});
        }

        const {profilePic} = req.body
        console.log("Données envoyées:", profilePic);

        if(!profilePic){
            return res.status(400).json({success:false, message:"Profile picture is required"})
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic, {
            resource_type: "auto"
          });
                  const updatedUser = await User.findByIdAndUpdate(user._id, {logo: uploadResponse.secure_url}, {new:true})

        res.status(200).json({success:true, user:updatedUser})

    } catch (error) {
        console.log("error in update profile: ", error)
        res.status(500).json({success:false, message:"Internal server error"})
        
    }
}

export const updateProfile = async (req, res) => {
	try {
		const userId = req.userId; // Injecté par verifyToken
		const { nom, prenom, pseudo, password } = req.body;

		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ message: "Utilisateur non trouvé" });
		}

		// Mettre à jour les champs
		if (nom) user.lName = nom;
		if (prenom) user.fName = prenom;
		if (pseudo) user.pseudo = pseudo;

		// Si password fourni, on le hash avant update
		if (password) {
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);
			user.password = hashedPassword;
		}

		// Sauvegarde
		await user.save();

		// On enlève le mot de passe de la réponse
		const { password: pwd, ...userData } = user._doc;

		return res.status(200).json({success: true, message: "Profil mis à jour avec succès", user: userData });

	} catch (error) {
		console.error("Erreur updateProfile:", error);
		return res.status(500).json({ message: "Erreur serveur" });
	}
};
