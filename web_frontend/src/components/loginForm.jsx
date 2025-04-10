import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/user/login', formData);
            localStorage.setItem('token', res.data.token); // Enregistre le token
            navigate('/compte'); // Redirige vers la page de compte
        } catch (err) {
            console.error("Erreur à la connexion :", err);
            alert("Email ou mot de passe incorrect.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Connexion</h2>
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
            <button type="submit">Se connecter</button>
            <br />
            <button type="button" onClick={() => navigate('/register')}>
                Pas encore inscrit ?
            </button>
        </form>
    );
}

export default LoginForm;
