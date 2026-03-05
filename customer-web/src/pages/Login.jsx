import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChefHat, Eye, EyeOff } from "lucide-react";

export default function Login() {

const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [showPassword, setShowPassword] = useState(false);
const [loading, setLoading] = useState(false);

const navigate = useNavigate();

const handleSubmit = async (e) => {

e.preventDefault();
setLoading(true);

try {

const res = await axios.post(
"http://127.0.0.1:8000/api/auth/token/",
{
username: username,
password: password,
}
);

localStorage.setItem("access", res.data.access);
localStorage.setItem("refresh", res.data.refresh);

navigate("/");
window.location.reload();

} catch (err) {

console.log("LOGIN ERROR 👉", err.response?.data);
alert("Wrong username or password");

} finally {
setLoading(false);
}

};

return (

<div className="min-h-screen bg-gradient-to-br from-orange-600 via-red-600 to-orange-700 flex items-center justify-center">

<motion.div
initial={{ y: 100, opacity: 0 }}
animate={{ y: 0, opacity: 1 }}
transition={{ duration: 0.7 }}
className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md"
>

<div className="text-center mb-10">
<h1 className="text-6xl font-black text-orange-600">Bite</h1>
<p className="text-gray-600">Login to your account</p>
</div>

<form onSubmit={handleSubmit} className="space-y-6">

<input
type="text"
placeholder="Username"
value={username}
onChange={(e) => setUsername(e.target.value)}
required
className="w-full p-4 border rounded-xl"
/>

<div className="relative">

<input
type={showPassword ? "text" : "password"}
placeholder="Password"
value={password}
onChange={(e) => setPassword(e.target.value)}
required
className="w-full p-4 border rounded-xl"
/>

<button
type="button"
onClick={() => setShowPassword(!showPassword)}
className="absolute right-4 top-4"
>
{showPassword ? <EyeOff /> : <Eye />}
</button>

</div>

<button
type="submit"
disabled={loading}
className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold"
>

{loading ? "Logging in..." : "Login"}

</button>

</form>

<div className="text-center mt-6 text-gray-600">
Don't have an account?{" "}
<a href="/register" className="text-orange-600 font-bold">
Register
</a>
</div>

</motion.div>

</div>

);

}