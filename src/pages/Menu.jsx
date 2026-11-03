import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Filter, 
  ArrowUpDown, 
  SlidersHorizontal, 
  Utensils, 
  RotateCcw,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import FoodCard from '../components/FoodCard';
import CategoryList from '../components/CategoryList';
import SearchBar from '../components/SearchBar';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Menu() {
  const { isAdmin } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [dietFilter, setDietFilter] = useState('all'); // 'all' | 'veg' | 'non-veg'
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'price-asc' | 'price-desc' | 'rating'

  useEffect(() => {
    const fetchFoods = async () => {
      setLoading(true);
      try {
        const data = await api.getFoods();
        setFoods(data);
      } catch (err) {
        console.error("Failed to load foods:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFoods();
  }, []);

  // Sync category param with URL if changed
  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  // Filter and sort items
  const filteredFoods = useMemo(() => {
    let result = [...foods];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q) ||
          f.category.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter(
        (f) => f.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Diet filter
    if (dietFilter === 'veg') {
      result = result.filter((f) => f.isVegetarian);
    } else if (dietFilter === 'non-veg') {
      result = result.filter((f) => !f.isVegetarian);
    }

    // Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [foods, searchQuery, selectedCategory, dietFilter, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setDietFilter('all');
    setSortBy('featured');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Admin Quick Ribbon */}
      {isAdmin && (
        <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400 block">
                Administrator View
              </span>
              <p className="text-xs sm:text-sm text-slate-300">
                You are viewing the restaurant menu. You can manage dishes, modify prices, or fulfill customer orders from the Admin Dashboard.
              </p>
            </div>
          </div>
          <Link
            to="/admin"
            className="w-full sm:w-auto text-center bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl transition shadow-md whitespace-nowrap"
          >
            Manage Dishes in Admin
          </Link>
        </div>
      )}

      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-700 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          Full Food Catalog
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
          Explore Our Delicious Menu
        </h1>
        <p className="text-slate-500 text-sm sm:text-base">
          From oven-fresh sourdough pizzas and prime beef burgers to healthy bowls and handmade desserts.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
          placeholder="Search by food name or ingredient..."
        />
      </div>

      {/* Categories Bar */}
      <div>
        <CategoryList
          activeCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
        />
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
        
        {/* Diet toggles */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
            Diet:
          </span>
          <button
            onClick={() => setDietFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              dietFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setDietFilter('veg')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              dietFilter === 'veg'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Pure Veg</span>
          </button>
          <button
            onClick={() => setDietFilter('non-veg')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              dietFilter === 'non-veg'
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-400" />
            <span>Non-Veg</span>
          </button>
        </div>

        {/* Sort & Count */}
        <div className="flex items-center gap-3 ml-auto">
          <span className="text-xs text-slate-400 font-medium hidden md:inline">
            Showing <strong className="text-slate-700">{filteredFoods.length}</strong> items
          </span>

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-none focus:outline-none cursor-pointer text-xs font-semibold"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          {(searchQuery || selectedCategory !== 'all' || dietFilter !== 'all' || sortBy !== 'featured') && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline px-2 py-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Foods Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm animate-pulse space-y-4">
              <div className="w-full h-48 bg-slate-200 rounded-2xl" />
              <div className="h-4 bg-slate-200 rounded w-3/4" />
              <div className="h-3 bg-slate-200 rounded w-1/2" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-6 bg-slate-200 rounded w-16" />
                <div className="h-8 bg-slate-200 rounded-xl w-20" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredFoods.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm max-w-lg mx-auto p-8 space-y-4">
          <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto text-3xl">
            🍽️
          </div>
          <h3 className="text-xl font-bold text-slate-800">No food items found</h3>
          <p className="text-slate-500 text-sm max-w-xs mx-auto">
            We couldn't find any dishes matching your current search or filter criteria.
          </p>
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm shadow transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFoods.map((food) => (
            <FoodCard key={food._id || food.id} food={food} />
          ))}
        </div>
      )}
    </div>
  );
}

