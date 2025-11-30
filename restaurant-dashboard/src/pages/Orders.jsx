// src/pages/Orders.jsx
import { useEffect, useState } from "react";
import axios from "axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/orders/restaurant-orders/", {
      headers: { Authorization: `Bearer ${localStorage.getItem("access")}` }
    })
    .then(res => setOrders(res.data));
  }, []);

  const updateStatus = async (orderId, status) => {
    await axios.patch(`http://127.0.0.1:8000/api/orders/${orderId}/update-status/`, 
      { status },
      { headers: { Authorization: `Bearer ${localStorage.getItem("access")}` } }
    );
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold mb-8">All Orders</h1>
      <div className="space-y-6">
        {orders.map(order => (
          <div key={order.id} className="bg-white p-6 rounded-xl shadow-lg">
            <p><strong>Order ID:</strong> {order.id}</p>
            <p><strong>Customer:</strong> {order.customer_name}</p>
            <p><strong>Total:</strong> ৳{order.total}</p>
            <p><strong>Status:</strong> 
              <span className={`ml-3 px-4 py-2 rounded-full text-white ${
                order.status === 'delivered' ? 'bg-green-500' : 
                order.status === 'cooking' ? 'bg-orange-500' : 'bg-blue-500'
              }`}>
                {order.status}
              </span>
            </p>
            <div className="mt-4 flex gap-3">
              {order.status === 'pending' && (
                <button onClick={() => updateStatus(order.id, 'accepted')} className="bg-green-600 text-white px-4 py-2 rounded">Accept</button>
              )}
              {order.status === 'accepted' && (
                <button onClick={() => updateStatus(order.id, 'cooking')} className="bg-orange-600 text-white px-4 py-2 rounded">Start Cooking</button>
              )}
              {order.status === 'cooking' && (
                <button onClick={() => updateStatus(order.id, 'on_the_way')} className="bg-blue-600 text-white px-4 py-2 rounded">On The Way</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}