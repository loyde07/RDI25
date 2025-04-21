import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const joueurSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true,
        trim: true
    },
    prenom: {
        type: String,
        required: true,
        trim: true
    },
    pseudo: {
        type: String,
        unique: true,
        sparse: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    niveau: {
        type: Number,
        default: 1,
        min: 1,
        max: 100
    },
    logo: {
        type: String // chemin vers l’image (ex: "uploads/logos/1712779851517.png")
    },
    ecole_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ecole',
        required: true
    },
}, { timestamps: true });

// Hash automatique du mot de passe avant sauvegarde
joueurSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const Joueur = mongoose.model("Joueur", joueurSchema);
export default Joueur;