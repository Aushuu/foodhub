import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Star, Clock, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function FoodCard({ food }) {
  const { addToCart } = useCart();
  const { isAdmin } = useAuth();
  const id = food._id || food.id;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(food, 1);
  };

  return (
    <div className="group bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-soft hover:shadow-soft-hover transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1">
      {/* Image container with badges */}
      <Link to={`/food/${id}`} className="relative block h-48 sm:h-52 overflow-hidden bg-slate-100">
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Veg / Non-veg Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              food.isVegetarian ? 'bg-emerald-500' : 'bg-red-500'
            }`}
          />
          <span className="text-slate-700 text-[11px]">
            {food.isVegetarian ? 'Veg' : 'Non-Veg'}
          </span>
        </div>

        {/* Category Pill */}
        <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-1 rounded-full shadow-sm">
          {food.category}
        </div>

        {/* Rating and prep time banner */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-medium">
          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-lg">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{food.rating || '4.8'}</span>
          </div>
          {food.prepTime && (
            <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-lg text-[11px]">
              <Clock className="w-3 h-3 text-orange-300" />
              <span>{food.prepTime}</span>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <Link to={`/food/${id}`} className="block group-hover:text-orange-600 transition-colors">
            <h3 className="font-bold text-slate-800 text-lg leading-snug line-clamp-1 mb-1.5">
              {food.name}
            </h3>
          </Link>
          <p className="text-slate-500 text-xs sm:text-sm line-clamp-2 leading-relaxed">
            {food.description}
          </p>
        </div>

        {/* Bottom row: Price and Add button */}
        <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block">Price</span>
            <span className="text-xl font-extrabold text-orange-600">
              ${Number(food.price).toFixed(2)}
            </span>
          </div>

          {isAdmin ? (
            <Link
              to="/admin"
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-orange-600 text-white px-3.5 py-2.5 rounded-2xl font-bold text-xs transition shadow-sm"
              aria-label={`Manage ${food.name} in Admin`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Manage Dish</span>
            </Link>
          ) : (
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white px-4 py-2.5 rounded-2xl font-semibold text-sm shadow-md shadow-orange-500/20 hover:shadow-orange-500/30 transition-all duration-200"
              aria-label={`Add ${food.name} to cart`}
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

