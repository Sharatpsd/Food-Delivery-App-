import { useCart } from "../context/CartContext";

export default function FoodCard({ food }) {
  const { addToCart } = useCart();

  return (
    <div className="bg-white shadow p-3 rounded">
      <img src={food.image} className="w-full h-40 object-cover rounded" />
      <h3 className="text-lg font-bold">{food.title}</h3>
      <p className="text-gray-600">৳ {food.price}</p>

      <button
        className="bg-green-600 text-white px-3 py-1 mt-2 rounded"
        onClick={() => addToCart(food)}
      >
        Add to Cart
      </button>
    </div>
  );
}
