import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { getToken } from "../utils/auth";
import { addCartItem, getCart, removeCartItem, updateCartItem } from "../utils/api";
import {
  buildImageSources,
  getImageFromSources,
  getLocalFoodFallback,
} from "../utils/image";

export const CartContext = createContext();

const normalizeBackendCartItem = (item, cartData) => {
  const title = item.food_name || item.name || "Food item";
  const imageSources = buildImageSources(
    [item.image_url, item.image_final, item.image],
    getLocalFoodFallback(title, item.food_id || item.id)
  );

  return {
    id: item.food_id,
    cartItemId: item.id,
    restaurant: cartData?.restaurant_name || "",
    restaurantId: cartData?.restaurant_id || item.restaurant_id || null,
    title,
    name: title,
    imageSources,
    image: getImageFromSources(imageSources),
    quantity: Number(item.quantity) > 0 ? Number(item.quantity) : 1,
    price: Number(item.price) || 0,
    lineTotal: Number(item.line_total) || 0,
  };
};

const normalizeCartResponse = (cartData) => {
  const items = Array.isArray(cartData?.items)
    ? cartData.items.map((item) => normalizeBackendCartItem(item, cartData))
    : [];

  return {
    cart: items,
    cartCount: Number(cartData?.item_count) || items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: Number(cartData?.total) || items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  };
};

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartLoading, setCartLoading] = useState(false);

  const applyCartResponse = useCallback((cartData) => {
    const normalized = normalizeCartResponse(cartData);
    setCart(normalized.cart);
    setCartCount(normalized.cartCount);
    setTotalPrice(normalized.totalPrice);
  }, []);

  const resetCart = useCallback(() => {
    setCart([]);
    setCartCount(0);
    setTotalPrice(0);
  }, []);

  const refreshCart = useCallback(async () => {
    if (!getToken()) {
      resetCart();
      return null;
    }

    setCartLoading(true);
    try {
      const cartData = await getCart();
      applyCartResponse(cartData);
      return cartData;
    } catch (error) {
      if (error?.response?.status === 401) {
        resetCart();
      }
      throw error;
    } finally {
      setCartLoading(false);
    }
  }, [applyCartResponse, resetCart]);

  useEffect(() => {
    refreshCart().catch(() => {});

    const handleAuthChange = () => {
      if (!getToken()) {
        resetCart();
        return;
      }
      refreshCart().catch(() => {});
    };

    window.addEventListener("focus", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);
    window.addEventListener("auth-change", handleAuthChange);

    return () => {
      window.removeEventListener("focus", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
      window.removeEventListener("auth-change", handleAuthChange);
    };
  }, [refreshCart, resetCart]);

  const addToCart = useCallback(
    async (food) => {
      const quantity = Number(food?.quantity) > 0 ? Number(food.quantity) : 1;
      const cartData = await addCartItem({
        foodId: food.id,
        quantity,
      });
      applyCartResponse(cartData);
      return cartData;
    },
    [applyCartResponse]
  );

  const updateQuantityByFoodId = useCallback(
    async (foodId, quantity) => {
      const item = cart.find((entry) => entry.id === foodId);
      if (!item) return null;

      const cartData = await updateCartItem({
        cartItemId: item.cartItemId,
        quantity,
      });
      applyCartResponse(cartData);
      return cartData;
    },
    [applyCartResponse, cart]
  );

  const removeFromCart = useCallback(
    async (foodId) => {
      const item = cart.find((entry) => entry.id === foodId);
      if (!item) return null;

      const cartData = await removeCartItem(item.cartItemId);
      applyCartResponse(cartData);
      return cartData;
    },
    [applyCartResponse, cart]
  );

  const increaseQty = useCallback(
    async (foodId) => {
      const item = cart.find((entry) => entry.id === foodId);
      if (!item) return null;
      return updateQuantityByFoodId(foodId, item.quantity + 1);
    },
    [cart, updateQuantityByFoodId]
  );

  const decreaseQty = useCallback(
    async (foodId) => {
      const item = cart.find((entry) => entry.id === foodId);
      if (!item) return null;

      if (item.quantity <= 1) {
        return removeFromCart(foodId);
      }

      return updateQuantityByFoodId(foodId, item.quantity - 1);
    },
    [cart, removeFromCart, updateQuantityByFoodId]
  );

  const clearCart = useCallback(async () => {
    if (!cart.length) {
      resetCart();
      return;
    }

    setCartLoading(true);
    try {
      for (const item of cart) {
        await removeCartItem(item.cartItemId);
      }
      resetCart();
    } finally {
      setCartLoading(false);
    }
  }, [cart, resetCart]);

  const value = useMemo(
    () => ({
      cart,
      cartCount,
      totalPrice,
      isEmpty: cart.length === 0,
      cartLoading,
      refreshCart,
      addToCart,
      removeFromCart,
      increaseQty,
      decreaseQty,
      clearCart,
    }),
    [
      addToCart,
      cart,
      cartCount,
      cartLoading,
      clearCart,
      decreaseQty,
      increaseQty,
      refreshCart,
      removeFromCart,
      totalPrice,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
