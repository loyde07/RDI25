import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Loader, User, GraduationCap, Star, Lock } from "lucide-react";
import { motion } from 'framer-motion';

import { useAuthStore } from "../store/authStore";
import { useEcoleStore } from "../store/ecoleStore";

import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import EditableField from "../components/EditableField";

import { valorantRanks } from "../utils/valorantRanks";
import { validateProfileUpdate } from "../utils/validation/validationEditProfile";

const EditProfilePage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    pseudo: "",
    ecole_id: "",
    niveau: "",
    password: "",
    confirmPassword: "",
  });

  const [showPasswordSection, setShowPasswordSection] = useState(false);

  const { ecoles, fetchEcoles } = useEcoleStore();
  const { updateProfile, user, error, isLoading } = useAuthStore();

  useEffect(() => {
    fetchEcoles();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        nom: user.lName || "",
        prenom: user.fName || "",
        pseudo: user.pseudo || "",
        niveau: user.niveau || "",
        ecole_id: user.ecole_id?._id || "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [user]);

  const handleFieldChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    const { modifiedFields, errors } = validateProfileUpdate(formData, user, showPasswordSection);

    if (errors.length > 0) {
      errors.forEach(err => toast.error(err));
      return;
    }

    if (!modifiedFields || Object.keys(modifiedFields).length === 0) {
      toast.error("Aucune modification détectée.");
      return;
    }

    try {
      await updateProfile(modifiedFields);
      navigate("/profile");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
      console.error(error);
    }
  };

  return (
    <div className="max-w-md w-3xl mx-auto p-5 bg-gradient-to-tl from-white to-indigo-800 rounded-2xl shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-600 to-blue-800 ">Modifier mon profil</h2>
      <form onSubmit={handleUpdateProfile}>
        <EditableField
          label="Nom"
          name="nom"
          value={formData.nom}
          onChange={handleFieldChange}
          icon={User}
        />
        <EditableField
          label="Prénom"
          name="prenom"
          value={formData.prenom}
          onChange={handleFieldChange}
          icon={User}
        />
        <EditableField
          label="Pseudo"
          name="pseudo"
          value={formData.pseudo}
          onChange={handleFieldChange}
          icon={User}
        />
        <EditableField
          label="École"
          name="ecole_id"
          value={formData.ecole_id}
          onChange={handleFieldChange}
          icon={GraduationCap}
          options={ecoles.map(ecole => ({ label: ecole.nom, value: ecole._id }))}
        />
        <EditableField
          label="Niveau"
          name="niveau"
          value={formData.niveau}
          onChange={handleFieldChange}
          icon={Star}
          options={valorantRanks}
        />

        <div className="mt-4">
          <button
            type="button"
            onClick={() => setShowPasswordSection(!showPasswordSection)}
            className="text-blue-900 hover:underline   font-semibold "
          >
            {showPasswordSection ? "Annuler le changement de mot de passe" : "Changer le mot de passe"}
          </button>
        </div>

        {showPasswordSection && (
          <div className="mt-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-white mb-1">Nouveau mot de passe</label>
              <input
                type="password"
                name="password"
                data-testid="password"
                value={formData.password}
                onChange={(e) => handleFieldChange("password", e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-white mb-1">Confirmer le mot de passe</label>
              <input
                type="password"
                name="confirmPassword"
                data-testid="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => handleFieldChange("confirmPassword", e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <PasswordStrengthMeter password={formData.password} />
          </div>
        )}

        {error && <p className='text-red-500 font-semibold mt-2'>{error}</p>}

        <motion.button
          className='mt-5 w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white 
                      font-bold rounded-lg shadow-lg hover:from-blue-600
                      hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                      focus:ring-offset-gray-900 transition duration-200'
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type='submit'
          disabled={isLoading}
          data-testid="submit-button"
        >
          {isLoading ? <Loader className='animate-spin mx-auto' size={24} /> : "Enregistrer les informations"}
        </motion.button>
      </form>
    </div>
  );
};

export default EditProfilePage;
