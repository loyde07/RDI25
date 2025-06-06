import mongoose from "mongoose";

//const Team = require('./team.model.js');
//const Tournois = require('./tournois.model.js');

import Team from './team.model.js';
import Tournois from './tournois.model.js';

const matchScheama = new mongoose.Schema({
    tournois_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tournois',
        required: true
    },
    team1_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: false,
        default : null
    },
    team2_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: false,
        default: null
    },
    winner_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: false,
        default : null
    },
    round: {
        type: Number,
        default: 1
    }
      
}, {timestamps: true }  // à chaque modif y a la date

);

const Match = mongoose.model("Match", matchScheama); //creation d'une collection Local basé sur le modèle localSchema, chaque local suit le modele 
//moongose prend le nom des collection avec Maj et sg --> locals
export default Match;