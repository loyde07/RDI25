
import React, { useState } from 'react';
import CreationTeam from '../composants/gestionTeam/newTeam.jsx';
import RejoindreTeam from '../composants/gestionTeam/joinTeam.jsx';
import SupprimerTeam from '../composants/gestionTeam/deleteTeam.jsx';
import UpdateTeam from '../composants/gestionTeam/updateTeam.jsx';
import {motion} from 'framer-motion'
import { useAuthStore } from "../store/authStore";
import { Link } from 'react-router-dom';
import { ArrowLeft } from "lucide-react";


function Gestion() {
  const [selectedAction, setSelectedAction] = useState(null);
  const { user } = useAuthStore();


  return (
    <div>
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden p-6"
        >{
    <div className="home-container">
      {user.droit == "admin" ? (
              <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-indigo-400 text-transparent bg-clip-text">
              Gérer les équipes
              </h2>
      ) : (
              <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-indigo-400 text-transparent bg-clip-text">
              Créer ou rejoindre une équipe
              </h2>
      )}


      {/* Boutons d'action */}
      <div className="button-container">
      <motion.button
            onClick={() => setSelectedAction('creation')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`mt-5 w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white 
                        font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-indigo-700 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                        focus:ring-offset-gray-900 transition duration-200
                        ${selectedAction === 'creation' ? 'ring-2 ring-blue-400' : ''}`}
            >
            Créer une Team
            </motion.button>


            <motion.button
        onClick={() => setSelectedAction('join')}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`mt-5 w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white 
                    font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-indigo-700 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                    focus:ring-offset-gray-900 transition duration-200
                    ${selectedAction === 'join' ? 'ring-2 ring-blue-300' : ''}`}
        >
        Rejoindre une Team
        </motion.button>
        {user.droit == "admin" && (       
          <div>
          <motion.button
          onClick={() => setSelectedAction('delete')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`mt-5 w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white 
                      font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-indigo-700 
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                      focus:ring-offset-gray-900 transition duration-200
                      ${selectedAction === 'delete' ? 'ring-2 ring-blue-300' : ''}`}
          >
          Supprimer une Team
          </motion.button>

          <motion.button
          onClick={() => setSelectedAction('update')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`mt-5 w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white 
                      font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-indigo-700 
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                      focus:ring-offset-gray-900 transition duration-200
                      ${selectedAction === 'update' ? 'ring-2 ring-blue-300' : ''}`}
          >
          Update une Team
          </motion.button>
          </div>
      )}

      </div>
      <div id="action-container" className="action-container">      
      {selectedAction === 'creation' && <CreationTeam />}
      {selectedAction === 'join' && <RejoindreTeam />}
      {selectedAction === 'delete' && <SupprimerTeam /> }
      {selectedAction === 'update' && <UpdateTeam /> }
      </div>
    </div>

        }</motion.div>
            <Link to="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="py-3 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white 
                          font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-indigo-700 
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                          focus:ring-offset-gray-900 transition duration-200  mt-6"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
            </Link>

        </div>
  );
}

export default Gestion;
