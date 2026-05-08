# Admin Dashboard

Admin Dashboard for Food Delivery App - Manage restaurants, users, orders, payments, and delivery agents.

## Features

- 📊 **Dashboard** - Real-time statistics and analytics
- 👥 **User Management** - Manage all users and their roles
- 🏪 **Restaurant Management** - Approve/reject restaurant requests and manage operations
- 📦 **Order Management** - View and track all orders
- 💳 **Payment Management** - Monitor all payment transactions
- 🚚 **Delivery Agent Approval** - Approve pending delivery agents
- 📈 **Revenue Reports** - Detailed revenue analytics and reports

## Setup

### Prerequisites

- Node.js 16+
- Backend API running on `http://localhost:8000`

### Installation

1. Install dependencies (already done via npm create vite):
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your backend URL:
```
VITE_API_URL=http://localhost:8000/api
```

### Development

Start the dev server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173/`

### Build

Build for production:
```bash
npm run build
```

## API Endpoints

### Dashboard
- `GET /admin/stats/` - Get dashboard statistics

### Users
- `GET /admin/users/` - Get all users
- `GET /admin/users/by_role/?role=customer` - Get users by role
- `POST /admin/users/{id}/suspend/` - Suspend user
- `POST /admin/users/{id}/activate/` - Activate user

### Restaurants
- `GET /admin/restaurant-requests/` - Get pending restaurant requests
- `POST /admin/restaurant-requests/{id}/approve/` - Approve restaurant
- `POST /admin/restaurant-requests/{id}/reject/` - Reject restaurant
- `GET /admin/restaurants/` - Get all restaurants
- `POST /admin/restaurants/{id}/toggle_open/` - Toggle restaurant status

### Orders
- `GET /admin/orders/` - Get all orders
- `GET /admin/orders/?status=pending` - Filter orders by status
- `GET /admin/orders/pending_orders/` - Get pending orders
- `GET /admin/orders/summary/` - Get order summary

### Payments
- `GET /admin/payments/` - Get all payments
- `GET /admin/payments/by_method/?method=bkash` - Filter by payment method

### Delivery Agents
- `GET /admin/delivery-agents/approvals/` - Get pending delivery agent approvals
- `POST /admin/delivery-agents/approvals/` - Approve delivery agent

### Reports
- `GET /admin/revenue-report/?days=30` - Get revenue report for last N days

## Authentication

All endpoints require a valid admin token in the Authorization header:
```
Authorization: Bearer <access_token>
```

The app will automatically include the token from localStorage.

## Project Structure

```
src/
├── pages/          # Page components (Dashboard, Users, Orders, etc.)
├── components/     # Reusable components
├── context/        # React context
├── utils/          # Utility functions and API
└── App.jsx         # Main app component with routing
```

## Technologies

- React 19
- React Router v6
- Axios
- Tailwind CSS
- Vite

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
