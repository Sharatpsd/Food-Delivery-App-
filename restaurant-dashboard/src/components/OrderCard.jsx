export default function OrderCard({ order, onStatusChange }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold">Order #{order.id}</h3>
          <p className="text-gray-600">Customer: {order.customer_name || "N/A"}</p>
          <p className="font-semibold text-lg mt-1">৳{parseFloat(order.total).toFixed(2)}</p>
        </div>
        <span className="inline-block px-3 py-1 bg-gray-200 rounded-full text-sm font-semibold">
          {order.status.replace("_", " ").toUpperCase()}
        </span>
      </div>

      {/* Items List */}
      {order.items_detail && order.items_detail.length > 0 && (
        <div className="mb-4 text-sm text-gray-600">
          <strong>Items:</strong>
          <ul className="mt-1 ml-4">
            {order.items_detail.map((item, idx) => (
              <li key={idx}>
                • {item.food_name} x {item.quantity}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Status Update Buttons */}
      <div className="flex gap-2 flex-wrap">
        {order.status === "pending" && (
          <button
            onClick={() => onStatusChange(order.id, "accepted")}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-semibold transition"
          >
            Accept
          </button>
        )}
        {order.status === "accepted" && (
          <button
            onClick={() => onStatusChange(order.id, "cooking")}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded text-sm font-semibold transition"
          >
            Start Cooking
          </button>
        )}
        {order.status === "cooking" && (
          <button
            onClick={() => onStatusChange(order.id, "on_the_way")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-semibold transition"
          >
            Ready for Delivery
          </button>
        )}
        {order.status === "on_the_way" && (
          <button
            onClick={() => onStatusChange(order.id, "delivered")}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm font-semibold transition"
          >
            Mark Delivered
          </button>
        )}
      </div>
    </div>
  );
}
