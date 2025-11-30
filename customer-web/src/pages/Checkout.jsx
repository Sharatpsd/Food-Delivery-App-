// src/pages/Checkout.jsx
import { useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const [address] = useState("Dhaka"); // পরে ইউজার থেকে নিবে
  const navigate = useNavigate();

  const handleCheckout = async () => {
    const items = cart.map(item => ({
      food_id: item.id,
      quantity: item.qty
    }));

    try {
      await axios.post("http://127.0.0.1:8000/api/orders/create/", {
        restaurant: cart[0].restaurant, // সব আইটেম একই রেস্টুরেন্ট থেকে
        items
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` }
      });
      clearCart();
      alert("Order placed successfully!");
      navigate("/orders");
    } catch (err) {
      alert("Order failed");
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Checkout</h1>
      <div className="bg-white p-6 rounded shadow">
        <p className="text-xl mb-4">Total Amount: ৳{total}</p>
        <p className="mb-6">Delivery Address: {address}</p>
        <button
          onClick={handleCheckout}
          className="w-full bg-green-600 text-white py-4 rounded-lg text-xl hover:bg-green-700"
        >
          Confirm Order
        </button>
      </div>
    </div>
  );
}