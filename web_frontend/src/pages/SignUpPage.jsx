import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Loader, Star, GraduationCap } from "lucide-react"
import { useState, useEffect } from 'react'
import React from 'react'
import { toast } from 'react-hot-toast'

import { valorantRanks } from '../utils/valorantRanks'
import { useAuthStore } from '../store/authStore'
import { useEcoleStore } from '../store/ecoleStore'

import Select from '../components/CustomSelect'
import Input from '../components/Input'
import PasswordStrengthMeter from '../components/PasswordStrengthMeter'
import { validateSignup } from '../utils/validation/validationSignUp';

const SignUpPage = () => {

    const [lName, setLName] = useState('')
    const [fName, setFName] = useState('')
    const [pseudo, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [niveau, setNiveau] = useState('')
    const [ecole_id, setEcole] = useState(null);
    const [password, setPassword] = useState('')
    const [localError, setLocalError] = useState('')

    const navigate = useNavigate()

    const { ecoles, fetchEcoles } = useEcoleStore();
    const { signup, error, isLoading } = useAuthStore();

    useEffect(() => {
        fetchEcoles();
    }, []);

    const handleSignUp = async (e) => {
        e.preventDefault();

        const formData = { lName, fName, pseudo, ecole_id, niveau, email, password };
        const errors = validateSignup(formData);

        if (Object.keys(errors).length > 0) {
            const firstError = errors.global || Object.values(errors)[0];
            toast.error(firstError);
            setLocalError(firstError);
            return;
        }

        setLocalError('');

        try {
            await signup(formData.lName.trim(), formData.fName.trim(), formData.pseudo.trim(), formData.ecole_id.value, formData.niveau, formData.email.trim(), formData.password);
            navigate("/profile");
        } catch (error) {
            const message = error?.response?.data?.message || error.message || 'Une erreur est survenue';
            toast.error(message);
        }
    };


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
                    Créer Compte
                </h2>

                <form onSubmit={handleSignUp}>
                    <Input
                        icon={User}
                        type='text'
                        placeholder='Nom'
                        value={lName}
                        onChange={(e) => setLName(e.target.value)}
                    />
                    <Input
                        icon={User}
                        type='text'
                        placeholder='Prenom'
                        value={fName}
                        onChange={(e) => setFName(e.target.value)}
                    />
                    <Input
                        icon={User}
                        type='userName'
                        placeholder='Pseudo'
                        value={pseudo}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                    <Select
                        icon={GraduationCap}
                        options={ecoles.map(ecole => ({ label: ecole.nom, value: ecole._id }))}
                        value={ecole_id}
                        onChange={(option) => setEcole(option)}
                        placeholder="École"
                        data-testid="ecole-select"
                    />
                    <Select
                        icon={Star}
                        options={valorantRanks}
                        value={valorantRanks.find((option) => option.value === niveau)}
                        onChange={(option) => setNiveau(option.value)}
                        placeholder="Niveau"
                        data-testid="niveau-select"
                    />
                    <Input
                        icon={Mail}
                        type='text'
                        placeholder='Adresse mail'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onInvalid={(e) => e.preventDefault()}
                    />
                    <Input
                        icon={Lock}
                        type='password'
                        placeholder='Mot de passe'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {(localError || error) && (<p className="text-red-500 font-semibold mt-2"> {localError || error}</p>)}
                    <PasswordStrengthMeter password={password} />

                    <motion.button
                        className='mt-5 w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white 
						font-bold rounded-lg shadow-lg hover:from-blue-600
						hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
						 focus:ring-offset-gray-900 transition duration-200'
                        whileHover={{ scale: 1.02 }}
                        whileTop={{ scale: 0.98 }}
                        type='submit'
                        disabled={isLoading}
                        data-testid="submit-button"
                    >
                        {isLoading ? <Loader data-testid="loader" className='animate-spin mx-auto' size={24} /> : "S'inscrire"}
                    </motion.button>
                </form>
            </div>
            <div className='px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center'>
                <p className='text-sm text-gray-400'>
                    Déja inscrit?{" "}
                    <Link to={"/login"} className='text-blue-400 hover:underline'>
                        Se Connecter
                    </Link>
                </p>
            </div>
        </motion.div>
    )
}
export default SignUpPage