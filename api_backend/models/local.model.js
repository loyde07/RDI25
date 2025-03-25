import mongoose from "mongoose";

const localScheama = new mongoose.Schema({
    nom:{
        type: String,
        required: true
    },
    tempMoy: {
        type: Number,
        required: true
    },
    carte:{
        type: String,
        required: true
    },
}, {timestamps: true }  // à chaque modif y a la date

);

const Local = mongoose.model("Local", localScheama); //creation d'une collection Local basé sur le modèle localSchema, chaque local suit le modele 
//moongose prend le nom des collection avec Maj et sg --> locals
export default Local;