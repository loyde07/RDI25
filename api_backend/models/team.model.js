import mongoose from "mongoose";
const Ecole = require('./ecole.model.js');


const teamScheama = new mongoose.Schema({
    nom:{
        type: String,
        required: true
    },
    ecole_id: {
        type: Number,
        ref: 'Ecole',
        required: true
    },
    logo:{
        type: String,
    },
}, {timestamps: true }  // à chaque modif y a la date

);

const Team = mongoose.model("Team", teamScheama); //creation d'une collection Local basé sur le modèle localSchema, chaque local suit le modele 
//moongose prend le nom des collection avec Maj et sg --> locals
export default Team;