// src/pages/Cart.jsx
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cart, updateQty, clearCart, total } = useCart();

  if (cart.length === 0) {
    return <div className="text-center text-2xl mt-20">Your cart is empty</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Your Cart</h1>
      {cart.map(item => (
        <div key={item.id} className="flex justify-between items-center bg-white p-4 mb-4 rounded shadow">
          <div>
            <h3 className="text-xl font-semibold">{item.title}</h3>
            <p>৳{item.price} × {item.qty}</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => updateQty(item.id, item.qty - 1)} className="px-3 py-1 bg-gray-300 rounded">-</button>
            <span className="text-xl">{item.qty}</span>
            <button onClick={() => updateQty(item.id, item.qty + 1)} className="px-3 py-1 bg-gray-300 rounded">+</button>
          </div>
        </div>
      ))}
      <div className="text-right text-2xl font-bold mt-8">
        Total: ৳{total}
      </div>
      <div className="mt-6 text-right">
        <Link to="/checkout" className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}