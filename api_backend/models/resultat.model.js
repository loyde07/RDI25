import mongoose from "mongoose";

const resultatScheme = new mongoose.Schema({

    match_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Match',
        required: true
    },
    winner_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },


});

inscriptionSchema.index({ match_id: 1, winner_id: 1 }, { unique: true });

const Resultat = mongoose.model('Resultat', resultatScheme);

export default Resultat;