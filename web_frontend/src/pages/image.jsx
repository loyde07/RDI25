import React from "react";
import { useNavigate } from "react-router-dom";

function Image(){
    const navigate = useNavigate();

    const imageUrl = "https://i.pinimg.com/736x/45/f4/52/45f452315f2e9f4ee7fc981a52a7943b.jpg"; // Remplacez par votre lien d'image


    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h1>Page </h1>
          <p>Ceci est la page "drole".</p>

          <img src={imageUrl} alt="Description de l'image" style={{ width: '300px', borderRadius: '8px' }} />

          <div style={{ marginTop: "20px" }}>
            <button onClick={() => navigate('/')}>Retour à l'Accueil</button>
            <br /><br />
            <button onClick={() => navigate('/team')}> Voir les équipes</button>
          </div>
        </div>
      );
    }

export default Image;