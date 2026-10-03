import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { MessageCircle, X, Send, PhoneCall, ShieldCheck } from 'lucide-react';

export const WhatsAppFloatingButton: React.FC = () => {
  const { settings, addToast } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [inquiryText, setInquiryText] = useState('');

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const query = inquiryText.trim() || 'Hello Badawat Shopping! I would like help with an order or product.';
    const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(query)}`;
    
    // Attempt window navigation safely
    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch {
      // fallback
      window.location.href = url;
    }
    
    addToast('Opening WhatsApp support chat...', 'info');
    setIsOpen(false);
    setInquiryText('');
  };

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-4 z-40">
      {isOpen && (
        <div className="mb-3 w-80 sm:w-88 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="bg-emerald-600 px-4 py-3.5 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-white text-sm">
                BS
              </div>
              <div>
                <h4 className="text-sm font-semibold leading-tight">Badawat Support</h4>
                <p className="text-xs text-emerald-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                  Typically replies in 5 minutes
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-lg"
              aria-label="Close WhatsApp chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 bg-slate-50 space-y-3">
            <div className="bg-white p-3 rounded-xl rounded-tl-none border border-slate-100 shadow-xs text-xs text-slate-700 space-y-1">
              <p className="font-medium text-slate-900">Namaste! 🙏 Welcome to Badawat Shopping.</p>
              <p>How can our customer care team assist you today? Track an order, check offers, or product queries!</p>
            </div>

            <form onSubmit={handleSendWhatsApp} className="space-y-2.5 pt-1">
              <textarea
                value={inquiryText}
                onChange={(e) => setInquiryText(e.target.value)}
                placeholder="Type your message here..."
                rows={2}
                className="w-full text-xs px-3 py-2 bg-white rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
              />
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                Chat on WhatsApp (+91 98290 12345)
              </button>
            </form>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Official Verified Business
              </span>
              <span className="flex items-center gap-1">
                <PhoneCall className="w-3 h-3 text-slate-400" />
                9 AM - 9 PM IST
              </span>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
        aria-label="WhatsApp Support"
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="text-xs font-bold tracking-wide uppercase hidden sm:inline-block">
          WhatsApp Support
        </span>
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 border-2 border-white rounded-full animate-ping" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-500 border-2 border-white rounded-full" />
      </button>
    </div>
  );
};
