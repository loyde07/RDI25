import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/Compte.css';  // Import du fichier CSS

import { useNavigate } from 'react-router-dom';

function Compte() {
    const [joueur, setJoueur] = useState(null);
    const [formData, setFormData] = useState({
        pseudo: '',
        password: '',
        niveau: ''
    });
    const [logoFile, setLogoFile] = useState(null);
    const [editing, setEditing] = useState(false); // pour afficher/masquer les champs modifiables
    const [showLogoInput, setShowLogoInput] = useState(false); // pour afficher/masquer l'input du logo
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('http://localhost:5000/api/user/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setJoueur(response.data);
            } catch (err) {
                console.error('Erreur lors du chargement du profil :', err);
            }
        };
        fetchProfile();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

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
        <div className="compte-container">
            {/* Header du profil */}
            <div className="profile-header">
            <div className="profile-image">
                {joueur.logo ? (
                    <img
                    src={`http://localhost:5000/uploads/logos/${joueur.logo}`}
                    alt="Logo"
                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    />
                ) : (
                    <img
                        src="/default-logo.png" // Image par défaut dans le dossier public
                        alt="Logo par défaut"
                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    />
                )}
            </div>

                <h2>Mon Compte</h2>
            </div>

            {/* Informations de l'utilisateur */}
            <div className="profile-info">
                <p><strong>Nom :</strong> {joueur.nom || 'Ajouter le nom'}</p>
                <p><strong>Prénom :</strong> {joueur.prenom || 'Ajouter le prénom'}</p>
                <p><strong>Email :</strong> {joueur.email || 'Ajouter l\'email'}</p>
                <p><strong>Niveau :</strong> {joueur.niveau || 'Ajouter le niveau'}</p>
                <p><strong>École :</strong> {joueur.ecole_id?.nom || 'Ajouter l\'école'}</p>
            </div>

            {/* Bouton de modification et formulaire */}
            <div>
                <button onClick={() => setEditing(!editing)}>
                    {editing ? 'Annuler la modification' : 'Modifier mon profil'}
                </button>
                {editing && (
                    <form onSubmit={handleSubmit}>
                        <h3>Modifier mon profil</h3>

                        <label>Pseudo : </label>
                        <input
                            type="text"
                            name="pseudo"
                            value={formData.pseudo || joueur.pseudo || joueur.nom}
                            onChange={handleChange}
                            placeholder={joueur.pseudo || joueur.nom}
                        />
                        <label>Mot de passe : </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <label>Niveau : </label>
                        <input
                            type="text"
                            name="niveau"
                            value={formData.niveau}
                            onChange={handleChange}
                        />
                        <label>Logo :</label>
                        <input type="file" name="logo" onChange={handleFileChange} />
                        <button type="submit">Mettre à jour</button>
                    </form>
                )}
            </div>

            <br />
            <button onClick={handleLogout}>Se déconnecter</button>
        </div>

    );
}

export default Compte;
