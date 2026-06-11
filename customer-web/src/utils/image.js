const normalizeApiBase = (baseUrl) => {
  if (!baseUrl) {
    return import.meta.env.PROD
      ? "https://food-delivery-app-1-ihcm.onrender.com"
      : "http://localhost:8000";
  }
  const trimmed = baseUrl.replace(/\/$/, "");
  return trimmed.endsWith("/api")
    ? trimmed.slice(0, -"/api".length)
    : trimmed;
};

const API_BASE = normalizeApiBase(import.meta.env.VITE_API_BASE_URL);
const localFoodFiles = [
  "bbq.jpg",
  "baked-turkey-with-lettuce-pan.jpg",
  "bb1_lam.jpg",
  "Panshi_Chicken_Fried_Rice.jpg",
  "images.jpg",
  "Chicken-Kacchi-Biryani.jpg",
  "Sultans_Chicken_Biryani.jpg",
  "cheese-loaded-pizza-photo.jpeg",
  "Pepperoni-pizza.jpg",
  "Chili-Chicken-Recipe.webp",
  "Chillox_Classic_Burger.jpg",
  "Mutton_Korma.jpg",
  "Mutton_Tehari.jpg",
  "Tempura_Prawns.jpg",
  "Salmon_Nigiri.jpg",
  "Star_Special_Seekh_Kebab.jpg",
  "Chicken_Handi.jpg",
];

const localFoodPool = localFoodFiles.map(
  (file) => `/media/foods/images/${encodeURIComponent(file)}`
);
const localRestaurantFiles = [
  "cafe_rio.png",
  "haji biriyani.jpg",
  "handi_res.jpg",
  "izumi.jpg",
  "kacchi-bhai.jpg",
  "spicy-ramna.jpg",
  "sultan.png",
  "takeout.jpg",
];

const localRestaurantPool = localRestaurantFiles.map(
  (file) => `/restaurants/${encodeURIComponent(file)}`
);

const getSeed = (value) => {
  const text = String(value || "");
  let sum = 0;
  for (let i = 0; i < text.length; i += 1) sum += text.charCodeAt(i);
  return sum;
};

const pickFromPool = (pool, seedValue) => {
  if (!pool.length) return null;
  const idx = Math.abs(getSeed(seedValue)) % pool.length;
  return pool[idx];
};

const keywordFoodMap = [
  {
    keys: ["bbq full chicken", "full chicken"],
    file: "baked-turkey-with-lettuce-pan.jpg",
  },
  {
    keys: ["bbq beef ribs", "bbq ribs", "beef ribs", "bq ribs"],
    file: "baked-turkey-with-lettuce-pan.jpg",
  },
  { keys: ["bbq lamb chops", "lamb chops"], file: "bb1_lam.jpg" },
  { keys: ["bbq"], file: "bbq.jpg" },
  {
    keys: ["panshi chicken fried rice"],
    file: "Panshi_Chicken_Fried_Rice.jpg",
  },
  { keys: ["hakka noodles", "hakka noodle"], file: "images.jpg" },
  { keys: ["panshi", "fried rice"], file: "Panshi_Chicken_Fried_Rice.jpg" },
  { keys: ["kacchi", "biryani"], file: "Chicken-Kacchi-Biryani.jpg" },
  { keys: ["sultan"], file: "Sultans_Chicken_Biryani.jpg" },
  { keys: ["pizza"], file: "Pepperoni-pizza.jpg" },
  { keys: ["burger", "chillox"], file: "Chillox_Classic_Burger.jpg" },
  { keys: ["noodle", "chilli"], file: "Chili-Chicken-Recipe.webp" },
  { keys: ["korma"], file: "Mutton_Korma.jpg" },
  { keys: ["tehari"], file: "Mutton_Tehari.jpg" },
  { keys: ["prawn", "shrimp", "tempura"], file: "Tempura_Prawns.jpg" },
  { keys: ["sushi", "nigiri"], file: "Salmon_Nigiri.jpg" },
  { keys: ["kebab"], file: "Star_Special_Seekh_Kebab.jpg" },
  { keys: ["handi"], file: "Chicken_Handi.jpg" },
];
const keywordRestaurantMap = [
  { keys: ["izumi"], file: "izumi.jpg" },
  { keys: ["haji"], file: "haji biriyani.jpg" },
  { keys: ["handi"], file: "handi_res.jpg" },
  { keys: ["kacchi", "kacci"], file: "kacchi-bhai.jpg" },
  { keys: ["sultan"], file: "sultan.png" },
  { keys: ["takeout"], file: "takeout.jpg" },
  { keys: ["spicy"], file: "spicy-ramna.jpg" },
  { keys: ["cafe"], file: "cafe_rio.png" },
];
const decodeIfEncodedUrl = (source) => {
  if (!source) return source;
  if (source.includes("https%3A") || source.includes("http%3A")) {
    return decodeURIComponent(source.replace("/media/", ""));
  }
  return source;
};

export const toAbsoluteMediaUrl = (value) => {
  if (!value) return null;
  let source = decodeIfEncodedUrl(String(value).trim());

  source = source.replace(/^https?:\/\/(127\.0\.0\.1|localhost):8000/i, API_BASE);
  if (source.startsWith("food-delivery-app-1-ihcm.onrender.com")) {
    source = `https://${source}`;
  }

  if (source.startsWith("http")) return source;
  if (source.startsWith("/")) return `${API_BASE}${source}`;
  return `${API_BASE}/${source}`;
};

const shouldIgnoreRemoteImage = (value) => {
  if (!value) return false;

  try {
    const source = decodeIfEncodedUrl(String(value).trim());
    const parsed = new URL(source);
    const host = parsed.hostname.toLowerCase();

    if (host.includes("seeklogo.com")) return true;
    if (host.includes("via.placeholder.com")) return true;
  } catch {
    return false;
  }

  return false;
};

export const buildImageSources = (values = [], fallback = null) => {
  const sources = [];

  const fallbackAbsolute = toAbsoluteMediaUrl(fallback);
  if (fallbackAbsolute) sources.push(fallbackAbsolute);

  values.forEach((value) => {
    if (shouldIgnoreRemoteImage(value)) {
      return;
    }

    const absolute = toAbsoluteMediaUrl(value);
    if (absolute) sources.push(absolute);
  });

  return [...new Set(sources.filter(Boolean))];
};

export const getImageFromSources = (sources = [], fallback = "") =>
  sources.find(Boolean) || fallback;

export const getLocalFoodFallback = (name = "", seed = "") => {
  const lower = String(name || "").toLowerCase();
  const mapped = keywordFoodMap.find(({ keys }) =>
    keys.some((key) => lower.includes(key))
  );
  if (mapped) return `/media/foods/images/${encodeURIComponent(mapped.file)}`;
  return pickFromPool(localFoodPool, `${name}-${seed}`) || localFoodPool[0];
};

export const getLocalRestaurantFallback = (name = "", seed = "") =>
{
  const lower = String(name || "").toLowerCase();
  const mapped = keywordRestaurantMap.find(({ keys }) =>
    keys.some((key) => lower.includes(key))
  );
  if (mapped) return `/restaurants/${encodeURIComponent(mapped.file)}`;
  return (
    pickFromPool(localRestaurantPool, `${name}-${seed}`) || localRestaurantPool[0]
  );
};
