import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Header from "./header.jsx"

function Home(){

  const navigate = useNavigate();




  const [locals, setLocals] = useState([]); //pour créer un tableau
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/locals");
      setLocals(response.data.data);
    } catch (error) {
      console.error("Erreur lors de la récupération :", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);



  return (
    <div style={{textAlign: 'center', padding: '50px'}}>
      <Header/>
      <h1>Home page RDI25</h1>
      <p>clique pour voir une photo drôle</p>
      <button onClick={() => navigate('/image')}>click </button>
      <h3>locaux </h3>
      <div>      
      {locals.length === 0 ? (
        <p>Aucun local trouvé.</p>
      ) : (
        <ul>
          {locals.map((local) => (
            <li key={local._id}>
              <strong>{local.nom}</strong> - Température Moyenne: {local.tempMoy}°C
            </li>
          ))}
        </ul>
      )}
    </div>
      
    </div>
  );
}

export default Home;