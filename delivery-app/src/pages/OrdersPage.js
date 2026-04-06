import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { clearToken } from "../utils/auth";
import LoadingSpinner from "../components/LoadingSpinner";
import OrderCard from "../components/OrderCard";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [markingDelivered, setMarkingDelivered] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/delivery/assigned-orders/");
      // Handle paginated response
      const ordersData = response.data.results || response.data;
      setOrders(Array.isArray(ordersData) ? ordersData : []);
    } catch (err) {
      if (err.response?.status === 401) {
        clearToken();
        navigate("/login");
      } else {
        setError(
          err.response?.data?.detail ||
            err.message ||
            "Failed to fetch orders"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMarkDelivered = async (orderId) => {
    setMarkingDelivered(orderId);
    try {
      await api.post(`/delivery/complete-delivery/${orderId}/`, {});
      // Update local state
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: "delivered" } : order
        )
      );
      alert("Order marked as delivered!");
    } catch (err) {
      alert(
        err.response?.data?.detail ||
          err.message ||
          "Failed to mark order as delivered"
      );
    } finally {
      setMarkingDelivered(null);
    }
  };

  const handleLogout = () => {
    clearToken();
    navigate("/login");
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>My Deliveries</h1>
        <button style={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {orders.length === 0 ? (
        <div style={styles.emptyState}>
          <p>No orders assigned yet</p>
          <button style={styles.refreshButton} onClick={fetchOrders}>
            Refresh
          </button>
        </div>
      ) : (
        <div style={styles.ordersContainer}>
          <p style={styles.count}>{orders.length} orders assigned</p>
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onMarkDelivered={handleMarkDelivered}
              isLoading={markingDelivered === order.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  title: {
    margin: 0,
    fontSize: "28px",
    color: "#333",
  },
  logoutButton: {
    padding: "8px 16px",
    backgroundColor: "#ff6b35",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  error: {
    backgroundColor: "#fee",
    color: "#c33",
    padding: "12px",
    borderRadius: "4px",
    marginBottom: "20px",
    border: "1px solid #fcc",
  },
  emptyState: {
    textAlign: "center",
    padding: "40px 20px",
    backgroundColor: "white",
    borderRadius: "8px",
  },
  refreshButton: {
    padding: "10px 20px",
    backgroundColor: "#ff6b35",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "20px",
  },
  ordersContainer: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  count: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "16px",
  },
};

export default OrdersPage;
