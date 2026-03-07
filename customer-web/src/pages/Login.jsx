import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ChefHat, Eye, EyeOff } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import api from "../utils/api";

export default function Login() {

const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [showPassword, setShowPassword] = useState(false);
const [loading, setLoading] = useState(false);

const navigate = useNavigate();
const location = useLocation();

const finishLogin = (access, refresh) => {
localStorage.setItem("access", access);
localStorage.setItem("refresh", refresh);
const nextPath = new URLSearchParams(location.search).get("next") || "/";
navigate(nextPath);
window.location.reload();
};

const handleSubmit = async (e) => {

e.preventDefault();
setLoading(true);

try {

const res = await api.post("/auth/token/", {
username: username,
password: password,
});

finishLogin(res.data.access, res.data.refresh);

} catch (err) {

console.log("LOGIN ERROR ðŸ‘‰", err.response?.data);
alert("Wrong username or password");

} finally {
setLoading(false);
}

};

const handleGoogleSuccess = async (credentialResponse) => {
const token = credentialResponse?.credential;

if (!token) {
alert("Google token missing");
return;
}

try {
const res = await api.post("/auth/google/", { token });
finishLogin(res.data.access, res.data.refresh);
} catch (err) {
console.log("GOOGLE LOGIN ERROR ðŸ‘‰", err.response?.data);
alert(err.response?.data?.error || "Google login failed");
}
};

return (

<div className="min-h-screen bg-gradient-to-br from-orange-600 via-red-600 to-orange-700 flex items-center justify-center">

<motion.div
initial={{ y: 100, opacity: 0 }}
animate={{ y: 0, opacity: 1 }}
transition={{ duration: 0.7 }}
className="bg-[#1b1f27] p-10 rounded-3xl shadow-2xl w-full max-w-md"
>

<div className="text-center mb-10">
<h1 className="text-6xl font-black text-orange-300">Bite</h1>
<p className="text-gray-300">Login to your account</p>
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

<div className="my-6 flex items-center gap-3">
<div className="h-px flex-1 bg-gray-200" />
<span className="text-sm text-gray-400">OR</span>
<div className="h-px flex-1 bg-gray-200" />
</div>

<div className="flex justify-center">
<GoogleLogin
onSuccess={handleGoogleSuccess}
onError={() => alert("Google login failed")}
useOneTap={false}
/>
</div>

<div className="text-center mt-6 text-gray-300">
Don't have an account?{" "}
<a href="/register" className="text-orange-300 font-bold">
Register
</a>
</div>

</motion.div>

</div>

);

}


