import axios from "../utils/axios";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const handleOrder = async () => {
    const restaurantId = cart[0].restaurant; // first item restaurant

    const items = cart.map((item) => ({
      food_id: item.id,
      quantity: item.quantity,
    }));

    try {
      const res = await axios.post("/orders/create/", {
        restaurant: restaurantId,
        items,
      });

      clearCart();
      navigate("/orders");

    } catch (err) {
      console.log(err);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold">Checkout</h2>
      <p>Total Amount: ৳ {totalPrice}</p>

      <button
        onClick={handleOrder}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
      >
        Place Order
      </button>
    </div>
  );
}
