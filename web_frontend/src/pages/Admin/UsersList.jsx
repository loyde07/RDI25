import React, { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import useUserStore from '../../store/userStore';

const UsersList = () => {
  const { 
    users, 
    loading, 
    error, 
    fetchUsers, 
    updateUser, 
    deleteUser 
  } = useUserStore();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await updateUser(userId, { droit: newRole });
    } catch (err) {
      console.error('Error updating user role:', err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await deleteUser(userId);
      } catch (err) {
        console.error('Error deleting user:', err);
      }
    }
  };

  if (loading) return <div className="text-center py-8">Chargement...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Liste des Utilisateurs</h2>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Nom complet</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Rôle</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="py-3 px-4">{`${user.lName} ${user.fName}`}</td>
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4">
                  <select
                    value={user.droit || 'user'}
                    onChange={(e) => handleUpdateRole(user._id, e.target.value)}
                    className="border rounded p-1 bg-white"
                  >
                    <option value="user">Utilisateur</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="py-3 px-4 space-x-2">
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersList;