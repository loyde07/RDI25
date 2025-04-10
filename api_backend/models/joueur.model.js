import mongoose from 'mongoose';
import Ecole from './ecole.model.js';
import bcrypt from 'bcrypt';


const joueurSchema = new mongoose.Schema({
    nom:{
        type: String,
        required: true
    },
    prenom:{
        type: String,
        required: true
    },
    ecole_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ecole',
        required: true
    },
    password: {
        type: String,
        required: true
    },
    niveau:{
        type: Number,
    },
    email:{
        type: String,
        required: true
    },
}, {timestamps: true }  // à chaque modif y a la date

);

const Joueur = mongoose.model("Joueur", joueurSchema); //creation d'une collection Local basé sur le modèle localSchema, chaque local suit le modele 
//moongose prend le nom des collection avec Maj et sg --> locals
export default Joueur;

joueurSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});