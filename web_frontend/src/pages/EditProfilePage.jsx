import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { User, Lock, Loader } from "lucide-react"
import { motion } from 'framer-motion'

import { useAuthStore } from "../store/authStore";

import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import Input from '../components/Input'


const  EditProfilePage =  () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    pseudo: "",
    password: "",
    confirmPassword: "",
  });

  const { updateProfile , user, error, isLoading } =  useAuthStore();


  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        nom: user.lName || "",
        prenom: user.fName || "",
        pseudo: user.pseudo || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    const { nom, prenom, pseudo, password, confirmPassword } = formData;

    if (password && password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const updatePayload = { nom, prenom, pseudo };
      if (password) updatePayload.password = password;

      await updateProfile(updatePayload);
      navigate("/dashboard");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
      console.error(error);
    }
  };

  return (
    <div className="max-w-md  w-3xl mx-auto p-6 bg-gradient-to-tl from-white to-indigo-800 rounded-2xl shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Modifier mon profil</h2>
      <form onSubmit={handleUpdateProfile}>
        <Input
            icon={User}
            name="nom"
            type='text'
            placeholder='Nom'
            value={formData.nom}
            onChange={handleChange}
        />
        <Input
            icon={User}
            name="prenom"
            type='text'
            placeholder='prenom'
            value={formData.prenom}
            onChange={handleChange}
        />
        <Input
            icon={User}
            name="pseudo"
            type='userName'
            placeholder='pseudo'
            value={formData.pseudo}
            onChange={handleChange}
        />
        <Input
            icon={Lock}
            name="password"
            type='password'
            placeholder='password'
            value={formData.password}
            onChange={handleChange}
        />
        <Input
          icon={Lock}
          type="password"
          name="confirmPassword"
          placeholder="Confirmer le mot de passe"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        />
        {error && <p className='text-red-500 font-semibold mt-2'>{error}</p>}
        <PasswordStrengthMeter password={formData.password}/>

        <motion.button
            className='mt-5 w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white 
                      font-bold rounded-lg shadow-lg hover:from-blue-600
                      hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                      focus:ring-offset-gray-900 transition duration-200'
            whileHover={{scale: 1.02}}
            whileTop={{scale:0.98}}
            type='submit'
            disabled={isLoading}
        >
        {isLoading? <Loader className='animate-spin mx-auto' size={24}/>:"Enregistrer les informations"}
        </motion.button>

        <motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					className='w-full py-3 px-4 bg-gradient-to-r from-blue-700 to-indigo-800 text-white 
				 font-bold rounded-lg shadow-lg hover:from-blue-800 hover:to-indigo-900
				 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 focus:ring-offset-gray-900'
				>
				    <Link to="/dashboard">Annuler</Link> 

				</motion.button>
      </form>
    </div>
  );
}

export default EditProfilePage;
