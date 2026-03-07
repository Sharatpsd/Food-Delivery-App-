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
  "Panshi Chicken Fried Rice.jpg",
  "Chicken-Kacchi-Biryani.jpg",
  "Sultan's Chicken Biryani.jpg",
  "cheese-loaded-pizza-photo.jpeg",
  "Pepperoni-pizza.jpg",
  "Chili-Chicken-Recipe.webp",
  "Chillox Classic Burger.jpg",
  "Mutton Korma.jpg",
  "Mutton Tehari.jpg",
  "Tempura Prawns.jpg",
  "Salmon Nigiri.jpg",
  "Star Special Seekh Kebab.jpg",
  "Handi Chicken Biryani.jpg",
];

const localFoodPool = localFoodFiles.map(
  (file) => `/media/foods/${encodeURIComponent(file)}`
);
const localRestaurantFiles = [
  "bbq-party.jpg",
  "pansi.webp",
  "cheez update.jpg",
  "handi_image.jpg",
  "izumi.jpg",
  "takeout restaurent.jpg",
  "kacci bhai logo.jpg",
  "Star_Kabab (1).jpg",
  "images.jpg",
  "1000092399.jpg",
  "chillox orginal .jpg",
];

const localRestaurantPool = localRestaurantFiles.map(
  (file) => `/media/restaurants/${encodeURIComponent(file)}`
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
  { keys: ["bbq"], file: "bbq.jpg" },
  { keys: ["panshi", "fried rice"], file: "Panshi Chicken Fried Rice.jpg" },
  { keys: ["kacchi", "biryani"], file: "Chicken-Kacchi-Biryani.jpg" },
  { keys: ["sultan"], file: "Sultan's Chicken Biryani.jpg" },
  { keys: ["pizza"], file: "Pepperoni-pizza.jpg" },
  { keys: ["burger", "chillox"], file: "Chillox Classic Burger.jpg" },
  { keys: ["noodle", "chilli"], file: "Chili-Chicken-Recipe.webp" },
  { keys: ["korma"], file: "Mutton Korma.jpg" },
  { keys: ["tehari"], file: "Mutton Tehari.jpg" },
  { keys: ["prawn", "shrimp", "tempura"], file: "Tempura Prawns.jpg" },
  { keys: ["sushi", "nigiri"], file: "Salmon Nigiri.jpg" },
  { keys: ["kebab"], file: "Star Special Seekh Kebab.jpg" },
  { keys: ["handi"], file: "Handi Chicken Biryani.jpg" },
];
const keywordRestaurantMap = [
  { keys: ["bbq"], file: "bbq-party.jpg" },
  { keys: ["panshi", "pansi"], file: "pansi.webp" },
  { keys: ["cheez"], file: "cheez update.jpg" },
  { keys: ["handi"], file: "handi_image.jpg" },
  { keys: ["izumi"], file: "izumi.jpg" },
  { keys: ["takeout"], file: "takeout restaurent.jpg" },
  { keys: ["kacchi", "kacci"], file: "kacci bhai logo.jpg" },
  { keys: ["star", "kabab", "kebab"], file: "Star_Kabab (1).jpg" },
  { keys: ["sultan"], file: "sultan dine .jpg orginal.png" },
  { keys: ["madchef"], file: "madchef1.jpg" },
  { keys: ["chillox"], file: "chillox orginal .jpg" },
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

const toPublicMediaPath = (value) => {
  if (!value) return null;
  const source = decodeIfEncodedUrl(String(value).trim());

  if (source.startsWith("http")) {
    try {
      const parsed = new URL(source);
      if (parsed.pathname.startsWith("/media/")) return parsed.pathname;
    } catch {
      return null;
    }
    return null;
  }

  if (source.startsWith("/media/")) return source;
  if (source.startsWith("media/")) return `/${source}`;

  const mediaIndex = source.indexOf("/media/");
  if (mediaIndex >= 0) return source.slice(mediaIndex);

  return null;
};

export const buildImageSources = (values = [], fallback = null) => {
  const sources = [];

  values.forEach((value) => {
    const absolute = toAbsoluteMediaUrl(value);
    if (absolute) sources.push(absolute);

    const mediaPath = toPublicMediaPath(value);
    if (mediaPath) sources.push(mediaPath);
  });

  if (fallback) sources.push(fallback);
  return [...new Set(sources.filter(Boolean))];
};

export const getImageFromSources = (sources = [], fallback = "") =>
  sources.find(Boolean) || fallback;

export const getLocalFoodFallback = (name = "", seed = "") => {
  const lower = String(name || "").toLowerCase();
  const mapped = keywordFoodMap.find(({ keys }) =>
    keys.some((key) => lower.includes(key))
  );
  if (mapped) return `/media/foods/${encodeURIComponent(mapped.file)}`;
  return pickFromPool(localFoodPool, `${name}-${seed}`) || localFoodPool[0];
};

export const getLocalRestaurantFallback = (name = "", seed = "") =>
{
  const lower = String(name || "").toLowerCase();
  const mapped = keywordRestaurantMap.find(({ keys }) =>
    keys.some((key) => lower.includes(key))
  );
  if (mapped) return `/media/restaurants/${encodeURIComponent(mapped.file)}`;
  return (
    pickFromPool(localRestaurantPool, `${name}-${seed}`) || localRestaurantPool[0]
  );
};
