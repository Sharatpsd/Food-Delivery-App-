import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/token/", {
        username: username.trim(),
        password,
      });

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      navigate("/", { replace: true });
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Wrong username or password.");
      } else {
        setError("Server error. Try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b0d12] px-4 py-10 text-white sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(249,115,22,0.18),transparent_25%),radial-gradient(circle_at_85%_15%,rgba(239,68,68,0.14),transparent_20%),radial-gradient(circle_at_bottom_right,rgba(251,146,60,0.12),transparent_26%)]" />

      <div className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="hidden rounded-[2.5rem] border border-white/10 bg-[#12161d]/90 p-10 shadow-[0_28px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl lg:block">
          <p className="text-xs font-semibold uppercase tracking-[0.38em] text-orange-300/85">
            Bite Partner
          </p>
          <h1 className="mt-5 text-5xl font-black leading-tight">
            Run your restaurant
            <span className="block bg-gradient-to-r from-orange-300 to-orange-500 bg-clip-text text-transparent">
              from one premium cockpit
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-slate-400">
            Manage incoming orders, keep the kitchen aligned, and track your
            menu with a dashboard built for busy service hours.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "Live operations",
                text: "View every order status in one calm queue.",
                tone: "from-orange-500 to-red-500",
              },
              {
                title: "Menu control",
                text: "See catalog coverage, pricing, and category balance.",
                tone: "from-sky-500 to-cyan-500",
              },
              {
                title: "Owner insights",
                text: "Daily revenue and ticket flow in one clean snapshot.",
                tone: "from-emerald-500 to-teal-500",
              },
              {
                title: "Mobile ready",
                text: "Works smoothly across desktop and tablet screens.",
                tone: "from-fuchsia-500 to-rose-500",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[1.8rem] border border-white/8 bg-white/[0.03] p-5"
              >
                <div className={`h-2 w-20 rounded-full bg-gradient-to-r ${item.tone}`} />
                <h2 className="mt-5 text-xl font-bold text-white">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-400">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2.5rem] border border-white/10 bg-[#12161d]/92 p-8 shadow-[0_28px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-10">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.38em] text-orange-300/85">
              Secure login
            </p>
            <h2 className="mt-5 text-4xl font-black text-white">
              Restaurant dashboard access
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              Sign in with your owner account to open the live dashboard.
            </p>
          </div>

          {error && (
            <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                Username
              </span>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-[#0d1117] px-4 py-4 text-base text-white placeholder:text-slate-500 focus:border-orange-400/40 focus:outline-none"
                required
                disabled={loading}
              />
            </label>

            <label className="block">
              <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                Password
              </span>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-[#0d1117] px-4 py-4 text-base text-white placeholder:text-slate-500 focus:border-orange-400/40 focus:outline-none"
                required
                disabled={loading}
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-orange-500 via-orange-500 to-red-500 px-4 py-4 text-base font-bold text-white shadow-[0_18px_40px_rgba(249,115,22,0.28)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Open dashboard"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
