import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API;

import { useAuthStore } from "../../store/authStore";


function DashTeam() {

    const { user } = useAuthStore();
    const [Teams, setTeams] = useState([]);
    const [isInTeam, setIsInTeam] = useState(false);
    const [teamId, setTeamId] = useState(null);
    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const res = await axios.get(API + '/api/teams');
                const allTeams = res.data.data || res.data;

                setTeams(allTeams);

                const foundTeam = Teams.find(team =>
                    team.joueurs?.includes(user._id)
                );


                if (foundTeam) {
                    setIsInTeam(true);
                    setTeamId(foundTeam._id);
                } else {
                    setIsInTeam(false);
                    setTeamId(null);
                }

            } catch (error) {
                console.error("Erreur lors de la récupération des teams :", error.message);
            }
        };

        fetchTeams();
    }, [Teams]);





    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-sm p-8 bg-gray-800 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800"
        >
            {!isInTeam ? (
                <Link to="/gestion">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white 
                font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-indigo-700
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                    >
                        Rejoindre ou créer une équipe
                    </motion.button>
                </Link>
            ) : (
                <Link to={`/gestion/${teamId}`}>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white 
            font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-indigo-700
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 mb-6"
                    >
                        Voir mon équipe
                    </motion.button>
                </Link>
            )}

            {user.droit == "admin" && (
                <div>
                    <lable className="block text-xl font-semibold text-blue-400 text-center " >ADMIN</lable>
                    <Link to="/gestion">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="mt-6 w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white 
            font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-indigo-700
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                        >
                            Gestion des équipes
                        </motion.button>
                    </Link>
                </div>
            )}
        </motion.div>
    )

}

export default DashTeam;