import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange, onClear, placeholder = "Search for burgers, pizzas, bowls, desserts..." }) {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-5 h-5 text-orange-500 pointer-events-none" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-10 py-3.5 sm:py-4 bg-white border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 text-sm sm:text-base font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200"
        />
        {value && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3.5 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
            aria-label="Clear search input"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

