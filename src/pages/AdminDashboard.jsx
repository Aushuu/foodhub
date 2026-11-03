import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  ShoppingBag, 
  DollarSign, 
  Users, 
  UtensilsCrossed, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  X,
  Search,
  ChevronDown,
  Sparkles,
  TrendingUp,
  ShieldAlert,
  Bell,
  BellRing,
  ChefHat,
  Truck,
  Phone,
  MapPin,
  LayoutGrid,
  List,
  CheckCircle2,
  Volume2,
  VolumeX,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';
import { CATEGORIES } from '../services/foodData';
import { useAuth } from '../context/AuthContext';

// Web Audio chime for incoming orders
function playKitchenOrderChime() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
    osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.6);
  } catch (e) {
    // browser audio policy
  }
}

export default function AdminDashboard() {
  const { user, isAdmin, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'foods' | 'stats'
  const [orderViewMode, setOrderViewMode] = useState('board'); // 'board' | 'table'
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [foods, setFoods] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const prevOrdersCountRef = useRef(0);

  // Modal states for Food CRUD
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Burgers',
    price: '',
    image: '',
    description: '',
    isVegetarian: false,
    isAvailable: true
  });
  const [foodSearch, setFoodSearch] = useState('');
  const [statusMessage, setStatusMessage] = useState(null);
  const [newOrderBanner, setNewOrderBanner] = useState(null);

  const loadData = async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    try {
      const [foodsData, ordersData] = await Promise.all([
        api.getFoods(),
        api.getAllOrders()
      ]);
      setFoods(foodsData);

      // Check if new orders arrived
      if (prevOrdersCountRef.current > 0 && ordersData.length > prevOrdersCountRef.current) {
        const latest = ordersData[0];
        setNewOrderBanner(`🚨 NEW ORDER #${latest._id?.slice(-6)} received from ${latest.customerName}!`);
        if (soundEnabled) playKitchenOrderChime();
      }
      prevOrdersCountRef.current = ordersData.length;
      setOrders(ordersData);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      if (showSpinner) setLoading(false);
    }
  };

  useEffect(() => {
    loadData(true);

    // Live auto-polling every 3.5 seconds so admin gets instant order alerts
    const interval = setInterval(() => {
      loadData(false);
    }, 3500);

    return () => clearInterval(interval);
  }, [soundEnabled]);

  const showNotification = (msg) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const openAddModal = () => {
    setEditingFood(null);
    setFormData({
      name: '',
      category: 'Burgers',
      price: '',
      image: '',
      description: '',
      isVegetarian: false,
      isAvailable: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (food) => {
    setEditingFood(food);
    setFormData({
      name: food.name,
      category: food.category,
      price: food.price,
      image: food.image,
      description: food.description,
      isVegetarian: food.isVegetarian,
      isAvailable: food.isAvailable !== false
    });
    setIsModalOpen(true);
  };

  const handleSaveFood = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price)
      };

      if (editingFood) {
        const id = editingFood._id || editingFood.id;
        const updated = await api.updateFood(id, payload);
        setFoods((prev) => prev.map((f) => ((f._id || f.id) === id ? updated : f)));
        showNotification("Food item updated successfully!");
      } else {
        const created = await api.createFood(payload);
        setFoods((prev) => [created, ...prev]);
        showNotification("New food item added to menu!");
      }
      setIsModalOpen(false);
    } catch (err) {
      alert(err.message || "Failed to save food");
    }
  };

  const handleDeleteFood = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from the menu?`)) {
      try {
        await api.deleteFood(id);
        setFoods((prev) => prev.filter((f) => (f._id || f.id) !== id));
        showNotification(`Removed "${name}" from menu`);
      } catch (err) {
        alert(err.message || "Failed to delete");
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
      );
      showNotification(`Order #${orderId.slice(-6)} updated to "${newStatus}"`);
    } catch (err) {
      alert("Failed to update status");
    }
  };

  // Stats calculation
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
  const totalOrdersCount = orders.length;
  const pendingOrders = orders.filter((o) => o.orderStatus === 'Placed');
  const kitchenOrders = orders.filter((o) => o.orderStatus === 'Preparing');
  const outOrders = orders.filter((o) => o.orderStatus === 'On the way');
  const deliveredOrders = orders.filter((o) => o.orderStatus === 'Delivered');

  const filteredFoods = foods.filter(
    (f) =>
      f.name.toLowerCase().includes(foodSearch.toLowerCase()) ||
      f.category.toLowerCase().includes(foodSearch.toLowerCase())
  );

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Toast Alert */}
      {statusMessage && (
        <div className="fixed top-24 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-sm font-semibold animate-fade-in">
          <Sparkles className="w-4 h-4 text-orange-400" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* New Incoming Order Audio Banner */}
      {newOrderBanner && (
        <div className="bg-gradient-to-r from-orange-500 to-amber-600 text-white p-4 sm:p-5 rounded-2xl shadow-lg flex items-center justify-between gap-4 animate-bounce">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <BellRing className="w-5 h-5 text-white animate-spin" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm sm:text-base">{newOrderBanner}</h4>
              <p className="text-orange-100 text-xs">A new customer order just arrived. Check dishes and start cooking!</p>
            </div>
          </div>
          <button
            onClick={() => setNewOrderBanner(null)}
            className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-500">
              Restaurant Kitchen & Store Control
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Orders Active
            </span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-0.5">
            Admin Management Portal
          </h1>
        </div>

        {/* Action Controls & Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (!soundEnabled) playKitchenOrderChime();
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition border ${
              soundEnabled
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}
            title="Toggle kitchen chime sound on incoming orders"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{soundEnabled ? 'Chime ON' : 'Chime OFF'}</span>
          </button>

          {/* Action Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                activeTab === 'orders'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Customer Orders ({orders.length})</span>
              {pendingOrders.length > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full animate-pulse">
                  {pendingOrders.length} New
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('foods')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                activeTab === 'foods'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Manage Foods ({foods.length})
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                activeTab === 'stats'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Statistics
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
            <Bell className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
              Needs Cooking
            </span>
            <span className="text-2xl font-black text-red-600">
              {pendingOrders.length} Orders
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
              In The Kitchen
            </span>
            <span className="text-2xl font-black text-amber-600">
              {kitchenOrders.length} Cooking
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
              Out for Delivery
            </span>
            <span className="text-2xl font-black text-blue-600">
              {outOrders.length} With Rider
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
              Total Revenue
            </span>
            <span className="text-2xl font-black text-slate-900">
              ${totalRevenue.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Tab 1: Customer Orders (Kitchen Display System) */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* View mode toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-slate-900">
                Kitchen Orders Board
              </span>
              <span className="text-xs text-slate-500">
                (Click any button to advance order & update customer tracker)
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setOrderViewMode('board')}
                className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  orderViewMode === 'board' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-600'
                }`}
                title="Kitchen Cards Board"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Cards View</span>
              </button>
              <button
                onClick={() => setOrderViewMode('table')}
                className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  orderViewMode === 'table' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-600'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">Table View</span>
              </button>
            </div>
          </div>

          {/* Cards View (Kitchen Display System) */}
          {orderViewMode === 'board' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders.length === 0 ? (
                <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-slate-100 text-slate-400">
                  <div className="text-4xl mb-3">🍳</div>
                  <h3 className="font-bold text-slate-700 text-base">No Customer Orders Yet</h3>
                  <p className="text-xs text-slate-400 mt-1">When a customer places an order, it will ring and appear here in real time!</p>
                </div>
              ) : (
                orders.map((order) => {
                  const status = order.orderStatus || 'Placed';
                  const isPlaced = status === 'Placed';
                  const isPreparing = status === 'Preparing';
                  const isOnTheWay = status === 'On the way';
                  const isDelivered = status === 'Delivered';

                  return (
                    <div
                      key={order._id}
                      className={`bg-white rounded-3xl border shadow-soft overflow-hidden flex flex-col justify-between transition-all ${
                        isPlaced 
                          ? 'border-orange-300 ring-2 ring-orange-200' 
                          : isPreparing 
                          ? 'border-amber-200' 
                          : isOnTheWay 
                          ? 'border-blue-200' 
                          : 'border-slate-100 opacity-90'
                      }`}
                    >
                      {/* Ticket Header */}
                      <div className={`p-5 border-b flex items-center justify-between ${
                        isPlaced ? 'bg-orange-50/70 border-orange-100' : 'bg-slate-50 border-slate-100'
                      }`}>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-sm text-slate-900">
                              #{order._id?.slice(-6) || order._id}
                            </span>
                            {isPlaced && (
                              <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
                                NEW ORDER
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400">
                            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          isDelivered ? 'bg-emerald-100 text-emerald-800' :
                          isOnTheWay ? 'bg-blue-100 text-blue-800' :
                          isPreparing ? 'bg-amber-100 text-amber-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {status}
                        </span>
                      </div>

                      {/* Dishes to Cook */}
                      <div className="p-5 space-y-4 flex-1">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                            Dishes to Prepare ({order.items?.length || 0}):
                          </span>
                          <div className="space-y-2.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                            {order.items?.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                  <span className="w-5 h-5 rounded-md bg-orange-500 text-white font-extrabold flex items-center justify-center text-[11px]">
                                    {item.quantity}×
                                  </span>
                                  <span className="font-bold text-slate-800">
                                    {item.name}
                                  </span>
                                </div>
                                <span className="font-bold text-slate-600">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Customer & Address */}
                        <div className="space-y-1.5 text-xs">
                          <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                            <span>👤 {order.customerName}</span>
                            {order.deliveryAddress?.phone && (
                              <a href={`tel:${order.deliveryAddress.phone}`} className="text-orange-600 hover:underline flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                <span>{order.deliveryAddress.phone}</span>
                              </a>
                            )}
                          </div>
                          <div className="flex items-start gap-1.5 text-slate-500 text-[11px]">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                            <span>{order.deliveryAddress?.street}, {order.deliveryAddress?.city}</span>
                          </div>
                          {order.deliveryAddress?.instructions && (
                            <p className="text-[11px] text-amber-700 italic bg-amber-50 p-2 rounded-xl border border-amber-100">
                              Note: "{order.deliveryAddress.instructions}"
                            </p>
                          )}
                        </div>

                        {/* Payment & Total */}
                        <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                          <span className="text-slate-500">
                            Payment: <strong>{order.paymentMethod || 'COD'}</strong>
                          </span>
                          <span className="font-black text-slate-900 text-sm">
                            Total: ${Number(order.totalAmount).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* One-Click Kitchen Action Workflow Buttons */}
                      <div className="p-4 bg-slate-50/70 border-t border-slate-100">
                        {isPlaced && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order._id, 'Preparing')}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 active:scale-95 transition"
                          >
                            <ChefHat className="w-4 h-4" />
                            <span>👨‍🍳 Accept & Start Cooking</span>
                          </button>
                        )}

                        {isPreparing && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order._id, 'On the way')}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 active:scale-95 transition"
                          >
                            <Truck className="w-4 h-4" />
                            <span>🛵 Food Ready - Hand to Rider</span>
                          </button>
                        )}

                        {isOnTheWay && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order._id, 'Delivered')}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 active:scale-95 transition"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>✅ Confirm Delivered</span>
                          </button>
                        )}

                        {isDelivered && (
                          <div className="text-center text-xs font-bold text-emerald-700 flex items-center justify-center gap-1.5 py-1">
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                            <span>Order Completed & Delivered</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            /* Table View */
            <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <tr>
                      <th className="py-4 px-6">Order ID</th>
                      <th className="py-4 px-6">Customer & Phone</th>
                      <th className="py-4 px-6">Delivery Address</th>
                      <th className="py-4 px-6">Dishes Ordered</th>
                      <th className="py-4 px-6">Total</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6 text-right">Kitchen Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.map((order) => (
                      <tr key={order._id} className="hover:bg-slate-50/50 transition">
                        <td className="py-4 px-6 font-mono text-xs font-bold text-slate-900">
                          #{order._id?.slice(-6) || order._id}
                          <div className="text-[10px] text-slate-400 font-sans font-normal">
                            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-bold text-slate-900">{order.customerName}</div>
                          <div className="text-xs text-slate-500">{order.deliveryAddress?.phone || order.customerEmail}</div>
                        </td>
                        <td className="py-4 px-6 text-xs text-slate-600 max-w-xs truncate">
                          {order.deliveryAddress?.street}, {order.deliveryAddress?.city}
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-xs font-bold text-slate-700 block">
                            {order.items?.length || 0} items
                          </span>
                          <div className="text-[11px] text-slate-400 line-clamp-1">
                            {order.items?.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                          </div>
                        </td>
                        <td className="py-4 px-6 font-extrabold text-orange-600">
                          ${Number(order.totalAmount).toFixed(2)}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                            order.orderStatus === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                            order.orderStatus === 'On the way' ? 'bg-blue-100 text-blue-800' :
                            order.orderStatus === 'Preparing' ? 'bg-amber-100 text-amber-800' :
                            'bg-orange-100 text-orange-800'
                          }`}>
                            {order.orderStatus}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <select
                            value={order.orderStatus}
                            onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                            className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 py-1.5 px-3 rounded-xl focus:outline-none focus:border-orange-500 cursor-pointer"
                          >
                            <option value="Placed">Placed</option>
                            <option value="Preparing">Preparing</option>
                            <option value="On the way">On the way</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Manage Foods */}
      {activeTab === 'foods' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={foodSearch}
                onChange={(e) => setFoodSearch(e.target.value)}
                placeholder="Search dishes by name..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-orange-500 shadow-sm"
              />
            </div>

            <button
              onClick={openAddModal}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-orange-500/20 active:scale-95 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Food Item</span>
            </button>
          </div>

          {/* Foods Table */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="py-4 px-6">Dish</th>
                    <th className="py-4 px-6">Category</th>
                    <th className="py-4 px-6">Price</th>
                    <th className="py-4 px-6">Diet</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredFoods.map((food) => {
                    const id = food._id || food.id;
                    return (
                      <tr key={id} className="hover:bg-slate-50/50 transition">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={food.image}
                              alt={food.name}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-100 shrink-0"
                            />
                            <div>
                              <div className="font-bold text-slate-900">{food.name}</div>
                              <div className="text-xs text-slate-400 line-clamp-1 max-w-xs">
                                {food.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg text-xs font-semibold">
                            {food.category}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-extrabold text-orange-600">
                          ${Number(food.price).toFixed(2)}
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              food.isVegetarian
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-red-50 text-red-700'
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                food.isVegetarian ? 'bg-emerald-500' : 'bg-red-500'
                              }`}
                            />
                            <span>{food.isVegetarian ? 'Veg' : 'Non-Veg'}</span>
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right space-x-2">
                          <button
                            onClick={() => openEditModal(food)}
                            className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition"
                            title="Edit Dish"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteFood(id, food.name)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                            title="Delete Dish"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Detailed Statistics Overview */}
      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-soft space-y-4">
            <h3 className="font-extrabold text-lg text-slate-900">Food Category Distribution</h3>
            <div className="space-y-3">
              {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => {
                const count = foods.filter((f) => f.category.toLowerCase() === cat.id.toLowerCase()).length;
                const pct = foods.length ? Math.round((count / foods.length) * 100) : 0;
                return (
                  <div key={cat.id} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>{cat.name}</span>
                      <span>{count} dishes ({pct}%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-soft space-y-4">
            <h3 className="font-extrabold text-lg text-slate-900">Order Delivery Metrics</h3>
            <div className="space-y-4">
              <div className="p-4 bg-orange-50 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-orange-700 font-bold block">Avg Preparation Time</span>
                  <span className="text-xl font-black text-orange-900">18 Minutes</span>
                </div>
                <Clock className="w-8 h-8 text-orange-400" />
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-emerald-700 font-bold block">Customer Satisfaction</span>
                  <span className="text-xl font-black text-emerald-900">98.4% (5 Stars)</span>
                </div>
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Food Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-black text-xl text-slate-900">
                {editingFood ? 'Edit Food Item' : 'Add New Food Item'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFood} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Food Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="e.g. Truffle Mushroom Pizza"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
                  >
                    {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    placeholder="14.99"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Image URL (Unsplash or direct image) *
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  required
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  required
                  placeholder="Describe delicious ingredients, flavors and preparation..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isVegetarian}
                    onChange={(e) => setFormData({ ...formData, isVegetarian: e.target.checked })}
                    className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                  />
                  <span className="text-xs font-bold text-slate-700">Pure Vegetarian</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                    className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                  />
                  <span className="text-xs font-bold text-slate-700">In Stock / Available</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 shadow-md shadow-orange-500/20 transition"
                >
                  {editingFood ? 'Save Changes' : 'Create Food Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
