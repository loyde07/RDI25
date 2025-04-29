import { motion } from "framer-motion";
import { Camera, Mail, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";


import { useAuthStore } from "../store/authStore";
import { formatDate } from "../utils/date";

const DashboardPage = () => {
	const { user, logout, isUpdatingPic, updatePic } = useAuthStore();
    const [selectedImg, setSelectedImg] = useState(null)

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

    const handleUpdateProfile = async (e) => {
        
    }
	const handleLogout = () => {
		logout();
	};
	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.9 }}
			transition={{ duration: 0.5 }}
			className='max-w-md w-full mx-auto mt-10 p-8 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800'
		>
			<h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-indigo-600 text-transparent bg-clip-text'>
				Profil de  {user.fName}
			</h2>
            <div className="flex flex-col items-center gap-4">
                <div className="relative text-gray-800">
                    <img
                        src={selectedImg || user.logo || "/avatar.png"}
                        alt="Profil"
                        className="size-32 bg-gradient-to-r from-indigo-400 to-blue-600 rounded-full object-cover border-4 "
                    />
                    <label
                        htmlFor="avatar-upload"
                        className={`
                            
                            absolute bottom-0 right-0 
                            bg-base-content hover:scale-105
                            p-2 rounded-full cursor-pointer 
                            transition-all duration-200
                            ${isUpdatingPic ? "animate-pulse pointer-events-none" : ""}
                        `}
                    >
                        <Camera className="w-5 h-6 text-base-200 text-gray-100" />
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

                    
					className='p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
				>
 					<h3 className='text-xl font-semibold text-blue-500 mb-3'>Informations utilisateur</h3>
                    <div className="space-y-1.5">
                        <div className="text-sm text-zinc-400 flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Nom Complet
                        </div>
                            <p className="px-4 py-2.5 bg-base-200 text-blue-400 rounded-lg border">{user.lName} {user.fName}</p>
                    </div>

                    <div className="space-y-1.5">
                        <div className="text-sm text-zinc-400 flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Pseudo
                        </div>
                        <p className="px-4 py-2.5 bg-base-200 text-blue-400 rounded-lg border">{user.pseudo}</p>
                    </div>
                    <div className="space-y-1.5">
                        <div className="text-sm text-zinc-400 flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            Adresse mail
                        </div>
                        <p className="px-4 py-2.5 bg-base-200 text-blue-400 rounded-lg border">{user.email}</p>
                    </div>


				</motion.div>
				<motion.div
					className='p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
				>
					<h3 className='text-xl font-semibold text-blue-400 mb-3'>Activité du compte

                    </h3>
					<p className='text-gray-300'>
						<span className='font-bold'>Creation du compte: </span>
						{new Date(user.createdAt).toLocaleDateString("en-US", {
							year: "numeric",
							month: "long",
							day: "numeric",
						})}
					</p>
					<p className='text-gray-300'>
						<span className='font-bold'>Dernière connexion: </span>

						{formatDate(user.lastLogin)}
					</p>
				</motion.div>
			</div>
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
				>
				    <Link to="/editProfile" >Modifier Profile</Link> 

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
					className='w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white 
				font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-indigo-700
				 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900'
				>
					Se déconnecter
				</motion.button>
			</motion.div>
		</motion.div>
	);
};
export default DashboardPage;