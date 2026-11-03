import React from 'react';
import { CATEGORIES } from '../services/foodData';

export default function CategoryList({ activeCategory, onSelectCategory }) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2.5 overflow-x-auto pb-3 pt-1 scrollbar-none no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        {CATEGORIES.map((cat) => {
          const isActive = (activeCategory || 'all').toLowerCase() === cat.id.toLowerCase();
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 whitespace-nowrap shrink-0 border ${
                isActive
                  ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/25 scale-[1.02]'
                  : 'bg-white text-slate-600 border-slate-200/80 hover:border-orange-200 hover:bg-orange-50/50 hover:text-orange-600'
              }`}
            >
              <span className="text-base">{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

