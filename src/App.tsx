import React, { useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { ToastContainer } from './components/ToastContainer';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';

import { HomeView } from './views/HomeView';
import { ShopView } from './views/ShopView';
import { ProductDetailView } from './views/ProductDetailView';
import { CartView } from './views/CartView';
import { CheckoutView } from './views/CheckoutView';
import { OrderSuccessView } from './views/OrderSuccessView';
import { UserDashboardView } from './views/UserDashboardView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { InvoiceView } from './views/InvoiceView';
import { AboutView, ContactView, FAQView, PolicyView } from './views/StaticPages';

const MainContent: React.FC = () => {
  const { activePage } = useStore();

  // Scroll to top on page switch
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage]);

  const renderActiveView = () => {
    switch (activePage) {
      case 'home':
        return <HomeView />;
      case 'shop':
        return <ShopView />;
      case 'product-detail':
        return <ProductDetailView />;
      case 'cart':
        return <CartView />;
      case 'checkout':
        return <CheckoutView />;
      case 'order-success':
        return <OrderSuccessView />;
      case 'user-dashboard':
      case 'order-tracking':
      case 'wishlist':
        return <UserDashboardView />;
      case 'admin-dashboard':
        return <AdminDashboardView />;
      case 'invoice':
        return <InvoiceView />;
      case 'about':
        return <AboutView />;
      case 'contact':
        return <ContactView />;
      case 'faq':
        return <FAQView />;
      case 'privacy-policy':
        return <PolicyView type="privacy" />;
      case 'terms-conditions':
        return <PolicyView type="terms" />;
      case 'refund-policy':
        return <PolicyView type="refund" />;
      case 'shipping-policy':
        return <PolicyView type="shipping" />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Page Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {renderActiveView()}
      </main>

      {/* Floating Elements */}
      <WhatsAppFloatingButton />
      <ToastContainer />
      <MobileBottomNav />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainContent />
    </StoreProvider>
  );
}
