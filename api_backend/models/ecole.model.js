import mongoose from "mongoose";
const ecoleSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  adresse: {
    type: String,
    required: true
  },

});

const Ecole = mongoose.model('Ecole', ecoleSchema);

export default Ecole;
