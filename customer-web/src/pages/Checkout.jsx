import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, Loader2, PackageCheck } from "lucide-react";
import api from "../utils/axios";

const toInt = (value) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : null;
};

const pickErrorMessage = (error) => {
  const data = error?.response?.data;
  if (!data) return error?.message || "Checkout failed";
  if (typeof data === "string") return data;
  if (typeof data?.detail === "string") return data.detail;

  const firstKey = Object.keys(data)[0];
  if (!firstKey) return "Checkout failed";
  const value = data[firstKey];
  if (Array.isArray(value) && value.length) return String(value[0]);
  if (typeof value === "string") return value;
  return "Checkout failed";
};

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    flat: "",
    paymentMethod: "bkash",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem("access")) return;

    const loadUser = async () => {
      try {
        const res = await api.get("/auth/user/");
        setFormData((prev) => ({
          ...prev,
          fullName: res.data?.name || prev.fullName,
          phone: res.data?.phone || prev.phone,
          email: res.data?.username || prev.email,
          address: res.data?.address || prev.address,
        }));
      } catch {
        // keep manual input fallback
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const paymentStatus = params.get("payment_status");
    const orderId = params.get("order_id");

    if (!paymentStatus || !orderId) return;

    const verifyPayment = async () => {
      try {
        const res = await api.get(`/payments/status/${orderId}/`);
        const payment = res.data;

        if (payment.status === "completed" || paymentStatus === "success") {
          setPlacedOrderId(orderId);
          setOrderSuccess(true);
          clearCart();
          setStep(4);
          navigate("/checkout", { replace: true });
          return;
        }

        alert(
          paymentStatus === "cancelled"
            ? "Payment was cancelled. Please try again."
            : "Payment failed. Please try again."
        );
      } catch {
        if (paymentStatus === "success") {
          setPlacedOrderId(orderId);
          setOrderSuccess(true);
          clearCart();
          setStep(4);
          navigate("/checkout", { replace: true });
          return;
        }
        alert("Could not verify payment status.");
      }
    };

    verifyPayment();
  }, [location.search, clearCart, navigate]);

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOrder = async () => {
    if (!cart.length) {
      alert("Cart is empty!");
      return;
    }

    if (!formData.fullName || !formData.phone || !formData.address) {
      alert("Please fill required delivery fields");
      setStep(1);
      return;
    }

    setLoading(true);

    const restaurantId = toInt(
      cart[0]?.restaurantId ?? cart[0]?.restaurant_id ?? cart[0]?.restaurant
    );

    if (!restaurantId) {
      setLoading(false);
      alert("Cart data is outdated. Please clear cart and add items again.");
      return;
    }

    const hasMixedRestaurant = cart.some((item) => {
      const itemRestaurantId = toInt(
        item?.restaurantId ?? item?.restaurant_id ?? item?.restaurant
      );
      return itemRestaurantId !== restaurantId;
    });

    if (hasMixedRestaurant) {
      setLoading(false);
      alert("Please order from one restaurant at a time.");
      return;
    }

    const items = cart
      .map((item) => ({
        food_id: toInt(item.id),
        quantity: Number(item.quantity) > 0 ? Number(item.quantity) : 1,
      }))
      .filter((item) => item.food_id);

    if (!items.length) {
      setLoading(false);
      alert("No valid items found in cart. Please re-add items.");
      return;
    }

    try {
      const orderRes = await api.post("/orders/create/", {
        restaurant: restaurantId,
        items,
      });

      const orderId = orderRes.data?.id;
      if (!orderId) {
        throw new Error("Order creation failed");
      }

      const paymentMethod =
        formData.paymentMethod === "cash" ? "cod" : formData.paymentMethod;

      const paymentRes = await api.post("/payments/initiate/", {
        order: orderId,
        method: paymentMethod,
      });

      if (paymentMethod === "cod") {
        clearCart();
        setPlacedOrderId(orderId);
        setOrderSuccess(true);
        setStep(4);
      } else {
        const gatewayUrl = paymentRes.data?.gateway_url;
        if (!gatewayUrl) {
          throw new Error("Payment gateway URL missing");
        }
        window.location.href = gatewayUrl;
      }
    } catch (err) {
      alert(pickErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 py-20 px-4">
        <div className="max-w-2xl mx-auto bg-white/90 rounded-3xl shadow-2xl p-10 text-center">
          <div className="w-24 h-24 bg-emerald-100 rounded-3xl mx-auto mb-6 flex items-center justify-center">
            <PackageCheck className="w-12 h-12 text-emerald-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-emerald-700">Order Placed!</h1>
          <p className="text-gray-700 mb-6">
            Your order has been placed successfully.
          </p>
          <p className="text-lg font-semibold mb-2">Order ID: #{placedOrderId || "-"}</p>
          <p className="text-2xl font-bold text-orange-600 mb-8">BDT {totalPrice.toLocaleString()}</p>
          <button
            onClick={() => navigate("/orders")}
            className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold"
          >
            Track My Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium mb-6"
          whileHover={{ scale: 1.03 }}
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Cart
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold mb-6">Checkout</h2>
            <p className="text-sm text-gray-500 mb-6">Step {step} of 3</p>

            {step === 1 && (
              <div className="space-y-4">
                <input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full p-4 border border-gray-200 rounded-2xl"
                  placeholder="Full name *"
                />
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-4 border border-gray-200 rounded-2xl"
                  placeholder="Phone *"
                />
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-4 border border-gray-200 rounded-2xl"
                  placeholder="Email"
                />
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full p-4 border border-gray-200 rounded-2xl"
                  placeholder="Delivery address *"
                />
                <input
                  name="flat"
                  value={formData.flat}
                  onChange={handleInputChange}
                  className="w-full p-4 border border-gray-200 rounded-2xl"
                  placeholder="Flat (optional)"
                />

                <button
                  onClick={() => setStep(2)}
                  className="w-full py-4 bg-orange-500 text-white rounded-2xl font-bold"
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border rounded-2xl cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bkash"
                    checked={formData.paymentMethod === "bkash"}
                    onChange={handleInputChange}
                  />
                  bKash / Online
                </label>
                <label className="flex items-center gap-3 p-4 border rounded-2xl cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === "card"}
                    onChange={handleInputChange}
                  />
                  Card / Online
                </label>
                <label className="flex items-center gap-3 p-4 border rounded-2xl cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={formData.paymentMethod === "cash"}
                    onChange={handleInputChange}
                  />
                  Cash on Delivery
                </label>

                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full p-4 border border-gray-200 rounded-2xl"
                  placeholder="Order notes"
                />

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 border rounded-2xl font-semibold"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 py-3 bg-orange-500 text-white rounded-2xl font-semibold"
                  >
                    Review
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-gray-50">
                  <p><strong>Name:</strong> {formData.fullName || "-"}</p>
                  <p><strong>Phone:</strong> {formData.phone || "-"}</p>
                  <p><strong>Address:</strong> {formData.address || "-"}</p>
                  <p><strong>Payment:</strong> {formData.paymentMethod}</p>
                </div>

                <button
                  onClick={handleOrder}
                  disabled={loading}
                  className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                  <CreditCard className="w-5 h-5" />
                  Place Order (BDT {totalPrice.toLocaleString()})
                </button>
              </div>
            )}
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 h-fit">
            <h3 className="text-2xl font-bold mb-6">Order Summary</h3>
            <div className="space-y-3 mb-6 max-h-72 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-semibold">{item.title || item.name}</p>
                    <p className="text-sm text-gray-500">x{item.quantity}</p>
                  </div>
                  <p className="font-bold">BDT {(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span className="text-orange-600">BDT {totalPrice.toLocaleString()}</span>
            </div>
            <Link
              to="/cart"
              className="block text-center mt-6 text-orange-600 font-semibold"
            >
              Back to Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
