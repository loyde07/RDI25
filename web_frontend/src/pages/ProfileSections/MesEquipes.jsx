export default function MesEquipes() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-[#382c2c]">Mes Équipes</h2>

      <div className="space-y-6">
        {/* Une équipe */}
        <div className="bg-white rounded p-4 shadow">
          <h3 className="text-lg font-semibold text-[#382c2c]">Team Alpha</h3>
          <p className="text-[#382c2c]">Niveau moyen : Platine</p>
          <p className="text-[#382c2c]">Membres : Jean, Marc, Léo</p>
          <ul className="mt-2 list-disc pl-6 text-[#382c2c]">
            <li>Match gagné contre Team Bravo</li>
            <li>Match perdu contre Team Delta</li>
          </ul>
        </div>

        {/* Une autre équipe */}
        <div className="bg-white rounded p-4 shadow">
          <h3 className="text-lg font-semibold text-[#382c2c]">Team Omega</h3>
          <p className="text-[#382c2c]">Niveau moyen : Or</p>
          <p className="text-[#382c2c]">Membres : Alice, Bob, Claire</p>
          <ul className="mt-2 list-disc pl-6 text-[#382c2c]">
            <li>Match gagné contre Team Zeta</li>
            <li>Match perdu contre Team Alpha</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
