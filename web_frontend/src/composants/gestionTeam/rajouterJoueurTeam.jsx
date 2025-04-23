import React, { useState } from 'react';
import axios from 'axios';

const API = "http://localhost:5000"; // Remplace par ton URL d'API

function RajouterJoueur() {
  const [joueur, setJoueur] = useState(null);
  const [pseudo, setPseudo] = useState(""); // Remplace par le pseudo souhaité ou dynamique
  const [erreur, setErreur] = useState('');
  


  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`${API}/api/joueurs/${pseudo}`);
      setJoueur(res.data.data);
      setErreur('');
    } catch (err) {
      setJoueur(null);
      setErreur("Joueur non trouvé.");
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px', fontFamily: 'Arial' }}>
      <form  style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Entrez un pseudo"
          value={pseudo}
          onChange={(e) => setPseudo(e.target.value)}
          style={{
            padding: '10px',
            borderRadius: '6px',
            border: '2px solid #8d695d',
            marginRight: '10px',
            width: '250px'
          }}
        />
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: '#8d695d',
            color: 'white',
            cursor: 'pointer'
          }}

          onClick={handleSearch}
        >
          Rechercher
        </button>
      </form>

      {erreur && <p style={{ color: '#52130c' }}>{erreur}</p>}

      {joueur && (
        <div style={{
          backgroundColor: '#e9d9d9',
          padding: '20px',
          borderRadius: '10px',
          border: '2px solid #8f8360',
          maxWidth: '400px',
          margin: '0 auto'
        }}>
          <h2 style={{ color: '#382c2c' }}>{joueur.pseudo}</h2>
          <p style={{ color: '#382c2c' }}>Email : {joueur.email}</p>
          {/* Ajoute ici d'autres infos si nécessaire */}
        </div>
      )}
    </div>
  );
}

export default RajouterJoueur;
