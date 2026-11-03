import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  Flame, 
  Clock, 
  ShieldCheck, 
  Star, 
  Truck, 
  CheckCircle2, 
  Award 
} from 'lucide-react';
import SearchBar from '../components/SearchBar';
import CategoryList from '../components/CategoryList';
import FoodCard from '../components/FoodCard';
import { api } from '../services/api';

export default function Home() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFoods = async () => {
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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/menu?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const popularFoods = foods.slice(0, 4);
  const featuredFoods = foods.slice(2, 6);

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-16 sm:pb-20">
        {/* Soft background glows */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-orange-200/40 via-amber-100/30 to-rose-100/20 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-orange-100/80 text-orange-700 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-sm">
                <Sparkles className="w-4 h-4 text-orange-500" />
                <span>Fastest Food Delivery in City</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Satisfy Your Cravings With <span className="text-orange-500 underline decoration-amber-400 decoration-wavy decoration-2">Gourmet Food</span> Delivered Fast.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Discover artisan wood-fired pizzas, handcrafted smash burgers, savory noodle bowls, and gourmet desserts made fresh with organic ingredients.
              </p>

              {/* Search Bar in Hero */}
              <form onSubmit={handleSearchSubmit} className="pt-2">
                <div className="relative max-w-lg mx-auto lg:mx-0 flex items-center">
                  <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    onClear={() => setSearchQuery('')}
                    placeholder="Search dishes (e.g. Smash burger, Truffle fries)..."
                  />
                  <button
                    type="submit"
                    className="absolute right-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-orange-500/25 transition active:scale-95"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Call to Actions */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/menu"
                  className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-7 py-3.5 rounded-2xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 transition active:scale-95"
                >
                  <span>Explore Full Menu</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </Link>

                <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm text-left">
                  <div className="flex -space-x-2">
                    <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Avatar" />
                    <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Avatar" />
                    <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="Avatar" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>4.9 / 5.0</span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium">10,000+ Reviews</span>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-100 max-w-lg mx-auto lg:mx-0">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-500 shrink-0" />
                  <span className="text-xs font-semibold text-slate-700">30 Min Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-orange-500 shrink-0" />
                  <span className="text-xs font-semibold text-slate-700">Top Rated Chefs</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-orange-500 shrink-0" />
                  <span className="text-xs font-semibold text-slate-700">100% Hygienic</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Hero Food Image */}
                <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white aspect-[4/4.5] bg-orange-50">
                  <img
                    src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80"
                    alt="Signature Burger"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <span className="inline-block bg-orange-500 text-white text-[11px] font-extrabold uppercase px-3 py-1 rounded-full mb-2">
                      Chef Special
                    </span>
                    <h3 className="text-2xl font-black">Double Smashed Angus</h3>
                    <p className="text-slate-200 text-xs mt-1">Caramelized onions, cheddar & truffle mayo</p>
                  </div>
                </div>

                {/* Floating Floating Stat Pill 1 */}
                <div className="absolute -top-4 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-bounce duration-1000">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                    <Flame className="w-5 h-5 fill-orange-500 text-orange-500" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Hot & Fresh</span>
                    <span className="text-[10px] text-slate-400">Guaranteed Warm</span>
                  </div>
                </div>

                {/* Floating Floating Stat Pill 2 */}
                <div className="absolute -bottom-4 -right-4 sm:-right-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <Truck className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Free Delivery</span>
                    <span className="text-[10px] text-slate-400">On orders over $40</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Categories Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-500">
              Browse by taste
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Explore Our Categories
            </h2>
          </div>
          <Link
            to="/menu"
            className="text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <CategoryList
          activeCategory={selectedCategory}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            navigate(`/menu?category=${cat}`);
          }}
        />
      </section>

      {/* Special Offer Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 p-8 sm:p-12 text-white overflow-hidden shadow-xl shadow-orange-500/20">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 space-y-3">
              <span className="inline-block bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider">
                Limited Time Promo
              </span>
              <h3 className="text-3xl sm:text-4xl font-black tracking-tight">
                Get 30% Off Your First Food Order!
              </h3>
              <p className="text-white/80 text-sm sm:text-base max-w-xl">
                Use code <span className="font-mono font-bold text-white bg-black/30 px-2 py-0.5 rounded">WELCOME30</span> at checkout to enjoy mouthwatering food delivered with zero delivery fees.
              </p>
            </div>
            <div className="md:col-span-4 flex justify-start md:justify-end">
              <Link
                to="/menu"
                className="bg-white text-orange-600 hover:bg-orange-50 font-bold px-7 py-3.5 rounded-2xl shadow-lg transition active:scale-95 text-sm sm:text-base"
              >
                Claim Discount Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Dishes Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
          <div>
            <div className="flex items-center gap-1.5 text-orange-500 font-bold text-xs uppercase tracking-wider mb-1">
              <Flame className="w-4 h-4 fill-orange-500" />
              <span>Trending right now</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Most Popular Dishes
            </h2>
          </div>
          <Link
            to="/menu"
            className="text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
          >
            <span>See Full Menu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
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
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularFoods.map((food) => (
              <FoodCard key={food._id || food.id} food={food} />
            ))}
          </div>
        )}
      </section>

      {/* Featured Items Section */}
      <section className="bg-orange-50/50 py-16 -mx-4 px-4 sm:mx-0 sm:px-8 rounded-3xl border border-orange-100/60 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
            Hand-picked selections
          </span>
          <h2 className="text-3xl font-black text-slate-900 mt-1">
            Chef's Featured Delicacies
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            Specially curated by our award-winning master chefs using fresh farm-to-table ingredients.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredFoods.map((food) => (
            <FoodCard key={food._id || food.id} food={food} />
          ))}
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-500">
            Real Stories
          </span>
          <h2 className="text-3xl font-black text-slate-900 mt-1">
            What Our Foodies Say
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            Over 50,000+ meals delivered with love, care, and 5-star ratings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Sophia Martinez",
              role: "Food Blogger",
              review: "The Classic Smash Cheeseburger was unbelievably juicy and piping hot! Arrived in under 22 minutes. FoodHub is definitely my new go-to.",
              rating: 5,
              image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
            },
            {
              name: "David Chen",
              role: "Software Architect",
              review: "The Spicy Tokyo Ramen broth tasted like it simmered for 24 hours. The packaging kept everything separated and crispy. 10/10 quality!",
              rating: 5,
              image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80"
            },
            {
              name: "Elena Rostova",
              role: "Designer & Fitness Enthusiast",
              review: "Huge fan of the Avocado Quinoa Bowl! Fresh crisp veggies, delicious tahini dressing, and prompt delivery right to my studio.",
              rating: 5,
              image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80"
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-7 rounded-3xl border border-slate-100 shadow-soft flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed italic">
                  "{item.review}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-6 mt-6 border-t border-slate-100">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-orange-200"
                />
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{item.name}</h4>
                  <span className="text-xs text-slate-400">{item.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose FoodHub Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-white mb-1">Easy Ordering</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Browse categorized menus, customize with ease, and checkout in seconds.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-white mb-1">Express Courier</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Thermal insulated bags ensure your pizza stays crispy and burgers stay hot.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-white mb-1">Quality Guarantee</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  100% money back guarantee if you are not fully satisfied with your order.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

