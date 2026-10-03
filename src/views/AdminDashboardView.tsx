import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, Category, Coupon, Order } from '../types';
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
    updateCategory,
    deleteCategory,
    orders,
    updateOrderStatus,
    coupons,
    addCoupon,
    deleteCoupon,
    toggleCouponStatus,
    settings,
    updateSettings,
    setActivePage,
    setSelectedOrderId,
    addToast,
  } = useStore();

  const [currentTab, setCurrentTab] = useState<
    'overview' | 'products' | 'categories' | 'orders' | 'coupons' | 'settings'
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

  // COUPON MODAL STATE
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [coupCode, setCoupCode] = useState('');
  const [coupTitle, setCoupTitle] = useState('');
  const [coupType, setCoupType] = useState<'percentage' | 'fixed'>('percentage');
  const [coupValue, setCoupValue] = useState(15);
  const [coupMinOrder, setCoupMinOrder] = useState(999);
  const [coupMaxDisc, setCoupMaxDisc] = useState(1000);
  const [coupExpiry, setCoupExpiry] = useState('2026-12-31');

  // ORDER FILTER STATE
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // Handle product edit/create
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

  // Handle Category submit
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

  // Handle Coupon submit
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
              Live inventory, order logistics, discounts and store operations.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActivePage('home')}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl transition-colors self-start md:self-auto"
        >
          View Live Storefront
        </button>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-xs">
        <button
          onClick={() => setCurrentTab('overview')}
          className={`px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
            currentTab === 'overview'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Dashboard Overview
        </button>
        <button
          onClick={() => setCurrentTab('orders')}
          className={`px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            currentTab === 'orders'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>Orders</span>
          <span className="bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-full text-[10px] font-mono">
            {orders.length}
          </span>
        </button>
        <button
          onClick={() => setCurrentTab('products')}
          className={`px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
            currentTab === 'products'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Products ({products.length})
        </button>
        <button
          onClick={() => setCurrentTab('categories')}
          className={`px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
            currentTab === 'categories'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Categories ({categories.length})
        </button>
        <button
          onClick={() => setCurrentTab('coupons')}
          className={`px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
            currentTab === 'coupons'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Coupons & Discounts
        </button>
        <button
          onClick={() => setCurrentTab('settings')}
          className={`px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
            currentTab === 'settings'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Store Settings
        </button>
      </div>

      {/* 1. OVERVIEW TAB */}
      {currentTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
              <span className="text-slate-500 text-xs font-semibold">Total Revenue (Paid)</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-slate-950 font-mono tabular-nums">
                  ₹{totalSales.toLocaleString('en-IN')}
                </span>
                <span className="text-emerald-700 text-xs font-bold flex items-center gap-0.5">
                  <TrendingUp className="w-3.5 h-3.5" /> +18.4%
                </span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
              <span className="text-slate-500 text-xs font-semibold">Total Customer Orders</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-slate-950 tabular-nums">
                  {orders.length}
                </span>
                <span className="text-slate-400 text-xs">All Time</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
              <span className="text-slate-500 text-xs font-semibold">Pending Fulfillment</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-amber-700 tabular-nums">
                  {pendingOrders}
                </span>
                <span className="text-amber-800 text-[10px] font-bold bg-amber-50 px-2 py-0.5 rounded">
                  Requires Dispatch
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

          {/* Recent Orders Overview */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-950 font-heading">
                Recent Customer Orders
              </h2>
              <button
                onClick={() => setCurrentTab('orders')}
                className="text-xs font-semibold text-amber-700 hover:underline"
              >
                View All Orders →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-100">
                    <th className="pb-3 font-semibold">Order ID</th>
                    <th className="pb-3 font-semibold">Customer</th>
                    <th className="pb-3 font-semibold">Date</th>
                    <th className="pb-3 font-semibold">Amount</th>
                    <th className="pb-3 font-semibold">Payment</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.slice(0, 5).map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/60">
                      <td className="py-3 font-mono font-bold text-slate-900">{ord.orderNumber}</td>
                      <td className="py-3 text-slate-800">{ord.customerName}</td>
                      <td className="py-3 text-slate-500">{new Date(ord.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 font-bold text-slate-900 tabular-nums">₹{ord.grandTotal.toLocaleString('en-IN')}</td>
                      <td className="py-3 uppercase text-[11px] font-semibold text-slate-600">{ord.paymentMethod} ({ord.paymentStatus})</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-900">
                          {ord.orderStatus}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => {
                            setSelectedOrderId(ord.id);
                            setActivePage('invoice');
                          }}
                          className="text-amber-700 hover:underline font-semibold"
                        >
                          Invoice
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. ORDERS MANAGEMENT TAB */}
      {currentTab === 'orders' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-950 font-heading">
                Orders Management ({filteredOrders.length})
              </h2>
              <p className="text-xs text-slate-500">Update fulfillment status, print tax invoices and track deliveries.</p>
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

                  {/* Status Dropdown */}
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

      {/* 3. PRODUCTS MANAGEMENT TAB */}
      {currentTab === 'products' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-950 font-heading">
                Product Catalog ({products.length})
              </h2>
              <p className="text-xs text-slate-500">Add, edit pricing, update stock, and toggle active status.</p>
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

      {/* 4. CATEGORIES MANAGEMENT TAB */}
      {currentTab === 'categories' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-950 font-heading">
                Store Categories ({categories.length})
              </h2>
              <p className="text-xs text-slate-500">Manage categories visible on homepage and navigation.</p>
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

      {/* 5. COUPONS TAB */}
      {currentTab === 'coupons' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-950 font-heading">
                Discount Coupons & Offers ({coupons.length})
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

      {/* 6. SETTINGS TAB */}
      {currentTab === 'settings' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-slate-950 font-heading pb-3 border-b border-slate-100">
            Store & Delivery Settings
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
            <div className="sm:col-span-2">
              <label className="font-semibold text-slate-700 block mb-1">Top Announcement Bar Text</label>
              <input
                type="text"
                value={settings.announcementText}
                onChange={(e) => updateSettings({ announcementText: e.target.value })}
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

    </div>
  );
};
