import React, { useState } from 'react';
import CreationTeam from '../composants/gestionTeam/newTeam.jsx';
import RejoindreTeam from '../composants/gestionTeam/joinTeam.jsx';
import SupprimerTeam from '../composants/gestionTeam/deleteTeam.jsx';
import '../home.css';
import UpdateTeam from '../composants/gestionTeam/updateTeam.jsx';


function Home() {
  const [selectedAction, setSelectedAction] = useState(null);

  return (
    <div className="home-container">
      <h1 className="home-title">LAN Valorant</h1>

      {/* Image centrale de l'arène */}
      <img
        src="/aula.jpg"
        alt="Arène du tournoi"
        style={{ width: '80%', maxWidth: '800px', borderRadius: '12px', marginBottom: '40px' }}

      />

      {/* Section des prix */}
      <section className="prix-section">
        <h2> Prix à gagner</h2>
        <ul style={{ listStyle: 'none', padding: 0, fontSize: '18px' }}>
          <li> 1ère place : 500€ + Casques Gamer</li>
          <li> 2ème place : 250€ + Souris gaming</li>
          <li> 3ème place : Clavier mécanique RGB</li>
        </ul>
      </section>

      {/* Boutons d'action */}
      <div className="button-container">
        <button
          className={`home-button creation ${selectedAction === 'creation' ? 'active' : ''}`}

          onClick={() => setSelectedAction('creation')}
        >
           Créer une Team
        </button>

        <button
          onClick={() => setSelectedAction('join')}
          className={`home-button join ${selectedAction === 'join' ? 'active' : ''}`}

        >
           Rejoindre une Team
        </button>

        <button
          onClick={() => setSelectedAction('delete')}
          className={`home-button join ${selectedAction === 'delete' ? 'active' : ''}`}

        >
           Supprimer une Team
        </button>
        
        <button
          onClick={() => setSelectedAction('update')}
          className={`home-button join ${selectedAction === 'update' ? 'active' : ''}`}

        >
           update une Team
        </button>
      </div>
      <div id="action-container" className="action-container">      
      {selectedAction === 'creation' && <CreationTeam />}
      {selectedAction === 'join' && <RejoindreTeam />}
      {selectedAction === 'delete' && <SupprimerTeam /> }
      {selectedAction === 'update' && <UpdateTeam /> }
      </div>
    </div>
  );
}

export default Home;
