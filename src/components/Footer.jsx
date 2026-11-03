import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Heart, Clock, MapPin, Phone, Mail, Instagram, Twitter, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/25">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Food<span className="text-orange-500">Hub</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Delivering chef-crafted culinary delights, fresh artisan pizzas, gourmet smash burgers, and healthy power bowls straight to your doorstep in 30 minutes.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-orange-600 hover:text-white flex items-center justify-center transition text-slate-400">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-orange-600 hover:text-white flex items-center justify-center transition text-slate-400">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-orange-600 hover:text-white flex items-center justify-center transition text-slate-400">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-orange-400 transition">Home</Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-orange-400 transition">Our Menu</Link>
              </li>
              <li>
                <Link to="/menu?category=Burgers" className="hover:text-orange-400 transition">Gourmet Burgers</Link>
              </li>
              <li>
                <Link to="/menu?category=Pizza" className="hover:text-orange-400 transition">Artisan Pizza</Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-orange-400 transition">Cart</Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/orders" className="hover:text-orange-400 transition">Track Order</Link>
              </li>
              <li>
                <span className="text-slate-400 hover:text-orange-400 transition cursor-pointer">Help Center & FAQ</span>
              </li>
              <li>
                <span className="text-slate-400 hover:text-orange-400 transition cursor-pointer">Refund Policy</span>
              </li>
              <li>
                <span className="text-slate-400 hover:text-orange-400 transition cursor-pointer">Terms of Service</span>
              </li>
              <li>
                <span className="text-slate-400 hover:text-orange-400 transition cursor-pointer">Privacy Policy</span>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase">Contact</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
                <span>100 Market St, San Francisco, CA</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                <span>+1 (800) 555-FOOD</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                <span>support@foodhub.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500 shrink-0" />
                <span>Everyday: 10:00 AM - 11:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} FoodHub Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for delicious food lovers
          </p>
        </div>
      </div>
    </footer>
  );
}

