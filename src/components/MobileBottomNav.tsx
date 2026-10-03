import React from 'react';
import { useStore } from '../context/StoreContext';
import { Home, Grid, Search, ShoppingBag, User, Heart } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { activePage, setActivePage, cartCount, wishlist, setSelectedCategoryFilter } = useStore();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg">
      <button
        onClick={() => setActivePage('home')}
        className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-colors ${
          activePage === 'home' ? 'text-amber-600 font-bold' : 'text-slate-600'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Home</span>
      </button>

      <button
        onClick={() => {
          setSelectedCategoryFilter('all');
          setActivePage('shop');
        }}
        className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-colors ${
          activePage === 'shop' ? 'text-amber-600 font-bold' : 'text-slate-600'
        }`}
      >
        <Grid className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Explore</span>
      </button>

      <button
        onClick={() => setActivePage('wishlist')}
        className={`relative flex flex-col items-center justify-center p-1.5 rounded-xl transition-colors ${
          activePage === 'wishlist' ? 'text-amber-600 font-bold' : 'text-slate-600'
        }`}
      >
        <Heart className="w-5 h-5" />
        {wishlist.length > 0 && (
          <span className="absolute top-1 right-2 w-3.5 h-3.5 bg-rose-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {wishlist.length}
          </span>
        )}
        <span className="text-[10px] mt-0.5">Wishlist</span>
      </button>

      <button
        onClick={() => setActivePage('cart')}
        className={`relative flex flex-col items-center justify-center p-1.5 rounded-xl transition-colors ${
          activePage === 'cart' ? 'text-amber-600 font-bold' : 'text-slate-600'
        }`}
      >
        <ShoppingBag className="w-5 h-5" />
        {cartCount > 0 && (
          <span className="absolute top-1 right-2 w-3.5 h-3.5 bg-slate-950 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {cartCount}
          </span>
        )}
        <span className="text-[10px] mt-0.5">Cart</span>
      </button>

      <button
        onClick={() => setActivePage('user-dashboard')}
        className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-colors ${
          activePage === 'user-dashboard' || activePage === 'admin-dashboard'
            ? 'text-amber-600 font-bold'
            : 'text-slate-600'
        }`}
      >
        <User className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Account</span>
      </button>
    </nav>
  );
};
