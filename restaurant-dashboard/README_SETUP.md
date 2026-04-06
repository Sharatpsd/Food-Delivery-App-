# Restaurant Dashboard

Minimal React dashboard for restaurant owners to manage orders.

## Features

- ✅ Login with JWT
- ✅ View all orders for your restaurant
- ✅ Update order status (pending → accepted → cooking → delivered)
- ✅ Real-time order list
- ✅ Clean, minimal UI with Tailwind CSS

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env.local` file:**
   ```bash
   echo "VITE_API_BASE_URL=http://127.0.0.1:8000" > .env.local
   ```

   Or for production:
   ```
   VITE_API_BASE_URL=https://food-delivery-app-1-ihcm.onrender.com
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Login:**
   - Go to `http://localhost:5173/login`
   - Use a restaurant owner account (role=restaurant)

## Project Structure

```
src/
├── pages/
│   ├── Login.jsx      (Login form with JWT)
│   ├── Orders.jsx     (Orders list & status update)
│   ├── Dashboard.jsx  (Main dashboard)
│   └── Foods.jsx      (Food management)
├── components/
│   └── Navbar.jsx     (Navigation)
├── utils/
│   ├── api.js         (Axios setup with token handling)
│   └── auth.js        (Token management)
├── App.jsx            (Router & layout)
└── main.jsx           (Entry point)
```

## API Endpoints Used

- `POST /api/auth/token/` - Login
- `GET /api/orders/restaurant-orders/` - Get restaurant orders
- `POST /api/orders/{id}/update-status/` - Update order status

## Order Status Flow

```
pending → accepted → cooking → delivered
```

Click buttons to progress through statuses.

## Technologies

- React 19
- Vite
- Tailwind CSS
- Axios
- React Router v7
