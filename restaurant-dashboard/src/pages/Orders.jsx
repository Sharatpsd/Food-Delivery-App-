import { useEffect, useState } from "react";
import axios from "axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // Auto refresh every 10 sec
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = () => {
    const token = localStorage.getItem("access");
    axios
      .get("http://127.0.0.1:8000/api/orders/restaurant-orders/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const updateStatus = async (orderId, status) => {
    const token = localStorage.getItem("access");
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/orders/${orderId}/update-status/`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered": return "bg-green-500";
      case "on_the_way": return "bg-blue-500";
      case "cooking": return "bg-orange-500";
      case "accepted": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  if (loading) return <div className="p-10 text-3xl text-center">Loading Orders...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-5xl font-extrabold text-center mb-10 text-orange-600">Live Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center text-2xl text-gray-600 mt-20">No orders yet. Relax!</div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-3xl shadow-2xl p-8 border-l-8 border-orange-500">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold">Order #{order.id}</h3>
                  <p className="text-lg text-gray-600">Customer: {order.customer_name || "Guest"}</p>
                  <p className="text-xl font-semibold mt-2">Total: ৳{order.total}</p>
                </div>
                <span className={`px-6 py-3 rounded-full text-white text-lg font-bold ${getStatusColor(order.status)}`}>
                  {order.status.replace("_", " ").toUpperCase()}
                </span>
              </div>

              <div className="flex flex-wrap gap-4">
                {order.status === "pending" && (
                  <button onClick={() => updateStatus(order.id, "accepted")} className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition">
                    Accept Order
                  </button>
                )}
                {order.status === "accepted" && (
                  <button onClick={() => updateStatus(order.id, "cooking")} className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition">
                    Start Cooking
                  </button>
                )}
                {order.status === "cooking" && (
                  <button onClick={() => updateStatus(order.id, "on_the_way")} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition">
                    Out for Delivery
                  </button>
                )}
                {order.status === "on_the_way" && (
                  <button onClick={() => updateStatus(order.id, "delivered")} className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition">
                    Mark as Delivered
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}