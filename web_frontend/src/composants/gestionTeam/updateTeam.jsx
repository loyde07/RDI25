import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API || "http://localhost:5000";

function UpdateTeam() {
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [teamData, setTeamData] = useState(null);
  const [joueurs, setJoueurs] = useState([]);
  const [joueursÀRetirer, setJoueursÀRetirer] = useState([]);


  const [form, setForm] = useState({
    nom: '',
    logo: '',
    joueurs: []
  });

  // 🔁 Charger toutes les équipes
  useEffect(() => {
    axios.get(`${API}/api/teams`)
      .then(res => setTeams(res.data.data || res.data)) // dépend de ton format
      .catch(err => console.error("Erreur chargement équipes :", err));
  }, []);

  // 📥 Charger l'équipe sélectionnée
  useEffect(() => {
    if (!selectedTeamId) return;

    const fetchDetails = async () => {
      try {
        const teamRes = await axios.get(`${API}/api/teams/${selectedTeamId}`);
        const joueursRes = await axios.get(`${API}/api/joueurs`);
        setTeamData(teamRes.data.data);
        setJoueurs(joueursRes.data);

        setForm({
          nom: teamRes.data.data.nom,
          logo: teamRes.data.data.logo,
          joueurs: teamRes.data.data.joueurs.map(j => j._id)
        });
      } catch (err) {
        console.error("Erreur chargement team ou joueurs :", err);
      }
    };

    fetchDetails();
  }, [selectedTeamId]);

  const handleUpdate = async (e) => {
    e.preventDefault();
  
    const nouvelleListe = form.joueurs.filter(id => !joueursÀRetirer.includes(id));
  
    try {
      await axios.patch(`${API}/api/teams/${selectedTeamId}`, {
        ...form,
        joueurs: nouvelleListe
      });
  
      alert("✅ Équipe mise à jour !");
      setJoueursÀRetirer([]);
    } catch (err) {
      console.error("Erreur modification :", err);
      alert("Erreur lors de la mise à jour");
    }
  };
  

  const toggleSuppression = (joueurId) => {
    setJoueursÀRetirer((prev) =>
      prev.includes(joueurId)
        ? prev.filter(id => id !== joueurId) // déjà marqué → on annule
        : [...prev, joueurId]                // sinon on le marque à retirer
    );
  };
  
  

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2>Modifier une équipe</h2>

      <label>Choisir une équipe :</label>
      <select
        value={selectedTeamId}
        onChange={(e) => setSelectedTeamId(e.target.value)}
        style={{ marginBottom: '20px', padding: '10px', width: '100%' }}
      >
        <option value="">-- Sélectionner --</option>
        {teams.map(team => (
          <option key={team._id} value={team._id}>
            {team.nom}
          </option>
        ))}
      </select>

      {teamData && (
        <form onSubmit={handleUpdate}>
          <label>Nom :</label>
          <input
            type="text"
            value={form.nom}
            onChange={(e) => setForm({ ...form, nom: e.target.value })}
          />

          <label>Logo (URL) :</label>
          <input
            type="text"
            value={form.logo}
            onChange={(e) => setForm({ ...form, logo: e.target.value })}
          />

          <label>Joueurs :</label>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h4>Membres de l’équipe :</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {joueurs
                .filter(j => form.joueurs.includes(j._id)) // joueurs déjà dans l’équipe
                .map(j => {
                const estMarqué = joueursÀRetirer.includes(j._id);
                return (
                    <li
                    key={j._id}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '8px',
                        opacity: estMarqué ? 0.5 : 1,
                        textDecoration: estMarqué ? 'line-through' : 'none'
                    }}
                    >
                    <span style={{ flex: 1 }}>
                        {j.prenom} {j.nom} — {j.email}
                    </span>
                    <button
                        type="button"
                        onClick={() => toggleSuppression(j._id)}
                        style={{
                        backgroundColor: estMarqué ? '#f39c12' : '#c0392b',
                        color: 'white',
                        border: 'none',
                        padding: '6px 10px',
                        borderRadius: '4px',
                        cursor: 'pointer'
                        }}
                    >
                        {estMarqué ? '↩️ Annuler' : '❌ Retirer'}
                    </button>
                    </li>
                );
                })}
            </ul>


          </div>

          <button type="submit" style={{ marginTop: '20px' }}>
            Enregistrer les modifications
          </button>
        </form>
      )}
    </div>
  );
}

export default UpdateTeam;
