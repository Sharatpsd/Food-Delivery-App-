import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingCart, 
  Minus, 
  Plus, 
  Trash2, 
  Package, 
  MapPin,
  CreditCard 
} from "lucide-react";

export default function Cart() {
  const {
    cart,
    increaseQty,
    decreaseQty,
    removeFromCart,
    totalPrice,
    clearCart,
  } = useCart();

  if (cart.length === 0)
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 py-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto text-center p-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50"
        >
          <div className="w-24 h-24 bg-orange-100 rounded-3xl mx-auto mb-6 flex items-center justify-center">
            <ShoppingCart className="w-12 h-12 text-orange-500" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Your cart is empty 😔
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Start exploring delicious food from your favorite restaurants!
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
          >
            Explore Restaurants
          </Link>
        </motion.div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Your Cart
              </h1>
              <p className="text-gray-600 mt-2">
                Review your items and proceed to checkout
              </p>
            </div>
            <motion.button
              onClick={clearCart}
              className="px-6 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-all duration-200 font-medium flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </motion.button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <AnimatePresence>
              {cart.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white rounded-3xl shadow-xl p-6 mb-6 border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="flex items-center gap-4">
                    {/* Item Image */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="relative flex-shrink-0"
                    >
                      <img
                        src={item.image || "/api/placeholder/120/120"}
                        alt={item.title}
                        className="w-24 h-24 rounded-2xl object-cover shadow-lg border-4 border-white/50"
                      />
                      <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                        ৳{item.price}
                      </span>
                    </motion.div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-xl text-gray-900 mb-1 line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {item.restaurant || "Local Restaurant"}
                      </p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <motion.button
                          onClick={() => decreaseQty(item.id)}
                          disabled={item.quantity <= 1}
                          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Minus className="w-4 h-4 text-gray-700" />
                        </motion.button>
                        
                        <span className="font-bold text-2xl text-gray-900 w-12 text-center">
                          {item.quantity}
                        </span>
                        
                        <motion.button
                          onClick={() => increaseQty(item.id)}
                          className="p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-all duration-200"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Plus className="w-4 h-4" />
                        </motion.button>
                      </div>

                      <p className="text-2xl font-bold text-orange-600 mt-3">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>

                    {/* Remove Button */}
                    <motion.button
                      onClick={() => removeFromCart(item.id)}
                      className="p-3 bg-red-100 hover:bg-red-200 text-red-600 rounded-2xl group transition-all duration-200 hover:scale-110"
                      whileTap={{ scale: 0.95 }}
                    >
                      <Trash2 className="w-5 h-5 group-hover:text-red-700" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:sticky lg:top-24 h-fit bg-white rounded-3xl shadow-2xl p-8 border border-gray-100"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Package className="w-8 h-8 text-orange-500" />
              Order Summary
            </h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-lg">
                <span className="text-gray-700">Subtotal:</span>
                <span className="font-bold">৳{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="text-gray-700">Delivery Fee:</span>
                <span className="text-green-600 font-bold">FREE</span>
              </div>
              <div className="h-px bg-gray-200" />
              <div className="flex justify-between text-2xl md:text-3xl font-bold text-gray-900">
                <span>Total:</span>
                <span className="text-orange-600">৳{totalPrice.toLocaleString()}</span>
              </div>
            </div>

            {/* Delivery Address Preview */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl mb-6">
              <div className="flex items-center gap-3 mb-3">
                <MapPin className="w-5 h-5 text-blue-500" />
                <h4 className="font-semibold text-gray-900">Delivery Address</h4>
              </div>
              <p className="text-sm text-gray-600">
                Char Bhadrāsan, Dhaka Division, BD
              </p>
              <Link
                to="/checkout"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 inline-block"
              >
                Change Address →
              </Link>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-4">
              <Link to="/checkout">
                <motion.button
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <CreditCard className="w-5 h-5" />
                  Proceed to Checkout ৳{totalPrice.toLocaleString()}
                </motion.button>
              </Link>
              <Link
                to="/"
                className="w-full block text-center py-3 text-orange-600 hover:text-orange-700 font-semibold border border-orange-200 rounded-xl hover:bg-orange-50 transition-all duration-200"
              >
                ← Continue Shopping
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center mb-2">
                Secure Checkout • Fast Delivery • ৳0 Delivery Fee
              </p>
              <div className="flex justify-center items-center gap-4">
                <div className="w-12 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-xs font-bold text-green-700">SSL</span>
                </div>
                <div className="w-12 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-700">bKash</span>
                </div>
                <div className="w-12 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-xs font-bold text-purple-700">Nagad</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
