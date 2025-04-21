import mongoose from "mongoose";


const matchScheama = new mongoose.Schema({
    tournois_id:{
        type: String,
        ref: 'Tournois',
        required: true
    },
    equipe1_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team_id',
        required: true
    },
    equipe2_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    }
    
}, {timestamps: true }  // à chaque modif y a la date

);

const Match = mongoose.model("Match", matchScheama); //creation d'une collection Local basé sur le modèle localSchema, chaque local suit le modele 
//moongose prend le nom des collection avec Maj et sg --> locals
export default Match;