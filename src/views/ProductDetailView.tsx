import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import {
  Star,
  Heart,
  ShoppingBag,
  Zap,
  Truck,
  RotateCcw,
  ShieldCheck,
  Share2,
  Copy,
  MessageCircle,
  MapPin,
  CheckCircle2,
  ChevronRight,
  Plus,
  Minus,
  AlertCircle,
  ThumbsUp,
  X,
} from 'lucide-react';

export const ProductDetailView: React.FC = () => {
  const {
    products,
    selectedProductId,
    setSelectedProductId,
    setActivePage,
    addToCart,
    wishlist,
    toggleWishlist,
    checkPincodeDelivery,
    addToast,
    reviews,
    addReview,
    currentUser,
  } = useStore();

  const product = products.find((p) => p.id === selectedProductId) || products[0];

  // Active state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.sizes ? product.sizes[0] : undefined
  );
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.colors ? product.colors[0].name : undefined
  );
  const [quantity, setQuantity] = useState(1);

  // Pincode checker state
  const [pincode, setPincode] = useState('');
  const [pincodeResult, setPincodeResult] = useState<{
    valid: boolean;
    message: string;
    cod: boolean;
    days: number;
  } | null>(null);

  // Review modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-sm text-slate-500">Product not found.</p>
        <button
          onClick={() => setActivePage('shop')}
          className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  const isFavorited = wishlist.includes(product.id);
  const discountPercent = Math.round(
    ((product.price - product.discountPrice) / product.price) * 100
  );

  const productReviews = reviews.filter((r) => r.productId === product.id);

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const res = checkPincodeDelivery(pincode);
    setPincodeResult(res);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
    setActivePage('checkout');
  };

  const handleShareWhatsApp = () => {
    const text = `Take a look at this ${product.name} on Badawat Shopping for only ₹${product.discountPrice.toLocaleString('en-IN')}!`;
    const url = `https://wa.me/?text=${encodeURIComponent(text + ' ' + window.location.href)}`;
    try {
      window.open(url, '_blank');
    } catch {
      window.location.href = url;
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    addToast('Product link copied to clipboard!', 'success');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTitle.trim() || !reviewComment.trim()) {
      addToast('Please enter review title and comments', 'error');
      return;
    }
    addReview({
      productId: product.id,
      userId: currentUser?.id || 'guest',
      userName: currentUser?.name || 'Verified Customer',
      rating: newRating,
      title: reviewTitle,
      comment: reviewComment,
      verifiedPurchase: true,
    });
    setIsReviewModalOpen(false);
    setReviewTitle('');
    setReviewComment('');
  };

  const relatedProducts = products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id && p.isActive)
    .slice(0, 4);

  return (
    <div className="space-y-12">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <button onClick={() => setActivePage('home')} className="hover:text-slate-900">
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <button onClick={() => setActivePage('shop')} className="hover:text-slate-900">
          {product.categoryName}
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-900 font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main PDP Grid: Gallery on Left + Sticky Purchase Module on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Left Column: Image Gallery (5 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Hero Image */}
          <div className="relative aspect-4/3 sm:aspect-square w-full bg-slate-100 rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-slate-950/85 backdrop-blur-xs text-amber-300 font-bold text-xs px-2.5 py-1 rounded-md">
                {discountPercent}% OFF
              </span>
            )}
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-4 right-4 p-2.5 rounded-full shadow-md backdrop-blur-xs transition-colors ${
                isFavorited ? 'bg-rose-50 text-rose-600' : 'bg-white/90 text-slate-700 hover:text-rose-600'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-600' : ''}`} />
            </button>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImageIndex === idx ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200 text-center text-xs text-slate-600">
            <div className="p-3 bg-slate-50 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-amber-600 mx-auto mb-1" />
              <span className="font-semibold text-slate-900 block">100% Genuine</span>
              <span className="text-[10px] text-slate-500">Official Warranty</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <Truck className="w-5 h-5 text-amber-600 mx-auto mb-1" />
              <span className="font-semibold text-slate-900 block">Free Delivery</span>
              <span className="text-[10px] text-slate-500">On ₹499+ orders</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <RotateCcw className="w-5 h-5 text-amber-600 mx-auto mb-1" />
              <span className="font-semibold text-slate-900 block">7-Day Returns</span>
              <span className="text-[10px] text-slate-500">Doorstep Pickup</span>
            </div>
          </div>
        </div>

        {/* Right Column: Contiguous Purchase Module (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Header Info */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest font-bold text-amber-700">
                {product.brand}
              </span>
              <span className="text-xs text-slate-400 font-mono">SKU: {product.sku}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-950 font-heading leading-snug">
              {product.name}
            </h1>

            {/* Ratings & Social Proof */}
            <div className="flex items-center gap-3 pt-1 text-xs">
              <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 text-amber-900 font-bold">
                <span>{product.rating}</span>
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              </div>
              <span className="text-slate-500">·</span>
              <span className="text-slate-600 font-medium">
                {product.reviewsCount} Customer Ratings
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified Authentic
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-slate-950 tabular-nums">
                ₹{product.discountPrice.toLocaleString('en-IN')}
              </span>
              {product.price > product.discountPrice && (
                <span className="text-base text-slate-400 line-through tabular-nums">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-sm font-bold text-emerald-700">
                  Save ₹{(product.price - product.discountPrice).toLocaleString('en-IN')} ({discountPercent}% off)
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              Inclusive of all taxes. GST invoice available upon checkout.
            </p>
          </div>

          {/* Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
                <span>Color: {selectedColor}</span>
              </label>
              <div className="flex items-center gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`group flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                      selectedColor === c.name
                        ? 'border-slate-950 bg-slate-950 text-white shadow-xs'
                        : 'border-slate-200 bg-white text-slate-800 hover:border-slate-400'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 uppercase tracking-wider">
                  Select Size
                </span>
                <span className="text-slate-500 text-[11px]">Indian Standard Fit</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      selectedSize === s
                        ? 'bg-slate-950 text-white border-slate-950 shadow-xs'
                        : 'bg-white text-slate-800 border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Stock Status */}
          <div className="flex items-center gap-6 pt-2">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase block">Quantity</span>
              <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden shadow-xs">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center font-bold text-xs text-slate-900 tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="p-2 text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase block">Availability</span>
              {product.stock > 0 ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  {product.stock <= 5 ? `Only ${product.stock} units left!` : 'In Stock Ready to Dispatch'}
                </span>
              ) : (
                <span className="text-xs font-bold text-rose-600">Currently Out of Stock</span>
              )}
            </div>
          </div>

          {/* Action Buttons: Add to Cart & Buy Now */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleAddToCart}
              className="flex-1 py-3.5 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 py-3.5 px-6 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Buy Now</span>
            </button>
          </div>

          {/* Delivery & Pincode Checker */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <MapPin className="w-4 h-4 text-amber-600" />
              <span>Check Estimated Delivery & COD</span>
            </div>
            <form onSubmit={handlePincodeCheck} className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit PIN code (e.g. 302004)"
                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-colors shrink-0"
              >
                Check
              </button>
            </form>
            {pincodeResult && (
              <div
                className={`p-3 rounded-xl text-xs ${
                  pincodeResult.valid
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    : 'bg-rose-50 text-rose-900 border border-rose-200'
                }`}
              >
                <p className="font-semibold">{pincodeResult.message}</p>
                {pincodeResult.valid && (
                  <p className="text-[11px] text-emerald-800 mt-1">
                    ✓ Cash on Delivery (COD) Available · Free Shipping eligible
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Social Share Strip */}
          <div className="flex items-center gap-3 pt-2 text-xs text-slate-600">
            <span className="font-semibold text-slate-800">Share Product:</span>
            <button
              onClick={handleShareWhatsApp}
              className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl flex items-center gap-1.5 font-medium transition-colors border border-emerald-200"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl flex items-center gap-1.5 font-medium transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Link</span>
            </button>
          </div>

        </div>
      </div>

      {/* Description & Technical Specifications */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-8">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-950 font-heading mb-3">
            Product Description
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed max-w-4xl">
            {product.description}
          </p>
        </div>

        {/* Specifications Table */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div className="pt-6 border-t border-slate-100 space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-950 font-heading">
              Technical Specifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-baseline justify-between py-2 border-b border-slate-100 text-xs"
                >
                  <span className="font-semibold text-slate-600">{key}</span>
                  <span className="text-slate-900 font-medium text-right max-w-xs">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Customer Ratings & Reviews Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-950 font-heading">
              Customer Reviews ({productReviews.length})
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500" />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-900">{product.rating} out of 5</span>
            </div>
          </div>
          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold self-start sm:self-auto transition-colors"
          >
            Write a Review
          </button>
        </div>

        {productReviews.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">
            No reviews yet. Be the first to share your thoughts on this product!
          </p>
        ) : (
          <div className="space-y-4">
            {productReviews.map((rev) => (
              <div key={rev.id} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs">{rev.userName}</span>
                    {rev.verifiedPurchase && (
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Verified Purchase
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400">{rev.createdAt}</span>
                </div>
                <div className="flex text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-500" />
                  ))}
                </div>
                <h4 className="text-xs font-bold text-slate-900">{rev.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-950 font-heading">
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Review Modal Form */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Write a Customer Review</h3>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="text-slate-400 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Your Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-1"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= newRating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Headline</label>
                <input
                  type="text"
                  required
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="e.g. Exceptional sound and battery life"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Your Review Comments
                </label>
                <textarea
                  required
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share details about performance, fit, and build quality..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold"
                >
                  Submit Review
                </button>
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sticky Mobile Add to Cart Bar (Within 15% mobile sticky cap rule) */}
      <div className="lg:hidden fixed bottom-14 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 p-2.5 px-4 flex items-center justify-between gap-3 shadow-lg">
        <div>
          <span className="text-[10px] text-slate-500 uppercase block">Total Price</span>
          <span className="text-base font-extrabold text-slate-950 tabular-nums">
            ₹{(product.discountPrice * quantity).toLocaleString('en-IN')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddToCart}
            className="py-2.5 px-4 bg-slate-900 text-white text-xs font-semibold rounded-xl"
          >
            Add to Cart
          </button>
          <button
            onClick={handleBuyNow}
            className="py-2.5 px-4 bg-amber-500 text-slate-950 text-xs font-bold rounded-xl"
          >
            Buy Now
          </button>
        </div>
      </div>

    </div>
  );
};
