import { useNavigate } from "react-router-dom";
import React from "react";
import "../header.css"; // n'oublie pas d'importer ton CSS

function Header() {
  const navigate = useNavigate();

  return (
    <header>
      {/* Bande 1 - Sponsors */}
      <div className="header-sponsors">
        
        <img src="https://www.aseus.be/sites/default/files/upload/aseus/EPHEC_Sport.png" alt="logo" className="logo-left" />
        
        <div className="sponsor-title">POWERED BY</div>
        <div className="sponsor-logos">
          {/*<img src="" alt="logo" />*/}
        </div>
      </div>

      {/* Bande 2 - Navigation + Réseaux */}
      <div className="header-nav">
        <div className="nav-buttons">
          <button onClick={() => navigate('')}>Team</button>
          <button onClick={() => navigate('')}>Score</button>
          <button onClick={() => navigate('/tournois')}>Tournament</button>
          <button onClick={() => navigate('')}>Register</button>
        </div>
        <div className="social-links">
          {/* Ajoute ici des icônes ex : */}
          <a href="#"><img src="/icons/facebook.svg" alt="FB" /></a>
          <a href="#"><img src="/icons/twitter.svg" alt="TW" /></a>
          <a href="#"><img src="/icons/instagram.svg" alt="IG" /></a>
        </div>
      </div>

      {/* Bande 3 - Écoles */}
      <div className="header-schools">
        {/* Ajoute ici les logos des écoles */}
        {/* Exemple : <img src="/logos/ephec.png" alt="EPHEC" /> */}
      </div>
    </header>
  );
}

export default Header;