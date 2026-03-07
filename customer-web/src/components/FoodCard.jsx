import { motion } from "framer-motion";
import { 
  ShoppingCart, 
  Star, 
  Clock, 
  Flame, 
  Minus, 
  Plus,
  Heart 
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function FoodCard({ food }) {
  const { addToCart, cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isInCart, setIsInCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Check if already in cart
  useEffect(() => {
    const existingItem = cart.find(item => item.id === food.id);
    if (existingItem) {
      setIsInCart(true);
      setQuantity(existingItem.quantity);
    }
  }, [cart, food.id]);

  const handleAddToCart = async () => {
    if (!localStorage.getItem("access")) {
      navigate(`/login?next=${encodeURIComponent(location.pathname)}`);
      return;
    }

    setIsLoading(true);
    
    try {
      // Add single click logic
      if (!isInCart) {
        await addToCart({ ...food, quantity: 1 });
      } else {
        // Update quantity
        await addToCart({ ...food, quantity });
      }
      setIsInCart(true);
    } catch (error) {
      console.error("Add to cart failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityChange = (type) => {
    if (type === 'increase') {
      setQuantity(prev => prev + 1);
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      whileHover={{ y: -10 }}
      whileTap={{ scale: 0.98 }}
      className="group relative bg-[#1b1f27]/80 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl border border-white/50 overflow-hidden transition-all duration-500 hover:border-orange-400/30"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Image & Badges */}
      <div className="relative overflow-hidden rounded-t-3xl">
        <img 
          src={food.image || "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&fit=crop&crop=entropy&auto=format"}
          alt={food.title}
          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Price Badge */}
        <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-2 rounded-2xl font-bold text-sm shadow-lg">
          {food.price}
        </div>

        {/* Discount Badge (if available) */}
        {food.discount && (
          <motion.div 
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-600 text-white px-3 py-2 rounded-2xl font-bold text-sm shadow-lg flex items-center gap-1"
          >
            <Flame className="w-3 h-3" />
            {food.discount}% OFF
          </motion.div>
        )}

        {/* Quick Add Button on Image */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          animate={isHovered ? { opacity: 1, scale: 1 } : { opacity: 0 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#1b1f27]/90 backdrop-blur-sm px-6 py-3 rounded-2xl font-bold text-orange-300 shadow-2xl border border-orange-400/30 hover:bg-orange-500/10 transition-all duration-300"
          onClick={handleAddToCart}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
              Adding...
            </div>
          ) : (
            "Quick Add +"
          )}
        </motion.button>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title & Rating */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-xl text-white leading-tight line-clamp-2 mb-2 group-hover:text-orange-300 transition-colors">
              {food.title}
            </h3>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="font-semibold text-white">{food.rating || 4.5}</span>
              </div>
              <span className="text-gray-400">({food.reviews || 23}+)</span>
            </div>
          </div>

          {/* Favorite Button */}
          <motion.button
            className="p-2 rounded-2xl bg-gray-100/50 hover:bg-red-100 group/fav transition-all duration-300"
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
          >
            <Heart className="w-5 h-5 text-gray-400 group-hover/fav:text-red-500 fill-transparent group-hover/fav:fill-red-500 transition-all duration-300" />
          </motion.button>
        </div>

        {/* Cuisine & Time */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{food.prepTime || "15-20"} mins</span>
          </div>
          {food.cuisine && (
            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
              {food.cuisine}
            </span>
          )}
          {food.popular && (
            <span className="px-3 py-1 bg-orange-500/15 text-orange-200 rounded-full text-xs font-medium">
              Popular
            </span>
          )}
        </div>

        {/* Cart Controls */}
        <div className={`transition-all duration-300 ${
          isInCart ? 'p-4 bg-orange-500/10 rounded-2xl border-2 border-orange-400/30' : 'p-0'
        }`}>
          {isInCart ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-[#1b1f27] px-4 py-2 rounded-2xl border shadow-sm">
                  <motion.button
                    onClick={() => handleQuantityChange('decrease')}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                    whileTap={{ scale: 0.9 }}
                  >
                    <Minus className="w-4 h-4 text-gray-300" />
                  </motion.button>
                  
                  <span className="font-bold text-lg mx-4 min-w-[2rem] text-center">
                    {quantity}
                  </span>
                  
                  <motion.button
                    onClick={() => handleQuantityChange('increase')}
                    className="p-2 hover:bg-orange-100 rounded-xl transition-colors"
                    whileTap={{ scale: 0.9 }}
                  >
                    <Plus className="w-4 h-4 text-orange-300" />
                  </motion.button>
                </div>
                <span className="font-bold text-xl text-orange-300">
                {(food.price * quantity).toLocaleString()}
                </span>
              </div>
              
              <motion.button
                onClick={handleAddToCart}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ShoppingCart className="w-4 h-4" />
                Update Cart
              </motion.button>
            </div>
          ) : (
            <motion.button
              onClick={handleAddToCart}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-400 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  Add {quantity > 1 ? `${quantity}x ` : ''}to Cart
                </>
              )}
            </motion.button>
          )}
        </div>
      </div>

      {/* Bottom Shadow */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
    </motion.div>
  );
}




