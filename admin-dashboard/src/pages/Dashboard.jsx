import { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getStats();
      setStats(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;
  if (!stats) return <div className="p-8">No data</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Users" value={stats.total_users} />
        <StatCard title="Customers" value={stats.total_customers} />
        <StatCard title="Restaurants" value={stats.total_restaurants} />
        <StatCard title="Delivery Agents" value={stats.total_delivery_agents} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Orders" value={stats.total_orders} />
        <StatCard title="Pending Orders" value={stats.pending_orders} className="bg-yellow-50" />
        <StatCard title="Completed Orders" value={stats.completed_orders} className="bg-green-50" />
        <StatCard title="Total Revenue" value={`৳${stats.total_revenue.toFixed(2)}`} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Pending Restaurants" value={stats.pending_restaurant_requests} />
        <StatCard title="Pending Delivery Agents" value={stats.pending_delivery_approvals} />
        <StatCard title="Avg Order Value" value={`৳${stats.avg_order_value.toFixed(2)}`} />
        <StatCard title="Today's Orders" value={stats.daily_orders} className="bg-blue-50" />
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Weekly Revenue: ৳{stats.weekly_revenue.toFixed(2)}</h2>
      </div>
    </div>
  );
}

function StatCard({ title, value, className = 'bg-blue-50' }) {
  return (
    <div className={`p-6 rounded-lg shadow ${className}`}>
      <h3 className="text-gray-600 text-sm font-semibold">{title}</h3>
      <p className="text-3xl font-bold mt-2 text-gray-900">{value}</p>
    </div>
  );
}
