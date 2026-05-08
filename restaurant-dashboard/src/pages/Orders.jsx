import { useEffect, useMemo, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import OrderCard from "../components/OrderCard";
import {
  formatCurrency,
  getRestaurantOrders,
  updateRestaurantOrderStatus,
} from "../utils/api";

const statusOptions = [
  { label: "All orders", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Accepted", value: "accepted" },
  { label: "Cooking", value: "cooking" },
  { label: "On the way", value: "on_the_way" },
  { label: "Delivered", value: "delivered" },
];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [busyOrderId, setBusyOrderId] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getRestaurantOrders();
        setOrders(data);
        setError("");
        setLastUpdated(new Date());
      } catch (err) {
        setError(err.response?.data?.detail || "Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (orderId, status) => {
    setBusyOrderId(orderId);
    try {
      await updateRestaurantOrderStatus(orderId, status);
      setOrders((current) =>
        current.map((order) =>
          order.id === orderId ? { ...order, status } : order
        )
      );
      setLastUpdated(new Date());
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to update order status.");
    } finally {
      setBusyOrderId(null);
    }
  };

  const filteredOrders = useMemo(() => {
    const lowerQuery = query.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;
      const haystack = [
        order.id,
        order.customer_name,
        order.contact_phone,
        order.delivery_address,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchesQuery = !lowerQuery || haystack.includes(lowerQuery);
      return matchesStatus && matchesQuery;
    });
  }, [orders, query, statusFilter]);

  const summary = useMemo(() => {
    const live = orders.filter((order) =>
      ["pending", "accepted", "cooking", "on_the_way"].includes(order.status)
    );
    const delivered = orders.filter((order) => order.status === "delivered");
    return {
      total: orders.length,
      live: live.length,
      delivered: delivered.length,
      revenue: orders.reduce((sum, order) => sum + Number(order.total || 0), 0),
    };
  }, [orders]);

  if (loading) {
    return <LoadingSpinner label="Loading your live order board..." />;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-white/10 bg-[#131821]/95 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.28)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-orange-300/85">
              Operations board
            </p>
            <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
              Live kitchen and delivery queue
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
              Keep every ticket moving from acceptance to delivery with one
              premium workflow. This view refreshes automatically.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-300">
            Last synced{" "}
            <span className="font-semibold text-white">
              {lastUpdated ? lastUpdated.toLocaleTimeString() : "--"}
            </span>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Total orders", value: summary.total, tone: "from-slate-700 to-slate-800" },
            { label: "Live queue", value: summary.live, tone: "from-orange-500 to-orange-600" },
            { label: "Delivered", value: summary.delivered, tone: "from-emerald-500 to-emerald-600" },
            { label: "Tracked revenue", value: formatCurrency(summary.revenue), tone: "from-sky-500 to-sky-600" },
          ].map((card) => (
            <div
              key={card.label}
              className={`rounded-[1.6rem] bg-gradient-to-br ${card.tone} p-5`}
            >
              <p className="text-sm text-white/75">{card.label}</p>
              <p className="mt-4 text-3xl font-black text-white">{card.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-[#131821]/95 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.28)]">
        <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
          <label className="block">
            <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
              Search by order, customer or phone
            </span>
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search order #, customer, address..."
              className="w-full rounded-2xl border border-white/10 bg-[#0d1117] px-4 py-3 text-white placeholder:text-slate-500 focus:border-orange-400/40 focus:outline-none"
            />
          </label>

          <label className="block">
            <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
              Filter by status
            </span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[#0d1117] px-4 py-3 text-white focus:border-orange-400/40 focus:outline-none"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {error && (
        <div className="rounded-[1.6rem] border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-100">
          {error}
        </div>
      )}

      <section className="space-y-5">
        {filteredOrders.length ? (
          filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              busy={busyOrderId === order.id}
              onStatusChange={handleStatusChange}
            />
          ))
        ) : (
          <div className="rounded-[2rem] border border-dashed border-white/10 bg-[#131821]/80 px-6 py-12 text-center text-slate-400">
            No orders match your current filters.
          </div>
        )}
      </section>
    </div>
  );
}
