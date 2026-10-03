import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Tag,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  X,
} from 'lucide-react';

export const CartView: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    cartDiscount,
    deliveryFee,
    grandTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    coupons,
    settings,
    setActivePage,
    setSelectedProductId,
    addToast,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput.trim());
    if (res.success) {
      addToast(res.message, 'success');
      setCouponError('');
      setCouponInput('');
    } else {
      setCouponError(res.message);
    }
  };

  const handleQuickCouponClick = (code: string) => {
    const res = applyCoupon(code);
    if (res.success) {
      addToast(res.message, 'success');
      setCouponError('');
    } else {
      setCouponError(res.message);
    }
  };

  // Progress to free delivery
  const amountNeededForFreeDelivery = Math.max(0, settings.freeShippingThreshold - cartSubtotal);
  const freeDeliveryPercent = Math.min(
    100,
    Math.round((cartSubtotal / settings.freeShippingThreshold) * 100)
  );

  if (cart.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs max-w-xl mx-auto my-12 space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-950 font-heading">
          Your Shopping Cart is Empty
        </h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Explore our trending electronics, luxury horology, designer fashion, and home collections.
        </p>
        <button
          onClick={() => setActivePage('shop')}
          className="mt-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-950 font-heading">
          Shopping Cart ({cart.reduce((a, b) => a + b.quantity, 0)} Items)
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Review your chosen items, apply promo discounts, and proceed to checkout.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Cart Items (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Free Shipping Progress Meter */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-amber-600" />
                {amountNeededForFreeDelivery === 0 ? (
                  <span className="text-emerald-700 font-bold">
                    🎉 You qualify for FREE Pan-India Delivery!
                  </span>
                ) : (
                  <span>
                    Add <strong className="text-slate-950">₹{amountNeededForFreeDelivery.toLocaleString('en-IN')}</strong> more for <strong className="text-emerald-700">FREE Delivery</strong>
                  </span>
                )}
              </span>
              <span className="text-slate-400 font-bold tabular-nums">
                ₹{cartSubtotal} / ₹{settings.freeShippingThreshold}
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${freeDeliveryPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
            {cart.map((item) => (
              <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                
                {/* Product Thumbnail */}
                <div
                  onClick={() => {
                    setSelectedProductId(item.productId);
                    setActivePage('product-detail');
                  }}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-100 overflow-hidden shrink-0 cursor-pointer border border-slate-200"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    {item.product.brand}
                  </span>
                  <h3
                    onClick={() => {
                      setSelectedProductId(item.productId);
                      setActivePage('product-detail');
                    }}
                    className="text-sm font-bold text-slate-900 truncate hover:text-amber-800 cursor-pointer"
                  >
                    {item.product.name}
                  </h3>

                  {/* Size & Color Tags */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 pt-0.5">
                    {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                    {item.selectedSize && item.selectedColor && <span>·</span>}
                    {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-sm font-bold text-slate-950 tabular-nums">
                      ₹{item.product.discountPrice.toLocaleString('en-IN')}
                    </span>
                    {item.product.price > item.product.discountPrice && (
                      <span className="text-xs text-slate-400 line-through tabular-nums">
                        ₹{item.product.price.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity Controls & Total */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-2 sm:pt-0">
                  <div className="flex items-center border border-slate-300 rounded-xl bg-slate-50 overflow-hidden">
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 text-slate-600 hover:bg-slate-200 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-slate-900 tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 text-slate-600 hover:bg-slate-200 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-slate-950 tabular-nums">
                      ₹{(item.product.discountPrice * item.quantity).toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Continue Shopping Link */}
          <div className="flex justify-between items-center text-xs">
            <button
              onClick={() => setActivePage('shop')}
              className="font-semibold text-slate-700 hover:text-slate-950 hover:underline"
            >
              ← Continue Shopping
            </button>
          </div>
        </div>

        {/* Right Column: Order Summary (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6 sticky top-20">
            <h2 className="text-base font-bold text-slate-950 font-heading pb-3 border-b border-slate-100">
              Order Summary
            </h2>

            {/* Subtotals */}
            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  ₹{cartSubtotal.toLocaleString('en-IN')}
                </span>
              </div>

              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" />
                    Coupon Discount ({appliedCoupon?.code})
                  </span>
                  <span className="font-bold tabular-nums">
                    -₹{cartDiscount.toLocaleString('en-IN')}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-700 font-bold uppercase text-[11px]">FREE</span>
                  ) : (
                    `₹${deliveryFee}`
                  )}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-950">Grand Total</span>
                <span className="text-2xl font-extrabold text-slate-950 tabular-nums">
                  ₹{grandTotal.toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 text-right">Includes all GST & taxes</p>
            </div>

            {/* Promo Code Form */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                Have a Promo Code?
              </label>

              {appliedCoupon ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-emerald-900 block">{appliedCoupon.code}</span>
                    <span className="text-[11px] text-emerald-700">Applied successfully</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-emerald-800 hover:text-emerald-950 p-1"
                    title="Remove coupon"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. BADAWAT10"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value.toUpperCase());
                        setCouponError('');
                      }}
                      className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 uppercase font-mono"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-[11px] text-rose-600">{couponError}</p>}
                </form>
              )}

              {/* Quick Click Available Coupons */}
              {!appliedCoupon && (
                <div className="space-y-1 pt-2">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Available Coupons:
                  </span>
                  <div className="space-y-1.5">
                    {coupons.filter((c) => c.isActive).map((c) => (
                      <div
                        key={c.id}
                        onClick={() => handleQuickCouponClick(c.code)}
                        className="p-2 rounded-xl bg-slate-50 hover:bg-amber-50/60 border border-slate-200 cursor-pointer transition-colors flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-mono font-bold text-slate-900">{c.code}</span>
                          <span className="text-[11px] text-slate-500 block">{c.title}</span>
                        </div>
                        <span className="text-[11px] text-amber-700 font-semibold hover:underline">
                          Apply
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => setActivePage('checkout')}
              className="w-full py-3.5 px-6 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Trust Markers */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-3 text-[11px] text-slate-500 text-center">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                256-Bit SSL Secure
              </span>
              <span>·</span>
              <span>7-Day Return Policy</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
