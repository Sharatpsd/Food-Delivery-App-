import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

export default function Cart() {
  const {
    cart,
    increaseQty,
    decreaseQty,
    removeFromCart,
    totalPrice,
  } = useCart();

  if (cart.length === 0)
    return (
      <div className="p-5 text-center">
        <h2>Your cart is empty 😔</h2>
      </div>
    );

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-3">Your Cart</h2>

      {cart.map((item) => (
        <div
          key={item.id}
          className="flex justify-between items-center bg-white p-3 rounded shadow mb-3"
        >
          <div>
            <h3 className="font-semibold">{item.title}</h3>
            <p>৳ {item.price}</p>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => decreaseQty(item.id)} className="px-2 py-1 bg-gray-200">-</button>
            <span>{item.quantity}</span>
            <button onClick={() => increaseQty(item.id)} className="px-2 py-1 bg-gray-200">+</button>

            <button
              onClick={() => removeFromCart(item.id)}
              className="text-red-600 font-bold ml-5"
            >
              X
            </button>
          </div>
        </div>
      ))}

      <div className="text-right mt-4">
        <h2 className="text-lg font-bold">Total: ৳ {totalPrice}</h2>
        <Link to="/checkout">
          <button className="bg-blue-600 text-white px-4 py-2 rounded mt-3">
            Proceed to Checkout
          </button>
        </Link>
      </div>
    </div>
  );
}
