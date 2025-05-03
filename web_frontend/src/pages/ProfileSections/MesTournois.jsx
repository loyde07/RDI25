export default function MesTournois() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-[#382c2c]">Mes Tournois</h2>
      <p className="text-[#382c2c] mb-2">Statistiques globales :</p>
      <ul className="list-disc pl-6 text-[#382c2c]">
        <li>Matchs joués : 12</li>
        <li>Matchs gagnés : 7</li>
        <li>Matchs perdus : 5</li>
      </ul>
      <h3 className="text-lg font-semibold mt-4 text-[#382c2c]">Détails des matchs :</h3>
      <ul className="mt-2 space-y-2">
        <li className="bg-white rounded p-3 shadow">
          <strong>Team Alpha</strong> vs <strong>Team Bravo</strong> — Gagné
        </li>
        <li className="bg-white rounded p-3 shadow">
          <strong>Team Alpha</strong> vs <strong>Team Delta</strong> — Perdu
        </li>
        {/* Autres matchs */}
      </ul>
    </div>
  );
}
