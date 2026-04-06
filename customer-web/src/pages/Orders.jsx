import { useEffect, useState } from "react";
import api from "../utils/api";
import { logout } from "../utils/auth";

const STATUS_COLORS = {
  pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending" },
  accepted: { bg: "bg-blue-100", text: "text-blue-800", label: "Accepted" },
  cooking: { bg: "bg-purple-100", text: "text-purple-800", label: "Cooking" },
  on_the_way: { bg: "bg-indigo-100", text: "text-indigo-800", label: "On the Way" },
  delivered: { bg: "bg-green-100", text: "text-green-800", label: "Delivered" },
  cancelled: { bg: "bg-red-100", text: "text-red-800", label: "Cancelled" },
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/orders/customer-orders/");
      setOrders(res.data.results || res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        window.location.href = "/login";
        setError("Session expired. Please log in again.");
      } else if (err.message === "Network Error") {
        setError("Network error. Please check your connection.");
      } else {
        setError(
          err.response?.data?.detail ||
            err.message ||
            "Failed to load orders"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusDisplay = (status) => {
    return STATUS_COLORS[status] || STATUS_COLORS.pending;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">My Orders</h1>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 h-40 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">My Orders</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-red-800 font-semibold mb-2">Error</h2>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={fetchOrders}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">My Orders</h1>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            No Orders Yet
          </h2>
          <p className="text-gray-600 mb-6">
            You haven't placed any orders yet. Start browsing restaurants!
          </p>
          <a
            href="/"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded font-semibold"
          >
            Browse Restaurants
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">My Orders</h1>
      <div className="space-y-6">
        {orders.map((order) => {
          const statusDisplay = getStatusDisplay(order.status);
          return (
            <div
              key={order.id}
              className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
              {/* Order Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600">Order ID: {order.id}</p>
                    <p className="text-lg font-semibold text-gray-800 mt-1">
                      {order.restaurant_name}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                        statusDisplay.bg
                      } ${
                        statusDisplay.text
                      }`}
                    >
                      {statusDisplay.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              {order.items_detail && order.items_detail.length > 0 && (
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-3">Items</h3>
                  <ul className="space-y-2">
                    {order.items_detail.map((item, idx) => (
                      <li key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-700">
                          {item.food_name} x {item.quantity}
                        </span>
                        <span className="font-medium text-gray-800">
                          ${item.price}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Order Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    {order.assigned_delivery_boy && (
                      <p className="text-xs text-gray-600">Delivery Assigned</p>
                    )}
                  </div>
                  <p className="text-xl font-bold text-gray-900">
                    ${parseFloat(order.total).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

