import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  MapPin, 
  User, 
  CreditCard, 
  Banknote, 
  CheckCircle, 
  ShieldCheck, 
  Truck, 
  AlertCircle,
  ArrowLeft 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function Checkout() {
  const { items, subtotal, deliveryFee, tax, totalAmount, clearCart } = useCart();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const discountAmount = location.state?.discountAmount || 0;
  const finalTotal = Math.max(0, totalAmount - discountAmount);

  // Form states
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    postalCode: user?.address?.postalCode || '',
    instructions: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
            Checkout Disabled for Administrators
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            You are logged in as Administrator (<strong>{user?.email}</strong>). Administrators manage kitchen operations and customer orders rather than placing food delivery orders.
          </p>
        </div>
        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/admin"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black px-6 py-3.5 rounded-2xl shadow-lg transition text-sm"
          >
            <span>Go to Admin Dashboard</span>
          </Link>
          <Link
            to="/menu"
            className="inline-flex items-center justify-center px-6 py-3.5 rounded-2xl font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition text-sm"
          >
            Back to Menu
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.street || !formData.city || !formData.postalCode) {
      setError('Please fill in all required delivery details.');
      return;
    }

    setLoading(true);

    const orderPayload = {
      items: items.map((i) => ({
        foodId: i.food._id || i.food.id,
        name: i.food.name,
        price: i.food.price,
        quantity: i.quantity,
        image: i.food.image
      })),
      deliveryAddress: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        phone: formData.phone,
        instructions: formData.instructions
      },
      customerName: formData.name,
      customerEmail: formData.email,
      subtotal,
      deliveryFee,
      tax,
      discount: discountAmount,
      totalAmount: finalTotal,
      paymentMethod,
      orderStatus: 'Placed'
    };

    try {
      const order = await api.createOrder(orderPayload);
      clearCart();
      navigate('/orders', { state: { newOrderPlaced: true, orderId: order._id } });
    } catch (err) {
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div>
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-orange-600 mb-3 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Cart</span>
        </Link>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Delivery & Checkout
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
          Enter your delivery destination and confirm payment option
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 text-sm font-semibold">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form: Customer & Address */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Customer Info Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-soft space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <User className="w-5 h-5 text-orange-500" />
              <h3 className="font-extrabold text-lg text-slate-900">1. Customer Information</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Alex Johnson"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="alex@example.com"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+1 (555) 234-5678"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Delivery Address Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-soft space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100 gap-2">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-5 h-5 text-orange-500" />
                <h3 className="font-extrabold text-lg text-slate-900">2. Delivery Address & Location</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      async (pos) => {
                        const { latitude, longitude } = pos.coords;
                        try {
                          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                          const data = await res.json();
                          if (data && data.address) {
                            setFormData((prev) => ({
                              ...prev,
                              street: data.address.road || data.address.suburb || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
                              city: data.address.city || data.address.town || data.address.village || 'Guntur',
                              state: data.address.state || 'AP',
                              postalCode: data.address.postcode || '500081'
                            }));
                          }
                        } catch {
                          setFormData((prev) => ({
                            ...prev,
                            street: `GPS Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`
                          }));
                        }
                      },
                      () => {
                        alert('Could not access current location. Please type your delivery address.');
                      }
                    );
                  }
                }}
                className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition"
              >
                <span>📍 Auto-Detect GPS Location</span>
              </button>
            </div>

            {/* Quick Address Presets */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Quick Tag:
              </span>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, street: 'Vadlamudi, Chanukya Hostel, Chillpops', city: 'Guntur', state: 'AP', postalCode: '522213' }))}
                className="text-xs bg-slate-100 hover:bg-orange-50 hover:text-orange-600 px-2.5 py-1 rounded-lg font-semibold transition"
              >
                🏢 Hostel / Campus
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, street: '124 Maple Street, Apt 3B', city: 'City Centre', state: 'AP', postalCode: '500081' }))}
                className="text-xs bg-slate-100 hover:bg-orange-50 hover:text-orange-600 px-2.5 py-1 rounded-lg font-semibold transition"
              >
                🏠 Home
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, street: 'Tech Park, Building 4, Floor 2', city: 'Guntur', state: 'AP', postalCode: '522002' }))}
                className="text-xs bg-slate-100 hover:bg-orange-50 hover:text-orange-600 px-2.5 py-1 rounded-lg font-semibold transition"
              >
                💼 Work
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Street Address & Landmark *
                </label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Vadlamudi, Chanukya Hostel, Near Chillpops"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Guntur"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    State / Region
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="AP"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    required
                    placeholder="522213"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Delivery Notes / Gate Code (Optional)
                </label>
                <textarea
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleChange}
                  rows="2"
                  placeholder="e.g. Leave at hostel reception / call when arrived at gate"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-soft space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <Banknote className="w-5 h-5 text-orange-500" />
              <h3 className="font-extrabold text-lg text-slate-900">3. Payment Option</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Cash On Delivery */}
              <label
                className={`relative flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition ${
                  paymentMethod === 'COD'
                    ? 'border-orange-500 bg-orange-50/50 text-orange-950 font-bold'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 text-sm font-bold">
                    <Banknote className="w-4 h-4 text-orange-500" />
                    <span>Cash on Delivery</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-normal mt-0.5">
                    Pay with cash when food arrives
                  </p>
                </div>
              </label>

              {/* Online Payment (Card) */}
              <label
                className={`relative flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition ${
                  paymentMethod === 'Card'
                    ? 'border-orange-500 bg-orange-50/50 text-orange-950 font-bold'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Card"
                  checked={paymentMethod === 'Card'}
                  onChange={() => setPaymentMethod('Card')}
                  className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 text-sm font-bold">
                    <CreditCard className="w-4 h-4 text-slate-500" />
                    <span>Credit / Debit Card</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-normal mt-0.5">
                    Simulated secure payment
                  </p>
                </div>
              </label>
            </div>
          </div>

        </div>

        {/* Right Summary Sidebar */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-soft space-y-6 sticky top-28">
          <h3 className="font-extrabold text-xl text-slate-900 pb-2 border-b border-slate-100">
            Order Items ({items.length})
          </h3>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-slate-100">
            {items.map((item) => (
              <div key={item.food._id || item.food.id} className="pt-3 first:pt-0 flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <img
                    src={item.food.image}
                    alt={item.food.name}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div>
                    <h5 className="font-bold text-slate-800 line-clamp-1">{item.food.name}</h5>
                    <span className="text-xs text-slate-400">Qty: {item.quantity}</span>
                  </div>
                </div>
                <span className="font-extrabold text-slate-900">
                  ${(item.food.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing calculations */}
          <div className="pt-4 border-t border-slate-100 space-y-2.5 text-sm text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-slate-800">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="font-bold text-slate-800">
                {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Tax (8%)</span>
              <span className="font-bold text-slate-800">${tax.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Discount</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
              <span className="text-base font-extrabold text-slate-900">Total Payable</span>
              <span className="text-2xl font-black text-orange-600">
                ${finalTotal.toFixed(2)}
              </span>
            </div>

            <div className="p-3 bg-orange-50/80 border border-orange-200/60 rounded-xl text-xs text-orange-900 font-medium">
              🧾 <strong>Exact Bill Match:</strong> ${subtotal.toFixed(2)} (Items) + {deliveryFee === 0 ? '$0.00 (Free Delivery)' : `$${deliveryFee.toFixed(2)} (Delivery)`} + ${tax.toFixed(2)} (Tax/Packaging 8%) = <strong className="text-orange-700">${finalTotal.toFixed(2)}</strong>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-500/30 transition flex items-center justify-center gap-2 text-base disabled:opacity-50"
          >
            {loading ? (
              <span>Placing Order...</span>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Confirm & Place Order (${finalTotal.toFixed(2)})</span>
              </>
            )}
          </button>

          <p className="text-center text-xs text-slate-400">
            By placing your order, you agree to FoodHub's Terms & Conditions.
          </p>
        </div>

      </form>
    </div>
  );
}

