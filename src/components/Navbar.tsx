import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Search,
  Heart,
  ShoppingBag,
  User as UserIcon,
  Shield,
  Bell,
  Menu,
  X,
  Package,
  MapPin,
  Sparkles,
  PhoneCall,
  CheckCircle,
} from 'lucide-react';
import { AuthModal } from './AuthModal';

export const Navbar: React.FC = () => {
  const {
    activePage,
    setActivePage,
    cartCount,
    wishlist,
    currentUser,
    logout,
    toggleRole,
    isAdmin,
    searchQuery,
    setSearchQuery,
    setSelectedCategoryFilter,
    settings,
    notifications,
    unreadNotificationsCount,
    markAllNotificationsAsRead,
    setSelectedOrderId,
  } = useStore();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isNotifMenuOpen, setIsNotifMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [dismissAnnouncement, setDismissAnnouncement] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActivePage('shop');
      setIsSearchOpen(false);
      setIsMobileNavOpen(false);
    }
  };

  const navigateTo = (page: typeof activePage, categoryFilter?: string) => {
    if (categoryFilter) {
      setSelectedCategoryFilter(categoryFilter);
    }
    setActivePage(page);
    setIsMobileNavOpen(false);
    setIsAccountMenuOpen(false);
    setIsNotifMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        {/* Slim Top Announcement Bar */}
        {!dismissAnnouncement && (
          <div className="bg-slate-950 text-white text-[11px] sm:text-xs py-1.5 px-4 font-medium flex items-center justify-between">
            <div className="mx-auto flex items-center gap-2 truncate">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>{settings.announcementText}</span>
              <button
                onClick={() => {
                  setSelectedCategoryFilter('all');
                  setActivePage('shop');
                }}
                className="text-amber-300 underline font-semibold hover:text-amber-200 ml-1 hidden sm:inline"
              >
                Shop Now
              </button>
            </div>
            <button
              onClick={() => setDismissAnnouncement(true)}
              className="text-slate-400 hover:text-white ml-2 text-xs"
              aria-label="Dismiss announcement"
            >
              ×
            </button>
          </div>
        )}

        {/* Main One-Row Top Bar Contract */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between gap-4">
            
            {/* Zone 1: Single Element Brand Wordmark */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                className="md:hidden p-1.5 -ml-1 text-slate-700 hover:text-slate-900 rounded-lg"
                aria-label="Toggle mobile menu"
              >
                {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <button
                onClick={() => navigateTo('home')}
                className="text-left group flex flex-col justify-center"
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold tracking-tight text-slate-950 text-lg sm:text-xl font-heading">
                    BADAWAT
                  </span>
                  <span className="text-amber-600 font-extrabold text-lg sm:text-xl font-heading">
                    SHOPPING
                  </span>
                </div>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-slate-500 -mt-1 hidden sm:block">
                  Shop Smart · Shop Easy
                </span>
              </button>
            </div>

            {/* Zone 2: Navigation Links & Integrated Search */}
            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-700">
              <button
                onClick={() => {
                  setSelectedCategoryFilter('all');
                  navigateTo('shop');
                }}
                className={`hover:text-slate-950 transition-colors ${
                  activePage === 'shop' ? 'text-slate-950 font-semibold' : ''
                }`}
              >
                All Products
              </button>
              <button
                onClick={() => navigateTo('shop', 'cat-electronics')}
                className="hover:text-slate-950 transition-colors"
              >
                Electronics
              </button>
              <button
                onClick={() => navigateTo('shop', 'cat-mens-fashion')}
                className="hover:text-slate-950 transition-colors"
              >
                Fashion
              </button>
              <button
                onClick={() => navigateTo('shop', 'cat-watches')}
                className="hover:text-slate-950 transition-colors"
              >
                Watches
              </button>
              <button
                onClick={() => navigateTo('shop', 'cat-home-kitchen')}
                className="hover:text-slate-950 transition-colors"
              >
                Home & Kitchen
              </button>
              <button
                onClick={() => navigateTo('user-dashboard')}
                className="hover:text-slate-950 transition-colors text-slate-600"
              >
                Track Orders
              </button>
            </nav>

            {/* Zone 3: Search Bar + Actions */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Desktop Search Input */}
              <form
                onSubmit={handleSearchSubmit}
                className="relative hidden md:block w-48 xl:w-64"
              >
                <input
                  type="text"
                  placeholder="Search 1,000+ products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200/70 focus:bg-white text-slate-900 rounded-full border border-transparent focus:border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-all"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </form>

              {/* Mobile Search Toggle */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="md:hidden p-2 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-full"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Admin / Customer Quick Role Badge */}
              <button
                onClick={toggleRole}
                title="Switch between Customer view and Admin view"
                className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all border ${
                  isAdmin
                    ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                <Shield className="w-3 h-3 text-amber-600" />
                <span>{isAdmin ? 'Admin Mode' : 'Customer Mode'}</span>
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => navigateTo('wishlist')}
                className="relative p-2 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-full transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute 1 top-0 right-0 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setIsNotifMenuOpen(!isNotifMenuOpen)}
                  className="relative p-2 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-full transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-amber-500 text-slate-950 text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </button>

                {isNotifMenuOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                      <span className="text-xs font-bold text-slate-900">Notifications</span>
                      {unreadNotificationsCount > 0 && (
                        <button
                          onClick={markAllNotificationsAsRead}
                          className="text-[11px] text-amber-700 hover:underline font-medium"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-slate-400 py-3 text-center">No notifications</p>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => {
                              if (n.actionLink) {
                                setSelectedOrderId(n.actionLink);
                                navigateTo('order-tracking');
                              }
                            }}
                            className={`p-2.5 rounded-xl text-xs cursor-pointer transition-colors ${
                              n.read ? 'bg-slate-50 text-slate-600' : 'bg-amber-50/70 text-slate-900 font-medium'
                            }`}
                          >
                            <p className="font-semibold text-slate-900 leading-tight">{n.title}</p>
                            <p className="text-[11px] text-slate-600 mt-0.5">{n.message}</p>
                            <span className="text-[10px] text-slate-400 mt-1 block">{n.createdAt}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Shopping Cart Button */}
              <button
                onClick={() => navigateTo('cart')}
                className="relative flex items-center gap-1.5 p-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-all shadow-xs"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="text-xs font-bold tabular-nums pr-0.5">{cartCount}</span>
              </button>

              {/* User Account Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                  className="flex items-center gap-1.5 p-1.5 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-xl transition-colors"
                  aria-label="Account menu"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-xs text-slate-800">
                    {currentUser ? currentUser.name.slice(0, 1).toUpperCase() : <UserIcon className="w-4 h-4" />}
                  </div>
                </button>

                {isAccountMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in duration-150">
                    {currentUser ? (
                      <>
                        <div className="px-4 py-2 border-b border-slate-100">
                          <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                          <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                          <span className="inline-block mt-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                            {currentUser.role === 'admin' ? 'Store Administrator' : 'Verified Member'}
                          </span>
                        </div>
                        <div className="py-1 text-xs text-slate-700 font-medium">
                          {isAdmin ? (
                            <button
                              onClick={() => navigateTo('admin-dashboard')}
                              className="w-full text-left px-4 py-2 hover:bg-amber-50 text-amber-900 font-semibold flex items-center gap-2"
                            >
                              <Shield className="w-4 h-4 text-amber-600" />
                              Admin Dashboard
                            </button>
                          ) : null}
                          <button
                            onClick={() => navigateTo('user-dashboard')}
                            className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <Package className="w-4 h-4 text-slate-400" />
                            My Orders & Tracking
                          </button>
                          <button
                            onClick={() => navigateTo('wishlist')}
                            className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <Heart className="w-4 h-4 text-slate-400" />
                            My Wishlist
                          </button>
                          <button
                            onClick={() => navigateTo('user-dashboard')}
                            className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <MapPin className="w-4 h-4 text-slate-400" />
                            Saved Addresses
                          </button>
                          <button
                            onClick={toggleRole}
                            className="w-full text-left px-4 py-2 hover:bg-slate-50 text-amber-800 flex items-center gap-2 border-t border-slate-100"
                          >
                            <Sparkles className="w-4 h-4 text-amber-600" />
                            Switch to {isAdmin ? 'Customer View' : 'Admin View'}
                          </button>
                          <button
                            onClick={logout}
                            className="w-full text-left px-4 py-2 hover:bg-rose-50 text-rose-600 flex items-center gap-2 border-t border-slate-100"
                          >
                            Logout
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="p-3 text-center">
                        <p className="text-xs font-medium text-slate-600 mb-2">
                          Sign in to manage orders & fast checkout
                        </p>
                        <button
                          onClick={() => {
                            setIsAccountMenuOpen(false);
                            setIsAuthModalOpen(true);
                          }}
                          className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors"
                        >
                          Sign In / Register
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* Mobile Search Bar Expandable */}
        {isSearchOpen && (
          <div className="md:hidden px-4 py-2 bg-slate-50 border-t border-slate-200">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search products, brands, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full pl-9 pr-4 py-2 text-sm bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </form>
          </div>
        )}

        {/* Mobile Dropdown Nav Drawer */}
        {isMobileNavOpen && (
          <div className="md:hidden bg-white border-t border-slate-200 px-4 py-3 space-y-2 animate-in fade-in duration-150">
            <button
              onClick={() => {
                setSelectedCategoryFilter('all');
                navigateTo('shop');
              }}
              className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-900 rounded-lg hover:bg-slate-50"
            >
              All Categories & Products
            </button>
            <button
              onClick={() => navigateTo('shop', 'cat-electronics')}
              className="w-full text-left px-3 py-2 text-sm text-slate-700 rounded-lg hover:bg-slate-50"
            >
              Electronics & Audio
            </button>
            <button
              onClick={() => navigateTo('shop', 'cat-mens-fashion')}
              className="w-full text-left px-3 py-2 text-sm text-slate-700 rounded-lg hover:bg-slate-50"
            >
              Men's & Women's Fashion
            </button>
            <button
              onClick={() => navigateTo('shop', 'cat-watches')}
              className="w-full text-left px-3 py-2 text-sm text-slate-700 rounded-lg hover:bg-slate-50"
            >
              Watches & Jewellery
            </button>
            <button
              onClick={() => navigateTo('shop', 'cat-home-kitchen')}
              className="w-full text-left px-3 py-2 text-sm text-slate-700 rounded-lg hover:bg-slate-50"
            >
              Home & Kitchen Appliances
            </button>
            <button
              onClick={() => navigateTo('user-dashboard')}
              className="w-full text-left px-3 py-2 text-sm text-slate-700 rounded-lg hover:bg-slate-50"
            >
              Track My Order
            </button>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={toggleRole}
                className="text-xs font-semibold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200"
              >
                Switch to {isAdmin ? 'Customer' : 'Admin'} Mode
              </button>
              {isAdmin && (
                <button
                  onClick={() => navigateTo('admin-dashboard')}
                  className="text-xs font-semibold text-slate-900 bg-slate-100 px-3 py-1.5 rounded-lg"
                >
                  Admin Panel
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};
