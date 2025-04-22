import mongoose from "mongoose";

//const Ecole = require('./ecole.model.js');

import Ecole from './ecole.model.js';



const teamScheama = new mongoose.Schema({
    nom:{
        type: String,
        required: true
    },
    logo:{
        type: String,
    },
    joueurs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Joueur' 
      }],
    }, {
      // Validation du nombre de joueurs
      validate: {
        validator: function() {
          return this.joueurs.length <= 5;  // Vérifier que la longueur du tableau 'joueurs' est <= 5
        },
        message: 'Une équipe ne peut pas avoir plus de 5 joueurs.'
      }
    });

const Team = mongoose.model("Team", teamScheama); //creation d'une collection Local basé sur le modèle localSchema, chaque local suit le modele 
//moongose prend le nom des collection avec Maj et sg --> locals
export default Team;