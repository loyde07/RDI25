import React, { useEffect,useState } from 'react';
import axios from 'axios';
import {motion} from 'framer-motion'

const API = "http://localhost:5000"; // Remplace par ton URL d'API

function RajouterJoueur({ onJoueurSelectionne }) {
    const [recherche, setRecherche] = useState('');
    const [resultats, setResultats] = useState([]);
 


    useEffect(() => {
        if (recherche.length === 0) {
          setResultats([]);
          return;
        }
      
        const fetchJoueurs = async () => {
          try {
            const res = await axios.get(`${API}/api/joueurs/joueurs?search=${recherche}`);
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
                  <li
                    key={joueur._id}
                    onClick={() => onJoueurSelectionne(joueur)}
                    style={{
                      cursor: 'pointer',
                      padding: '10px',
                      border: '1px solid #ccc',
                      marginBottom: '5px',
                      borderRadius: '5px'
                    }}
                  >
                    {joueur.pseudo}
                  </li>
                ))}
              </ul>
            )}
    </div>
  );
}

export default RajouterJoueur;
