import { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      if (roleFilter) {
        const response = await adminAPI.getUsersByRole(roleFilter);
        setUsers(response.data);
      } else {
        const response = await adminAPI.getUsers();
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = async (userId) => {
    try {
      await adminAPI.suspendUser(userId);
      fetchUsers();
    } catch (error) {
      console.error('Error suspending user:', error);
    }
  };

  const handleActivate = async (userId) => {
    try {
      await adminAPI.activateUser(userId);
      fetchUsers();
    } catch (error) {
      console.error('Error activating user:', error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Users Management</h1>

      <div className="mb-6">
        <label className="mr-4">Filter by Role:</label>
        <select 
          value={roleFilter} 
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 border rounded"
        >
          <option value="">All Users</option>
          <option value="customer">Customer</option>
          <option value="restaurant">Restaurant</option>
          <option value="delivery">Delivery Boy</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left">ID</th>
                <th className="border p-3 text-left">Name</th>
                <th className="border p-3 text-left">Email</th>
                <th className="border p-3 text-left">Phone</th>
                <th className="border p-3 text-left">Role</th>
                <th className="border p-3 text-left">Status</th>
                <th className="border p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border">
                  <td className="p-3">{user.id}</td>
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.phone}</td>
                  <td className="p-3"><span className="px-2 py-1 bg-blue-100 rounded">{user.role}</span></td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.is_active ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="p-3">
                    {user.is_active ? (
                      <button 
                        onClick={() => handleSuspend(user.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Suspend
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleActivate(user.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Activate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
