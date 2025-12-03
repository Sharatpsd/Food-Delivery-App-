import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    axios
      .get("http://127.0.0.1:8000/api/restaurants/my/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setRestaurant(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching restaurant:", err);
        if (err.response?.status === 404 || err.response?.status === 401) {
          localStorage.clear();
          window.location.href = "/login";
        }
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-3xl font-bold text-orange-600">Loading Dashboard...</div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-2xl text-red-600 font-semibold">No restaurant found. Contact admin.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pt-20 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-3xl shadow-2xl p-10 text-center mb-10">
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
            Welcome, {restaurant.name}!
          </h1>
          <p className="text-xl text-gray-600 mt-4">Manage your restaurant with ease</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-10 rounded-3xl shadow-2xl transform hover:scale-105 transition">
            <h2 className="text-5xl font-bold">৳48,500</h2>
            <p className="text-xl mt-3 opacity-90">Today's Earnings</p>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white p-10 rounded-3xl shadow-2xl transform hover:scale-105 transition">
            <h2 className="text-5xl font-bold">67</h2>
            <p className="text-xl mt-3 opacity-90">Total Orders Today</p>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-10 rounded-3xl shadow-2xl transform hover:scale-105 transition">
            <h2 className="text-5xl font-bold">4.8 ★</h2>
            <p className="text-xl mt-3 opacity-90">Customer Rating</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <Link to="/foods" className="bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition text-center border-4 border-orange-100">
            <div className="text-7xl mb-4">Pizza</div>
            <h3 className="text-2xl font-bold text-gray-800">Manage Menu</h3>
          </Link>
          <Link to="/orders" className="bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition text-center border-4 border-blue-100">
            <div className="text-7xl mb-4">Shopping Cart</div>
            <h3 className="text-2xl font-bold text-gray-800">View Orders</h3>
          </Link>
          <div className="bg-white p-10 rounded-3xl shadow-xl text-center border-4 border-purple-100 cursor-not-allowed opacity-75">
            <div className="text-7xl mb-4">Chart</div>
            <h3 className="text-2xl font-bold text-gray-800">Analytics</h3>
          </div>
          <div className="bg-white p-10 rounded-3xl shadow-xl text-center border-4 border-gray-200 cursor-not-allowed opacity-75">
            <div className="text-7xl mb-4">Settings</div>
            <h3 className="text-2xl font-bold text-gray-800">Settings</h3>
          </div>
        </div>

        {/* Restaurant Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-12 flex flex-col md:flex-row items-center gap-12">
          <img
            src={`http://127.0.0.1:8000${restaurant.logo}`}
            alt={restaurant.name}
            className="w-64 h-64 rounded-full object-cover border-8 border-orange-100 shadow-2xl"
            onError={(e) => e.target.src = "https://via.placeholder.com/300?text=No+Logo"}
          />
          <div className="text-center md:text-left">
            <h2 className="text-5xl font-extrabold text-gray-800 mb-4">{restaurant.name}</h2>
            <p className="text-2xl text-gray-600 mb-6">{restaurant.address}</p>
            <div className="flex items-center justify-center md:justify-start gap-4 text-3xl">
              <span className="text-yellow-500">Star</span>
              <span className="font-bold">{restaurant.rating || "New"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}