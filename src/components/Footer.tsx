import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  Send,
  MessageCircle,
  Heart,
  Award,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActivePage, setSelectedCategoryFilter, settings, addToast } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    addToast('🎉 Subscribed! Use code BADAWAT10 for 10% off your order.', 'success');
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-24 sm:pb-12 border-t border-slate-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Trust Badges Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 mb-12 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="font-bold text-white">Free Pan-India Delivery</p>
              <p className="text-slate-400 text-[11px]">On orders above ₹499</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="font-bold text-white">7-Day Hassle-Free Returns</p>
              <p className="text-slate-400 text-[11px]">Doorstep reverse pickup</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="font-bold text-white">100% Genuine Products</p>
              <p className="text-slate-400 text-[11px]">Direct brand warranties</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="font-bold text-white">UPI & COD Supported</p>
              <p className="text-slate-400 text-[11px]">Encrypted & secure checkout</p>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950/60 rounded-3xl p-6 sm:p-8 border border-slate-800 mb-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
              Exclusive Member Perks
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
              Join Badawat Insider & Get Flat ₹500 OFF
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Receive private sales, early access to new arrivals, and handpicked recommendations right to your inbox.
            </p>
          </div>
          <form onSubmit={handleSubscribe} className="flex w-full md:w-auto max-w-md gap-2">
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email address..."
              required
              className="px-4 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 flex-1 md:w-64"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shrink-0"
            >
              <span>Subscribe</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* 4-Column Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-tight text-white text-xl font-heading">
                BADAWAT
              </span>
              <span className="text-amber-500 font-extrabold text-xl font-heading">
                SHOPPING
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Badawat Shopping is India's premium shopping portal crafted for consumers who value authenticity, speed, and elegance. We curate electronics, ethnic wear, lifestyle luxuries, and daily essentials with verified Pan-India delivery.
            </p>
            <div className="space-y-1.5 text-xs text-slate-400">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Sector 18, Udyog Vihar, Gurugram, Haryana - 122015</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <span>+91 98290 12345 (9:00 AM - 9:00 PM IST)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <span>support@badawatshopping.in</span>
              </p>
              <p className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                <Award className="w-3.5 h-3.5 text-slate-400" />
                <span>GSTIN: {settings.gstNumber}</span>
              </p>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4">Categories</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => {
                    setSelectedCategoryFilter('cat-electronics');
                    setActivePage('shop');
                  }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Electronics & Audio
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategoryFilter('cat-mobiles');
                    setActivePage('shop');
                  }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Mobiles & Tech Accessories
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategoryFilter('cat-mens-fashion');
                    setActivePage('shop');
                  }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Men's Fashion & Silk Kurtas
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategoryFilter('cat-womens-fashion');
                    setActivePage('shop');
                  }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Women's Sarees & Dresses
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategoryFilter('cat-watches');
                    setActivePage('shop');
                  }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Luxury Chronographs & Watches
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategoryFilter('cat-home-kitchen');
                    setActivePage('shop');
                  }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Home & Kitchen Cookware
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategoryFilter('cat-jewellery');
                    setActivePage('shop');
                  }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Artisan Kundan Jewellery
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4">Customer Care</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => setActivePage('user-dashboard')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Track My Shipment
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('contact')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('faq')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('shipping-policy')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Shipping & Delivery Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('refund-policy')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Return & Cancellation Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('about')}
                  className="hover:text-amber-400 transition-colors"
                >
                  About Badawat Shopping
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Policies */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4">Legal & Security</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => setActivePage('terms-conditions')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('privacy-policy')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('refund-policy')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Refund Guidelines
                </button>
              </li>
              <li>
                <span className="text-[11px] text-slate-500 block pt-2">
                  Accepted Payments:
                </span>
                <p className="text-[11px] text-slate-400 mt-1">
                  UPI (GPay / PhonePe / Paytm), Visa, MasterCard, RuPay, Net Banking & Cash on Delivery.
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Badawat Shopping. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Crafted with pride in India</span>
            <span>·</span>
            <button
              onClick={() => setActivePage('privacy-policy')}
              className="hover:text-slate-400"
            >
              Privacy
            </button>
            <span>·</span>
            <button
              onClick={() => setActivePage('terms-conditions')}
              className="hover:text-slate-400"
            >
              Terms
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
