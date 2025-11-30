// src/pages/Login.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/auth/token/", {
        username,
        password,
      });
      localStorage.setItem("access", res.data.access);
      navigate("/");
      window.location.reload();
    } catch (err) {
      alert("Wrong credentials or not a restaurant owner");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="bg-white p-10 rounded-xl shadow-2xl w-96">
        <h2 className="text-3xl font-bold text-center mb-8">Restaurant Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-4 border rounded-lg mb-4"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 border rounded-lg mb-6"
            required
          />
          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-4 rounded-lg text-xl hover:bg-orange-700"
          >
            Login as Restaurant
          </button>
        </form>
      </div>
    </div>
  );
}
