import React from 'react';

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  return (
    <div className="w-64 bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold mb-6">Admin Dashboard</h2>
      <ul>
        <li className="mb-2">
          <button
            onClick={() => setActiveTab('users')}
            className={`w-full text-left p-2 rounded ${activeTab === 'users' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
          >
            Utilisateurs
          </button>
        </li>
        <li className="mb-2">
          <button
            onClick={() => setActiveTab('tournaments')}
            className={`w-full text-left p-2 rounded ${activeTab === 'tournaments' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
          >
            Tournois
          </button>
        </li>
        <li className="mb-2">
          <button
            onClick={() => setActiveTab('create-tournament')}
            className={`w-full text-left p-2 rounded ${activeTab === 'create-tournament' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
          >
            Créer un tournoi
          </button>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;