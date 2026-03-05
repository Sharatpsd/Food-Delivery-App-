import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  MapPin,
  Phone,
  User,
  PackageCheck,
  ArrowLeft,
  Loader2,
  CheckCircle,
} from "lucide-react";
import api from "../utils/axios";

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  // Form states
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "01783720914", // Pre-filled from your profile
    email: "",
    address: "Char Bhadrāsan, Dhaka Division, BD",
    flat: "",
    paymentMethod: "bkash",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Delivery, 2: Payment, 3: Review
  const [orderSuccess, setOrderSuccess] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleOrder = async () => {
    if (!cart.length) {
      alert("Cart is empty!");
      return;
    }

    setLoading(true);

    const restaurantId = cart[0]?.restaurantId || cart[0]?.restaurant;

    const items = cart.map((item) => ({
      food_id: item.id,
      quantity: item.quantity,
    }));

    try {
      await api.post("/orders/", {
        restaurant: restaurantId,
        items,
        customer_name: formData.fullName,
        customer_phone: formData.phone,
        customer_email: formData.email,
        delivery_address: `${formData.address}, Flat ${formData.flat}`,
        payment_method: formData.paymentMethod,
        special_notes: formData.notes,
        total_amount: totalPrice,
      });

      clearCart();
      setOrderSuccess(true);
      setStep(4);

    } catch (err) {
      console.log("ORDER ERROR 👉", err.response?.data);
      alert(
        err.response?.data?.detail ||
        err.response?.data?.phone?.[0] ||
        "Order failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const NextStepButton = ({ onClick, children, disabled = false }) => (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-4 px-6 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 ${
        disabled
          ? "bg-gray-400 text-gray-600 cursor-not-allowed"
          : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-2xl hover:-translate-y-1"
      }`}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
    >
      {loading && <Loader2 className="w-5 h-5 animate-spin" />}
      {children}
    </motion.button>
  );

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-12 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500 }}
              className="w-32 h-32 bg-emerald-100 rounded-3xl mx-auto mb-8 flex items-center justify-center"
            >
              <PackageCheck className="w-16 h-16 text-emerald-500" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-6">
              Order Placed!
            </h1>
            <p className="text-xl text-gray-700 mb-8 max-w-md mx-auto">
              Your order has been successfully placed. Our team will contact you
              shortly on {formData.phone}.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 max-w-2xl mx-auto">
              <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 p-6 rounded-2xl border border-emerald-200">
                <p className="text-sm text-gray-600 mb-2">Order Total</p>
                <p className="text-2xl font-bold text-emerald-600">
                  ৳{totalPrice.toLocaleString()}
                </p>
              </div>
              <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 p-6 rounded-2xl border border-blue-200">
                <p className="text-sm text-gray-600 mb-2">Order ID</p>
                <p className="text-2xl font-bold text-blue-600">#ORD-{Date.now().toString().slice(-6)}</p>
              </div>
            </div>
            <motion.button
              onClick={() => navigate("/orders")}
              className="bg-gradient-to-r from-emerald-500 to-green-600 text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Track My Order
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <motion.button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Cart
          </motion.button>
          
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Step {step} of 3</span>
              <div className="w-8 h-1 bg-orange-500 rounded-full" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Checkout
          </h1>
          <p className="text-xl text-gray-600 mt-2">
            ৳<span className="font-bold text-3xl">{totalPrice.toLocaleString()}</span>
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Form Steps */}
          <div className="space-y-8">
            
            {/* Step 1: Delivery Info */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-orange-100 rounded-2xl flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-orange-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Delivery Info</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone *
                      </label>
                      <input
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="01XXXXXXXXX"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Delivery Address *
                    </label>
                    <input
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="House no, Road no, Area"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      name="flat"
                      value={formData.flat}
                      onChange={handleInputChange}
                      className="p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Flat No"
                    />
                  </div>
                </div>

                <NextStepButton
                  onClick={() => formData.fullName && formData.phone && formData.address ? setStep(2) : alert("Please fill required fields")}
                >
                  Continue to Payment
                </NextStepButton>
              </motion.div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-orange-100 rounded-2xl flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-orange-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Payment Method</h3>
                </div>

                <div className="space-y-3 mb-8">
                  <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-2xl hover:border-orange-300 cursor-pointer group transition-all duration-200">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bkash"
                      checked={formData.paymentMethod === "bkash"}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-orange-500"
                    />
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold">
                        bKash
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">bKash</p>
                        <p className="text-sm text-gray-600">Pay with Mobile Financial Service</p>
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-2xl hover:border-orange-300 cursor-pointer group transition-all duration-200">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={formData.paymentMethod === "cash"}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-orange-500"
                    />
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold">
                        Cash
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Cash on Delivery</p>
                        <p className="text-sm text-gray-600">Pay when you receive</p>
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-2xl hover:border-orange-300 cursor-pointer group transition-all duration-200">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === "card"}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-orange-500"
                    />
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">
                        Card
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Credit/Debit Card</p>
                        <p className="text-sm text-gray-600">Visa, MasterCard, etc.</p>
                      </div>
                    </div>
                  </label>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Order Notes (Optional)
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-vertical"
                      placeholder="E.g., Less spicy, No onion, Call before delivery"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-4 px-6 border border-gray-300 rounded-2xl font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-200"
                  >
                    Back
                  </button>
                  <NextStepButton onClick={() => setStep(3)}>
                    Review Order
                  </NextStepButton>
                </div>
              </motion.div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-orange-100 rounded-2xl flex items-center justify-center">
                    <User className="w-5 h-5 text-orange-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Review & Confirm</h3>
                </div>

                <div className="space-y-6 mb-8">
                  {/* Customer Info */}
                  <div className="p-6 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl">
                    <h4 className="font-bold text-lg mb-4">Customer Details</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div><span className="text-gray-600">Name:</span> <span className="font-semibold">{formData.fullName || "—"}</span></div>
                      <div><span className="text-gray-600">Phone:</span> <span className="font-semibold">{formData.phone}</span></div>
                      <div><span className="text-gray-600">Address:</span> <span className="font-semibold">{formData.address}, Flat {formData.flat || "—"}</span></div>
                      <div><span className="text-gray-600">Payment:</span> <span className="font-semibold capitalize">{formData.paymentMethod}</span></div>
                    </div>
                  </div>

                  {/* Cart Items Summary */}
                  <div className="p-6 bg-gray-50 rounded-2xl">
                    <h4 className="font-bold text-lg mb-4">Order Items ({cart.length})</h4>
                    <div className="space-y-3 max-h-40 overflow-y-auto">
                      {cart.map((item) => (
                        <div key={item.id} className="flex justify-between items-center p-3 bg-white rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center">
                              <span className="text-xs font-bold">🍲</span>
                            </div>
                            <div>
                              <p className="font-semibold text-sm">{item.title}</p>
                              <p className="text-xs text-gray-500">x{item.quantity}</p>
                            </div>
                          </div>
                          <p className="font-bold">৳{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-200">
                    <div className="flex justify-between text-2xl font-bold">
                      <span>Total Amount</span>
                      <span className="text-emerald-600">৳{totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 py-4 px-6 border border-gray-300 rounded-2xl font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Edit Order
                  </button>
                  <NextStepButton onClick={handleOrder} disabled={!formData.fullName}>
                    Place Order Now
                  </NextStepButton>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right: Order Summary (Sticky) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:sticky lg:top-24 h-fit bg-white rounded-3xl shadow-2xl p-8 border border-gray-100"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <PackageCheck className="w-8 h-8 text-orange-500" />
              Order Summary
            </h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between">
                <span className="text-gray-700">Items ({cart.length}):</span>
                <span className="font-bold text-lg">{cart.reduce((sum, item) => sum + item.quantity, 0)} pcs</span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="text-gray-700">Subtotal:</span>
                <span className="font-bold">৳{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="text-gray-700">Delivery:</span>
                <span className="text-green-600 font-bold">FREE</span>
              </div>
              <div className="h-px bg-gray-200 my-2" />
              <div className="flex justify-between text-3xl font-bold text-gray-900">
                <span>Total:</span>
                <span className="text-orange-600">৳{totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-2 mb-8 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl">
              <p className="text-sm text-gray-700 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                Free delivery today
              </p>
              <p className="text-sm text-gray-700 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                30-45 mins delivery time
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-6">
              <div className="text-center p-2 bg-orange-100 rounded-xl">
                <span className="text-xs text-gray-600 block">bKash</span>
              </div>
              <div className="text-center p-2 bg-green-100 rounded-xl">
                <span className="text-xs text-gray-600 block">Cash</span>
              </div>
              <div className="text-center p-2 bg-blue-100 rounded-xl">
                <span className="text-xs text-gray-600 block">Card</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
