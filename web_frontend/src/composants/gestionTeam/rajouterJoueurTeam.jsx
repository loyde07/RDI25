import React, { useEffect,useState } from 'react';
import axios from 'axios';

const API = "http://localhost:5000"; // Remplace par ton URL d'API

function RajouterJoueur() {
    const [joueurs, setJoueurs] = useState([]);
    const [recherche, setRecherche] = useState('');
    const [resultats, setResultats] = useState([]);
 


    useEffect(() => {
        if (recherche.length === 0) {
          setResultats([]);
          return;
        }
      
        const fetchJoueurs = async () => {
          try {
            const res = await axios.get(`http://localhost:5000/api/joueurs?search=${recherche}`);
            setResultats(res.data.data);
            console.log(res.data.data);
            console.log("Recherche :", recherche);

          } catch (err) {
            console.error(err);
          }
        };
      
        fetchJoueurs();
      }, [recherche]);


  return (
    <div>
      <input
        type="text"
        placeholder="Rechercher un joueur par pseudo"
        value={recherche}
        onChange={(e) => setRecherche(e.target.value)}
        style={{
          padding: '10px',
          borderRadius: '5px',
          border: '1px solid #ccc',
          width: '100%',
          marginBottom: '10px'
        }}
      />

            {Array.isArray(resultats) && resultats.length > 0 && (
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {resultats.map(joueur => (
                <li key={joueur._id}>{joueur.pseudo}</li>
                ))}
            </ul>
            )}
    </div>
  );
}

export default RajouterJoueur;
