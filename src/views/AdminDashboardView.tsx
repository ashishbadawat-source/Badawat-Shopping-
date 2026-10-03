import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, Category, Coupon, Order, User, Banner, PaymentTransaction } from '../types';
import {
  Shield,
  Package,
  Layers,
  ShoppingBag,
  Tag,
  Settings,
  Users,
  TrendingUp,
  Plus,
  Trash2,
  Edit,
  Eye,
  CheckCircle,
  XCircle,
  FileText,
  Search,
  Check,
  X,
  Truck,
  CreditCard,
  MessageSquare,
  Image as ImageIcon,
  DollarSign,
  AlertTriangle,
  Lock,
  UserCheck,
  UserX,
  RefreshCw,
  ExternalLink,
  Sliders,
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,
    categories,
    addCategory,
    deleteCategory,
    orders,
    updateOrderStatus,
    coupons,
    addCoupon,
    deleteCoupon,
    toggleCouponStatus,
    reviews,
    deleteReview,
    updateReviewStatus,
    users,
    addUser,
    toggleUserBlock,
    changeUserRole,
    deleteUser,
    payments,
    refundPayment,
    markPaymentPaid,
    banners,
    addBanner,
    updateBanner,
    deleteBanner,
    toggleBannerStatus,
    settings,
    updateSettings,
    setActivePage,
    setSelectedOrderId,
    addToast,
  } = useStore();

  const [currentTab, setCurrentTab] = useState<
    | 'overview'
    | 'products'
    | 'categories'
    | 'users'
    | 'orders'
    | 'payments'
    | 'coupons'
    | 'reviews'
    | 'banners'
    | 'settings'
  >('overview');

  // Stats calculation
  const totalSales = orders
    .filter((o) => o.paymentStatus === 'paid' && o.orderStatus !== 'cancelled')
    .reduce((sum, o) => sum + o.grandTotal, 0);
  const pendingOrders = orders.filter(
    (o) => o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled'
  ).length;
  const lowStockProducts = products.filter((p) => p.stock <= 5 && p.isActive).length;

  // PRODUCT MODAL STATE
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodBrand, setProdBrand] = useState('Badawat');
  const [prodCatId, setProdCatId] = useState(categories[0]?.id || '');
  const [prodPrice, setProdPrice] = useState(2999);
  const [prodDiscPrice, setProdDiscPrice] = useState(1499);
  const [prodStock, setProdStock] = useState(25);
  const [prodSku, setProdSku] = useState('BW-NEW-01');
  const [prodImage, setProdImage] = useState('/src/assets/images/product_wireless_earbuds_1791010448598.jpg');
  const [prodDesc, setProdDesc] = useState('');
  const [prodIsFlashSale, setProdIsFlashSale] = useState(false);

  // CATEGORY MODAL STATE
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catImage, setCatImage] = useState('/src/assets/images/product_luxury_chronograph_1791010460947.jpg');

  // USER MODAL STATE
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userRole, setUserRole] = useState<'admin' | 'customer'>('customer');

  // COUPON MODAL STATE
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [coupCode, setCoupCode] = useState('');
  const [coupTitle, setCoupTitle] = useState('');
  const [coupType, setCoupType] = useState<'percentage' | 'fixed'>('percentage');
  const [coupValue, setCoupValue] = useState(15);
  const [coupMinOrder, setCoupMinOrder] = useState(999);
  const [coupMaxDisc, setCoupMaxDisc] = useState(1000);
  const [coupExpiry, setCoupExpiry] = useState('2026-12-31');

  // BANNER MODAL STATE
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerSubtitle, setBannerSubtitle] = useState('');
  const [bannerTag, setBannerTag] = useState('');
  const [bannerImage, setBannerImage] = useState('/src/assets/images/hero_badawat_shopping_1791010434824.jpg');
  const [bannerCategory, setBannerCategory] = useState('all');
  const [bannerCta, setBannerCta] = useState('Shop Now');

  // ORDER FILTER STATE
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // Product actions
  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setProdName('');
    setProdBrand('Badawat');
    setProdPrice(2499);
    setProdDiscPrice(1299);
    setProdStock(30);
    setProdSku(`BW-PRD-${Math.floor(100 + Math.random() * 900)}`);
    setProdImage('/src/assets/images/product_wireless_earbuds_1791010448598.jpg');
    setProdDesc('Engineered with premium materials and high precision.');
    setProdIsFlashSale(false);
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setProdName(p.name);
    setProdBrand(p.brand);
    setProdCatId(p.categoryId);
    setProdPrice(p.price);
    setProdDiscPrice(p.discountPrice);
    setProdStock(p.stock);
    setProdSku(p.sku);
    setProdImage(p.images[0] || '');
    setProdDesc(p.description);
    setProdIsFlashSale(Boolean(p.isFlashSale));
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const cat = categories.find((c) => c.id === prodCatId) || categories[0];
    const productPayload = {
      name: prodName,
      slug: prodName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      brand: prodBrand,
      categoryId: cat.id,
      categoryName: cat.name,
      price: Number(prodPrice),
      discountPrice: Number(prodDiscPrice),
      stock: Number(prodStock),
      sku: prodSku,
      images: [prodImage],
      description: prodDesc,
      specifications: {
        Manufacturer: 'Badawat Industrial & Lifestyle',
        Origin: 'Made in India',
      },
      rating: 4.8,
      reviewsCount: 1,
      isFlashSale: prodIsFlashSale,
      isActive: true,
    };

    if (editingProductId) {
      updateProduct(editingProductId, productPayload);
    } else {
      addProduct(productPayload);
    }
    setIsProductModalOpen(false);
  };

  // Category actions
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    addCategory({
      name: catName,
      slug: catName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: catDesc,
      image: catImage,
      itemCount: 0,
      order: categories.length + 1,
      isActive: true,
    });
    setIsCatModalOpen(false);
    setCatName('');
    setCatDesc('');
  };

  // User actions
  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !userEmail) return;
    addUser({
      name: userName,
      email: userEmail,
      phone: userPhone || '+91 98000 00000',
      role: userRole,
    });
    setIsUserModalOpen(false);
    setUserName('');
    setUserEmail('');
  };

  // Coupon actions
  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    addCoupon({
      code: coupCode.toUpperCase().trim(),
      title: coupTitle,
      discountType: coupType,
      value: Number(coupValue),
      minOrderValue: Number(coupMinOrder),
      maxDiscount: coupType === 'percentage' ? Number(coupMaxDisc) : undefined,
      expiryDate: coupExpiry,
      usageLimit: 1000,
      usedCount: 0,
      isActive: true,
    });
    setIsCouponModalOpen(false);
  };

  // Banner actions
  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    addBanner({
      title: bannerTitle,
      subtitle: bannerSubtitle,
      tag: bannerTag,
      image: bannerImage,
      linkCategory: bannerCategory,
      ctaText: bannerCta,
      isActive: true,
      order: banners.length + 1,
    });
    setIsBannerModalOpen(false);
    setBannerTitle('');
    setBannerSubtitle('');
  };

  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter !== 'all' && o.orderStatus !== orderStatusFilter) {
      return false;
    }
    if (orderSearchQuery.trim()) {
      const q = orderSearchQuery.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.shippingAddress.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Admin Title Bar */}
      <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold font-heading">Badawat Admin Console</h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                Super Admin
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live management across Products, Categories, Users, Orders, Payments, Coupons, Reviews, Banners & Settings.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActivePage('home')}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl transition-colors self-start md:self-auto flex items-center gap-1.5"
        >
          <span>View Customer Storefront</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Admin 9-Module Navigation Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 text-xs">
        <button
          onClick={() => setCurrentTab('overview')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            currentTab === 'overview'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setCurrentTab('products')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            currentTab === 'products'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Manage Products ({products.length})</span>
        </button>

        <button
          onClick={() => setCurrentTab('categories')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            currentTab === 'categories'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Manage Categories ({categories.length})</span>
        </button>

        <button
          onClick={() => setCurrentTab('users')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            currentTab === 'users'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Manage Users ({users.length})</span>
        </button>

        <button
          onClick={() => setCurrentTab('orders')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            currentTab === 'orders'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Manage Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setCurrentTab('payments')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            currentTab === 'payments'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Manage Payments ({payments.length})</span>
        </button>

        <button
          onClick={() => setCurrentTab('coupons')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            currentTab === 'coupons'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Manage Coupons ({coupons.length})</span>
        </button>

        <button
          onClick={() => setCurrentTab('reviews')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            currentTab === 'reviews'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Manage Reviews ({reviews.length})</span>
        </button>

        <button
          onClick={() => setCurrentTab('banners')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            currentTab === 'banners'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Manage Banners ({banners.length})</span>
        </button>

        <button
          onClick={() => setCurrentTab('settings')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            currentTab === 'settings'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Website Settings</span>
        </button>
      </div>

      {/* 1. OVERVIEW TAB */}
      {currentTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
              <span className="text-slate-500 text-xs font-semibold">Total Revenue (Paid)</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-slate-950 font-mono tabular-nums">
                  ₹{totalSales.toLocaleString('en-IN')}
                </span>
                <span className="text-emerald-700 text-xs font-bold flex items-center gap-0.5">
                  <TrendingUp className="w-3.5 h-3.5" /> Active
                </span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
              <span className="text-slate-500 text-xs font-semibold">Total Customer Orders</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-slate-950 tabular-nums">
                  {orders.length}
                </span>
                <span className="text-slate-400 text-xs">{pendingOrders} Pending</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
              <span className="text-slate-500 text-xs font-semibold">Registered Customers</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-slate-950 tabular-nums">
                  {users.length}
                </span>
                <span className="text-emerald-700 text-[10px] font-bold bg-emerald-50 px-2 py-0.5 rounded">
                  All Active
                </span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
              <span className="text-slate-500 text-xs font-semibold">Active Inventory SKUs</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-slate-950 tabular-nums">
                  {products.length}
                </span>
                {lowStockProducts > 0 && (
                  <span className="text-rose-700 text-[10px] font-bold bg-rose-50 px-2 py-0.5 rounded">
                    {lowStockProducts} Low Stock
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Shortcuts to Admin Modules */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => setCurrentTab('orders')}
              className="p-4 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 text-left transition-colors"
            >
              <ShoppingBag className="w-5 h-5 text-amber-600 mb-2" />
              <h4 className="font-bold text-xs text-slate-900">Manage Orders</h4>
              <p className="text-[11px] text-slate-500">Update statuses, view invoices</p>
            </button>

            <button
              onClick={() => setCurrentTab('products')}
              className="p-4 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 text-left transition-colors"
            >
              <Package className="w-5 h-5 text-amber-600 mb-2" />
              <h4 className="font-bold text-xs text-slate-900">Manage Products</h4>
              <p className="text-[11px] text-slate-500">Stock & pricing control</p>
            </button>

            <button
              onClick={() => setCurrentTab('payments')}
              className="p-4 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 text-left transition-colors"
            >
              <CreditCard className="w-5 h-5 text-amber-600 mb-2" />
              <h4 className="font-bold text-xs text-slate-900">Manage Payments</h4>
              <p className="text-[11px] text-slate-500">Refunds, transaction logs</p>
            </button>

            <button
              onClick={() => setCurrentTab('users')}
              className="p-4 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 text-left transition-colors"
            >
              <Users className="w-5 h-5 text-amber-600 mb-2" />
              <h4 className="font-bold text-xs text-slate-900">Manage Users</h4>
              <p className="text-[11px] text-slate-500">Roles & customer directory</p>
            </button>
          </div>
        </div>
      )}

      {/* 2. MANAGE PRODUCTS */}
      {currentTab === 'products' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-950 font-heading">
                Manage Products ({products.length})
              </h2>
              <p className="text-xs text-slate-500">Create products, upload pictures, adjust MRP/discounts and inventory.</p>
            </div>
            <button
              onClick={handleOpenAddProduct}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100">
                  <th className="pb-3 font-semibold">Product</th>
                  <th className="pb-3 font-semibold">Category</th>
                  <th className="pb-3 font-semibold">Price / Disc.</th>
                  <th className="pb-3 font-semibold">Stock</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900 line-clamp-1">{p.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">SKU: {p.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-slate-700">{p.categoryName}</td>
                    <td className="py-3 tabular-nums font-semibold">
                      <span className="text-slate-950 font-bold">₹{p.discountPrice.toLocaleString('en-IN')}</span>
                      <span className="text-slate-400 line-through text-[11px] ml-1">₹{p.price.toLocaleString('en-IN')}</span>
                    </td>
                    <td className="py-3">
                      <span className={`font-bold tabular-nums ${p.stock <= 5 ? 'text-rose-600' : 'text-slate-900'}`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="py-3">
                      <button
                        onClick={() => toggleProductStatus(p.id)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          p.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {p.isActive ? 'Active' : 'Disabled'}
                      </button>
                    </td>
                    <td className="py-3 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditProduct(p)}
                        className="text-slate-700 hover:text-slate-950 font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="text-rose-600 hover:text-rose-800 font-semibold"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. MANAGE CATEGORIES */}
      {currentTab === 'categories' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-950 font-heading">
                Manage Categories ({categories.length})
              </h2>
              <p className="text-xs text-slate-500">Configure catalog categories and homepage groupings.</p>
            </div>
            <button
              onClick={() => setIsCatModalOpen(true)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Add Category
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((c) => (
              <div key={c.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 overflow-hidden shrink-0">
                    {c.image ? <img src={c.image} alt={c.name} className="w-full h-full object-cover" /> : null}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{c.name}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{c.description}</p>
                    <span className="text-[10px] text-amber-700 font-semibold">{c.itemCount} items listed</span>
                  </div>
                </div>

                <button
                  onClick={() => deleteCategory(c.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. MANAGE USERS */}
      {currentTab === 'users' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-950 font-heading">
                Manage Users ({users.length})
              </h2>
              <p className="text-xs text-slate-500">Manage registered customers, administrators, block status and roles.</p>
            </div>
            <button
              onClick={() => setIsUserModalOpen(true)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Add User
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100">
                  <th className="pb-3 font-semibold">User</th>
                  <th className="pb-3 font-semibold">Contact</th>
                  <th className="pb-3 font-semibold">Role</th>
                  <th className="pb-3 font-semibold">Orders / Spent</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/60">
                    <td className="py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-800 font-bold flex items-center justify-center text-xs">
                          {u.name.slice(0, 1).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{u.name}</p>
                          <p className="text-[11px] text-slate-400">Joined {u.createdAt}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <p className="text-slate-800">{u.email}</p>
                      <p className="text-[11px] text-slate-500 font-mono">{u.phone}</p>
                    </td>
                    <td className="py-3">
                      <select
                        value={u.role}
                        onChange={(e) => changeUserRole(u.id, e.target.value as 'admin' | 'customer')}
                        className="px-2 py-1 bg-slate-50 border rounded-lg text-xs font-semibold"
                      >
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="py-3 tabular-nums font-semibold">
                      <p className="text-slate-900">{u.ordersCount || 0} orders</p>
                      <p className="text-emerald-700 text-[11px]">₹{(u.totalSpent || 0).toLocaleString('en-IN')}</p>
                    </td>
                    <td className="py-3">
                      <button
                        onClick={() => toggleUserBlock(u.id)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          u.isBlocked ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {u.isBlocked ? 'Blocked' : 'Active'}
                      </button>
                    </td>
                    <td className="py-3 text-right">
                      {u.id !== 'admin-001' && (
                        <button
                          onClick={() => deleteUser(u.id)}
                          className="text-rose-600 hover:text-rose-800 font-semibold"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. MANAGE ORDERS */}
      {currentTab === 'orders' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-950 font-heading">
                Manage Orders ({filteredOrders.length})
              </h2>
              <p className="text-xs text-slate-500">Live order fulfillment, customer status updates, and printable tax invoices.</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                placeholder="Search order #, customer, city..."
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
                className="text-xs px-3 py-2 bg-slate-50 border rounded-xl"
              />

              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="text-xs px-3 py-2 bg-slate-50 border rounded-xl cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredOrders.map((ord) => (
              <div key={ord.id} className="p-4 rounded-2xl bg-slate-50/60 border border-slate-200 space-y-3 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200/60">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-sm text-slate-900">#{ord.orderNumber}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-600 font-semibold">{ord.customerName}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500">{ord.customerPhone}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-medium">Update Status:</span>
                    <select
                      value={ord.orderStatus}
                      onChange={(e) => updateOrderStatus(ord.id, e.target.value as Order['orderStatus'])}
                      className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg font-bold text-xs cursor-pointer"
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="out_for_delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-slate-600">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Items ({ord.items.length})</span>
                    <p className="line-clamp-2 text-slate-900 font-medium">
                      {ord.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Shipping Address</span>
                    <p className="line-clamp-2 text-slate-700">
                      {ord.shippingAddress.street}, {ord.shippingAddress.city}, {ord.shippingAddress.state} - {ord.shippingAddress.pincode}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Payment & Amount</span>
                    <p className="font-bold text-slate-950 tabular-nums">₹{ord.grandTotal.toLocaleString('en-IN')}</p>
                    <p className="text-[11px] text-slate-500 uppercase">{ord.paymentMethod} · {ord.paymentStatus}</p>
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setSelectedOrderId(ord.id);
                        setActivePage('invoice');
                      }}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Invoice
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. MANAGE PAYMENTS */}
      {currentTab === 'payments' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-950 font-heading">
                Manage Payments & Transactions ({payments.length})
              </h2>
              <p className="text-xs text-slate-500">Transaction ledger, payment gateway reconciliation and refunds.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100">
                  <th className="pb-3 font-semibold">Transaction ID</th>
                  <th className="pb-3 font-semibold">Order #</th>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Method</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60">
                    <td className="py-3 font-mono font-bold text-slate-900">
                      {p.transactionId}
                      <span className="block text-[10px] text-slate-400 font-sans">{p.gatewayRef}</span>
                    </td>
                    <td className="py-3 font-mono font-semibold text-slate-700">{p.orderNumber}</td>
                    <td className="py-3 text-slate-800">{p.customerName}</td>
                    <td className="py-3 uppercase text-[11px] font-bold text-slate-600">{p.paymentMethod}</td>
                    <td className="py-3 font-extrabold text-slate-950 tabular-nums">
                      ₹{p.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          p.paymentStatus === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : p.paymentStatus === 'refunded'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {p.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 text-right space-x-2">
                      {p.paymentStatus === 'pending' && (
                        <button
                          onClick={() => markPaymentPaid(p.id)}
                          className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold"
                        >
                          Mark Paid
                        </button>
                      )}
                      {p.paymentStatus === 'paid' && (
                        <button
                          onClick={() => refundPayment(p.id)}
                          className="px-2 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded text-[11px] font-semibold"
                        >
                          Refund
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. MANAGE COUPONS */}
      {currentTab === 'coupons' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-950 font-heading">
                Manage Coupons & Promo Codes ({coupons.length})
              </h2>
              <p className="text-xs text-slate-500">Configure promotional vouchers, percentage & flat discounts.</p>
            </div>
            <button
              onClick={() => setIsCouponModalOpen(true)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Create Coupon
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {coupons.map((c) => (
              <div key={c.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-base font-extrabold text-slate-950">{c.code}</span>
                  <button
                    onClick={() => toggleCouponStatus(c.id)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      c.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {c.isActive ? 'Active' : 'Disabled'}
                  </button>
                </div>
                <p className="font-semibold text-slate-800">{c.title}</p>
                <p className="text-slate-500">
                  Value: {c.discountType === 'percentage' ? `${c.value}% Off` : `₹${c.value} Flat`} · Min: ₹{c.minOrderValue}
                </p>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Used {c.usedCount} times</span>
                  <button
                    onClick={() => deleteCoupon(c.id)}
                    className="text-rose-600 hover:underline text-[11px]"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. MANAGE REVIEWS */}
      {currentTab === 'reviews' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-950 font-heading">
                Manage Reviews ({reviews.length})
              </h2>
              <p className="text-xs text-slate-500">Moderate customer ratings, verify genuine feedback, approve or delete.</p>
            </div>
          </div>

          <div className="space-y-3">
            {reviews.map((r) => (
              <div key={r.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{r.userName}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-amber-800 font-semibold">{r.productName || 'Verified Product'}</span>
                    {r.verifiedPurchase && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <span className="text-slate-400 text-[11px]">{r.createdAt}</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex text-amber-500 font-bold">
                    {'★'.repeat(r.rating)}
                    {'☆'.repeat(5 - r.rating)}
                  </div>
                  <span className="font-bold text-slate-900">{r.title}</span>
                </div>

                <p className="text-slate-600">{r.comment}</p>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Status: <strong className="uppercase text-emerald-700">{r.status || 'Approved'}</strong>
                  </span>
                  <div className="space-x-2">
                    <button
                      onClick={() => updateReviewStatus(r.id, 'approved')}
                      className="px-2.5 py-1 bg-emerald-600 text-white rounded text-[11px] font-semibold"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateReviewStatus(r.id, 'rejected')}
                      className="px-2.5 py-1 bg-amber-600 text-white rounded text-[11px] font-semibold"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => deleteReview(r.id)}
                      className="px-2.5 py-1 text-rose-600 hover:bg-rose-50 rounded text-[11px] font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 9. MANAGE BANNERS */}
      {currentTab === 'banners' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-950 font-heading">
                Manage Promotional Banners ({banners.length})
              </h2>
              <p className="text-xs text-slate-500">Configure homepage hero banners, seasonal campaign sliders and CTA links.</p>
            </div>
            <button
              onClick={() => setIsBannerModalOpen(true)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Add Banner
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {banners.map((b) => (
              <div key={b.id} className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 space-y-3">
                <div className="aspect-16/9 w-full bg-slate-900 relative">
                  <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 bg-slate-950/80 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded">
                    {b.tag}
                  </div>
                </div>
                <div className="p-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-slate-900">{b.title}</h4>
                    <button
                      onClick={() => toggleBannerStatus(b.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        b.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {b.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </div>
                  <p className="text-slate-600 line-clamp-2">{b.subtitle}</p>
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-[11px] text-amber-700 font-semibold">CTA: {b.ctaText}</span>
                    <button
                      onClick={() => deleteBanner(b.id)}
                      className="text-rose-600 hover:underline text-[11px]"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 10. WEBSITE SETTINGS */}
      {currentTab === 'settings' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-slate-950 font-heading pb-3 border-b border-slate-100">
            Website & Store Settings
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Website Brand Name</label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => updateSettings({ storeName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Brand Tagline</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => updateSettings({ tagline: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Free Delivery Threshold (₹)</label>
              <input
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(e) => updateSettings({ freeShippingThreshold: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Standard Delivery Fee (₹)</label>
              <input
                type="number"
                value={settings.defaultShippingFee}
                onChange={(e) => updateSettings({ defaultShippingFee: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">GSTIN Number</label>
              <input
                type="text"
                value={settings.gstNumber}
                onChange={(e) => updateSettings({ gstNumber: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Support WhatsApp Number</label>
              <input
                type="text"
                value={settings.whatsappNumber}
                onChange={(e) => updateSettings({ whatsappNumber: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="font-semibold text-slate-700 block mb-1">Top Announcement Bar Text</label>
              <input
                type="text"
                value={settings.announcementText}
                onChange={(e) => updateSettings({ announcementText: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="font-semibold text-slate-700 block mb-1">Warehouse Address</label>
              <input
                type="text"
                value={settings.warehouseLocation}
                onChange={(e) => updateSettings({ warehouseLocation: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
              />
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT PRODUCT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">
                {editingProductId ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Brand</label>
                  <input
                    type="text"
                    required
                    value={prodBrand}
                    onChange={(e) => setProdBrand(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={prodCatId}
                    onChange={(e) => setProdCatId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Regular MRP (₹)</label>
                  <input
                    type="number"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Discount Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={prodDiscPrice}
                    onChange={(e) => setProdDiscPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={prodStock}
                    onChange={(e) => setProdStock(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Image URL or Asset Path</label>
                <input
                  type="text"
                  required
                  value={prodImage}
                  onChange={(e) => setProdImage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={prodIsFlashSale}
                    onChange={(e) => setProdIsFlashSale(e.target.checked)}
                  />
                  <span>Feature in Flash Sale Section</span>
                </label>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl font-semibold"
                >
                  Save Product
                </button>
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD CATEGORY MODAL */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Add New Category</h3>
              <button onClick={() => setIsCatModalOpen(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="e.g. Sports & Fitness"
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Description</label>
                <input
                  type="text"
                  required
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  placeholder="e.g. Equipment, apparel and sporting gear"
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Image Path</label>
                <input
                  type="text"
                  value={catImage}
                  onChange={(e) => setCatImage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-mono text-[11px]"
                />
              </div>
              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl font-semibold"
                >
                  Create Category
                </button>
                <button
                  type="button"
                  onClick={() => setIsCatModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD USER MODAL */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Add New User</h3>
              <button onClick={() => setIsUserModalOpen(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="e.g. Rajesh Kumar"
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="e.g. rajesh@gmail.com"
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  placeholder="+91 98000 00000"
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">User Role</label>
                <select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value as 'admin' | 'customer')}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Store Admin</option>
                </select>
              </div>
              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl font-semibold"
                >
                  Create User
                </button>
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE COUPON MODAL */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Create New Coupon</h3>
              <button onClick={() => setIsCouponModalOpen(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  value={coupCode}
                  onChange={(e) => setCoupCode(e.target.value)}
                  placeholder="e.g. SUMMER15"
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl uppercase font-mono"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={coupTitle}
                  onChange={(e) => setCoupTitle(e.target.value)}
                  placeholder="e.g. Summer Special 15% Off"
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Type</label>
                  <select
                    value={coupType}
                    onChange={(e) => setCoupType(e.target.value as typeof coupType)}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Flat Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    value={coupValue}
                    onChange={(e) => setCoupValue(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Min Order Value (₹)</label>
                  <input
                    type="number"
                    required
                    value={coupMinOrder}
                    onChange={(e) => setCoupMinOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Max Discount (₹)</label>
                  <input
                    type="number"
                    value={coupMaxDisc}
                    onChange={(e) => setCoupMaxDisc(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                  />
                </div>
              </div>
              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl font-semibold"
                >
                  Create Coupon
                </button>
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE BANNER MODAL */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Add Promotional Banner</h3>
              <button onClick={() => setIsBannerModalOpen(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBanner} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Banner Headline</label>
                <input
                  type="text"
                  required
                  value={bannerTitle}
                  onChange={(e) => setBannerTitle(e.target.value)}
                  placeholder="e.g. Diwali Super Savings"
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Subtitle / Description</label>
                <input
                  type="text"
                  required
                  value={bannerSubtitle}
                  onChange={(e) => setBannerSubtitle(e.target.value)}
                  placeholder="e.g. Up to 50% Off on all silk and fashion collections."
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Promo Tag Pill</label>
                <input
                  type="text"
                  required
                  value={bannerTag}
                  onChange={(e) => setBannerTag(e.target.value)}
                  placeholder="e.g. Limited Festive Edition"
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Image Asset Path</label>
                <input
                  type="text"
                  required
                  value={bannerImage}
                  onChange={(e) => setBannerImage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-mono text-[11px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Target Category</label>
                  <select
                    value={bannerCategory}
                    onChange={(e) => setBannerCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                  >
                    <option value="all">All Store Products</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Button Text</label>
                  <input
                    type="text"
                    required
                    value={bannerCta}
                    onChange={(e) => setBannerCta(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                  />
                </div>
              </div>
              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl font-semibold"
                >
                  Create Banner
                </button>
                <button
                  type="button"
                  onClick={() => setIsBannerModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
