// src/pages/Home.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/restaurants/", {
      headers: { Authorization: `Bearer ${localStorage.getItem("access")}` }
    })
    .then(res => setRestaurants(res.data))
    .catch(() => alert("Failed to load restaurants"));
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-10">All Restaurants</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {restaurants.map(r => (
          <Link
            to={`/restaurant/${r.id}`}
            key={r.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition transform hover:-translate-y-2"
          >
            <img
              src={`http://127.0.0.1:8000${r.logo || '/placeholder.jpg'}`}
              alt={r.name}
              className="w-full h-56 object-cover"
            />
            <div className="p-5">
              <h3 className="text-xl font-bold">{r.name}</h3>
              <p className="text-gray-600 text-sm mt-1">{r.address}</p>
              <p className="text-yellow-600 font-semibold mt-2">Rating: {r.rating || 'New'}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}