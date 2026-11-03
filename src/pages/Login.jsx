import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ShoppingBag, 
  ShieldCheck, 
  Sparkles, 
  ChefHat, 
  UserCheck, 
  LogOut,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  // Customer Form State
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPassword, setCustomerPassword] = useState('');
  const [showCustomerPassword, setShowCustomerPassword] = useState(false);
  const [customerError, setCustomerError] = useState('');
  const [customerLoading, setCustomerLoading] = useState(false);

  // Admin Form State
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);

  const { login, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectMessage = location.state?.message;

  // Handle Customer Login
  const handleCustomerSubmit = async (e) => {
    e.preventDefault();
    setCustomerError('');

    if (!customerEmail || !customerPassword) {
      setCustomerError('Please enter both email and password.');
      return;
    }

    setCustomerLoading(true);
    try {
      const res = await login(customerEmail, customerPassword);
      if (res.success) {
        if (res.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/menu');
        }
      } else {
        setCustomerError(res.message || 'Invalid email or password.');
      }
    } catch (err) {
      setCustomerError(err.message || 'Customer login failed.');
    } finally {
      setCustomerLoading(false);
    }
  };

  // Handle Admin Login
  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setAdminError('');

    if (!adminEmail || !adminPassword) {
      setAdminError('Please enter administrator email and password.');
      return;
    }

    setAdminLoading(true);
    try {
      const res = await login(adminEmail, adminPassword);
      if (res.success) {
        if (res.user.role !== 'admin') {
          setAdminError('Access Denied: This is a customer account. Please use the Customer Sign In side.');
          logout();
          return;
        }
        navigate('/admin');
      } else {
        setAdminError(res.message || 'Invalid administrator credentials.');
      }
    } catch (err) {
      setAdminError(err.message || 'Admin login failed.');
    } finally {
      setAdminLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto my-10 px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      
      {/* Portal Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
          FoodHub Access Portal
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Welcome to FoodHub
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm">
          Select your portal below: Customers order meals, and Administrators manage kitchen operations.
        </p>
      </div>

      {/* Existing Session Alert */}
      {user && (
        <div className="max-w-xl mx-auto bg-slate-100 border border-slate-200 p-4 rounded-2xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span>
              Currently signed in as: <strong>{user.email}</strong> ({user.role})
            </span>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-1 font-bold text-red-600 hover:text-red-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      )}

      {redirectMessage && (
        <div className="max-w-xl mx-auto p-3.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{redirectMessage}</span>
        </div>
      )}

      {/* Two-Column Side-by-Side Login Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        
        {/* ================= LEFT SIDE: CUSTOMER LOGIN ================= */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-soft flex flex-col justify-between space-y-6 relative overflow-hidden">
          
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 shadow-sm">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-600 block">
                  For Foodies & Diners
                </span>
                <h2 className="text-2xl font-black text-slate-900">
                  Customer Sign In
                </h2>
                <p className="text-slate-500 text-xs">
                  Browse menus, order hot food & track live deliveries
                </p>
              </div>
            </div>

            {customerError && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold animate-fade-in">
                {customerError}
              </div>
            )}

            {/* Customer Form */}
            <form onSubmit={handleCustomerSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Customer Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    required
                    placeholder="customer@foodhub.com"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showCustomerPassword ? 'text' : 'password'}
                    value={customerPassword}
                    onChange={(e) => setCustomerPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCustomerPassword(!showCustomerPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showCustomerPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={customerLoading}
                className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-orange-500/25 transition disabled:opacity-50 text-sm flex items-center justify-center gap-2"
              >
                <span>{customerLoading ? 'Signing in...' : 'Sign In as Customer'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Fill for Testing Customer */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setCustomerEmail('customer@foodhub.com');
                  setCustomerPassword('customer123');
                }}
                className="w-full py-2 bg-orange-50/80 hover:bg-orange-100/80 border border-orange-200/60 rounded-xl text-xs font-bold text-orange-700 transition"
              >
                ⚡ Fill Test Customer (customer@foodhub.com)
              </button>
            </div>
          </div>

          {/* Footer for Customer */}
          <div className="pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Don't have a customer account?{' '}
              <Link to="/register" className="font-bold text-orange-600 hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* ================= RIGHT SIDE: ADMIN LOGIN ================= */}
        <div className="bg-slate-900 text-white p-8 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl flex flex-col justify-between space-y-6 relative overflow-hidden">
          
          {/* Background Glow */}
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-6 relative z-10">
            {/* Header */}
            <div className="flex items-center gap-4 pb-4 border-b border-slate-800">
              <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 text-amber-400 flex items-center justify-center shrink-0 shadow-sm">
                <ShieldCheck className="w-7 h-7 text-amber-400" />
              </div>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400 block">
                  Staff & Kitchen Management
                </span>
                <h2 className="text-2xl font-black text-white">
                  Admin Portal Sign In
                </h2>
                <p className="text-slate-400 text-xs">
                  Manage dishes, receive customer orders & control dispatch
                </p>
              </div>
            </div>

            {adminError && (
              <div className="p-3.5 bg-red-900/60 border border-red-700 text-red-200 rounded-xl text-xs font-semibold animate-fade-in">
                {adminError}
              </div>
            )}

            {/* Admin Form */}
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Administrator Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    required
                    placeholder="admin@foodhub.com"
                    className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 rounded-xl text-sm font-medium focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Admin Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showAdminPassword ? 'text' : 'password'}
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 rounded-xl text-sm font-medium focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={adminLoading}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-95 text-slate-950 font-black py-3.5 rounded-2xl shadow-lg shadow-orange-500/20 transition disabled:opacity-50 text-sm flex items-center justify-center gap-2"
              >
                <ChefHat className="w-4 h-4" />
                <span>{adminLoading ? 'Verifying Admin...' : '🔐 Sign In to Admin Dashboard'}</span>
              </button>
            </form>

            {/* Quick Fill for Testing Admin */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setAdminEmail('admin@foodhub.com');
                  setAdminPassword('admin123');
                }}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-xl text-xs font-bold text-amber-300 transition"
              >
                ⚡ Fill Admin Credentials (admin@foodhub.com)
              </button>
            </div>
          </div>

          {/* Footer for Admin */}
          <div className="pt-4 border-t border-slate-800 text-center relative z-10">
            <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Strictly restricted to FoodHub authorized administrators</span>
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
