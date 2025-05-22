import React, {useState} from "react";
import {motion} from 'framer-motion'
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ImagePlus } from "lucide-react";
import { uploadLogo, createTeamAndJoin } from "./outilsGestionTeams/outilsNew.jsx";

const API = import.meta.env.VITE_API ;



const CreationTeam = () => {
  const [nom, setNom] = useState('');
  const [logo, setLogo] = useState('');
  const { user, updateProfile } = useAuthStore();
  const [newLogoFile, setNewLogoFile] = useState(null);
  const navigate = useNavigate();



    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let logoPath = logo; // Si tu as déjà un logo (par exemple après édition)

            if (newLogoFile) {
                logoPath = await uploadLogo(newLogoFile);
            }

            const createdTeam = await createTeamAndJoin(nom, logoPath, user, updateProfile);

            toast.success('Équipe créée avec succès !');
            navigate("/dashboard");

        } catch (error) {
            console.error(error);
            toast.error("Erreur lors de la création");
        }
    };


 

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setNewLogoFile(file);
    toast.success("Fichier prêt à être uploadé à la création");
};


  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full mx-auto bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-2xl shadow-xl p-8"
    >
      <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-indigo-400 text-transparent bg-clip-text">
        Créer une nouvelle équipe
      </h2>

      <input
        type="text"
        placeholder="Nom de l'équipe"
        className="w-full px-4 py-3 bg-gray-700 text-white placeholder-gray-400 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
        required
      />
      <div className="mb-6">

      <input
          type="text"
          placeholder="Lien du logo"
          className="w-full px-4 py-3 bg-gray-700 text-white placeholder-gray-400 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={logo}
          onChange={(e) => setLogo(e.target.value)}
        />
        <label className="block text-white mb-2">Charger un logo :</label>

        <div className="flex items-center gap-3">
          <label
            htmlFor="logo-upload"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-all"
          >
            <ImagePlus className="w-5 h-5" />
            <span>Choisir un fichier</span>
          </label>
          <input
            id="logo-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          {logo && (
            <span className="text-sm text-green-400">Logo chargé</span>
          )}
        </div>
      </div>

      <motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
      >
        Créer
      </motion.button>
    </motion.form>
  );
};

export default CreationTeam;
