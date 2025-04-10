import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Compte() {
    const [joueur, setJoueur] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            console.log("Token récupéré :", token);
    
            if (!token) {
                navigate('/login');
                return;
            }
    
            try {
                const res = await axios.get('http://localhost:5000/api/user/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log("Réponse serveur :", res.data);
                setJoueur(res.data);
            } catch (err) {
                console.error("Erreur lors de la récupération du profil :", err);
                localStorage.removeItem('token');
                navigate('/login');
            }
        };
    
        fetchData();
    }, [navigate]);
    

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const [formData, setFormData] = useState({
        pseudo: '',
        password: '',
        niveau: ''
    });
    const [logoFile, setLogoFile] = useState(null);
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const handleFileChange = (e) => {
        setLogoFile(e.target.files[0]);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const form = new FormData();
    
        form.append('pseudo', formData.pseudo);
        form.append('password', formData.password);
        form.append('niveau', formData.niveau);
        if (logoFile) {
            form.append('logo', logoFile);
        }
    
        try {
            const res = await axios.put('http://localhost:5000/api/user/update', form, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Profil mis à jour !');
            setJoueur(res.data); // actualise les infos affichées
        } catch (err) {
            console.error('Erreur lors de la mise à jour :', err);
            alert('Erreur lors de la mise à jour');
        }
    };
    

    if (!joueur) return <p>Chargement du profil...</p>;

    return (
        <div>
            <h2>Mon Compte</h2>
            <p><strong>Nom :</strong> {joueur.nom}</p>
            <p><strong>Prénom :</strong> {joueur.prenom}</p>
            <p><strong>Email :</strong> {joueur.email}</p>
            <p><strong>Niveau :</strong> {joueur.niveau}</p>
            <p><strong>École :</strong> {joueur.ecole_id?.nom || 'Non défini'}</p>

            <form onSubmit={handleSubmit}>
                <h3>Modifier mon profil</h3>

                <label>Pseudo : </label>
                <input type="text" name="pseudo" value={formData.pseudo} onChange={handleChange} /><br />

                <label>Mot de passe : </label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} /><br />

                <label>Niveau : </label>
                <input type="text" name="niveau" value={formData.niveau} onChange={handleChange} /><br />

                <label>Logo : </label>
                <input type="file" name="logo" onChange={handleFileChange} /><br />

                <button type="submit">Mettre à jour</button>
            </form>

            <br />
            <button onClick={handleLogout}>Se déconnecter</button>
        </div>
    );
}

export default Compte;
