import mongoose from "mongoose";


const teamSchema = new mongoose.Schema({
    nom:{
        type: String,
        required: true,
        unique: true
    },
    logo:{
        type: String,
    },joueurs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Joueur' 
      }],
    }, 
    );

  teamSchema.pre("save", function (next) {
    // Convertit chaque ID en string pour comparaison
    const uniqueJoueurs = [...new Set(this.joueurs.map(id => id.toString()))];
  
    if (uniqueJoueurs.length !== this.joueurs.length) {
      return next(new Error("Chaque joueur doit être unique dans l’équipe."));
    }
  
    next();
  });

const Team = mongoose.model("Team", teamSchema); //creation d'une collection Local basé sur le modèle localSchema, chaque local suit le modele 
//moongose prend le nom des collection avec Maj et sg --> locals
export default Team;