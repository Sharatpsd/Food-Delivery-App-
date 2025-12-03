// src/components/FoodCard.jsx
import { useCart } from "../context/CartContext";

export default function FoodCard({ item }) {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-xl shadow p-3">
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-40 object-cover rounded-lg"
      />
      <h2 className="text-lg font-semibold mt-2">{item.name}</h2>
      <p className="text-gray-600 text-sm">{item.description}</p>
      <p className="font-bold mt-1">৳ {item.price}</p>

      <button
        onClick={() => addToCart(item)}
        className="w-full bg-orange-500 text-white py-2 rounded-lg mt-3"
      >
        Add to cart
      </button>
    </div>
  );
}
