// src/components/FoodCard.jsx
import { useCart } from "../context/CartContext";

export default function FoodCard({ food }) {
  const { addToCart } = useCart();

  const handleAdd = () => {
    const token = localStorage.getItem("access");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    addToCart(food);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:scale-105 transition">
      <img
        src={`http://127.0.0.1:8000${food.image}`}
        className="w-full h-60 object-cover"
      />
      <div className="p-6">
        <h3 className="text-xl font-bold">{food.title}</h3>
        <p className="text-3xl font-bold text-green-600 mt-2">৳{food.price}</p>

        {food.is_available ? (
          <button
            onClick={handleAdd}
            className="mt-4 w-full bg-orange-500 text-white py-3 rounded-xl text-lg font-bold hover:bg-orange-600"
          >
            Add to Cart
          </button>
        ) : (
          <p className="text-red-600 font-bold mt-4 text-center">Sold Out</p>
        )}
      </div>
    </div>
  );
}
