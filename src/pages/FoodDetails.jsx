import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Star, 
  Clock, 
  ShieldCheck, 
  Flame, 
  Check, 
  Sparkles 
} from 'lucide-react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import FoodCard from '../components/FoodCard';

export default function FoodDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAdmin } = useAuth();

  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [relatedFoods, setRelatedFoods] = useState([]);

  useEffect(() => {
    const fetchFoodDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const item = await api.getFoodById(id);
        setFood(item);
        
        // Fetch related foods in same category
        const all = await api.getFoods(item.category);
        setRelatedFoods(all.filter((f) => (f._id || f.id) !== id).slice(0, 4));
      } catch (err) {
        setError(err.message || "Failed to load food details");
      } finally {
        setLoading(false);
      }
    };

    fetchFoodDetails();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleAddToCart = () => {
    if (!food) return;
    addToCart(food, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse space-y-8">
        <div className="h-6 bg-slate-200 rounded w-28" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="h-96 sm:h-[480px] bg-slate-200 rounded-3xl" />
          <div className="space-y-6 py-4">
            <div className="h-8 bg-slate-200 rounded w-3/4" />
            <div className="h-5 bg-slate-200 rounded w-1/4" />
            <div className="h-20 bg-slate-200 rounded" />
            <div className="h-12 bg-slate-200 rounded-2xl w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !food) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-slate-100 shadow-sm text-center space-y-4">
        <div className="text-4xl">🔍</div>
        <h2 className="text-xl font-bold text-slate-800">Dish Not Found</h2>
        <p className="text-slate-500 text-sm">
          The dish you are looking for does not exist or may have been retired.
        </p>
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2.5 rounded-xl text-sm shadow transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Menu</span>
        </Link>
      </div>
    );
  }

  const totalPrice = (food.price * quantity).toFixed(2);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16 animate-fade-in">
      
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-slate-500 hover:text-orange-600 font-medium text-sm transition group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back</span>
      </button>

      {/* Main Food Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        
        {/* Left: Food Image */}
        <div className="lg:col-span-6">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3.5] bg-slate-100 group">
            <img
              src={food.image}
              alt={food.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Dietary Pill */}
            <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold shadow-md">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  food.isVegetarian ? 'bg-emerald-500' : 'bg-red-500'
                }`}
              />
              <span className="text-slate-700">
                {food.isVegetarian ? 'Vegetarian' : 'Non-Vegetarian'}
              </span>
            </div>

            {/* Category */}
            <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full">
              {food.category}
            </div>
          </div>
        </div>

        {/* Right: Info and Order Controls */}
        <div className="lg:col-span-6 space-y-6">
          
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-800 px-2.5 py-0.5 rounded-lg text-xs font-bold">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>{food.rating || '4.9'} (140+ reviews)</span>
              </div>
              <div className="flex items-center gap-1 text-slate-500 text-xs font-medium">
                <Clock className="w-3.5 h-3.5 text-orange-500" />
                <span>{food.prepTime || '15-20 min'}</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {food.name}
            </h1>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-extrabold text-orange-600">
              ${food.price.toFixed(2)}
            </span>
            <span className="text-sm text-slate-400">/ per serving</span>
          </div>

          {/* Description */}
          <p className="text-slate-600 text-base leading-relaxed">
            {food.description}
          </p>

          {/* Highlights */}
          <div className="grid grid-cols-2 gap-3 py-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <Sparkles className="w-4 h-4 text-orange-500 shrink-0" />
              <span>Chef Handcrafted</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>100% Fresh Guaranteed</span>
            </div>
          </div>

          {/* Order Actions for Customers / Management Action for Admin */}
          {isAdmin ? (
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="p-5 bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 shrink-0 shadow-sm">
                    <ShieldCheck className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400 block">
                      Administrator Catalog View
                    </span>
                    <p className="text-xs text-slate-300">
                      You are viewing this dish as the restaurant manager. Admins can update prices, stock & details from the Admin Panel.
                    </p>
                  </div>
                </div>
                <Link
                  to="/admin"
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs px-5 py-3 rounded-xl transition text-center whitespace-nowrap shadow-md"
                >
                  Manage Dishes in Admin
                </Link>
              </div>
            </div>
          ) : (
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-slate-700">Quantity</span>
                <div className="flex items-center gap-3 bg-slate-100 rounded-2xl p-1.5 border border-slate-200">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-700 hover:text-orange-600 active:scale-95 transition"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-extrabold text-base text-slate-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-700 hover:text-orange-600 active:scale-95 transition"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="ml-auto text-right">
                  <span className="text-xs text-slate-400 block font-medium">Subtotal</span>
                  <span className="text-xl font-black text-slate-900">${totalPrice}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl font-bold text-white transition-all shadow-lg active:scale-95 ${
                    addedAnimation
                      ? 'bg-emerald-600 shadow-emerald-600/30'
                      : 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/30'
                  }`}
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-5 h-5 stroke-[2.5]" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      <span>Add to Cart • ${totalPrice}</span>
                    </>
                  )}
                </button>

                <Link
                  to="/cart"
                  className="inline-flex items-center justify-center px-6 py-4 rounded-2xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
                >
                  View Cart
                </Link>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Related Foods */}
      {relatedFoods.length > 0 && (
        <div className="pt-12 border-t border-slate-100 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-slate-900">
              You Might Also Like
            </h3>
            <Link
              to={`/menu?category=${food.category}`}
              className="text-sm font-bold text-orange-600 hover:underline"
            >
              See More {food.category}
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedFoods.map((relFood) => (
              <FoodCard key={relFood._id || relFood.id} food={relFood} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

