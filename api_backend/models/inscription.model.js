import mongoose from "mongoose";


const inscriptionSchema = new mongoose.Schema({
    team_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: true
    },
    tournois_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tournois',
      required: true
    }
});

const Inscription = mongoose.model('Inscription', inscriptionSchema);

export default Inscription; 