import { useNavigate } from "react-router-dom";
import React from "react";
import { Facebook, Instagram, Twitter } from "lucide-react";

function Header({ className = "" }) {
  const navigate = useNavigate();

  return (
    <header className={`bg-gray-900 text-white shadow-lg py-4 px-6 border-b border-gray-800 ${className}`}>
      {/* Ligne 1 - Sponsors */}
      <div className="flex items-center justify-between mb-3">
        <img
          src="https://www.aseus.be/sites/default/files/upload/aseus/EPHEC_Sport.png"
          alt="logoEphec"
          className="w-28 object-contain"
        />
        <div className="text-sm text-gray-400">POWERED BY</div>
        <div className="flex gap-4">
          {/* Ajouter logos sponsors ici si disponibles */}
        </div>
      </div>

      {/* Ligne 2 - Navigation */}
      <div className="flex gap-4 text-sm font-semibold">
          {[
            { name: "Home", path: "/" },
            { name: "Team", path: "/team" },
            { name: "Gestion", path: "/gestion" },
            { name: "Tournament", path: "/tournois" },
            { name: "Login", path: "/login" },
          ].map(({ name, path }) => (
            <button
              key={name}
              onClick={() => navigate(path)}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-md shadow-md hover:from-blue-600 hover:to-indigo-700 transition duration-300"
            >
              {name}
            </button>
          ))}

          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 border border-indigo-500 text-indigo-400 hover:bg-indigo-600 hover:text-white transition duration-300 rounded-md"
          >
            Profil
          </button>
        </div>


        <div className="flex gap-3">
          <a href="#"><Facebook className="w-5 h-5 hover:text-blue-500 transition" /></a>
          <a href="#"><Twitter className="w-5 h-5 hover:text-sky-400 transition" /></a>
          <a href="#"><Instagram className="w-5 h-5 hover:text-pink-500 transition" /></a>
        </div>
      

      {/* Ligne 3 - Écoles (placeholder) */}
      <div className="mt-4 border-t border-gray-800 pt-2 text-center text-sm text-gray-500">
        {/* Ajouter logos écoles ici si nécessaire */}
      </div>
    </header>
  );
}

export default Header;
