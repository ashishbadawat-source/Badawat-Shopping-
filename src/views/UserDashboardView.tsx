import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Address, Order } from '../types';
import {
  User as UserIcon,
  Package,
  Truck,
  Heart,
  MapPin,
  Tag,
  Bell,
  Lock,
  LogOut,
  ChevronRight,
  Plus,
  Trash2,
  FileText,
  CheckCircle2,
  Clock,
  Shield,
  X,
  ShoppingBag,
} from 'lucide-react';

export const UserDashboardView: React.FC = () => {
  const {
    currentUser,
    orders,
    wishlist,
    products,
    addresses,
    addAddress,
    deleteAddress,
    setDefaultAddress,
    coupons,
    notifications,
    markNotificationAsRead,
    selectedOrderId,
    setSelectedOrderId,
    setActivePage,
    setSelectedProductId,
    addToCart,
    toggleWishlist,
    cancelOrder,
    logout,
    addToast,
    isAdmin,
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    'orders' | 'tracking' | 'wishlist' | 'addresses' | 'coupons' | 'notifications' | 'profile'
  >(selectedOrderId ? 'tracking' : 'orders');

  // Tracking order state
  const trackingOrder =
    orders.find((o) => o.id === selectedOrderId) || orders[0];

  // Address modal
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [addrName, setAddrName] = useState(currentUser?.name || '');
  const [addrPhone, setAddrPhone] = useState(currentUser?.phone || '');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrState, setAddrState] = useState('');
  const [addrPincode, setAddrPincode] = useState('');
  const [addrType, setAddrType] = useState<'home' | 'work' | 'other'>('home');

  // Password change state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrName || !addrPhone || !addrStreet || !addrCity || !addrState || !addrPincode) {
      addToast('Please fill all fields', 'error');
      return;
    }
    addAddress({
      name: addrName,
      phone: addrPhone,
      street: addrStreet,
      city: addrCity,
      state: addrState,
      pincode: addrPincode,
      isDefault: addresses.length === 0,
      type: addrType,
    });
    setIsAddAddressOpen(false);
    setAddrStreet('');
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass.length < 6) {
      addToast('Password must be at least 6 characters', 'error');
      return;
    }
    addToast('Password updated securely!', 'success');
    setCurrentPass('');
    setNewPass('');
  };

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="space-y-6">
      
      {/* Account Overview Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 text-amber-400 font-extrabold text-xl flex items-center justify-center shrink-0 shadow-md">
            {currentUser ? currentUser.name.slice(0, 1).toUpperCase() : 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-950 font-heading">
                {currentUser?.name || 'Customer Account'}
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                Verified Indian Member
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentUser?.email} · {currentUser?.phone}
            </p>
          </div>
        </div>

        {isAdmin && (
          <button
            onClick={() => setActivePage('admin-dashboard')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors self-start md:self-auto"
          >
            <Shield className="w-4 h-4" />
            Switch to Admin Panel
          </button>
        )}
      </div>

      {/* Main Dashboard Navigation + Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sidebar Nav (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs space-y-1 h-fit">
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors ${
              activeTab === 'orders' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>My Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('tracking')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors ${
              activeTab === 'tracking' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Order Tracking</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors ${
              activeTab === 'wishlist' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>My Wishlist ({wishlist.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors ${
              activeTab === 'addresses' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Addresses ({addresses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors ${
              activeTab === 'coupons' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Offers & Coupons</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors ${
              activeTab === 'notifications' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notifications ({notifications.filter((n) => !n.read).length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors ${
              activeTab === 'profile' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>Account Security</span>
          </button>

          <div className="pt-2 border-t border-slate-100 mt-2">
            <button
              onClick={logout}
              className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Tab Content Area (9 cols) */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* TAB 1: MY ORDERS */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-slate-950 font-heading">
                All Orders ({orders.length})
              </h2>

              {orders.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  You haven't placed any orders yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/60 text-xs">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-slate-900 text-sm">
                            #{ord.orderNumber}
                          </span>
                          <span className="text-slate-400">·</span>
                          <span className="text-slate-500">{new Date(ord.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                              ord.orderStatus === 'delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ord.orderStatus === 'cancelled'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-900'
                            }`}
                          >
                            {ord.orderStatus.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-2">
                        {ord.items.map((item, i) => (
                          <div key={i} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                              />
                              <div>
                                <span className="font-bold text-slate-900 line-clamp-1">{item.name}</span>
                                <span className="text-[11px] text-slate-500">
                                  Qty: {item.quantity} · ₹{item.price.toLocaleString('en-IN')} each
                                </span>
                              </div>
                            </div>
                            <span className="font-bold text-slate-900 tabular-nums">
                              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-3 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div>
                          <span className="text-slate-500">Total: </span>
                          <span className="font-bold text-slate-950 text-sm tabular-nums">
                            ₹{ord.grandTotal.toLocaleString('en-IN')}
                          </span>
                          <span className="text-slate-400 text-[11px] ml-1">({ord.paymentMethod.toUpperCase()})</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedOrderId(ord.id);
                              setActiveTab('tracking');
                            }}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-colors"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            Track Shipment
                          </button>
                          <button
                            onClick={() => {
                              setSelectedOrderId(ord.id);
                              setActivePage('invoice');
                            }}
                            className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5 text-amber-600" />
                            Tax Invoice
                          </button>
                          {ord.orderStatus !== 'delivered' && ord.orderStatus !== 'cancelled' && (
                            <button
                              onClick={() => cancelOrder(ord.id)}
                              className="px-2.5 py-1.5 text-rose-600 hover:bg-rose-50 rounded-lg font-semibold text-xs"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ORDER TRACKING */}
          {activeTab === 'tracking' && trackingOrder && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs text-amber-700 font-bold uppercase tracking-wider">
                    Live Courier Tracking
                  </span>
                  <h2 className="text-xl font-bold text-slate-950 font-heading">
                    Order #{trackingOrder.orderNumber}
                  </h2>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Estimated Arrival</span>
                  <span className="text-xs font-bold text-emerald-800">
                    {trackingOrder.estimatedDeliveryDate}
                  </span>
                </div>
              </div>

              {/* Visual Timeline Stepper */}
              <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-200 space-y-8 my-4 ml-3">
                {trackingOrder.trackingTimeline.map((step, idx) => (
                  <div key={idx} className="relative">
                    {/* Step Icon */}
                    <div
                      className={`absolute -left-[31px] sm:-left-[39px] top-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-xs ${
                        step.completed
                          ? 'bg-emerald-600 text-white ring-4 ring-emerald-50'
                          : step.current
                          ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-50 animate-pulse'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {step.completed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-3">
                        <h4 className="font-bold text-sm text-slate-900">{step.title}</h4>
                        {step.current && (
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                            Current Stage
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">{step.description}</p>
                      <span className="text-[11px] text-slate-400 font-mono block pt-1">
                        {step.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Destination Address Card */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-600 flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <span className="font-bold text-slate-900 block mb-1">Delivering To:</span>
                  <p>{trackingOrder.shippingAddress.name} ({trackingOrder.shippingAddress.phone})</p>
                  <p>{trackingOrder.shippingAddress.street}, {trackingOrder.shippingAddress.city}, {trackingOrder.shippingAddress.state} - {trackingOrder.shippingAddress.pincode}</p>
                </div>
                <div className="sm:text-right">
                  <span className="font-bold text-slate-900 block mb-1">Carrier Details:</span>
                  <p>BlueDart Express Air Logistics</p>
                  <p className="font-mono text-slate-500">AWB #889210941IND</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-slate-950 font-heading">
                My Wishlist ({wishlistProducts.length} Items)
              </h2>

              {wishlistProducts.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  Your wishlist is currently empty. Save items you love!
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {wishlistProducts.map((p) => (
                    <div
                      key={p.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3"
                    >
                      <div className="aspect-square rounded-xl bg-white overflow-hidden border border-slate-200">
                        <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{p.name}</h4>
                        <span className="text-sm font-bold text-slate-950 tabular-nums">
                          ₹{p.discountPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => addToCart(p, 1)}
                          className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          Add to Cart
                        </button>
                        <button
                          onClick={() => toggleWishlist(p.id)}
                          className="p-2 text-rose-600 bg-white border border-slate-200 rounded-xl hover:bg-rose-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SAVED ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="text-base font-bold text-slate-950 font-heading">
                  Saved Delivery Addresses ({addresses.length})
                </h2>
                <button
                  onClick={() => setIsAddAddressOpen(true)}
                  className="px-3.5 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Address
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2 relative"
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-slate-900">{addr.name}</span>
                      <span className="uppercase text-[10px] bg-slate-200 px-2 py-0.5 rounded text-slate-700">
                        {addr.type}
                      </span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      {addr.street}, {addr.landmark ? `${addr.landmark}, ` : ''}{addr.city}, {addr.state} - {addr.pincode}
                    </p>
                    <p className="text-slate-500 font-mono text-[11px]">Phone: {addr.phone}</p>

                    <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                      {addr.isDefault ? (
                        <span className="text-emerald-700 font-semibold text-[11px]">
                          ✓ Default Address
                        </span>
                      ) : (
                        <button
                          onClick={() => setDefaultAddress(addr.id)}
                          className="text-amber-700 hover:underline font-medium text-[11px]"
                        >
                          Set as Default
                        </button>
                      )}

                      {addresses.length > 1 && (
                        <button
                          onClick={() => deleteAddress(addr.id)}
                          className="text-rose-600 hover:underline text-[11px]"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Address Modal */}
              {isAddAddressOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
                  <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <h3 className="font-bold text-sm text-slate-900">Add New Address</h3>
                      <button onClick={() => setIsAddAddressOpen(false)} className="text-slate-400">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleCreateAddress} className="space-y-3 text-xs">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Name</label>
                        <input
                          type="text"
                          required
                          value={addrName}
                          onChange={(e) => setAddrName(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Phone</label>
                        <input
                          type="text"
                          required
                          value={addrPhone}
                          onChange={(e) => setAddrPhone(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Street Address</label>
                        <input
                          type="text"
                          required
                          value={addrStreet}
                          onChange={(e) => setAddrStreet(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="font-semibold text-slate-700 block mb-1">City</label>
                          <input
                            type="text"
                            required
                            value={addrCity}
                            onChange={(e) => setAddrCity(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-slate-700 block mb-1">PIN Code</label>
                          <input
                            type="text"
                            required
                            maxLength={6}
                            value={addrPincode}
                            onChange={(e) => setAddrPincode(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">State</label>
                        <input
                          type="text"
                          required
                          value={addrState}
                          onChange={(e) => setAddrState(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                        />
                      </div>

                      <div className="pt-2 flex gap-2">
                        <button
                          type="submit"
                          className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl font-semibold"
                        >
                          Save Address
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsAddAddressOpen(false)}
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
          )}

          {/* TAB 5: COUPONS */}
          {activeTab === 'coupons' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-slate-950 font-heading">
                My Coupons & Special Vouchers
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {coupons.map((c) => (
                  <div
                    key={c.id}
                    className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200/80 space-y-2 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-base font-extrabold text-slate-900">
                        {c.code}
                      </span>
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                        Active
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-800">{c.title}</p>
                    <p className="text-[11px] text-slate-500">
                      Min order value ₹{c.minOrderValue} · Expires on {c.expiryDate}
                    </p>
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(c.code);
                          addToast(`Copied ${c.code} to clipboard!`, 'success');
                        }}
                        className="text-xs font-semibold text-amber-800 hover:underline"
                      >
                        Copy Promo Code
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-slate-950 font-heading">
                All Notifications
              </h2>

              <div className="space-y-3">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationAsRead(n.id)}
                    className={`p-4 rounded-2xl text-xs space-y-1 transition-colors cursor-pointer border ${
                      n.read ? 'bg-slate-50 border-slate-200' : 'bg-amber-50/80 border-amber-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">{n.title}</span>
                      <span className="text-[10px] text-slate-400">{n.createdAt}</span>
                    </div>
                    <p className="text-slate-600">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: PROFILE & SECURITY */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
              <h2 className="text-base font-bold text-slate-950 font-heading pb-3 border-b border-slate-100">
                Account Details & Password
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block mb-1">Full Name</span>
                  <p className="font-semibold text-slate-900 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    {currentUser?.name}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500 block mb-1">Registered Email</span>
                  <p className="font-semibold text-slate-900 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    {currentUser?.email}
                  </p>
                </div>
              </div>

              {/* Password change form */}
              <form onSubmit={handlePasswordChange} className="pt-4 border-t border-slate-100 space-y-4 max-w-md">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Update Account Password
                </h3>
                <div>
                  <label className="text-xs text-slate-600 block mb-1">Current Password</label>
                  <input
                    type="password"
                    required
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs px-3 py-2 bg-slate-50 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 block mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs px-3 py-2 bg-slate-50 border rounded-xl"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold"
                >
                  Update Password
                </button>
              </form>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
