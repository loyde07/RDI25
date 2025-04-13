import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AccountPage() {
    const [userData, setUserData] = useState({
        pseudo: '',
        email: '',
        niveau: '',
        logo: '',
        password: ''
    });
    const [newPassword, setNewPassword] = useState('');
    const [newPseudo, setNewPseudo] = useState('');
    const [newLogo, setNewLogo] = useState(null);

    useEffect(() => {
        // Récupérer les données de l'utilisateur connecté
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/user/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setUserData(res.data);
        };
        fetchUserData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('pseudo', newPseudo || userData.pseudo);
            formData.append('niveau', userData.niveau);
            formData.append('logo', newLogo);
            formData.append('password', newPassword || userData.password);

            const token = localStorage.getItem('token');

            const response = await axios.put('http://localhost:5000/api/user/update', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            

            alert('Informations mises à jour avec succès !');
            setUserData(response.data); // Met à jour l’état avec les nouvelles données de l'utilisateur
            console.log("Mise à jour réussie, données :", response.data);

        } catch (error) {
            console.error('Erreur lors de la mise à jour du profil', error);
            alert('Erreur lors de la mise à jour du profil.');
        }
    };

    return (
        <div>
            <h2>Modifier mon compte</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Pseudo :</label>
                    <input
                        type="text"
                        value={newPseudo}
                        onChange={(e) => setNewPseudo(e.target.value)}
                        placeholder={userData.pseudo}
                    />
                </div>
                <div>
                    <label>Mot de passe :</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Nouveau mot de passe"
                    />
                </div>
                <div>
                    <label>Logo :</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setNewLogo(e.target.files[0])}
                    />
                </div>
                <div>
                    <button type="submit">Mettre à jour</button>
                </div>
            </form>
        </div>
    );
}

export default AccountPage;
