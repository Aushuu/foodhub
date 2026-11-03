# 🍔 FoodHub – Frontend-First Gourmet Food Ordering Application

FoodHub is a modern, responsive, high-performance food delivery web application built with **React**, **Vite**, **Tailwind CSS**, **React Router DOM**, and **MongoDB Atlas** powered by minimal **Vercel Serverless Functions**.

---

## 🌟 Key Features

### 🛍️ Customer Experience
- **Interactive Home Page**: Hero showcase, dynamic food search, category pills, special discounts banner, popular dishes, chef recommendations, and customer testimonials.
- **Categorized Menu**: Filter by food category (Burgers, Pizza, Pasta, Asian, Bowls, Sides, Desserts, Beverages), pure vegetarian vs. non-vegetarian toggle, and real-time price & rating sorting.
- **Food Details**: High-resolution imagery, dietary indicators, estimated preparation time, dynamic quantity selector, and related dish recommendations.
- **Shopping Cart**: Real-time quantity manipulation, item removal, automatic subtotal calculation, free delivery thresholds ($40+), 8% tax calculation, and coupon codes (`WELCOME30`, `FOODHUB10`).
- **Streamlined Checkout**: Customer contact details, delivery address with apartment & notes, Cash on Delivery (COD) payment flow, and instant order placement.
- **Order History & Real-Time Status**: View past and active orders with delivery address, itemized breakdown, and status progression (`Placed` ➔ `Preparing` ➔ `On the way` ➔ `Delivered`).
- **User Authentication**: Secure customer & admin registration, login with JWT tokens, and quick 1-click demo login buttons.

### 🛡️ Admin Control Portal
- **Real-Time Analytics**: Total revenue, total orders placed, active menu items, and average order value.
- **Food Catalog Management (CRUD)**:
  - Add new dishes with image URLs, descriptions, categories, prices, and veg/non-veg status.
  - Live edit dishes directly from the dashboard.
  - Delete retired menu items with confirmation safeguards.
- **Order Fulfillment**: Track customer delivery addresses, items ordered, and update order status (`Placed` ➔ `Preparing` ➔ `On the way` ➔ `Delivered` ➔ `Cancelled`).

---

## 🏗️ Architecture

```
React (Vite + Tailwind CSS)
          │
          ▼
Minimal Serverless Functions (/api/*)
          │
          ▼
   MongoDB Atlas
```

- **No bloated Express server** or continuous Node.js backend.
- High efficiency, low latency serverless database operations.
- Clean separation between frontend components, context state, and minimal API endpoints.

---

## 📂 Project Structure

```text
foodhub/
│
├── api/                             # Minimal Vercel Serverless Functions
│   ├── _lib/
│   │   ├── db.js                    # MongoDB Atlas connection pool
│   │   └── auth.js                  # JWT & bcrypt authentication helpers
│   ├── foods/
│   │   ├── index.js                 # GET all foods, POST new food (Admin)
│   │   └── [id].js                  # GET, PUT, DELETE food by ID
│   ├── auth/
│   │   ├── register.js              # User registration
│   │   ├── login.js                 # User login
│   │   └── me.js                    # Token verification
│   ├── cart/
│   │   └── index.js                 # Customer cart sync
│   └── orders/
│       ├── index.js                 # POST order, GET all orders (Admin), PATCH status
│       └── my.js                    # GET user order history
│
├── src/
│   ├── components/
│   │   ├── Navbar.jsx               # Responsive navigation with badge & profile
│   │   ├── Footer.jsx               # Footer with links and contact info
│   │   ├── FoodCard.jsx             # Reusable food card with veg badge & hover effects
│   │   ├── SearchBar.jsx            # Instant search input with clear trigger
│   │   ├── CategoryList.jsx         # Horizontal scrollable category pills
│   │   └── CartItem.jsx             # Cart row with +/- controls and delete
│   │
│   ├── pages/
│   │   ├── Home.jsx                 # Complete landing page
│   │   ├── Menu.jsx                 # Filterable menu catalog
│   │   ├── FoodDetails.jsx          # Dish detail and quantity picker
│   │   ├── Cart.jsx                 # Shopping cart with promo codes
│   │   ├── Checkout.jsx             # Address and COD confirmation
│   │   ├── Orders.jsx               # Order history & status tracking
│   │   ├── Login.jsx                # Login with quick 1-click demo accounts
│   │   ├── Register.jsx             # Registration with customer/admin role
│   │   └── AdminDashboard.jsx       # Complete Admin CRUD & Order management
│   │
│   ├── context/
│   │   ├── AuthContext.jsx          # User auth state and token persistence
│   │   └── CartContext.jsx          # Shopping cart state, fees, calculations
│   │
│   ├── services/
│   │   ├── api.js                   # Client API abstraction with offline fallback
│   │   └── foodData.js              # Seed data catalog with Unsplash food assets
│   │
│   ├── App.jsx                      # App routing configuration
│   ├── main.jsx                     # Entry point
│   └── index.css                    # Tailwind CSS and custom typography styles
│
├── scripts/
│   └── seed.js                      # MongoDB Atlas seed script
├── .env.example
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## ⚙️ Environment Variables

Create a `.env` file in the project root:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.your-subdomain.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=foodhub
JWT_SECRET=your_super_secret_jwt_key
```

> **Note**: In local Vite mode, the frontend is already pre-configured to automatically use fallback data so you can preview, browse, test cart, checkout, and admin features immediately!

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Seed MongoDB Atlas Database
Once you add your `MONGODB_URI` to `.env`:
```bash
npm run seed
```
This populates the `foods` collection with artisan dishes and creates default test accounts:
- **Admin**: `admin@foodhub.com` / `admin123`
- **Customer**: `customer@foodhub.com` / `customer123`

---

## 🌐 Deploy to Vercel

1. Push your repository to GitHub.
2. Import the project into your [Vercel Dashboard](https://vercel.com).
3. In **Project Settings** ➔ **Environment Variables**, configure:
   - `MONGODB_URI`: Your MongoDB Atlas URI
   - `MONGODB_DB`: `foodhub`
   - `JWT_SECRET`: A secure random secret string
4. Click **Deploy**. Vercel will build the React Vite frontend and automatically deploy `/api/*` as serverless functions.

