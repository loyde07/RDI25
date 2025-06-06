import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    lName: {
        type: String,
        required: true,
        trim: true
    },
    fName: {
        type: String,
        required: true,
        trim: true
    },
    pseudo: {
        type: String,
        default: null,
        unique:true,
        require: true,
        sparse: true,
        trim: true
    },
    droit: {
        type: String,
        default: null
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    niveau: {
        type: Number,
        default: 1,
        min: 1,
        max: 100
    },
    logo: {
        type: String,
        default: ""
    },
    ecole_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ecole',
    },
    lastLogin:{
    type: Date,
    default: Date.now
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,

}, { timestamps: true });

export const User = mongoose.model("Joueur", userSchema);

