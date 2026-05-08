import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
} from "recharts";
import LoadingSpinner from "../components/LoadingSpinner";
import SmartImage from "../components/SmartImage";
import StatusBadge from "../components/StatusBadge";
import {
  formatCurrency,
  getPartnerRestaurantBundle,
  getRestaurantOrders,
} from "../utils/api";

const statusPalette = {
  pending: "#f59e0b",
  accepted: "#10b981",
  cooking: "#f97316",
  on_the_way: "#0ea5e9",
  delivered: "#8b5cf6",
  cancelled: "#ef4444",
};

export default function Dashboard() {
  const [bundle, setBundle] = useState({ user: null, restaurant: null, foods: [] });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const [restaurantBundle, orderData] = await Promise.all([
          getPartnerRestaurantBundle(),
          getRestaurantOrders(),
        ]);

        if (!mounted) return;
        setBundle(restaurantBundle);
        setOrders(orderData);
        setError("");
      } catch (err) {
        if (!mounted) return;
        setError(err.response?.data?.detail || "Could not load dashboard data.");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  const { restaurant, foods } = bundle;

  const metrics = useMemo(() => {
    const liveOrders = orders.filter((order) =>
      ["pending", "accepted", "cooking", "on_the_way"].includes(order.status)
    );
    const revenue = orders.reduce(
      (sum, order) => sum + Number(order.total || 0),
      0
    );
    const avgTicket = orders.length ? revenue / orders.length : 0;
    const categories = new Set(foods.map((food) => food.category).filter(Boolean));

    return {
      liveOrders: liveOrders.length,
      totalRevenue: revenue,
      avgTicket,
      menuItems: foods.length,
      categories: categories.size,
    };
  }, [foods, orders]);

  const statusData = useMemo(() => {
    const counts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).map(([status, count]) => ({
      name: status.replaceAll("_", " "),
      value: count,
      color: statusPalette[status] || "#94a3b8",
    }));
  }, [orders]);

  const menuTrendData = useMemo(
    () =>
      foods.slice(0, 6).map((food, index) => ({
        name: food.name.length > 14 ? `${food.name.slice(0, 14)}…` : food.name,
        price: Number(food.price || 0),
        slot: index + 1,
      })),
    [foods]
  );

  const recentOrders = orders.slice(0, 4);

  if (loading) {
    return <LoadingSpinner label="Preparing your command center..." />;
  }

  if (error) {
    return (
      <div className="rounded-[2rem] border border-red-500/20 bg-red-500/10 px-6 py-8 text-red-100">
        <h1 className="text-2xl font-bold">Dashboard unavailable</h1>
        <p className="mt-3 text-sm text-red-100/80">{error}</p>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="rounded-[2rem] border border-white/10 bg-[#131821]/90 px-6 py-10 text-center shadow-[0_22px_60px_rgba(0,0,0,0.25)]">
        <p className="text-xs uppercase tracking-[0.35em] text-orange-300">
          Bite Partner
        </p>
        <h1 className="mt-4 text-3xl font-black text-white">
          No active restaurant is linked to this account yet.
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-400">
          Ask an admin to connect your owner account with a restaurant profile.
          Once linked, this dashboard will automatically show orders, menu items,
          and performance insights.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-[2rem] border border-white/10 bg-[#131821]/95 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.28)]">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-orange-300/85">
            Live overview
          </p>
          <div className="mt-4 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">
                {restaurant.name}
              </h1>
              <p className="mt-3 text-sm leading-7 text-slate-400 sm:text-base">
                {restaurant.address || "Dhaka"}
                {restaurant.city ? `, ${restaurant.city}` : ""}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <span className="rounded-full border border-orange-400/20 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-100">
                  {restaurant.theme || "Restaurant"}
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-slate-200">
                  Rating {restaurant.rating || "New"}
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-slate-200">
                  {foods.length} menu items
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <SmartImage
                src={restaurant.logo || restaurant.logo_final || restaurant.logo_url}
                alt={restaurant.name}
                label={restaurant.name}
                className="h-24 w-24 rounded-[1.75rem] object-cover shadow-[0_18px_40px_rgba(0,0,0,0.25)] sm:h-28 sm:w-28"
                fallbackClassName="h-24 w-24 rounded-[1.75rem] shadow-[0_18px_40px_rgba(0,0,0,0.25)] sm:h-28 sm:w-28"
              />
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: "Live orders",
                value: metrics.liveOrders,
                tone: "from-orange-500 to-orange-600",
              },
              {
                label: "Revenue tracked",
                value: formatCurrency(metrics.totalRevenue),
                tone: "from-emerald-500 to-emerald-600",
              },
              {
                label: "Average ticket",
                value: formatCurrency(metrics.avgTicket),
                tone: "from-sky-500 to-sky-600",
              },
              {
                label: "Menu categories",
                value: metrics.categories,
                tone: "from-fuchsia-500 to-rose-500",
              },
            ].map((card) => (
              <div
                key={card.label}
                className={`rounded-[1.75rem] bg-gradient-to-br ${card.tone} p-5 shadow-[0_16px_35px_rgba(0,0,0,0.18)]`}
              >
                <p className="text-sm text-white/75">{card.label}</p>
                <p className="mt-4 text-3xl font-black text-white">{card.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-[#131821]/95 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.28)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-orange-300/85">
                Quick actions
              </p>
              <h2 className="mt-3 text-2xl font-black text-white">
                Operator shortcuts
              </h2>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <Link
              to="/orders"
              className="flex items-center justify-between rounded-[1.5rem] border border-orange-400/15 bg-orange-500/10 px-5 py-4 text-white transition hover:bg-orange-500/15"
            >
              <div>
                <p className="font-semibold">Review live orders</p>
                <p className="text-sm text-orange-100/75">
                  Move tickets through the kitchen pipeline
                </p>
              </div>
              <span className="text-2xl">\u2192</span>
            </Link>

            <Link
              to="/foods"
              className="flex items-center justify-between rounded-[1.5rem] border border-white/10 bg-white/[0.04] px-5 py-4 text-white transition hover:bg-white/[0.06]"
            >
              <div>
                <p className="font-semibold">Inspect menu catalog</p>
                <p className="text-sm text-slate-400">
                  Browse pricing, categories, and image coverage
                </p>
              </div>
              <span className="text-2xl">\u2192</span>
            </Link>
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
              Shift note
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              This panel auto-pulls real restaurant and order data from your
              linked owner account, so your team sees the same operational
              picture every time.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-white/10 bg-[#131821]/95 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.28)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-orange-300/85">
                Revenue cues
              </p>
              <h2 className="mt-3 text-2xl font-black text-white">
                Menu pricing snapshot
              </h2>
            </div>
          </div>

          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={menuTrendData}>
                <defs>
                  <linearGradient id="menuGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "#0f172a",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "16px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#fb923c"
                  strokeWidth={3}
                  fill="url(#menuGlow)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-[#131821]/95 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.28)]">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-orange-300/85">
            Order mix
          </p>
          <h2 className="mt-3 text-2xl font-black text-white">
            Status distribution
          </h2>

          <div className="mt-6 h-72">
            {statusData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={4}
                  >
                    {statusData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "#0f172a",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "16px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.03] text-sm text-slate-400">
                No order history yet.
              </div>
            )}
          </div>

          <div className="mt-3 space-y-2">
            {statusData.map((entry) => (
              <div
                key={entry.name}
                className="flex items-center justify-between rounded-2xl bg-white/[0.03] px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm capitalize text-slate-200">{entry.name}</span>
                </div>
                <span className="text-sm font-semibold text-white">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-[#131821]/95 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.28)]">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-orange-300/85">
              Recent orders
            </p>
            <h2 className="mt-3 text-2xl font-black text-white">
              Latest service queue
            </h2>
          </div>
          <Link
            to="/orders"
            className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.08]"
          >
            Open full board
          </Link>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          {recentOrders.length ? (
            recentOrders.map((order) => (
              <div
                key={order.id}
                className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-bold text-white">Order #{order.id}</p>
                    <p className="mt-1 text-sm text-slate-400">
                      {order.customer_name || "Guest customer"}
                    </p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-slate-400">
                    {order.items_detail?.length || 0} menu items
                  </span>
                  <span className="font-semibold text-orange-200">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.03] p-8 text-sm text-slate-400 xl:col-span-2">
              Orders will start appearing here once customers begin placing them.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
