import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/RegisterForm.css'; // Assure-toi que le chemin d'importation correspond à l'emplacement de ton fichier CSS

import { useNavigate } from 'react-router-dom';


function RegisterForm() {
    const navigate = useNavigate();   
    const [ecoles, setEcoles] = useState([]);
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        password: '', 
        niveau: '',
        ecole_id: '',
    });;
    

    useEffect(() => {
        axios.get('http://localhost:5000/api/ecoles') // adapte l’URL si besoin
            .then((res) => {
                if (Array.isArray(res.data)) {
                    setEcoles(res.data);
                } else if (Array.isArray(res.data.ecoles)) {
                    setEcoles(res.data.ecoles);
                } else {
                    console.error("Format inattendu :", res.data);
                }
            })
            .catch((err) => console.error("Erreur lors du fetch des écoles :", err));
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('http://localhost:5000/api/user/register', formData)
            .then((res) => {
                alert("Joueur inscrit avec succès !");
                console.log(res.data);
                setFormData({
                    nom: '',
                    prenom: '',
                    email: '',
                    password: '',
                    niveau: '',
                    ecole_id: '',
                });
            })
            .catch((err) => {
                const msg = err.response?.data?.message || "Erreur inconnue.";
                alert(`Erreur à l'inscription : ${msg}`);
                console.error("Erreur à l'inscription :", err);
            });
            
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Inscription Joueur</h2>

            <input
                type="text"
                name="nom"
                placeholder="Nom"
                value={formData.nom}
                onChange={handleChange}
                required
            />
            <br />

            <input
                type="text"
                name="prenom"
                placeholder="Prénom"
                value={formData.prenom}
                onChange={handleChange}
                required
            />
            <br />

            <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
            />
            <br />
            <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={formData.password}
            onChange={handleChange}
            required
            />
            <br />
            <input
                type="number"
                name="niveau"
                placeholder="Niveau"
                value={formData.niveau}
                onChange={handleChange}
            />
            <br />

            <select
                name="ecole_id"
                value={formData.ecole_id}
                onChange={handleChange}
                required
            >
                <option value="">-- Sélectionnez une école --</option>
                {Array.isArray(ecoles) && ecoles.map((ecole) => (
                    <option key={ecole._id} value={ecole._id}>
                        {ecole.nom}
                    </option>
                ))}
            </select>
            <br />

            <button type="submit">S'inscrire</button>
            <button type="button" onClick={() => navigate('/login')}>Se connecter</button>
        </form>
    );
}

export default RegisterForm;
