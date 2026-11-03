import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  User, 
  Menu as MenuIcon, 
  X, 
  UtensilsCrossed, 
  ShieldCheck, 
  LogOut, 
  Package, 
  ChevronDown 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const { totalItems, subtotal } = useCart();
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) return;
    const fetchPendingOrders = async () => {
      try {
        const token = localStorage.getItem('foodhub_token');
        if (!token) return;
        const res = await fetch('/api/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const orders = await res.json();
          const pending = orders.filter((o) => o.orderStatus === 'Placed').length;
          setPendingOrdersCount(pending);
        }
      } catch (e) {}
    };

    fetchPendingOrders();
    const interval = setInterval(fetchPendingOrders, 4000);
    return () => clearInterval(interval);
  }, [isAdmin]);

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    `font-medium transition-colors duration-200 px-3 py-2 rounded-lg text-sm ${
      isActive 
        ? 'text-orange-600 bg-orange-50 font-semibold' 
        : 'text-slate-600 hover:text-orange-600 hover:bg-slate-50'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/25 group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-slate-900 group-hover:text-orange-600 transition-colors">
                Food<span className="text-orange-500">Hub</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/menu" className={navLinkClass}>
              Menu
            </NavLink>
            {/* Customer Only Nav Link: My Orders */}
            {user && !isAdmin && (
              <NavLink to="/orders" className={navLinkClass}>
                My Orders
              </NavLink>
            )}
            {isAdmin && (
              <NavLink to="/admin" className={({ isActive }) => 
                `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive ? 'bg-orange-600 text-white shadow-sm' : 'text-orange-600 bg-orange-50 hover:bg-orange-100'
                }`
              }>
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Panel</span>
                {pendingOrdersCount > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full animate-pulse ml-0.5">
                    {pendingOrdersCount} New
                  </span>
                )}
              </NavLink>
            )}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            {/* Cart Button: Hidden for Administrators */}
            {!isAdmin && (
              <Link
                to="/cart"
                className="flex items-center gap-2 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-700 px-3.5 py-2 rounded-xl text-sm font-medium transition shadow-sm hover:shadow active:scale-95"
                aria-label="View shopping cart"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 text-orange-600" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                      {totalItems}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline font-bold text-orange-900">
                  ${subtotal.toFixed(2)}
                </span>
              </Link>
            )}

            {/* User Profile / Auth */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pl-2.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition"
                >
                  <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 font-bold flex items-center justify-center text-sm">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="hidden sm:inline text-sm font-medium text-slate-700 max-w-[120px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-fade-in">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-semibold text-slate-800 truncate">{user.email}</p>
                      {isAdmin && (
                        <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                          Administrator
                        </span>
                      )}
                    </div>

                    {!isAdmin && (
                      <Link
                        to="/orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-orange-50 hover:text-orange-600"
                      >
                        <Package className="w-4 h-4" />
                        Order History
                      </Link>
                    )}

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-orange-600 font-medium hover:bg-orange-50"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 text-left border-t border-slate-100 mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-orange-600 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-md shadow-orange-500/20 transition active:scale-95"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-orange-600 md:hidden rounded-lg hover:bg-slate-100"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 space-y-2 animate-fade-in">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 text-base font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-600 rounded-xl"
            >
              Home
            </Link>
            <Link
              to="/menu"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 text-base font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-600 rounded-xl"
            >
              Full Menu
            </Link>
            {user ? (
              <>
                {!isAdmin && (
                  <Link
                    to="/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2.5 text-base font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-600 rounded-xl"
                  >
                    My Orders
                  </Link>
                )}
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2.5 text-base font-semibold text-orange-600 hover:bg-orange-50 rounded-xl"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-base font-medium text-red-600 hover:bg-red-50 rounded-xl"
                >
                  Sign Out ({user.name})
                </button>
              </>
            ) : (
              <div className="pt-2 flex flex-col gap-2 px-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-semibold border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-semibold bg-orange-500 text-white rounded-xl shadow hover:bg-orange-600"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

