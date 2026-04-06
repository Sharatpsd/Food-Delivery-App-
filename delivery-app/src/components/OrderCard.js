import React from "react";

const OrderCard = ({ order, onMarkDelivered, isLoading }) => {
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h3 style={styles.orderId}>Order #{order.id}</h3>
        <span style={styles.status}>{order.status.toUpperCase()}</span>
      </div>

      <div style={styles.details}>
        <p>
          <strong>Customer:</strong> {order.customer_name}
        </p>
        <p>
          <strong>Restaurant:</strong> {order.restaurant_name}
        </p>
        <p>
          <strong>Total:</strong> ${parseFloat(order.total).toFixed(2)}
        </p>
      </div>

      <div style={styles.items}>
        <strong>Items:</strong>
        <ul style={styles.itemList}>
          {order.items_detail && order.items_detail.length > 0 ? (
            order.items_detail.map((item, idx) => (
              <li key={idx}>
                {item.food_name} x {item.quantity}
              </li>
            ))
          ) : (
            <li>No items</li>
          )}
        </ul>
      </div>

      {order.status !== "delivered" && order.status !== "cancelled" && (
        <button
          style={styles.button}
          onClick={() => onMarkDelivered(order.id)}
          disabled={isLoading}
        >
          {isLoading ? "Marking..." : "Mark as Delivered"}
        </button>
      )}
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "16px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
    borderBottom: "1px solid #eee",
    paddingBottom: "12px",
  },
  orderId: {
    margin: 0,
    fontSize: "18px",
  },
  status: {
    backgroundColor: "#ff6b35",
    color: "white",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  details: {
    marginBottom: "12px",
    fontSize: "14px",
  },
  items: {
    marginBottom: "12px",
    fontSize: "14px",
  },
  itemList: {
    paddingLeft: "20px",
    margin: "8px 0 0 0",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#ff6b35",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "12px",
  },
};

export default OrderCard;
