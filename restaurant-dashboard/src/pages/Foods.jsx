import { useEffect, useMemo, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import SmartImage from "../components/SmartImage";
import {
  formatCurrency,
  getPartnerRestaurantBundle,
} from "../utils/api";

export default function Foods() {
  const [bundle, setBundle] = useState({ user: null, restaurant: null, foods: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    let mounted = true;

    const fetchBundle = async () => {
      try {
        const data = await getPartnerRestaurantBundle();
        if (!mounted) return;
        setBundle(data);
      } catch (err) {
        if (!mounted) return;
        setError(err.response?.data?.detail || "Could not load menu catalog.");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchBundle();
    return () => {
      mounted = false;
    };
  }, []);

  const { restaurant, foods } = bundle;

  const categories = useMemo(
    () => ["all", ...new Set(foods.map((food) => food.category).filter(Boolean))],
    [foods]
  );

  const filteredFoods = useMemo(() => {
    const lowerQuery = query.trim().toLowerCase();
    return foods.filter((food) => {
      const matchesCategory = category === "all" || food.category === category;
      const haystack = `${food.name} ${food.description || ""} ${food.category || ""}`.toLowerCase();
      const matchesQuery = !lowerQuery || haystack.includes(lowerQuery);
      return matchesCategory && matchesQuery;
    });
  }, [foods, query, category]);

  const priceSummary = useMemo(() => {
    if (!foods.length) {
      return { min: 0, max: 0, avg: 0 };
    }

    const prices = foods.map((food) => Number(food.price || 0));
    const total = prices.reduce((sum, value) => sum + value, 0);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
      avg: total / prices.length,
    };
  }, [foods]);

  if (loading) {
    return <LoadingSpinner label="Loading your menu studio..." />;
  }

  if (error) {
    return (
      <div className="rounded-[2rem] border border-red-500/20 bg-red-500/10 px-6 py-8 text-red-100">
        <h1 className="text-2xl font-bold">Menu unavailable</h1>
        <p className="mt-3 text-sm text-red-100/80">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-white/10 bg-[#131821]/95 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.28)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-orange-300/85">
              Menu studio
            </p>
            <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
              {restaurant?.name || "Restaurant"} menu catalog
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
              Browse your backend-synced menu with category filters, pricing
              summaries, and clean image previews.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-3">
            <SmartImage
              src={restaurant?.logo || restaurant?.logo_final || restaurant?.logo_url}
              alt={restaurant?.name || "Restaurant"}
              label={restaurant?.name || "Restaurant"}
              className="h-20 w-20 rounded-[1.4rem] object-cover"
              fallbackClassName="h-20 w-20 rounded-[1.4rem]"
            />
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Total items", value: foods.length, tone: "from-orange-500 to-orange-600" },
            { label: "Categories", value: Math.max(categories.length - 1, 0), tone: "from-sky-500 to-sky-600" },
            { label: "Average price", value: formatCurrency(priceSummary.avg), tone: "from-emerald-500 to-emerald-600" },
            { label: "Top price", value: formatCurrency(priceSummary.max), tone: "from-fuchsia-500 to-rose-500" },
          ].map((card) => (
            <div key={card.label} className={`rounded-[1.6rem] bg-gradient-to-br ${card.tone} p-5`}>
              <p className="text-sm text-white/75">{card.label}</p>
              <p className="mt-4 text-3xl font-black text-white">{card.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-[#131821]/95 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.28)]">
        <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
          <label className="block">
            <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
              Search menu
            </span>
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by food name or description..."
              className="w-full rounded-2xl border border-white/10 bg-[#0d1117] px-4 py-3 text-white placeholder:text-slate-500 focus:border-orange-400/40 focus:outline-none"
            />
          </label>

          <label className="block">
            <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
              Category
            </span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[#0d1117] px-4 py-3 text-white focus:border-orange-400/40 focus:outline-none"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item === "all" ? "All categories" : item}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredFoods.length ? (
          filteredFoods.map((food) => (
            <article
              key={food.id}
              className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#131821]/95 shadow-[0_24px_60px_rgba(0,0,0,0.28)]"
            >
              <div className="relative">
                <SmartImage
                  src={food.image || food.image_final || food.image_url}
                  alt={food.name}
                  label={food.name}
                  className="h-56 w-full object-cover"
                  fallbackClassName="h-56 w-full"
                />
                <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/35 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
                  {food.category || "Menu"}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-black text-white">{food.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {food.description || "Freshly prepared item from your live menu catalog."}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-orange-400/20 bg-orange-500/10 px-3 py-2 text-sm font-bold text-orange-100">
                    {formatCurrency(food.price)}
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                  <span className="text-sm text-slate-400">
                    Availability
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                      food.is_available
                        ? "bg-emerald-500/15 text-emerald-200"
                        : "bg-rose-500/15 text-rose-200"
                    }`}
                  >
                    {food.is_available ? "Available" : "Hidden"}
                  </span>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-[2rem] border border-dashed border-white/10 bg-[#131821]/80 px-6 py-12 text-center text-slate-400 md:col-span-2 xl:col-span-3">
            No menu items match your current search and filters.
          </div>
        )}
      </section>
    </div>
  );
}
