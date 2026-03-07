import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api, { submitRestaurantOwnerRequest } from "../utils/api";

export default function RestaurantOwner() {
  const [formData, setFormData] = useState({
    restaurantName: "",
    phone: "",
    email: "",
    address: "",
    logo: null,
    license: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate("/");
  };

  useEffect(() => {
    if (!localStorage.getItem("access")) return;

    const loadUser = async () => {
      try {
        const res = await api.get("/auth/user/");
        setFormData((prev) => ({
          ...prev,
          phone: res.data?.phone || prev.phone,
          email: res.data?.username || prev.email,
        }));
      } catch {
        // keep manual input fallback
      }
    };

    loadUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    data.append("role", "restaurant");

    try {
      const result = await submitRestaurantOwnerRequest(data);
      alert(result.message || "Request submitted successfully");
      navigate("/");
    } catch (error) {
      alert("Error submitting request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#12161d] to-[#1a1f28] py-12 sm:py-16">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={handleBack}
          className="mb-8 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-gray-200 transition hover:bg-white/10 hover:text-orange-300 sm:mb-10 sm:text-base"
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          Back
        </motion.button>

        <div className="rounded-3xl border border-orange-400/30 bg-[#1b1f27]/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8 md:p-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-center text-3xl font-black text-transparent sm:mb-8 sm:text-4xl"
          >
            Restaurant Owner Application
          </motion.h1>

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div>
              <label className="mb-2 block text-base font-semibold text-gray-100 sm:text-lg">
                Restaurant Name *
              </label>
              <input
                type="text"
                required
                className="w-full rounded-xl border-2 border-orange-400/30 px-4 py-3 text-base transition-all focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/20 sm:text-lg"
                value={formData.restaurantName}
                onChange={(e) =>
                  setFormData({ ...formData, restaurantName: e.target.value })
                }
                placeholder="Enter your restaurant name"
              />
            </div>

            <div>
              <label className="mb-2 block text-base font-semibold text-gray-100 sm:text-lg">
                Phone *
              </label>
              <input
                type="tel"
                required
                className="w-full rounded-xl border-2 border-orange-400/30 px-4 py-3 text-base transition-all focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/20 sm:text-lg"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>

            <div>
              <label className="mb-2 block text-base font-semibold text-gray-100 sm:text-lg">
                Email *
              </label>
              <input
                type="email"
                required
                className="w-full rounded-xl border-2 border-orange-400/30 px-4 py-3 text-base transition-all focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/20 sm:text-lg"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-base font-semibold text-gray-100 sm:text-lg">
                Restaurant Address *
              </label>
              <textarea
                rows="4"
                required
                className="w-full resize-vertical rounded-xl border-2 border-orange-400/30 px-4 py-3 text-base transition-all focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/20 sm:text-lg"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Full address with city, area, landmark"
              />
            </div>

            <div>
              <label className="mb-2 block text-base font-semibold text-gray-100 sm:text-lg">
                Restaurant Logo *
              </label>
              <div className="group relative cursor-pointer rounded-2xl border-2 border-dashed border-orange-300 p-7 text-center transition-all hover:border-orange-400 hover:bg-orange-500/10 sm:p-8">
                <input
                  type="file"
                  accept="image/*"
                  required
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) =>
                    setFormData({ ...formData, logo: e.target.files[0] })
                  }
                />
                <div className="pointer-events-none">
                  <Upload className="mx-auto mb-3 h-12 w-12 text-orange-500 transition-transform group-hover:scale-110 sm:h-14 sm:w-14" />
                  <p className="mb-1 text-base font-semibold text-gray-200 sm:text-lg">
                    Click to upload logo
                  </p>
                  <p className="text-sm text-gray-400">(JPG, PNG - Max 5MB)</p>
                  {formData.logo && (
                    <p className="mt-3 text-orange-300 font-medium">
                      {formData.logo.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-base font-semibold text-gray-100 sm:text-lg">
                Business License # *
              </label>
              <input
                type="text"
                required
                className="w-full rounded-xl border-2 border-orange-400/30 px-4 py-3 text-base transition-all focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/20 sm:text-lg"
                value={formData.license}
                onChange={(e) =>
                  setFormData({ ...formData, license: e.target.value })
                }
                placeholder="Enter your business license number"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 px-6 py-4 text-lg font-black text-white shadow-2xl transition-all hover:from-orange-600 hover:to-red-700 disabled:cursor-not-allowed disabled:opacity-50 sm:text-xl"
            >
              {loading ? "Submitting..." : "Submit Request -> Admin Will Review"}
            </motion.button>
          </form>

          <div className="mt-8 border-t border-white/10 pt-6 text-center sm:mt-10 sm:pt-8">
            <p className="mb-3 text-base text-gray-300 sm:text-lg">Need help? Contact directly:</p>
            <div className="text-base sm:text-lg space-y-2">
              <p>
                <strong>Email: sharatacharjee6@gmail.com</strong>
              </p>
              <p>
                <strong>Phone: 01783-720914</strong>
              </p>
              <a
                href="https://mugdho-portfolio.netlify.app"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-orange-300 hover:text-orange-200 font-semibold text-lg hover:underline"
              >
                Developer Portfolio
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



