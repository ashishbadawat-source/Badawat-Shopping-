import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { Star, Heart, ShoppingBag, Eye, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { setSelectedProductId, setActivePage, addToCart, isInWishlist, toggleWishlist } = useStore();
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const discountPercent = Math.round(
    ((product.price - product.discountPrice) / product.price) * 100
  );

  const isFavorited = isInWishlist(product.id);

  const handleCardClick = () => {
    setSelectedProductId(product.id);
    setActivePage('product-detail');
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(
      product,
      1,
      product.sizes ? product.sizes[0] : undefined,
      product.colors ? product.colors[0].name : undefined
    );
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Image Container with 4:3 Aspect Ratio */}
      <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
        {!imageError && product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-4 text-center">
            <span className="text-xs font-semibold">{product.brand}</span>
            <span className="text-[11px] text-slate-500 mt-1 line-clamp-1">{product.name}</span>
          </div>
        )}

        {/* Subtle Discount Tag (Single text tag - No pill sandwich) */}
        {discountPercent > 0 && (
          <div className="absolute top-2.5 left-2.5 bg-slate-950/85 backdrop-blur-xs text-amber-300 text-[11px] font-bold px-2 py-0.5 rounded-md tracking-tight">
            {discountPercent}% OFF
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isFavorited
              ? 'bg-rose-50 text-rose-600 shadow-sm'
              : 'bg-white/90 text-slate-600 hover:text-rose-600 hover:bg-white shadow-xs'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-600' : ''}`} />
        </button>

        {/* Quick Add Overlay on Desktop Hover */}
        <div
          className={`absolute inset-x-2.5 bottom-2.5 hidden sm:flex items-center gap-2 transition-all duration-200 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
        >
          <button
            onClick={handleQuickAdd}
            className="flex-1 py-2 px-3 bg-slate-950/90 hover:bg-slate-950 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-md backdrop-blur-xs transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Quick Add
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Rating row */}
          <div className="flex items-center justify-between gap-2 text-xs mb-1">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 truncate">
              {product.brand}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-slate-700 font-semibold shrink-0">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span>{product.rating}</span>
              <span className="text-slate-400 font-normal">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2 group-hover:text-amber-800 transition-colors">
            {product.name}
          </h3>
        </div>

        {/* Price & Action Row */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-slate-950 tabular-nums">
                ₹{product.discountPrice.toLocaleString('en-IN')}
              </span>
              {product.price > product.discountPrice && (
                <span className="text-xs text-slate-400 line-through tabular-nums">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-700 font-medium block">
              Save ₹{(product.price - product.discountPrice).toLocaleString('en-IN')}
            </span>
          </div>

          {/* Mobile direct Add button */}
          <button
            onClick={handleQuickAdd}
            className="sm:hidden p-2 bg-slate-900 text-white rounded-xl text-xs"
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
