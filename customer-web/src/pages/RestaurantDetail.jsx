import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ArrowLeft, Star, ShoppingCart, CheckCircle2 } from "lucide-react";
import { getRestaurantDetail, getRestaurantFoods } from "../utils/api";

const normalizeApiBase = (baseUrl) => {
  if (!baseUrl) return "http://localhost:8000";
  const trimmed = baseUrl.replace(/\/$/, "");
  return trimmed.endsWith("/api")
    ? trimmed.slice(0, -"/api".length)
    : trimmed;
};

const API_BASE = normalizeApiBase(import.meta.env.VITE_API_BASE_URL);

const toAbsoluteMediaUrl = (value) => {
  if (!value) return null;
  if (value.startsWith("http")) return value;
  if (value.startsWith("/")) return `${API_BASE}${value}`;
  return `${API_BASE}/${value}`;
};

const toSafeNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const formatMoney = (amount) => `BDT ${Math.round(amount).toLocaleString()}`;

export default function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedItemId, setAddedItemId] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [lastAddedItemName, setLastAddedItemName] = useState("");
  const addedItemTimerRef = useRef(null);
  const toastTimerRef = useRef(null);

  const { addToCart } = useCart();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate("/");
  };

  const handleAddToCart = (item) => {
    if (!localStorage.getItem("access")) {
      navigate(`/login?next=${encodeURIComponent(location.pathname)}`);
      return;
    }

    addToCart({
      ...item,
      restaurant: restaurant.id,
    });

    setAddedItemId(item.id);
    setLastAddedItemName(item.name);
    setShowToast(true);

    if (addedItemTimerRef.current) clearTimeout(addedItemTimerRef.current);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);

    addedItemTimerRef.current = setTimeout(() => {
      setAddedItemId(null);
    }, 1200);

    toastTimerRef.current = setTimeout(() => {
      setShowToast(false);
    }, 2200);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getRestaurantDetail(id);
        setRestaurant(res.data);

        const foodsRes = await getRestaurantFoods(id);
        setFoods(foodsRes.data);
      } catch (err) {
        console.error("Restaurant load error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    return () => {
      if (addedItemTimerRef.current) clearTimeout(addedItemTimerRef.current);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading restaurant...
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Restaurant not found
      </div>
    );
  }

  const imageUrl = toAbsoluteMediaUrl(
    restaurant.logo_final || restaurant.logo_url || restaurant.logo
  );

  return (
    <div className="min-h-screen bg-[#111214]">
      <div
        className={`fixed right-4 top-4 z-50 transform transition-all duration-300 ${
          showToast
            ? "translate-y-0 opacity-100"
            : "-translate-y-4 pointer-events-none opacity-0"
        }`}
      >
        <div className="flex items-center gap-3 rounded-2xl border border-orange-400/30 bg-[#1b1f27] px-4 py-3 shadow-2xl">
          <CheckCircle2 className="h-6 w-6 text-orange-400" />
          <div>
            <p className="text-sm font-semibold text-white">Added to cart</p>
            <p className="max-w-[220px] truncate text-xs text-gray-400">
              {lastAddedItemName}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/cart")}
            className="rounded-lg bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-200 transition hover:bg-orange-500/15"
          >
            View
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-[#1b1f27]/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-[#1b1f27]/25"
          >
            <ArrowLeft size={18} />
            Back
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-[#1b1f27] rounded-3xl shadow-xl overflow-hidden mb-10">
          <img
            src={
              imageUrl ||
              "https://images.unsplash.com/photo-1504674900247-0877df9cc836"
            }
            alt={restaurant.name}
            className="w-full h-80 object-cover"
          />

          <div className="p-8">
            <h1 className="text-4xl font-bold mb-2">{restaurant.name}</h1>
            <p className="text-gray-300 mb-3">{restaurant.city}</p>

            <div className="flex items-center gap-2">
              <Star className="text-yellow-400" fill="currentColor" />
              <span className="font-semibold">{restaurant.rating}</span>
            </div>

            <p className="mt-3 text-gray-300">{restaurant.theme}</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-6">Menu</h2>

        {foods.length === 0 && <p className="text-gray-400">No food available</p>}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {foods.map((item) => {
            const foodImage =
              toAbsoluteMediaUrl(item.image_final || item.image_url || item.image) ||
              "https://images.unsplash.com/photo-1606755962773-d324e0a13086";
            const currentPrice = toSafeNumber(item.price, 0);
            const fallbackDiscount = item.id % 3 === 0 ? 20 : 10;
            const discountPercent = Math.max(
              5,
              Math.min(
                60,
                Math.round(
                  toSafeNumber(
                    item.discount || item.discount_percent || item.offer_percent,
                    fallbackDiscount
                  )
                )
              )
            );
            const regularPrice = Math.round(currentPrice / (1 - discountPercent / 100));
            const saveAmount = Math.max(0, regularPrice - currentPrice);

            return (
              <div key={item.id} className="bg-[#1b1f27] rounded-2xl shadow-lg p-6">
                <div className="relative mb-4">
                  <img
                    src={foodImage}
                    alt={item.name}
                    className="w-full h-44 object-cover rounded-xl"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
                    -{discountPercent}%
                  </span>
                </div>

                <h3 className="text-xl font-bold mb-2">{item.name}</h3>

                <p className="text-gray-400 mb-2">{item.category || "Food"}</p>

                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                    Save {formatMoney(saveAmount)}
                  </span>
                  <span className="rounded-full bg-orange-500/15 px-3 py-1 text-xs font-semibold text-orange-200">
                    Fresh Deal
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-bold text-orange-300">
                      {formatMoney(currentPrice)}
                    </p>
                    <p className="text-sm text-gray-400 line-through">
                      {formatMoney(regularPrice)}
                    </p>
                  </div>

                  <button
                    onClick={() => handleAddToCart(item)}
                    className={`flex items-center gap-2 rounded px-4 py-2 text-sm font-semibold text-white transition ${
                      addedItemId === item.id
                        ? "bg-orange-500"
                        : "bg-orange-500 hover:bg-orange-600"
                    }`}
                  >
                    {addedItemId === item.id ? (
                      <>
                        <CheckCircle2 size={16} />
                        Added
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={16} />
                        Add
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}



