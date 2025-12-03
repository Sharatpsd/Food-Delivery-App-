import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
      const res = await axios.post("http://127.0.0.1:8000/api/auth/token/", {
        username,
        password,
      });

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      const profileRes = await axios.get("http://127.0.0.1:8000/api/restaurants/my/", {
        headers: { Authorization: `Bearer ${res.data.access}` },
      });

      navigate("/");
      window.location.reload();
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Wrong username or password");
      } else if (err.response?.status === 404) {
        setError("You don't own a restaurant. Contact admin.");
      } else {
        setError("Server error. Try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-400 via-red-500 to-pink-500">
      <div className="bg-white p-12 rounded-3xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
            Restaurant Login
          </h1>
          <p className="text-gray-600 mt-4">Manage your restaurant like a pro</p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-6 text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-5 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:outline-none text-lg"
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-5 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:outline-none text-lg"
            required
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-5 rounded-2xl text-xl font-bold hover:from-orange-700 hover:to-red-700 transition duration-300 disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Login as Restaurant"}
          </button>
        </form>
      </div>
    </div>
  );
}