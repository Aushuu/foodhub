import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Package, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Truck, 
  ChefHat, 
  ArrowRight,
  ShoppingBag,
  Sparkles,
  Phone,
  RefreshCw,
  Play,
  Pause,
  Receipt,
  Info,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LiveDeliveryMap from '../components/LiveDeliveryMap';

const STAGES = [
  { key: 'placed', label: 'Order Placed', icon: Clock },
  { key: 'preparing', label: 'In Kitchen', icon: ChefHat },
  { key: 'on the way', label: 'Out for Delivery', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle2 }
];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [simulatingOrderId, setSimulatingOrderId] = useState(null);
  const [expandedReceipts, setExpandedReceipts] = useState({});
  const location = useLocation();
  const { user, isAdmin, login } = useAuth();
  const simulationTimerRef = useRef(null);

  const newOrderPlaced = location.state?.newOrderPlaced;

  // Initial load
  const fetchOrders = async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    try {
      const email = user?.email || '';
      const data = await api.getMyOrders(email);
      setOrders(data);
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      if (showSpinner) setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(true);

    // Auto-poll every 3.5 seconds so when restaurant changes status, it updates live!
    const interval = setInterval(() => {
      fetchOrders(false);
    }, 3500);

    return () => {
      clearInterval(interval);
      if (simulationTimerRef.current) clearInterval(simulationTimerRef.current);
    };
  }, []);

  const getStageIndex = (status) => {
    const s = (status || 'placed').toLowerCase();
    if (s === 'delivered') return 3;
    if (s === 'on the way' || s === 'out for delivery') return 2;
    if (s === 'preparing') return 1;
    return 0; // placed
  };

  const toggleReceipt = (orderId) => {
    setExpandedReceipts(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  // Manual status step updater (updates both local state & MongoDB Atlas)
  const handleSetOrderStatus = async (orderId, newStatus) => {
    try {
      // Optimistic update
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
      await api.updateOrderStatus(orderId, newStatus);
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  // Live Auto-Simulation (advances stage automatically every 7 seconds)
  const toggleAutoSimulate = (order) => {
    if (simulatingOrderId === order._id) {
      // Stop simulation
      if (simulationTimerRef.current) clearInterval(simulationTimerRef.current);
      setSimulatingOrderId(null);
      return;
    }

    setSimulatingOrderId(order._id);
    let currentIdx = getStageIndex(order.orderStatus);

    if (simulationTimerRef.current) clearInterval(simulationTimerRef.current);

    simulationTimerRef.current = setInterval(async () => {
      currentIdx = (currentIdx + 1) % STAGES.length;
      const nextStatusName = STAGES[currentIdx].label;
      const apiStatus = nextStatusName === 'In Kitchen' ? 'Preparing' : nextStatusName === 'Out for Delivery' ? 'On the way' : nextStatusName;

      // Update in state & DB
      setOrders(prev => prev.map(o => o._id === order._id ? { ...o, orderStatus: apiStatus } : o));
      try {
        await api.updateOrderStatus(order._id, apiStatus);
      } catch (e) {
        console.error(e);
      }

      if (currentIdx === 3) {
        // Delivered! Stop after reaching delivered
        clearInterval(simulationTimerRef.current);
        setSimulatingOrderId(null);
      }
    }, 7000);
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Delivered</span>
          </span>
        );
      case 'on the way':
      case 'out for delivery':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 animate-pulse">
            <Truck className="w-3.5 h-3.5 text-blue-600" />
            <span>Out for Delivery</span>
          </span>
        );
      case 'preparing':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
            <ChefHat className="w-3.5 h-3.5 text-amber-600" />
            <span>In Kitchen (Cooking)</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800">
            <Clock className="w-3.5 h-3.5 text-orange-600" />
            <span>Order Placed</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Live Order Tracking
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Sync
            </span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm">
            Real-time GPS tracking from restaurant kitchen to your doorstep
          </p>
        </div>

        <button
          onClick={() => fetchOrders(true)}
          className="self-start sm:self-auto flex items-center gap-1.5 text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 px-4 py-2 rounded-xl transition shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Now</span>
        </button>
      </div>

      {/* Success banner if arrived after checkout */}
      {newOrderPlaced && (
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-6 rounded-3xl shadow-lg flex items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg">Thank You! Your Order is Placed!</h3>
              <p className="text-emerald-100 text-xs sm:text-sm">
                Your order is confirmed, saved to MongoDB Atlas, and kitchen staff has started preparing your food.
              </p>
            </div>
          </div>
          <Link
            to="/menu"
            className="hidden sm:inline-block bg-white text-emerald-700 px-4 py-2 rounded-xl text-xs font-bold shadow hover:bg-emerald-50"
          >
            Order More
          </Link>
        </div>
      )}

      {isAdmin ? (
        <div className="max-w-xl mx-auto my-12 p-8 sm:p-10 bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-2xl text-center space-y-6 animate-fade-in relative overflow-hidden">
          <div className="w-16 h-16 bg-slate-800 text-amber-400 border border-slate-700 rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <ChefHat className="w-8 h-8 text-amber-400" />
          </div>
          <div className="space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
              Restaurant Administrator Mode
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Customer Orders are Managed in Kitchen Board
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
              You are signed in as Administrator (<strong>{user?.email}</strong>). The personal "My Orders" delivery radar is for customers tracking food deliveries. As the restaurant operator, you manage and fulfill all incoming customer orders directly in the Kitchen Orders Board.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/admin"
              className="py-3.5 px-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black rounded-xl shadow-lg shadow-orange-500/25 transition text-sm flex items-center justify-center gap-2"
            >
              <ChefHat className="w-4 h-4" />
              <span>Open Kitchen Orders Board</span>
            </Link>
            <Link
              to="/menu"
              className="py-3.5 px-6 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-sm transition"
            >
              View Menu Catalog
            </Link>
          </div>
        </div>
      ) : loading ? (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div key={n} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm animate-pulse space-y-4">
              <div className="flex justify-between">
                <div className="h-5 bg-slate-200 rounded w-1/4" />
                <div className="h-6 bg-slate-200 rounded-full w-24" />
              </div>
              <div className="h-32 bg-slate-200 rounded-2xl" />
            </div>
          ))}
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-8">
          {!user && (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm text-orange-900 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="text-base">📦</span>
                <span>
                  <strong>Guest Order Tracking:</strong> Showing active order placed in this browser. Sign in or sign up to save order history permanently.
                </span>
              </div>
              <Link
                to="/login"
                className="self-start sm:self-auto px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-xs transition shadow-xs"
              >
                Sign In
              </Link>
            </div>
          )}
          {orders.map((order) => {
            const currentStageIndex = getStageIndex(order.orderStatus);
            const isSimulating = simulatingOrderId === order._id;
            const isReceiptOpen = expandedReceipts[order._id] || false;

            // Transparent calculation
            const itemsSubtotal = Number(order.subtotal || order.items?.reduce((s, i) => s + (i.price * i.quantity), 0) || 0);
            const deliveryFee = Number(order.deliveryFee !== undefined ? order.deliveryFee : 3.99);
            const taxAmount = Number(
              order.tax !== undefined 
                ? order.tax 
                : Math.max(0, (Number(order.totalAmount) - (itemsSubtotal + deliveryFee)).toFixed(2))
            );
            const totalBill = Number(order.totalAmount || (itemsSubtotal + deliveryFee + taxAmount)).toFixed(2);

            return (
              <div
                key={order._id}
                className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden space-y-0"
              >
                {/* Order Top Bar */}
                <div className="p-6 bg-slate-50/80 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                        Order Ticket:
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-800 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs">
                        #{order._id?.slice(-8) || order._id}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusBadge(order.orderStatus)}
                    <span className="text-2xl font-black text-slate-900">
                      ${totalBill}
                    </span>
                  </div>
                </div>

                {/* Interactive Live Delivery Map with Radar & Animated Rider */}
                <div className="p-6 border-b border-slate-100">
                  <LiveDeliveryMap order={order} stageIndex={currentStageIndex} />
                </div>

                {/* Step-by-Step Delivery Progress Line */}
                <div className="p-6 border-b border-slate-100 bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Delivery Journey Milestones
                    </span>

                    {/* Simulation Controls: Lets user watch the delivery progression in real-time */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleAutoSimulate(order)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
                          isSimulating
                            ? 'bg-red-500 text-white animate-pulse'
                            : 'bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200'
                        }`}
                        title="Simulate realistic live delivery progression"
                      >
                        {isSimulating ? (
                          <>
                            <Pause className="w-3.5 h-3.5" />
                            <span>Stop Simulation</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 fill-orange-500" />
                            <span>⚡ Simulate Live Delivery</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Milestones Bar */}
                  <div className="relative flex items-center justify-between max-w-2xl mx-auto px-4 py-2">
                    <div className="absolute top-7 left-10 right-10 h-1 bg-slate-100 -z-0" />
                    <div
                      className="absolute top-7 left-10 h-1 bg-orange-500 transition-all duration-700 -z-0"
                      style={{
                        width: `${(currentStageIndex / (STAGES.length - 1)) * 82}%`
                      }}
                    />

                    {STAGES.map((stage, idx) => {
                      const isCompleted = idx <= currentStageIndex;
                      const isCurrent = idx === currentStageIndex;
                      const Icon = stage.icon;

                      return (
                        <button
                          key={stage.key}
                          onClick={() => {
                            const apiName = stage.label === 'In Kitchen' ? 'Preparing' : stage.label === 'Out for Delivery' ? 'On the way' : stage.label;
                            handleSetOrderStatus(order._id, apiName);
                          }}
                          className="relative z-10 flex flex-col items-center text-center group cursor-pointer focus:outline-none"
                          title={`Click to set stage to ${stage.label}`}
                        >
                          <div
                            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm ${
                              isCompleted
                                ? isCurrent
                                  ? 'bg-orange-500 text-white ring-4 ring-orange-100 scale-110 shadow-md shadow-orange-500/25'
                                  : 'bg-emerald-500 text-white'
                                : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                            }`}
                          >
                            <Icon className="w-5 h-5 stroke-[2.2]" />
                          </div>
                          <span
                            className={`text-xs mt-2 font-bold whitespace-nowrap transition-colors ${
                              isCompleted ? 'text-slate-900' : 'text-slate-400'
                            }`}
                          >
                            {stage.label}
                          </span>
                          <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            (click to test)
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Ordered Items List */}
                <div className="p-6 divide-y divide-slate-100">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Dishes in this Order ({order.items?.length || 0})
                  </div>
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-14 h-14 rounded-2xl object-cover border border-slate-100 shrink-0"
                          />
                        )}
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm sm:text-base">
                            {item.name}
                          </h4>
                          <span className="text-xs text-slate-500 font-medium">
                            Quantity: {item.quantity} × ${Number(item.price).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <span className="font-extrabold text-slate-800 text-sm sm:text-base">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Transparent Detailed Bill Breakdown Accordion */}
                <div className="border-t border-slate-100 bg-slate-50/50 p-6">
                  <button
                    onClick={() => toggleReceipt(order._id)}
                    className="w-full flex items-center justify-between text-xs font-bold text-slate-700 hover:text-orange-600 transition"
                  >
                    <div className="flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-orange-500" />
                      <span>Itemized Cost Calculation & Tax Breakdown</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-orange-600">
                      <span>{isReceiptOpen ? 'Hide Receipt' : 'View Detailed Breakdown'}</span>
                      {isReceiptOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {/* Expanded Breakdown */}
                  {isReceiptOpen && (
                    <div className="mt-4 pt-4 border-t border-slate-200/60 space-y-2.5 text-xs text-slate-600 animate-fade-in max-w-md">
                      <div className="flex justify-between">
                        <span>Items Total (Subtotal)</span>
                        <span className="font-bold text-slate-800">${itemsSubtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery Partner Fee</span>
                        <span className="font-bold text-slate-800">
                          {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Govt Taxes & Restaurant Packaging (GST 8%)</span>
                        <span className="font-bold text-slate-800">${taxAmount.toFixed(2)}</span>
                      </div>
                      {order.discount > 0 && (
                        <div className="flex justify-between text-emerald-600 font-bold">
                          <span>Discount Applied</span>
                          <span>-${Number(order.discount).toFixed(2)}</span>
                        </div>
                      )}
                      <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline font-black text-slate-900 text-sm">
                        <span>Total Paid / Payable</span>
                        <span className="text-orange-600 text-base">${totalBill}</span>
                      </div>
                      <div className="p-2.5 bg-orange-50 border border-orange-100 rounded-xl text-[11px] text-orange-800 font-medium flex items-start gap-2">
                        <Info className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                        <span>
                          Calculation: ${itemsSubtotal.toFixed(2)} (Food) + ${deliveryFee.toFixed(2)} (Delivery) + ${taxAmount.toFixed(2)} (Taxes) = <strong>${totalBill}</strong>
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Delivery Destination & Payment Footer */}
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row justify-between text-xs text-slate-600 gap-4">
                  <div className="flex items-start gap-2.5 max-w-md">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-800 block mb-0.5">
                        Delivering To: {order.customerName}
                      </span>
                      <span className="text-slate-600">
                        {order.deliveryAddress?.street}, {order.deliveryAddress?.city}, {order.deliveryAddress?.state || ''} {order.deliveryAddress?.postalCode}
                      </span>
                      {order.deliveryAddress?.phone && (
                        <div className="flex items-center gap-1.5 mt-1 text-slate-700 font-medium">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>Contact: <strong>{order.deliveryAddress.phone}</strong></span>
                        </div>
                      )}
                      {order.deliveryAddress?.instructions && (
                        <p className="mt-1 text-slate-500 italic bg-white/70 p-1.5 rounded-lg border border-slate-200/50">
                          Note: "{order.deliveryAddress.instructions}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-6 sm:text-right">
                    <div>
                      <span className="block text-slate-400 font-medium">Payment Mode</span>
                      <span className="font-bold text-slate-800 text-sm">
                        {order.paymentMethod === 'COD' ? '💵 Cash on Delivery' : '💳 Online Card'}
                      </span>
                    </div>
                    <div>
                      <span className="block text-slate-400 font-medium">Delivery Service</span>
                      <span className="font-bold text-emerald-600 text-sm">
                        FoodHub Express
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : !user ? (
        <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-3xl border border-slate-100 shadow-soft text-center space-y-5 animate-fade-in">
          <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mx-auto text-3xl">
            📦
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900">Sign In to Track Orders</h2>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              You are currently viewing as guest. Please sign in to view your live orders and GPS delivery radar.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              to="/login"
              className="w-full py-3.5 px-4 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 transition text-sm"
            >
              Sign In to Your Account
            </Link>
            <button
              onClick={async () => {
                const res = await login('customer@foodhub.com', 'customer123');
                if (res.success) fetchOrders(true);
              }}
              className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs transition"
            >
              Sign In as Test Customer (customer@foodhub.com)
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm max-w-lg mx-auto p-8 space-y-4">
          <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto text-3xl">
            📦
          </div>
          <h3 className="text-xl font-bold text-slate-800">No Orders Placed Yet</h3>
          <p className="text-slate-500 text-sm max-w-xs mx-auto">
            You haven't placed any food orders yet. Ready to experience something delicious?
          </p>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-2xl text-sm shadow transition"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Explore Menu Now</span>
          </Link>
        </div>
      )}
    </div>
  );
}
