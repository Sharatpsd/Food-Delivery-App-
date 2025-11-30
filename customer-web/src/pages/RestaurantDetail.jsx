// src/pages/RestaurantDetail.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";

export default function RestaurantDetail() {
  const { id } = useParams();
  const [foods, setFoods] = useState([]);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/foods/?restaurant=${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("access")}` }
    })
    .then(res => setFoods(res.data));
  }, [id]);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <button onClick={() => navigate(-1)} className="mb-6 text-blue-600 font-semibold">
        ← Back
      </button>
      <h1 className="text-4xl font-bold mb-8 text-center">Menu</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {foods.map(food => (
          <div key={food.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
            <img
              src={`http://127.0.0.1:8000${food.image || '/placeholder.jpg'}`}
              alt={food.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold">{food.title}</h3>
              <p className="text-2xl font-bold text-green-600 mt-2">৳{food.price}</p>
              {food.is_available ? (
                <button
                  onClick={() => addToCart(food)}
                  className="mt-4 w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition"
                >
                  Add to Cart
                </button>
              ) : (
                <p className="text-red-500 font-semibold mt-4">Not Available</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}