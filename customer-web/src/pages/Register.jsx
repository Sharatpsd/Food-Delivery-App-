import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChefHat, ArrowRight, Eye, EyeOff, User, Phone, Lock } from "lucide-react";

export default function Register() {

const [formData, setFormData] = useState({
name: "",
username: "",
phone: "",
password: "",
password2: "",
});

const [showPassword, setShowPassword] = useState(false);
const [showConfirm, setShowConfirm] = useState(false);
const [loading, setLoading] = useState(false);

const navigate = useNavigate();

const handleChange = (e) => {
setFormData({
...formData,
[e.target.name]: e.target.value,
});
};

const handleSubmit = async (e) => {
e.preventDefault();

if (formData.password !== formData.password2) {
alert("Passwords do not match");
return;
}

setLoading(true);

try {

const payload = {
username: formData.username,
password: formData.password,
name: formData.name,
phone: formData.phone,
role: "customer",
address: "",
};

await axios.post(
"http://127.0.0.1:8000/api/auth/register/",
payload
);

alert("Account created successfully");
navigate("/login");

} catch (err) {

console.log("REGISTER ERROR 👉", err.response?.data);

alert(
JSON.stringify(err.response?.data) ||
"Registration failed"
);

} finally {
setLoading(false);
}

};

return (

<div className="min-h-screen bg-gradient-to-br from-orange-600 via-red-600 to-orange-700 flex items-center justify-center px-6">

<motion.div
initial={{ scale: 0.9, opacity: 0 }}
animate={{ scale: 1, opacity: 1 }}
transition={{ duration: 0.7 }}
className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-lg"
>

<div className="text-center mb-10">
<h1 className="text-6xl font-black text-orange-600">Bite</h1>
<p className="text-gray-600 mt-2">Create your account</p>
</div>

<form onSubmit={handleSubmit} className="space-y-6">

<div className="relative">
<User className="absolute left-4 top-5 text-gray-400" />
<input
type="text"
name="name"
placeholder="Full Name"
value={formData.name}
onChange={handleChange}
required
className="w-full pl-12 py-4 border rounded-xl"
/>
</div>

<div className="relative">
<User className="absolute left-4 top-5 text-gray-400" />
<input
type="text"
name="username"
placeholder="Username"
value={formData.username}
onChange={handleChange}
required
className="w-full pl-12 py-4 border rounded-xl"
/>
</div>

<div className="relative">
<Phone className="absolute left-4 top-5 text-gray-400" />
<input
type="text"
name="phone"
placeholder="Phone"
value={formData.phone}
onChange={handleChange}
required
className="w-full pl-12 py-4 border rounded-xl"
/>
</div>

<div className="relative">
<Lock className="absolute left-4 top-5 text-gray-400" />
<input
type={showPassword ? "text" : "password"}
name="password"
placeholder="Password"
value={formData.password}
onChange={handleChange}
required
className="w-full pl-12 pr-12 py-4 border rounded-xl"
/>

<button
type="button"
onClick={() => setShowPassword(!showPassword)}
className="absolute right-4 top-4"
>
{showPassword ? <EyeOff /> : <Eye />}
</button>

</div>

<div className="relative">
<Lock className="absolute left-4 top-5 text-gray-400" />
<input
type={showConfirm ? "text" : "password"}
name="password2"
placeholder="Confirm Password"
value={formData.password2}
onChange={handleChange}
required
className="w-full pl-12 pr-12 py-4 border rounded-xl"
/>

<button
type="button"
onClick={() => setShowConfirm(!showConfirm)}
className="absolute right-4 top-4"
>
{showConfirm ? <EyeOff /> : <Eye />}
</button>

</div>

<button
type="submit"
disabled={loading}
className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold"
>

{loading ? "Creating Account..." : "Sign Up"}

</button>

</form>

</motion.div>

</div>

);

}