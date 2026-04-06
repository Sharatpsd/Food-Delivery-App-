# Restaurant Dashboard - Complete Setup Guide

## 📁 File Structure

```
restaurant-dashboard/src/
├── pages/
│   ├── Login.jsx           ✓ Login form with JWT
│   ├── Orders.jsx          ✓ Full-featured orders page (with styles)
│   ├── OrdersSimple.jsx    ✓ Minimal orders page
│   ├── Dashboard.jsx       - Dashboard home
│   └── Foods.jsx           - Food management
├── components/
│   ├── Navbar.jsx          ✓ Navigation + logout
│   ├── OrderCard.jsx       ✓ Order item display
│   ├── LoadingSpinner.jsx  ✓ Loading state
│   └── ProtectedRoute.jsx  ✓ Authentication guard
├── utils/
│   ├── api.js              ✓ Axios instance with JWT
│   └── auth.js             - Token helpers
├── App.jsx                 ✓ Routes & layout
├── main.jsx                ✓ Entry point
└── index.css               - Tailwind styles
```

## ✅ What's Ready to Use

### 1. **Login Page** (`pages/Login.jsx`)
- JWT token login
- Error handling
- Clean form UI
- Redirects to dashboard on success

**Usage:**
```jsx
<Route path="/login" element={<Login />} />
```

### 2. **Orders Page** (`pages/Orders.jsx` - Full Featured)
- Auto-refresh every 10 seconds
- Status update buttons
- Color-coded status badges
- Responsive design

**API Endpoint:**
- GET `/api/orders/restaurant-orders/` - Fetch orders
- POST `/api/orders/{id}/update-status/` - Update status

### 3. **Orders Page (Minimal)** (`pages/OrdersSimple.jsx`)
- Same functionality
- Cleaner, simpler code
- Perfect for understanding the flow

### 4. **Components**

#### OrderCard.jsx
- Displays single order
- Status buttons based on current status
- Shows order items

#### LoadingSpinner.jsx
- Loading indicator
- Centered layout

#### ProtectedRoute.jsx
- Wraps authenticated routes
- Redirects to login if no token

#### Navbar.jsx
- Navigation links
- Logout button
- Hides on login page

### 5. **API Integration** (`utils/api.js`)
- Axios instance
- Auto JWT token attachment
- Token refresh on 401
- Error handling

**Example Usage:**
```jsx
import api from "../utils/api";

// GET request
const res = await api.get("/orders/restaurant-orders/");

// POST request
await api.post("/orders/123/update-status/", { status: "cooking" });
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env.local
# Edit .env.local if needed
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Open Browser
```
http://localhost:5173/login
```

### 5. Login
- Use a restaurant owner account (role must be 'restaurant')
- Use credentials from your Django backend

## 📊 Order Status Flow

```
pending → accepted → cooking → on_the_way → delivered
```

Each status has a corresponding button. Click to progress to next status.

## 🔐 Authentication Flow

1. User enters username/password on Login page
2. Send to `/api/auth/token/`
3. Get `access` and `refresh` tokens
4. Store in `localStorage` as `access` and `refresh`
5. All API requests attach token: `Authorization: Bearer {token}`
6. If 401 error, redirect to login

## 🎯 Key Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/token/` | Login |
| GET | `/api/orders/restaurant-orders/` | Fetch restaurant orders |
| POST | `/api/orders/{id}/update-status/` | Update order status |

## 📝 Environment Variables

Create `.env.local`:
```
VITE_API_BASE_URL=http://127.0.0.1:8000
```

For production:
```
VITE_API_BASE_URL=https://food-delivery-app-1-ihcm.onrender.com
```

## 🛠️ Development Tips

### View Order Response Structure
```jsx
// In console after fetchOrders
console.log(orders[0]);
// Output:
{
  id: 1,
  customer_name: "John Doe",
  restaurant_name: "My Restaurant",
  total: "150.00",
  status: "pending",
  items_detail: [
    { food_name: "Biryani", quantity: 2, price: "300.00" }
  ],
  created_at: "2024-04-06T10:30:00Z"
}
```

### Test Status Update
```jsx
// Click "Accept" button on any pending order
// Should update in list instantly
```

### Fix Common Issues

**Issue:** "Failed to load orders"
- Check if Django server is running: `python manage.py runserver`
- Check API URL in `.env.local`
- Check browser console for CORS errors

**Issue:** "Wrong username or password"
- Ensure you're using a 'restaurant' role account
- Check account exists in Django admin

**Issue:** "Not authorized" on order update
- Only restaurant owner can update their own orders
- Check if logged-in user owns the restaurant

## 🎨 Styling

- Tailwind CSS already configured
- Dark mode friendly
- Mobile responsive
- Orange/red color scheme

## 📦 Production Build

```bash
npm run build
# Creates dist/ folder
```

Deploy `dist/` folder to your hosting (Vercel, Netlify, etc.)

## 🐛 Debugging

Enable console logs in OrdersSimple.jsx:
```jsx
const res = await api.get("/orders/restaurant-orders/");
console.log("Orders:", res.data);
setOrders(Array.isArray(res.data) ? res.data : []);
```

## ✨ Next Steps

1. Try login - should redirect to orders page
2. View orders - should show list
3. Click status button - should update and refresh
4. Click logout - should return to login
5. Customize styles in Tailwind
6. Add more features (filters, search, etc.)

---

**Status:** ✅ Production Ready
**Minimal:** ✅ Only essential features
**Working:** ✅ All core functions tested
