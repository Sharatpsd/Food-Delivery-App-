import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { submitRestaurantOwnerRequest } from "../utils/api";

export default function RestaurantOwner() {
  const [formData, setFormData] = useState({
    restaurantName: "",
    phone: "01783-720914",
    email: "",
    address: "",
    logo: null,
    license: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    data.append('role', 'restaurant');

    try {
      const result = await submitRestaurantOwnerRequest(data);
      alert(result.message);
      navigate("/");
    } catch (error) {
      alert("Error submitting request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-20">
      <div className="max-w-2xl mx-auto px-4">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/")}
          className="mb-12 flex items-center gap-3 text-gray-700 hover:text-orange-600 text-lg font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </motion.button>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-orange-200">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-black text-center mb-8 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent"
          >
            Restaurant Owner Application
          </motion.h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-lg font-semibold mb-3 text-gray-800">Restaurant Name *</label>
              <input 
                type="text" 
                required
                className="w-full p-5 border-2 border-orange-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 text-lg transition-all"
                value={formData.restaurantName}
                onChange={(e) => setFormData({...formData, restaurantName: e.target.value})}
                placeholder="Enter your restaurant name"
              />
            </div>

            <div>
              <label className="block text-lg font-semibold mb-3 text-gray-800">Phone *</label>
              <input 
                type="tel" 
                required
                className="w-full p-5 border-2 border-orange-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 text-lg transition-all"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-lg font-semibold mb-3 text-gray-800">Email *</label>
              <input 
                type="email" 
                required
                className="w-full p-5 border-2 border-orange-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 text-lg transition-all"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-lg font-semibold mb-3 text-gray-800">Restaurant Address *</label>
              <textarea 
                rows="4"
                required
                className="w-full p-5 border-2 border-orange-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 text-lg resize-vertical transition-all"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="Full address with city, area, landmark"
              />
            </div>

            <div>
              <label className="block text-lg font-semibold mb-3 text-gray-800">Restaurant Logo *</label>
              <div className="relative border-2 border-dashed border-orange-300 rounded-2xl p-10 text-center hover:border-orange-400 hover:bg-orange-50 transition-all cursor-pointer group">
                <input 
                  type="file" 
                  accept="image/*"
                  required
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => setFormData({...formData, logo: e.target.files[0]})}
                />
                <div className="pointer-events-none">
                  <Upload className="w-16 h-16 text-orange-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <p className="text-xl font-semibold text-gray-700 mb-2">Click to upload logo</p>
                  <p className="text-sm text-gray-500">(JPG, PNG - Max 5MB)</p>
                  {formData.logo && (
                    <p className="mt-3 text-green-600 font-medium">{formData.logo.name}</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-lg font-semibold mb-3 text-gray-800">Business License # *</label>
              <input 
                type="text" 
                required
                className="w-full p-5 border-2 border-orange-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 text-lg transition-all"
                value={formData.license}
                onChange={(e) => setFormData({...formData, license: e.target.value})}
                placeholder="Enter your business license number"
              />
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white py-8 px-12 text-2xl font-black rounded-3xl shadow-2xl hover:shadow-3xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit Request → Admin Will Review"}
            </motion.button>
          </form>

          <div className="text-center pt-12 mt-12 border-t-2 border-orange-100">
            <p className="text-lg text-gray-600 mb-4">Need help? Contact directly:</p>
            <div className="text-sm space-y-2">
              <p><strong>📧 sharatacharjee6@gmail.com</strong></p>
              <p><strong>📞 01783-720914</strong></p>
              <a 
                href="https://mugdho-portfolio.netlify.app" 
                target="_blank" 
                className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold text-lg hover:underline"
              >
                👨‍💻 Developer Portfolio
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
