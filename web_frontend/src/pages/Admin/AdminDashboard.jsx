import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import UsersList from './UsersList';
import TournamentsList from './TournamentList';
import CreateTournament from './CreateTournament';
import { useAuthStore } from "../../store/authStore";

const AdminDashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState('users');

  useEffect(() => {
    if (!user || user.droit !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user || user.droit !== 'admin') {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 p-8 overflow-auto">
        {activeTab === 'users' && <UsersList />}
        {activeTab === 'tournaments' && <TournamentsList />}
        {activeTab === 'create-tournament' && <CreateTournament />}
      </div>
    </div>
  );
};

export default AdminDashboard;