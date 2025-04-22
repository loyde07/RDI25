import mongoose from "mongoose";

const joueurScheama = new mongoose.Schema({
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
    team_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
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

const Joueur = mongoose.model("Joueur", joueurScheama); //creation d'une collection Local basé sur le modèle localSchema, chaque local suit le modele 
//moongose prend le nom des collection avec Maj et sg --> locals
export default Joueur;