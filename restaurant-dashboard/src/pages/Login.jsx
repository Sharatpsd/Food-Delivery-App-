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
        username,
        password,
      });

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      navigate("/", { replace: true });
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Wrong username or password");
      } else {
        setError("Server error. Try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#12161d] to-[#1a1f28] px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#1b1f27] p-10 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
            Restaurant Login
          </h1>
          <p className="mt-3 text-gray-300">Manage your restaurant like a pro</p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-400/20 bg-red-500/10 p-3 text-center text-sm font-medium text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-2xl border border-white/15 bg-[#11161d] p-4 text-base text-white placeholder-gray-400 focus:border-orange-400"
            required
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-white/15 bg-[#11161d] p-4 text-base text-white placeholder-gray-400 focus:border-orange-400"
            required
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 py-3 text-base font-bold text-white transition hover:from-orange-600 hover:to-red-600 disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Login as Restaurant"}
          </button>
        </form>
      </div>
    </div>
  );
}
