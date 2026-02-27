// src/pages/Orders.jsx
import { useEffect, useState } from "react";
import axios from "axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get("http://:8000/api/orders/my-orders/", {
      headers: { Authorization: `Bearer ${localStorage.getItem("access")}` }
    })
    .then(res => setOrders(res.data));
  }, []);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">My Orders</h1>
      {orders.map(order => (
        <div key={order.id} className="bg-white p-6 mb-6 rounded shadow">
          <p><strong>Order ID:</strong> {order.id}</p>
          <p><strong>Restaurant:</strong> {order.restaurant_name}</p>
          <p><strong>Total:</strong> ৳{order.total}</p>
          <p><strong>Status:</strong> 
            <span className={`ml-2 px-3 py-1 rounded-full text-white ${
              order.status === 'delivered' ? 'bg-green-500' : 'bg-orange-500'
            }`}>
              {order.status}
            </span>
          </p>
        </div>
      ))}
    </div>
  );
}