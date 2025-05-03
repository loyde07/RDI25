import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, Loader } from "lucide-react"
import { Link, useNavigate } from 'react-router-dom'
import React from 'react'
import { toast } from 'react-hot-toast'

import { useAuthStore } from '../store/authStore'
import Input from '../components/Input'
import { validateLogin } from '../utils/validation/validationLogin.js';


const LoginPage = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [localError, setLocalError] = useState('')

    const navigate = useNavigate();
    const { login, isLoading, error } = useAuthStore()

    const handleLogin = async (e) => {
        e.preventDefault();
        const formData = { email, password };
        const errors = validateLogin(formData);

        if (Object.keys(errors).length > 0) {
            const firstError = errors.global || Object.values(errors)[0];
            toast.error(firstError);
            setLocalError(firstError);
            return;
        }

        setLocalError('');
        try {
            await login(email.trim(), password.trim())
            navigate("/profile");

        } catch (error) {
            console.error(error);
            const message = error?.response?.data?.message || error.message || 'Une erreur est survenue';
            toast.error(message);
        }
        // Si la connexion échoue, vous pouvez gérer l'erreur ici        
        // Si la connexion est réussie, redirige l'utilisateur vers le tableau de bord ou une autre page
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl 
                        overflow-hidden'
        >
            <div className='p-8'>
                <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-indigo-400 
                    text-transparent bg-clip-text'>
                    Coucou mon chou
                </h2>

                <form onSubmit={handleLogin} >
                    <Input
                        icon={Mail}
                        type='text'
                        placeholder='adresse mail'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                        icon={Lock}
                        type='password'
                        placeholder='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <div className='flex items-center mb-2'>
                        <Link to='/forgotPassword' className='text-sm text-blue-400 hover:underline'>
                            Mot de passe oublier?
                        </Link>
                    </div>
                    {(localError || error) && (<p className="text-red-500 font-semibold mt-2"> {localError || error}</p>)}
                    <motion.button
                        className='mt-5 w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white 
						font-bold rounded-lg shadow-lg hover:from-blue-600
						hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
						 focus:ring-offset-gray-900 transition duration-200'
                        whileHover={{ scale: 1.02 }}
                        whileTop={{ scale: 0.98 }}
                        type='submit'
                        disabled={isLoading}
                        data-testid="login-button"
                    >
                        {isLoading ? <Loader className='w-6 h-6 animate-spin mx-auto' /> : "Se connecter"}
                    </motion.button>

                </form>
            </div>
            <div className='px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center'>
                <p className='text-sm text-gray-400'>
                    Pas encore de compte?{" "}
                    <Link to={"/signup"} className='text-blue-400 hover:underline'>
                        S'inscrire
                    </Link>
                </p>
            </div>
        </motion.div>
    )
}
export default LoginPage