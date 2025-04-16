//const mongoose = require('mongoose');

import mongoose from 'mongoose';


const tournoisSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  date_debut: {
    type: Date,
    required: true
  },
  date_fin: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        return value > this.date_debut;  // La date de fin doit être après la date de début
      },
      message: 'La date de fin doit être après la date de début.'
    }
  },
  status: {
    type: String,
  }

});

const Tournois = mongoose.model('Tournois', tournoisSchema);

export default Tournois;