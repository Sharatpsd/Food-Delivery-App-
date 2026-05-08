import { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    fetchSummary();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getOrders({ status: statusFilter || undefined });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await adminAPI.getOrderSummary();
      setSummary(response.data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-blue-100 text-blue-800',
    cooking: 'bg-orange-100 text-orange-800',
    on_the_way: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Orders Management</h1>

      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded">
            <p className="text-gray-600">Total Orders</p>
            <p className="text-2xl font-bold">{summary.total}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded">
            <p className="text-gray-600">Pending</p>
            <p className="text-2xl font-bold">{summary.pending}</p>
          </div>
          <div className="bg-green-50 p-4 rounded">
            <p className="text-gray-600">Completed</p>
            <p className="text-2xl font-bold">{summary.completed}</p>
          </div>
          <div className="bg-red-50 p-4 rounded">
            <p className="text-gray-600">Cancelled</p>
            <p className="text-2xl font-bold">{summary.cancelled}</p>
          </div>
        </div>
      )}

      <div className="mb-6">
        <label className="mr-4">Filter by Status:</label>
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="cooking">Cooking</option>
          <option value="on_the_way">On The Way</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left">Order ID</th>
                <th className="border p-3 text-left">Customer</th>
                <th className="border p-3 text-left">Restaurant</th>
                <th className="border p-3 text-left">Total</th>
                <th className="border p-3 text-left">Status</th>
                <th className="border p-3 text-left">Delivery By</th>
                <th className="border p-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border hover:bg-gray-50">
                  <td className="p-3">#{order.id}</td>
                  <td className="p-3">
                    <div>
                      <p className="font-semibold">{order.customer_name}</p>
                      <p className="text-sm text-gray-600">{order.customer_email}</p>
                    </div>
                  </td>
                  <td className="p-3">{order.restaurant_name}</td>
                  <td className="p-3 font-semibold">৳{order.total}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-sm ${statusColors[order.status] || 'bg-gray-100'}`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-3">{order.delivery_boy_name || 'Not Assigned'}</td>
                  <td className="p-3 text-sm">{new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
