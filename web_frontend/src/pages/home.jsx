
import React, { useState } from 'react';



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

    </div>
  );
}

export default Home;
