import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import {
  ArrowRight,
  Sparkles,
  Zap,
  Flame,
  Award,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  CheckCircle2,
  Clock,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { INITIAL_HERO_IMAGE } from '../data/initialData';

export const HomeView: React.FC = () => {
  const { products, categories, setActivePage, setSelectedCategoryFilter, setSelectedProductId } = useStore();

  // Active filter tab for collection
  const [activeTab, setActiveTab] = useState<'trending' | 'bestsellers' | 'newarrivals'>('trending');

  // Live Flash Sale Countdown Timer
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 42,
    seconds: 19,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const flashSaleProducts = products.filter((p) => p.isFlashSale && p.isActive).slice(0, 4);

  const displayedProducts = products
    .filter((p) => p.isActive)
    .filter((p) => {
      if (activeTab === 'trending') return p.isTrending;
      if (activeTab === 'bestsellers') return p.isBestSeller;
      if (activeTab === 'newarrivals') return p.isNewArrival;
      return true;
    })
    .slice(0, 8);

  const handleCategoryClick = (catId: string) => {
    setSelectedCategoryFilter(catId);
    setActivePage('shop');
  };

  return (
    <div className="space-y-16">
      
      {/* 1. Large Hero Promotional Banner */}
      <section className="relative rounded-3xl overflow-hidden bg-slate-950 text-white min-h-[480px] lg:min-h-[540px] flex items-center shadow-xl">
        <div className="absolute inset-0 z-0">
          <img
            src={INITIAL_HERO_IMAGE}
            alt="Badawat Shopping Exclusive Showcase"
            className="w-full h-full object-cover object-center opacity-40 mix-blend-luminosity scale-100 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-2xl px-6 sm:px-12 py-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Grand Festive Season · Up to 60% Off</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-heading text-balance">
            Shop Smart. <br />
            <span className="text-amber-400">Shop Easy.</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-lg">
            Experience curated lifestyle excellence. From high-fidelity audio and horology to handcrafted festive silk, discover genuine Indian retail with ultra-fast delivery.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => {
                setSelectedCategoryFilter('all');
                setActivePage('shop');
              }}
              className="px-6 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-sm flex items-center gap-2 transition-all shadow-lg hover:shadow-amber-500/20"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setSelectedCategoryFilter('cat-electronics');
                setActivePage('shop');
              }}
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-sm backdrop-blur-xs transition-colors border border-white/20"
            >
              Shop Electronics
            </button>
          </div>

          {/* Micro trust stats */}
          <div className="pt-4 border-t border-white/10 flex items-center gap-6 text-xs text-slate-400">
            <div>
              <span className="block text-base font-bold text-white tabular-nums">10,000+</span>
              <span>Satisfied Shoppers</span>
            </div>
            <div className="h-6 w-px bg-white/20" />
            <div>
              <span className="block text-base font-bold text-white tabular-nums">4.9 / 5</span>
              <span>Verified Product Ratings</span>
            </div>
            <div className="h-6 w-px bg-white/20" />
            <div>
              <span className="block text-base font-bold text-white">Pan-India</span>
              <span>2-3 Day Courier Service</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Product Categories Showcase */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-950 font-heading">
              Shop by Category
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Handpicked categories spanning technology, fashion, luxury and lifestyle.
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedCategoryFilter('all');
              setActivePage('shop');
            }}
            className="text-xs sm:text-sm font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {categories.filter((c) => c.isActive).map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="group relative bg-white rounded-2xl p-4 border border-slate-200/80 hover:border-amber-400/80 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div className="aspect-square w-full rounded-xl bg-slate-100 overflow-hidden mb-3 relative">
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">
                    {cat.name.slice(0, 2)}
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-sm text-slate-900 group-hover:text-amber-800 transition-colors line-clamp-1">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  {cat.itemCount}+ items
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Flash Sale Section with Active Countdown */}
      {flashSaleProducts.length > 0 && (
        <section className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent rounded-3xl p-6 sm:p-8 border border-amber-300/40 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-amber-500 text-slate-950">
                  <Zap className="w-4 h-4 fill-current" />
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-950 font-heading">
                  Flash Deals of the Day
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600">
                Limited-time special prices. Grab yours before stock runs out!
              </p>
            </div>

            {/* Countdown Clock Display */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white px-4 py-2 rounded-2xl border border-amber-200 shadow-xs shrink-0">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Ends in:</span>
              <div className="flex items-center gap-1 font-mono font-bold text-slate-950 tabular-nums">
                <span className="bg-slate-900 text-white px-2 py-0.5 rounded-md text-xs">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span>:</span>
                <span className="bg-slate-900 text-white px-2 py-0.5 rounded-md text-xs">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span>:</span>
                <span className="bg-slate-900 text-white px-2 py-0.5 rounded-md text-xs">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {flashSaleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 4. Curated Collection Segmented Tabs (Trending / Best Sellers / New Arrivals) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-950 font-heading">
              Curated For You
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Top trending gadgets, high-fashion arrivals, and all-time customer favorites.
            </p>
          </div>

          {/* Interactive Segmented Filter Controls */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('trending')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'trending'
                  ? 'bg-white text-slate-950 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Trending Now
            </button>
            <button
              onClick={() => setActiveTab('bestsellers')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'bestsellers'
                  ? 'bg-white text-slate-950 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Best Sellers
            </button>
            <button
              onClick={() => setActiveTab('newarrivals')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'newarrivals'
                  ? 'bg-white text-slate-950 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              New Arrivals
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. Special Promotional Banner Strip */}
      <section className="bg-slate-900 rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-3 max-w-xl z-10">
          <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">
            Special Indian Festive Offer
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading">
            Extra Flat ₹500 OFF On Your First Order
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Apply coupon code <code className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-mono font-bold">WELCOME500</code> at checkout on orders of ₹1,999 or more. Valid on all categories!
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                setSelectedCategoryFilter('all');
                setActivePage('shop');
              }}
              className="px-5 py-2.5 bg-white text-slate-950 hover:bg-slate-100 font-bold rounded-xl text-xs transition-colors"
            >
              Claim Offer & Shop Now
            </button>
          </div>
        </div>
        <div className="shrink-0 flex items-center justify-center p-6 bg-slate-800/80 rounded-2xl border border-slate-700/80 text-center">
          <div>
            <span className="text-[11px] text-slate-400 block uppercase tracking-wider font-semibold">
              Coupon Code
            </span>
            <span className="text-2xl font-black text-amber-400 font-mono tracking-wider block my-1">
              WELCOME500
            </span>
            <span className="text-[10px] text-slate-400 block">Tap code at checkout to apply</span>
          </div>
        </div>
      </section>

      {/* 6. Why Choose Badawat Shopping */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-950 font-heading">
            Why Shop with Badawat?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Built on customer trust, uncompromised quality, and transparent pan-India commerce.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Direct Fulfillment & Air Shipping</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Orders are packaged in moisture-proof, tamper-evident containers and dispatched via top air logistics partners like BlueDart and Delhivery.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">100% Authentic Indian Stock</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every single piece is sourced directly from certified manufacturers or heritage artisan clusters with full warranty paperwork and GST invoicing.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Instant Refunds & Doorstep Returns</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              If an item doesn't meet your expectations or sizing needs, schedule a free reverse pickup with 1-click in your account dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* 7. Customer Reviews & Social Proof */}
      <section className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-950 font-heading">
              Loved by Shoppers Across India
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Verified buyers share their authentic delivery and product experiences.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-500" />
              ))}
            </div>
            <span className="font-bold text-slate-900">4.9 Overall Rating</span>
            <span className="text-slate-400">· 1,200+ Reviews</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex text-amber-500 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                ))}
              </div>
              <p className="text-xs font-bold text-slate-900 mb-1">
                "Superior sound quality, delivered next day in Jaipur!"
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                The Badawat AeroPro earbuds exceeded my expectations. The ANC blocks out traffic noise completely during commutes, and the packaging was sealed with genuine warranty card.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60 text-xs">
              <span className="font-bold text-slate-900">Vikramaditya S.</span>
              <span className="text-slate-400">·</span>
              <span className="text-emerald-700 font-medium flex items-center gap-0.5">
                <CheckCircle2 className="w-3 h-3" /> Verified Buyer
              </span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex text-amber-500 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                ))}
              </div>
              <p className="text-xs font-bold text-slate-900 mb-1">
                "The Royal Chronograph is pure luxury"
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                I wear this watch to business conferences and always get compliments on the cobalt blue face. Sapphire crystal is 100% scratch proof. Best purchase this year.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60 text-xs">
              <span className="font-bold text-slate-900">Arjun Mehta</span>
              <span className="text-slate-400">·</span>
              <span className="text-emerald-700 font-medium flex items-center gap-0.5">
                <CheckCircle2 className="w-3 h-3" /> Verified Buyer
              </span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex text-amber-500 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                ))}
              </div>
              <p className="text-xs font-bold text-slate-900 mb-1">
                "Festive Kurta fits like a bespoke tailored suit"
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                Fabric is pure raw silk with fine embroidery. Sizing chart was accurate and it arrived neatly pressed in a garment dust bag. Will order again!
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60 text-xs">
              <span className="font-bold text-slate-900">Rohan Singhania</span>
              <span className="text-slate-400">·</span>
              <span className="text-emerald-700 font-medium flex items-center gap-0.5">
                <CheckCircle2 className="w-3 h-3" /> Verified Buyer
              </span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
