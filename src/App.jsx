import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import FoodDetails from './pages/FoodDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ShieldAlert } from 'lucide-react';

function AdminRoute({ children }) {
  const { user, isAdmin } = useAuth();

  if (!user) {
    return <Navigate to="/login" state={{ fromAdmin: true, message: 'Please sign in with administrator credentials.' }} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-slate-100 shadow-soft text-center space-y-5 animate-fade-in">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900">Administrator Access Only</h2>
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
            You are currently signed in as a Customer ({user.email}). Only FoodHub administrators can access this management dashboard.
          </p>
        </div>
        <div className="pt-2 flex flex-col gap-2.5">
          <Link
            to="/menu"
            className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-md transition text-sm"
          >
            Return to Food Menu
          </Link>
          <Link
            to="/login"
            className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs transition"
          >
            Sign In as Admin
          </Link>
        </div>
      </div>
    );
  }

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="flex flex-col min-h-screen bg-[#FBFBFC]">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/food/:id" element={<FoodDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/admin" 
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

