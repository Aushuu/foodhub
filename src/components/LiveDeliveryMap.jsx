import React from 'react';
import { 
  MapPin, 
  Store, 
  Navigation, 
  Phone, 
  MessageSquare, 
  ShieldCheck, 
  Star,
  Clock,
  Compass
} from 'lucide-react';

export default function LiveDeliveryMap({ order, stageIndex }) {
  // stageIndex: 0 = Placed, 1 = Preparing, 2 = On the way, 3 = Delivered
  
  // Rider position percentage along the delivery line
  const riderPositions = [12, 35, 72, 94];
  const currentRiderPos = riderPositions[stageIndex] || 12;

  const stageDescriptions = [
    {
      title: 'Order Confirmed & Ticket Sent',
      desc: 'The restaurant kitchen received your order and is reviewing your dishes.',
      eta: '25-30 mins',
      riderStatus: 'Waiting at restaurant'
    },
    {
      title: 'Chef is Preparing Your Food',
      desc: 'Fresh ingredients are being prepared and cooked with hygienic packaging.',
      eta: '18-22 mins',
      riderStatus: 'Arrived at restaurant to collect order'
    },
    {
      title: 'Rider is On The Way to You',
      desc: 'Your food is packed hot and rider Rajesh is navigating to your address.',
      eta: '8-12 mins',
      riderStatus: 'Speed: 32 km/h • On the way'
    },
    {
      title: 'Order Delivered Successfully!',
      desc: 'Rider arrived at your doorstep/gate. Enjoy your delicious hot meal!',
      eta: 'Delivered',
      riderStatus: 'Delivered to customer'
    }
  ];

  const currentInfo = stageDescriptions[stageIndex] || stageDescriptions[0];

  const customerAddress = order.deliveryAddress?.street 
    ? `${order.deliveryAddress.street}, ${order.deliveryAddress.city}`
    : 'Customer Address';

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden border border-slate-800">
      
      {/* Background Subtle Radar Effect */}
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Map Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-2.5">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Live GPS Tracking Radar
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold bg-slate-800/80 px-3.5 py-1.5 rounded-full border border-slate-700/60 self-start sm:self-auto">
          <Clock className="w-3.5 h-3.5 text-orange-400" />
          <span>Estimated Arrival: <strong className="text-orange-400 font-bold">{currentInfo.eta}</strong></span>
        </div>
      </div>

      {/* Visual Live Route Canvas */}
      <div className="relative z-10 bg-slate-950/70 border border-slate-800/80 rounded-2xl p-6 sm:p-8 overflow-hidden">
        
        {/* Road Track Line */}
        <div className="relative my-8">
          {/* Base Track */}
          <div className="h-3 bg-slate-800 rounded-full w-full overflow-hidden relative">
            <div 
              className="h-full bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500 transition-all duration-1000 rounded-full"
              style={{ width: `${currentRiderPos}%` }}
            />
          </div>

          {/* Dotted Navigation Waypoints */}
          <div className="absolute inset-0 flex justify-between items-center px-1 pointer-events-none">
            {[0, 1, 2, 3].map((idx) => (
              <div 
                key={idx} 
                className={`w-2.5 h-2.5 rounded-full border-2 transition-all ${
                  idx <= stageIndex ? 'bg-white border-orange-500 scale-110' : 'bg-slate-700 border-slate-600'
                }`}
              />
            ))}
          </div>

          {/* Animated Delivery Scooter Icon */}
          <div 
            className="absolute -top-7 -translate-x-1/2 transition-all duration-1000 z-20 flex flex-col items-center"
            style={{ left: `${currentRiderPos}%` }}
          >
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/50 ring-4 ring-orange-400/20 animate-bounce">
                <span className="text-xl">🛵</span>
              </div>
              {stageIndex === 2 && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold text-orange-300 mt-1 whitespace-nowrap bg-slate-900/90 px-2 py-0.5 rounded-md border border-slate-700">
              Rider Rajesh
            </span>
          </div>
        </div>

        {/* Start (Restaurant) and End (Customer) Nodes */}
        <div className="flex justify-between items-start pt-4 border-t border-slate-800/80 text-xs">
          
          {/* Restaurant Node */}
          <div className="flex items-start gap-3 max-w-[45%]">
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-400 flex items-center justify-center shrink-0">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Pickup Kitchen
              </span>
              <h5 className="font-bold text-white text-xs sm:text-sm">
                FoodHub Central Kitchen
              </h5>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Main Road Express Hub
              </p>
            </div>
          </div>

          {/* Customer Destination Node */}
          <div className="flex items-start gap-3 text-right max-w-[48%] flex-row-reverse">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                Delivery Location
              </span>
              <h5 className="font-bold text-white text-xs sm:text-sm truncate">
                {order.customerName}
              </h5>
              <p className="text-slate-400 text-[11px] mt-0.5 line-clamp-1">
                {customerAddress}
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Stage Live Summary & Rider Contact Info */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center relative z-10 pt-2">
        
        {/* Stage Status Description */}
        <div className="md:col-span-7 bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 space-y-1">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-orange-400 animate-spin" style={{ animationDuration: '6s' }} />
            <h4 className="font-extrabold text-sm text-white">
              {currentInfo.title}
            </h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {currentInfo.desc}
          </p>
        </div>

        {/* Courier / Rider Profile Card */}
        <div className="md:col-span-5 bg-gradient-to-r from-slate-800 to-slate-800/80 border border-slate-700/60 rounded-2xl p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-lg">
              🪖
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs sm:text-sm text-white">Rajesh K.</span>
                <span className="flex items-center text-[10px] text-amber-400 font-bold">
                  <Star className="w-3 h-3 fill-amber-400 inline" /> 4.9
                </span>
              </div>
              <span className="text-[11px] text-slate-400 block">
                TVS Jupiter • AP 07 BK 9021
              </span>
            </div>
          </div>

          <a 
            href={`tel:${order.deliveryAddress?.phone || '7396084489'}`}
            className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded-xl text-xs font-bold transition shadow-md shadow-emerald-500/30"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call</span>
          </a>
        </div>

      </div>

    </div>
  );
}
