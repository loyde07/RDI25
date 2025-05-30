import mongoose from "mongoose";
import Match from './match.model.js';

const tournoisSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true,
        trim: true
    },
    jeu: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['en préparation', 'en cours', 'terminé', 'annulé'],
        default: 'en préparation'
    },
    matches: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Match'
    }],
    matchEnCours: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Match',
        default: null
    },
    dateDebut: {
        type: Date,
        default: null
    },
    dateFin: {
        type: Date,
        default: null
    },
    equipesParticipantes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
    }],
    gagnant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        default: null
    }
}, { timestamps: true });

// Middleware pour supprimer les matches associés quand un tournoi est supprimé
tournoisSchema.pre('remove', async function(next) {
    try {
        await Match.deleteMany({ tournois_id: this._id });
        next();
    } catch (err) {
        next(err);
    }
});

const Tournois = mongoose.model("Tournois", tournoisSchema);
export default Tournois;