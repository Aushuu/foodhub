import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  ArrowRight, 
  Trash2, 
  Tag, 
  ShieldCheck, 
  Truck, 
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CartItem from '../components/CartItem';

export default function Cart() {
  const { isAdmin, user } = useAuth();
  const { 
    items, 
    subtotal, 
    deliveryFee, 
    tax, 
    totalAmount, 
    clearCart,
    toastMessage
  } = useCart();

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  const navigate = useNavigate();

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');

    if (promoCode.trim().toUpperCase() === 'WELCOME30') {
      setDiscountPercent(30);
      setPromoSuccess('Promo code WELCOME30 applied! You get 30% off.');
    } else if (promoCode.trim().toUpperCase() === 'FOODHUB10') {
      setDiscountPercent(10);
      setPromoSuccess('Promo code FOODHUB10 applied! You get 10% off.');
    } else {
      setPromoError('Invalid promo code. Try WELCOME30');
    }
  };

  const discountAmount = Number(((subtotal * discountPercent) / 100).toFixed(2));
  const finalTotal = Number((totalAmount - discountAmount).toFixed(2));

  if (isAdmin) {
    return (
      <div className="max-w-xl mx-auto my-16 px-4 text-center space-y-6 animate-fade-in">
        <div className="w-24 h-24 bg-slate-900 text-amber-400 rounded-3xl flex items-center justify-center mx-auto shadow-xl border border-slate-800">
          <ShieldCheck className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-500 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Administrator Notice
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Shopping Cart is for Customers
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            You are logged in as Administrator (<strong>{user?.email}</strong>). Admins manage the food menu and prepare customer orders rather than placing food delivery orders.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/admin"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black px-6 py-3.5 rounded-2xl shadow-lg shadow-orange-500/25 transition active:scale-95 text-sm"
          >
            <span>Open Admin Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/menu"
            className="inline-flex items-center justify-center px-6 py-3.5 rounded-2xl font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition text-sm"
          >
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto my-16 px-4 text-center space-y-6 animate-fade-in">
        {/* Empty cart illustration */}
        <div className="w-32 h-32 bg-orange-50 rounded-full flex items-center justify-center mx-auto text-orange-500 shadow-inner">
          <ShoppingBag className="w-16 h-16 stroke-[1.5]" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Your Cart is Empty
          </h2>
          <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
            Looks like you haven't added anything to your cart yet. Explore our chef's special menu and satisfy your hunger!
          </p>
        </div>

        <Link
          to="/menu"
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg shadow-orange-500/25 transition active:scale-95"
        >
          <span>Explore Delicious Menu</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-sm font-semibold animate-fade-in">
          <Sparkles className="w-4 h-4 text-orange-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Review your selected dishes before checkout
          </p>
        </div>

        <button
          onClick={clearCart}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-red-500 transition px-3 py-1.5 rounded-xl hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear Cart</span>
        </button>
      </div>

      {/* Cart layout: Items on Left, Summary on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Items List */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-soft">
          <div className="divide-y divide-slate-100">
            {items.map((item) => (
              <CartItem key={item.food._id || item.food.id} item={item} />
            ))}
          </div>

          <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-700"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Add More Dishes</span>
            </Link>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-soft space-y-6">
            <h3 className="font-extrabold text-xl text-slate-900">
              Order Summary
            </h3>

            {/* Price lines */}
            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-800">${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Estimated Tax (8%)</span>
                <span className="font-bold text-slate-800">${tax.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-slate-400" />
                  <span>Delivery Fee</span>
                </span>
                <span className="font-bold text-slate-800">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-600 uppercase text-xs font-extrabold">
                      Free
                    </span>
                  ) : (
                    `$${deliveryFee.toFixed(2)}`
                  )}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Promo Discount ({discountPercent}%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              {subtotal < 40 && (
                <div className="p-3 bg-orange-50 rounded-2xl text-xs text-orange-700 font-medium">
                  Add <strong>${(40 - subtotal).toFixed(2)}</strong> more to get <strong>FREE delivery</strong>!
                </div>
              )}
            </div>

            {/* Total line */}
            <div className="pt-4 border-t border-slate-100 flex justify-between items-baseline">
              <span className="text-base font-bold text-slate-900">Total Amount</span>
              <span className="text-2xl font-black text-orange-600">
                ${finalTotal.toFixed(2)}
              </span>
            </div>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="pt-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Have a coupon?
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="e.g. WELCOME30"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-orange-500 uppercase"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition"
                >
                  Apply
                </button>
              </div>
              {promoError && (
                <p className="text-xs text-red-500 mt-1 font-medium">{promoError}</p>
              )}
              {promoSuccess && (
                <p className="text-xs text-emerald-600 mt-1 font-medium">{promoSuccess}</p>
              )}
            </form>

            {/* Proceed to checkout */}
            <button
              onClick={() => navigate('/checkout', { state: { discountPercent, discountAmount } })}
              className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-500/30 transition flex items-center justify-center gap-2 text-base"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Secure Trust Badge */}
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Guaranteed Safe & Secure Checkout</span>
          </div>
        </div>

      </div>
    </div>
  );
}

