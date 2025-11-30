// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/restaurants/my-restaurant/", {
      headers: { Authorization: `Bearer ${localStorage.getItem("access")}` }
    })
    .then(res => setRestaurant(res.data))
    .catch(() => alert("No restaurant found"));
  }, []);

  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Restaurant Dashboard</h1>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
          className="bg-red-600 text-white px-6 py-3 rounded-lg"
        >
          Logout
        </button>
      </div>

      {restaurant && (
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <img src={`http://127.0.0.1:8000${restaurant.logo}`} alt="" className="w-32 h-32 rounded-full mx-auto" />
          <h2 className="text-3xl font-bold text-center mt-4">{restaurant.name}</h2>
          <p className="text-center text-gray-600">{restaurant.address}</p>
          <Link
            to="/orders"
            className="block mt-8 text-center bg-green-600 text-white py-4 rounded-lg text-xl hover:bg-green-700"
          >
            View All Orders →
          </Link>
        </div>
      )}
    </div>
  );
}