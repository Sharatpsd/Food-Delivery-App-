// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getStats();
      setData(response.data);
    } catch (err) {
      console.error('Dashboard Error:', err);
      console.error('Error response:', err.response);
      const errorMsg = err.response?.status === 401 
        ? 'Unauthorized - Please login as admin'
        : err.response?.data?.detail || err.message || 'Failed to load dashboard data';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-center bg-gray-900 p-8 rounded-3xl">
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-xl"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const stats = data || {
    totalOrders: 1248,
    pendingOrders: 87,
    completedOrders: 984,
    totalUsers: 8734,
    totalRestaurants: 142,
    totalAgents: 89,
    todayRevenue: 45680,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400">Overview of your food delivery platform</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-900 rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Orders</p>
              <p className="text-4xl font-bold text-white mt-2">{stats.totalOrders}</p>
            </div>
            <span className="text-4xl opacity-80">📦</span>
          </div>
        </div>

        <div className="bg-gray-900 rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending Orders</p>
              <p className="text-4xl font-bold text-amber-400 mt-2">{stats.pendingOrders}</p>
            </div>
            <span className="text-4xl opacity-80">⏳</span>
          </div>
        </div>

        <div className="bg-gray-900 rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Users</p>
              <p className="text-4xl font-bold text-white mt-2">{stats.totalUsers}</p>
            </div>
            <span className="text-4xl opacity-80">👥</span>
          </div>
        </div>

        <div className="bg-gray-900 rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Today's Revenue</p>
              <p className="text-4xl font-bold text-emerald-400 mt-2">
                ৳{stats.todayRevenue?.toLocaleString()}
              </p>
            </div>
            <span className="text-4xl opacity-80">💰</span>
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 rounded-3xl p-6">
          <p className="text-gray-400 text-sm">Restaurants</p>
          <p className="text-5xl font-bold text-white mt-3">{stats.totalRestaurants}</p>
          <p className="text-emerald-500 text-sm mt-2">Active</p>
        </div>

        <div className="bg-gray-900 rounded-3xl p-6">
          <p className="text-gray-400 text-sm">Delivery Agents</p>
          <p className="text-5xl font-bold text-white mt-3">{stats.totalAgents}</p>
          <p className="text-emerald-500 text-sm mt-2">Online</p>
        </div>

        <div className="bg-gray-900 rounded-3xl p-6">
          <p className="text-gray-400 text-sm">Completed Orders</p>
          <p className="text-5xl font-bold text-white mt-3">{stats.completedOrders}</p>
          <p className="text-emerald-500 text-sm mt-2">This month</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-900 rounded-3xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
        <p className="text-gray-500 text-sm">No recent activity data available yet.</p>
      </div>
    </div>
  );
}