import { useEffect, useState } from "react";
import api from "../utils/api";
import OrderCard from "../components/OrderCard";
import LoadingSpinner from "../components/LoadingSpinner";

export default function OrdersSimple() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/restaurant-orders/");
      // Handle pagination
      const data = res.data.results || res.data;
      setOrders(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load orders");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.post(`/orders/${orderId}/update-status/`, { status: newStatus });
      // Update local state
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to update order");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-orange-600 mb-8">Live Orders</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-2xl font-semibold text-gray-600">No orders yet</p>
            <p className="text-gray-500 mt-2">Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600 font-semibold mb-4">{orders.length} active orders</p>
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} onStatusChange={handleStatusChange} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
