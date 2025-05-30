import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import MonProfil from "./ProfileSections/MonProfil";
import MesTournois from "./ProfileSections/MesTournois";
import MesEquipes from "./ProfileSections/MesEquipes";
import EditProfile from "./EditProfilePage";
import DashTeam from "./ProfileSections/TeamDash.jsx"


const ProfilPage = () => {
  const [activeSection, setActiveSection] = useState("profil");
  const { logout } = useAuthStore();


  const renderSection = () => {
    switch (activeSection) {
      case "profil":
        return <MonProfil />;
      case "tournois":
        return <MesTournois />;
      case "equipes":
        return <DashTeam />;
      case "editProfile":
        return <EditProfile />;
      default:
        return <MonProfil />;
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full overflow-hidden">
      {/* Sidebar fixe en hauteur et visible au scroll */}
      <div className="h-screen w-64 bg-gray-800 bg-opacity-80 border-r border-gray-700 shadow-lg p-4 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
        <button
          className={`w-full py-2 px-4 rounded-lg text-white font-semibold transition-all duration-200 ${activeSection === "profil"
            ? "bg-gradient-to-r from-blue-500 to-indigo-600"
            : "hover:bg-gray-700"
            }`}
          onClick={() => setActiveSection("profil")}
        >
          Mon Profil
        </button>
        <button
          className={`w-full py-2 px-4 rounded-lg text-white font-semibold transition-all duration-200 ${activeSection === "tournois"
            ? "bg-gradient-to-r from-blue-500 to-indigo-600"
            : "hover:bg-gray-700"
            }`}
          onClick={() => setActiveSection("tournois")}
        >
          Mes Tournois
        </button>
        <button
          className={`w-full py-2 px-4 rounded-lg text-white font-semibold transition-all duration-200 ${activeSection === "equipes"
            ? "bg-gradient-to-r from-blue-500 to-indigo-600"
            : "hover:bg-gray-700"
            }`}
          onClick={() => setActiveSection("equipes")}
        >
          Mes Équipes
        </button>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className='mt-4'
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white 
                 font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-indigo-700
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900'
            onClick={() => setActiveSection("editProfile")}
          >
            Modifier le profil
          </motion.button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className='mt-4'
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className='w-full py-3 px-4 bg-gradient-to-r from-red-500 to-red-800 text-white 
                font-bold rounded-lg shadow-lg hover:from-red-600 hover:to-red-900
                 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900'
          >
            Se déconnecter
          </motion.button>
        </motion.div>
      </div>

      {/* Contenu principal scrollable */}
      <div className="flex-1 h-screen overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {renderSection()}
      </div>
    </div>
  );
};

export default ProfilPage;
