import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  buildImageSources,
  getImageFromSources,
  getLocalFoodFallback,
} from "../utils/image";

export const CartContext = createContext();

const normalizeCartItem = (item) => {
  const imageSources = buildImageSources(
    [item.image_url, item.image_final, item.image],
    getLocalFoodFallback(item.title || item.name, item.id)
  );
  return {
    ...item,
    title: item.title || item.name || "Food item",
    imageSources,
    image: getImageFromSources(imageSources),
    quantity: Number(item.quantity) > 0 ? Number(item.quantity) : 1,
  };
};

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("cart");
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.map(normalizeCartItem) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, [cart]);

  const addToCart = useCallback((food) => {
    const normalizedFood = normalizeCartItem(food);

    setCart((prev) => {
      const exists = prev.find((item) => item.id === normalizedFood.id);
      if (exists) {
        return prev.map((item) =>
          item.id === normalizedFood.id
            ? {
                ...item,
                ...normalizedFood,
                quantity: item.quantity + 1,
              }
            : item
        );
      }
      return [...prev, normalizedFood];
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const increaseQty = useCallback((id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }, []);

  const decreaseQty = useCallback((id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(1, item.quantity - 1) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const isEmpty = cart.length === 0;

  const value = {
    cart,
    cartCount,
    totalPrice,
    isEmpty,
    addToCart,
    removeFromCart,
    increaseQty,
    decreaseQty,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
