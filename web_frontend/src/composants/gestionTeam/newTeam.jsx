import React, {useState} from "react";
import axios from 'axios';
import {motion} from 'framer-motion'
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ImagePlus } from "lucide-react";


const API = import.meta.env.VITE_API ;



const CreationTeam = () => {
  const [nom, setNom] = useState('');
  const [logo, setLogo] = useState('');
  const { user, updateProfile } = useAuthStore();
  const navigate = useNavigate();



  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(API +'/api/teams', {
        nom,
        logo
      });

      if (user.droit !== "admin"){
        const createdTeam = response.data.data;

        await axios.patch(`${API}/api/teams/${createdTeam._id}/join`, {
          playerId: user._id,
        });

        const updatePayload = { droit: "capitaine" };
        await updateProfile(updatePayload);

        navigate("/dashboard");

      }


      toast.success('Équipe créée avec succès !');


    } catch (error) {
        // Récupération du message d'erreur du back si dispo
        const message = error.response?.data?.message;
    
        if (message === "Une équipe avec ce nom existe déjà.") {
          toast.error(' Ce nom d’équipe est déjà utilisé. Choisis-en un autre.');
        } else {
          toast.error(' Erreur lors de la création de l’équipe. Veuillez réessayer plus tard.');
        }
    
      }
  };


const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('logo', file);

  try {
    const res = await axios.post(`${API}/api/teams/upload-logo`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    setLogo(res.data.path); // Chemin statique à stocker dans MongoDB
    toast.success("Logo uploadé !");
  } catch (err) {
    toast.error("Erreur upload logo");
    console.error(err);
  }
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
