import { useState } from "react";

export default function InspectionModes() {
  const [mode, setMode] = useState("home"); // État pour stocker la page actuelle

  // Composants des différentes pages
  const HomePage = () => (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">
        Choisissez un mode d'inspection
      </h1>
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setMode("autonomie")}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Autonomie
        </button>
        <button
          onClick={() => setMode("itineraire")}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Suivi d'itinéraire
        </button>
        <button
          onClick={() => setMode("controle")}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Contrôle
        </button>
      </div>
    </div>
  );

  const AutonomiePage = () => (
    <div className="text-center">
      <h1 className="text-2xl font-bold text-blue-500">Mode Autonomie</h1>
      <p>Le mode autonomie permet au robot de fonctionner sans intervention.</p>
      <button
        onClick={() => setMode("home")}
        className="mt-4 px-4 py-2 bg-gray-500 text-white rounded"
      >
        Retour
      </button>
    </div>
  );

  const ItinerairePage = () => (
    <div className="text-center">
      <h1 className="text-2xl font-bold text-green-500">
        Mode Suivi d'itinéraire
      </h1>
      <p>
        Le mode suivi d'itinéraire permet au robot de suivre un trajet défini.
      </p>
      <button
        onClick={() => setMode("home")}
        className="mt-4 px-4 py-2 bg-gray-500 text-white rounded"
      >
        Retour
      </button>
    </div>
  );

  const ControlePage = () => (
    <div className="text-center">
      <h1 className="text-2xl font-bold text-red-500">Mode Contrôle</h1>
      <p>
        Le mode contrôle permet une intervention humaine pour guider le robot.
      </p>
      <button
        onClick={() => setMode("home")}
        className="mt-4 px-4 py-2 bg-gray-500 text-white rounded"
      >
        Retour
      </button>
    </div>
  );

  return (
    <div className="p-6">
      {mode === "home" && <HomePage />}
      {mode === "autonomie" && <AutonomiePage />}
      {mode === "itineraire" && <ItinerairePage />}
      {mode === "controle" && <ControlePage />}
    </div>
  );
}
