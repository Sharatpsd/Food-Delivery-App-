// src/pages/Orders.jsx
import { useEffect, useState } from "react";
import api from "../utils/api";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/orders/my-orders/").then((res) => setOrders(res.data));
  }, []);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">My Orders</h1>
      {orders.map(order => (
        <div key={order.id} className="bg-[#1b1f27] p-6 mb-6 rounded shadow">
          <p><strong>Order ID:</strong> {order.id}</p>
          <p><strong>Restaurant:</strong> {order.restaurant_name}</p>
          <p><strong>Total:</strong> à§³{order.total}</p>
          <p><strong>Status:</strong> 
            <span className={`ml-2 px-3 py-1 rounded-full text-white ${
              order.status === 'delivered' ? 'bg-orange-500' : 'bg-orange-500'
            }`}>
              {order.status}
            </span>
          </p>
        </div>
      ))}
    </div>
  );
}


