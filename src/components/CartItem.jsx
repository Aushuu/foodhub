import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();
  const food = item.food;
  const foodId = food._id || food.id;

  return (
    <div className="flex items-center gap-4 py-4 border-b border-slate-100 last:border-b-0">
      {/* Thumbnail */}
      <img
        src={food.image}
        alt={food.name}
        className="w-20 h-20 rounded-2xl object-cover bg-slate-100 shrink-0 border border-slate-100"
      />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-slate-800 text-sm sm:text-base truncate">
          {food.name}
        </h4>
        <p className="text-xs text-slate-400 capitalize mt-0.5">
          {food.category}
        </p>
        <div className="text-orange-600 font-extrabold text-sm sm:text-base mt-1">
          ${Number(food.price).toFixed(2)}
        </div>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-xl p-1">
        <button
          onClick={() => updateQuantity(foodId, item.quantity - 1)}
          className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-600 hover:text-orange-600 hover:bg-orange-50 transition active:scale-95"
          aria-label="Decrease quantity"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="w-7 text-center font-bold text-sm text-slate-800">
          {item.quantity}
        </span>
        <button
          onClick={() => updateQuantity(foodId, item.quantity + 1)}
          className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-600 hover:text-orange-600 hover:bg-orange-50 transition active:scale-95"
          aria-label="Increase quantity"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Item Total & Remove */}
      <div className="flex items-center gap-3">
        <span className="font-extrabold text-slate-900 text-sm sm:text-base w-16 text-right">
          ${(food.price * item.quantity).toFixed(2)}
        </span>
        <button
          onClick={() => removeFromCart(foodId)}
          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
          aria-label="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

