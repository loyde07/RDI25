import { motion } from "framer-motion";
import { Camera, Mail, User, Users, GraduationCap } from "lucide-react";
import { useState } from "react";


import { useAuthStore } from "../../store/authStore";
import { valorantRanks } from "../../utils/valorantRanks";

const DashboardPage = () => {
    const { user, logout, isUpdatingPic, updatePic } = useAuthStore();
    const [selectedImg, setSelectedImg] = useState(null)

    const selectedRank = valorantRanks.find((option) => option.value === user.niveau);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = async () => {
            const base64Image = reader.result;
            console.log("Base64 envoyé:", base64Image);

            setSelectedImg(base64Image);
            await updatePic({ profilePic: base64Image });
        };
    };


    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className='max-w-md w-full mx-auto mt-10 p-8 bg-gray-900 bg-opacity-80 backdrop-filter scrollbar-thumb-gray-800 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800'
        >
            <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-indigo-600 text-transparent bg-clip-text'>
                Profil de  {user.fName}
            </h2>
            <div className="flex flex-col items-center gap-4">
                <div className="relative text-gray-800">
                    <img
                        src={selectedImg || user.logo || "/avatar.png"}
                        alt="Profil"
                        className="size-32 bg-gradient-to-r from-indigo-400 to-blue-600 rounded-full object-cover border-4"
                    />
                    <div className="absolute bottom-0 right-0 group">
                        <img
                            src={selectedRank.image || "rank/unknown.png"}
                            alt={selectedRank.label || "Rang"}
                            className="size-10 border-white rounded-full"
                        />
                        <div
                            className="absolute top-1/2 left-full ml-2 transform -translate-y-1/2
                        bg-gray-800 text-white text-sm font-semibold px-3 py-1 rounded-lg shadow-md
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap"
                        >
                            {selectedRank.label}
                        </div>
                    </div>
                    <label
                        htmlFor="avatar-upload"
                        className={`
                            
                            absolute bottom-0 left-0 
                            bg-base-content hover:scale-105
                            p-2 rounded-full cursor-pointer 
                            transition-all duration-200
                            ${isUpdatingPic ? "animate-pulse pointer-events-none" : ""}
                        `}
                    >
                        <Camera className="w-5 h-6 text-base-200 text-blue-400 " />
                        <input
                            type="file"
                            id="avatar-upload"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={isUpdatingPic}
                        />
                    </label>
                </div>

                <p className="text-sm font-semibold text-zinc-100 mb-2">
                    {isUpdatingPic ? "Uploading..." : "Cliquez sur l'icone pour mettre à jour la photo de profil"}
                </p>
            </div>

            <div className='space-y-6'>
                <motion.div


                    className='p-4 bg-gray-800 bg-opacity-50 rounded-lg border space-y-2 border-gray-700'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h3 className='text-xl font-semibold text-blue-500 mb-3'>Informations utilisateur</h3>
                    <motion.div className="space-y-1.5"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="text-sm text-zinc-400 flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Nom Complet
                        </div>
                        <p className="px-4 py-2.5 bg-base-200 text-blue-400 rounded-lg border">{user.lName} {user.fName}</p>
                    </motion.div>

                    <motion.div className="space-y-1.5"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <div className="text-sm text-zinc-400 flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Pseudo
                        </div>
                        <p className="px-4 py-2.5 bg-base-200 text-blue-400 rounded-lg border">{user.pseudo}</p>
                    </motion.div>

                    <motion.div className="space-y-1.5"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                    >
                        <div className="text-sm text-zinc-400 flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            Adresse mail
                        </div>
                        <p className="px-4 py-2.5 bg-base-200 text-blue-400 rounded-lg border">{user.email}</p>
                    </motion.div>
                    <motion.div className="space-y-1.5"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                    >
                        <div className="text-sm text-zinc-400 flex items-center gap-2">
                            <GraduationCap className="w-4 h-4" />
                            Ecole
                        </div>
                        <p className="px-4 py-2.5 bg-base-200 text-blue-400 rounded-lg border">{user.ecole_id.nom}</p>
                    </motion.div>


                </motion.div>
            </div>
        </motion.div>
    );
};
export default DashboardPage;