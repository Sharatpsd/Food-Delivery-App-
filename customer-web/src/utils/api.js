// // src/utils/api.js

// // ---------- MOCK RESTAURANTS (APPROVED ONLY - PUBLICLY VISIBLE) ----------
// const approvedRestaurants = [
//   {
//     id: 1,
//     name: "PizzaBurga",
//     logo: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80",
//     image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
//     rating: 4.8,
//     time: "25 min",
//     price: "$$",
//     category: "Pizza",
//     distance: "1.2 km",
//     city: "Dhaka",
//     theme: "Best pizza in town with fresh ingredients",
//     must_try: "Margherita Pizza, Garlic Bread",
//     pricePerItem: 12.99,
//     isApproved: true, // ✅ Only approved restaurants show
//     menu: [
//       {
//         id: "p1",
//         name: "Margherita Pizza",
//         price: 12.99,
//         image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&q=80",
//       },
//       {
//         id: "p2",
//         name: "Pepperoni Pizza",
//         price: 14.99,
//         image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&q=80",
//       },
//     ],
//   },
//   {
//     id: 2,
//     name: "Biryani House",
//     logo: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&q=80",
//     image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&q=80",
//     rating: 4.6,
//     time: "20 min",
//     price: "$",
//     category: "Biryani",
//     distance: "0.8 km",
//     city: "Dhaka",
//     theme: "Authentic Bangladeshi biryani",
//     must_try: "Chicken Biryani, Beef Biryani",
//     pricePerItem: 8.99,
//     isApproved: true,
//     menu: [
//       {
//         id: "b1",
//         name: "Chicken Biryani",
//         price: 8.99,
//         image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&q=80",
//       },
//     ],
//   },
//   {
//     id: 3,
//     name: "Shawarma King",
//     logo: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&q=80",
//     image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80",
//     rating: 4.9,
//     time: "15 min",
//     price: "$",
//     category: "Fast Food",
//     distance: "0.5 km",
//     city: "Dhaka",
//     theme: "Middle Eastern shawarma perfection",
//     must_try: "Chicken Shawarma, Falafel",
//     pricePerItem: 6.99,
//     isApproved: true,
//     menu: [
//       {
//         id: "s1",
//         name: "Chicken Shawarma",
//         price: 6.99,
//         image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&q=80",
//       },
//     ],
//   },
// ];

// // ---------- PENDING RESTAURANTS (ADMIN ONLY - NOT PUBLIC) ----------
// const pendingRestaurants = [
//   {
//     id: 999,
//     name: "New Grill Palace",
//     logo: null, // Uploaded by owner
//     image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3133?w=400&q=80",
//     rating: 0,
//     time: "N/A",
//     price: "$$",
//     category: "Grill",
//     distance: "1.5 km",
//     city: "Dhaka",
//     theme: "Pending approval",
//     isApproved: false,
//     status: "pending",
//   },
// ];

// // ---------- PUBLIC API FUNCTIONS (Only Approved Restaurants) ----------

// // ✅ Get only APPROVED restaurants (public homepage)
// export const getRestaurants = async ({ category = "", search = "" } = {}) => {
//   await new Promise((resolve) => setTimeout(resolve, 800));

//   let filtered = approvedRestaurants.filter(r => r.isApproved);

//   if (category) {
//     filtered = filtered.filter(
//       (r) => r.category.toLowerCase() === category.toLowerCase()
//     );
//   }

//   if (search) {
//     const q = search.toLowerCase();
//     filtered = filtered.filter(
//       (r) =>
//         r.name.toLowerCase().includes(q) ||
//         r.category.toLowerCase().includes(q) ||
//         r.city.toLowerCase().includes(q)
//     );
//   }

//   return { data: filtered };
// };

// // ✅ Get single approved restaurant details
// export const getRestaurantDetail = async (id) => {
//   await new Promise((resolve) => setTimeout(resolve, 500));

//   const restaurant = approvedRestaurants.find(
//     (r) => r.id === Number.parseInt(id, 10) && r.isApproved
//   );

//   if (!restaurant) {
//     throw new Error("Restaurant not found or not approved");
//   }

//   return { data: restaurant };
// };

// // ---------- PARTNER REGISTRATION API (Backend Ready) ----------

// // ✅ Submit Restaurant Owner Request
// export const submitRestaurantOwnerRequest = async (payload) => {
//   console.log("✅ Restaurant Owner Request:", payload);
  
