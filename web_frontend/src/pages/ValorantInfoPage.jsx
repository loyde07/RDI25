import React from 'react';
import {useNavigate} from 'react-router-dom'

import { FaTrophy, FaMicrophone, FaUsers, FaDiscord, FaCalendarAlt, FaGamepad } from 'react-icons/fa';
import { motion } from "framer-motion";

const ValorantInfo = () => {
    const navigate = useNavigate();
    return (
        <div className="bg-dark text-white min-h-screen">
            {/* Hero Banner */}
            <div
                className="relative h-96 flex items-center justify-center bg-cover bg-center"
                style={{
                    backgroundImage: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(./val.png)',
                }}
            >
                <div className="text-center px-4">
                    <h1 className="text-5xl md:text-6xl font-bold text-valorant-red uppercase mb-2">Tournoi Valorant</h1>
                    <p className="text-xl md:text-2xl">Montrez votre talent sur la scène compétitive</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12 max-w-6xl">
                {/* About Section */}
                <div className="bg-card p-6 rounded-lg shadow-lg mb-12 border-l-4 border-valorant-red">
                    <h2 className="text-3xl font-bold mb-6 flex items-center">
                        <FaTrophy className="mr-3 text-red" /> À Propos du Tournoi
                    </h2>

                    <div className="md:flex gap-8 items-center">
                        <div className="md:w-1/2 h-64 bg-cover bg-center rounded-lg mb-6 md:mb-0"
                            style={{ backgroundImage: 'url(./val_bg4.png)' }}>
                        </div>

                        <div className="md:w-1/2">
                            <p className="mb-6">
                                Valorant, le FPS tactique primé de Riot Games, rencontre l'esprit compétitif dans ce tournoi exclusif.
                                Que vous soyez un joueur occasionnel ou un compétiteur aguerri, ce tournoi est fait pour vous !
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <FaCalendarAlt className="text-valorant-red mt-1 mr-3" />
                                    <div>
                                        <h3 className="font-bold">Date</h3>
                                        <p>15-16 Novembre 2023</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <FaGamepad className="text-valorant-red mt-1 mr-3" />
                                    <div>
                                        <h3 className="font-bold">Format</h3>
                                        <p>5v5, Double Elimination</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Why Participate */}
                <div className="bg-valorant-card p-6 rounded-lg shadow-lg mb-12 border-l-4 border-valorant-red">
                    <h2 className="text-3xl font-bold mb-6 flex items-center">
                        <FaUsers className="mr-3 text-valorant-red" /> Pourquoi Participer ?
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-valorant-dark p-4 rounded-lg">
                            <h3 className="text-xl font-bold mb-2 text-valorant-red">🏅 Défi Compétitif</h3>
                            <p>Affrontez les meilleures équipes de votre région et mesurez-vous à différents styles de jeu.</p>
                        </div>

                        <div className="bg-valorant-dark p-4 rounded-lg">
                            <h3 className="text-xl font-bold mb-2 text-valorant-red">🎤 Expérience Esport</h3>
                            <p>Matchs streamés avec commentateurs professionnels pour une ambiance de championnat.</p>
                        </div>

                        <div className="bg-valorant-dark p-4 rounded-lg">
                            <h3 className="text-xl font-bold mb-2 text-valorant-red">🤝 Rencontres</h3>
                            <p>Échangez avec la communauté Valorant et créez des liens durables.</p>
                        </div>
                    </div>
                </div>

                {/* CTA Button */}
                <div className="text-center mb-12">
                    <motion.button
                        whileHover={{ scale: 1.05, cursor: 'pointer' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => { navigate('/valorantTournament') }}
                        className="bg-valorant-red hover:bg-valorant-red-dark text-white font-bold py-4 px-12 rounded-md text-lg uppercase transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-valorant-red/30"
                    >
                        Rejoindre le tournoi
                    </motion.button>
                </div>

                {/* Rules Section */}
                <div className="bg-valorant-card p-6 rounded-lg shadow-lg border-l-4 border-valorant-red">
                    <h2 className="text-3xl font-bold mb-6">📋 Règles du Tournoi</h2>

                    <ol className="space-y-4 list-decimal list-inside">
                        <li className="pl-2">Équipes de 5 joueurs + 1 remplaçant maximum</li>
                        <li className="pl-2"><FaMicrophone className="inline mr-2 text-valorant-red" /> Micro obligatoire pour la communication</li>
                        <li className="pl-2">Pas de comportement toxique</li>
                        <li className="pl-2">Les maps seront choisies par veto</li>
                        <li className="pl-2">Pauses autorisées entre les rounds (max 5 min)</li>
                    </ol>
                </div>

                {/* Contact */}
                <div className="mt-12 text-center">
                    <h3 className="text-2xl font-bold mb-4">Des questions ?</h3>
                    <div className="flex justify-center items-center space-x-4">
                        <FaDiscord className="text-valorant-red text-2xl" />
                        <p>Rejoignez notre <a href="#" className="text-valorant-red underline">Serveur Discord</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
};



export default ValorantInfo;