//   await new Promise((resolve) => setTimeout(resolve, 1500));
  
//   // TODO: Replace with real backend POST /api/join-requests
//   // const response = await fetch('/api/join-requests', {
//   //   method: 'POST',
//   //   body: formData
//   // });
  
//   return { 
//     ok: true, 
//     message: "✅ Request submitted! Admin will review within 24 hours.",
//     requestId: Date.now()
//   };
// };

// // ✅ Submit Delivery Partner Request
// export const submitDeliveryPartnerRequest = async (payload) => {
//   console.log("✅ Delivery Partner Request:", payload);
  
//   await new Promise((resolve) => setTimeout(resolve, 1500));
  
//   // TODO: Replace with real backend POST /api/join-requests
//   // const response = await fetch('/api/join-requests', {
//   //   method: 'POST',
//   //   body: formData
//   // });
  
//   return { 
//     ok: true, 
//     message: "✅ Request submitted! Admin will review within 24 hours.",
//     requestId: Date.now()
//   };
// };

// // ---------- ADMIN ONLY API FUNCTIONS (Future Dashboard) ----------

// // ✅ Get all join requests (Admin dashboard)
// export const getJoinRequests = async () => {
//   await new Promise((resolve) => setTimeout(resolve, 1000));
//   return {
//     data: [
//       {
//         id: 1,
//         role: 'restaurant',
//         name: 'New Restaurant XYZ',
//         email: 'owner@example.com',
//         phone: '01783720914',
//         status: 'pending',
//         createdAt: '2025-12-08'
//       },
//       {
//         id: 2,
//         role: 'delivery',
//         name: 'John Delivery',
//         email: 'delivery@example.com',
//         phone: '01712345678',
//         status: 'approved',
//         createdAt: '2025-12-07'
//       }
//     ]
//   };
// };

// // ✅ Approve restaurant request (Admin only)
// export const approveRestaurant = async (requestId) => {
//   await new Promise((resolve) => setTimeout(resolve, 1000));
//   console.log(`✅ Restaurant ${requestId} approved! Now visible on homepage.`);
//   return { ok: true, message: "Restaurant approved successfully!" };
// };

// // ✅ Get all restaurants including pending (Admin dashboard)
// export const getAllRestaurantsAdmin = async () => {
//   await new Promise((resolve) => setTimeout(resolve, 800));
//   return { data: [...approvedRestaurants, ...pendingRestaurants] };
// };

// console.log("🚀 API Ready - Only approved restaurants visible publicly");
// src/utils/api.js

// ⚠️ Change this to your real backend base URL
const API_BASE = "http://localhost:8000/api"; 

// LIST + SEARCH RESTAURANTS (uses RestaurantListView)
export const getRestaurants = async ({ category = "", search = "" } = {}) => {
  const params = new URLSearchParams();

  // Django view supports ?search=
  if (search) params.append("search", search);

  const res = await fetch(`${API_BASE}/restaurants/?${params.toString()}`);

  if (!res.ok) {
    throw new Error("Failed to fetch restaurants");
  }

  const data = await res.json(); // DRF ListAPIView returns an array

  // Optional: client-side filter by category since model has no category field
  let filtered = data;
  if (category) {
    const cat = category.toLowerCase();
    filtered = data.filter(
      (r) =>
        (r.theme && r.theme.toLowerCase().includes(cat)) ||
        (r.must_try && r.must_try.toLowerCase().includes(cat)) ||
        (r.city && r.city.toLowerCase().includes(cat))
    );
  }

  return { data: filtered };
};

// SINGLE RESTAURANT DETAIL (uses RestaurantDetailView)
export const getRestaurantDetail = async (id) => {
  const res = await fetch(`${API_BASE}/restaurants/${id}/`);
  if (!res.ok) {
    throw new Error("Restaurant not found");
  }
  const data = await res.json();
  return { data };
};

// Partner APIs – keep as placeholders for now
export const submitRestaurantOwnerRequest = async (payload) => {
  console.log("Restaurant Owner Request:", payload);
  return { ok: true, message: "Request submitted! Admin will review." };
};

export const submitDeliveryPartnerRequest = async (payload) => {
  console.log("Delivery Partner Request:", payload);
  return { ok: true, message: "Request submitted! Admin will review." };
};
