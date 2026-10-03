import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Phone,
  Mail,
  MapPin,
  Send,
  HelpCircle,
  ChevronDown,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';

export const AboutView: React.FC = () => {
  const { setActivePage } = useStore();

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-6">
      <div className="text-center space-y-3">
        <span className="text-amber-700 text-xs font-bold uppercase tracking-widest">
          About Badawat Shopping
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 font-heading">
          Shop Smart. Shop Easy.
        </h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
          Founded with a single mission: to provide Indian shoppers with direct access to genuine, high-caliber consumer goods, uncompromising quality assurance, and lightning-fast logistics.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs space-y-6 text-sm text-slate-700 leading-relaxed">
        <h2 className="text-xl font-bold text-slate-950 font-heading">
          Our Heritage & Modern Vision
        </h2>
        <p>
          Badawat Shopping started as an artisanal curator of fine textiles and lifestyle essentials in Rajasthan and has grown into a premier Pan-India multi-category digital marketplace. We bridge the gap between world-class engineering (wireless acoustics, smart horology, modern kitchen appliances) and timeless Indian craftsmanship (Banarasi handloom, pure leather goods, Jadau jewelry).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <ShieldCheck className="w-6 h-6 text-amber-600" />
            <h3 className="font-bold text-slate-900">Direct From Source</h3>
            <p className="text-xs text-slate-500">
              Zero middlemen. We audit factories and artisan guilds directly to guarantee authentic authenticity.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <Truck className="w-6 h-6 text-amber-600" />
            <h3 className="font-bold text-slate-900">Dedicated Air Logistics</h3>
            <p className="text-xs text-slate-500">
              Orders are packaged in moisture-sealed containers and dispatched within 12 hours from our central hubs.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <RotateCcw className="w-6 h-6 text-amber-600" />
            <h3 className="font-bold text-slate-900">Respect For Customers</h3>
            <p className="text-xs text-slate-500">
              No robotic hold queues. Our human support team is ready on WhatsApp and phone 7 days a week.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Headquartered at Sector 18, Udyog Vihar, Gurugram, India.
          </span>
          <button
            onClick={() => setActivePage('shop')}
            className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold"
          >
            Explore Our Catalog
          </button>
        </div>
      </div>
    </div>
  );
};

export const ContactView: React.FC = () => {
  const { settings, addToast } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
    addToast('Thank you! Your message has been sent to our customer care team.', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-950 font-heading">Contact Badawat Support</h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Have a question about an order, delivery timeline, or bulk business inquiry? We are here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Contact Info (5 cols) */}
        <div className="md:col-span-5 bg-slate-950 text-white rounded-3xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-lg font-bold font-heading">Get in Touch Directly</h2>
            <p className="text-xs text-slate-400 mt-1">Our support specialists reply promptly.</p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-200 block">Customer Helpline</span>
                <p className="text-slate-400">{settings.contactPhone}</p>
                <span className="text-[10px] text-slate-500">Mon - Sun: 9:00 AM - 9:00 PM IST</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-200 block">Email Support</span>
                <p className="text-slate-400">{settings.contactEmail}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-200 block">Fulfillment Center</span>
                <p className="text-slate-400">{settings.warehouseLocation}</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-2 font-semibold">Instant Chat:</span>
            <a
              href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>

        {/* Form (7 cols) */}
        <div className="md:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
          {isSent ? (
            <div className="text-center py-12 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900">Message Received!</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                A customer support representative will get back to you within 2 business hours.
              </p>
              <button
                onClick={() => setIsSent(false)}
                className="mt-2 text-xs font-bold text-amber-700 hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <h3 className="font-bold text-sm text-slate-900">Send an Inquiry</h3>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ashish Badawat"
                  className="w-full px-3 py-2.5 bg-slate-50 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3 py-2.5 bg-slate-50 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98290 12345"
                    className="w-full px-3 py-2.5 bg-slate-50 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Message / Inquiry Details</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us how we can help you..."
                  className="w-full px-3 py-2.5 bg-slate-50 border rounded-xl resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export const FAQView: React.FC = () => {
  const faqs = [
    {
      q: 'How long does delivery take across India?',
      a: 'Orders to metropolitan cities (Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata, Jaipur, Pune) are delivered within 24 to 48 hours. Other cities and pincodes take 2 to 4 business days. You receive real-time SMS and email tracking upon dispatch.',
    },
    {
      q: 'Is Cash on Delivery (COD) supported?',
      a: 'Yes, Cash on Delivery is supported for all major Indian PIN codes on orders up to ₹25,000. You can also pay the delivery executive via UPI QR code on doorstep arrival.',
    },
    {
      q: 'What is the return and replacement policy?',
      a: 'Badawat Shopping offers a 7-day hassle-free doorstep return policy for all fashion, lifestyle, and eligible electronics. If an item arrives damaged, defective, or does not fit, simply click "Return / Replace" in your account dashboard to schedule a free reverse pickup.',
    },
    {
      q: 'Are the products 100% genuine and original?',
      a: 'Absolutely. Every product sold on Badawat Shopping is sourced directly from verified authorized manufacturers or heritage artisan guilds. All branded items include standard manufacturer warranties and official GST invoices.',
    },
    {
      q: 'How do I track my placed order?',
      a: 'You can track your order live anytime by clicking "Track Orders" in the top navigation or visiting your User Dashboard. Each shipment displays live milestone updates from "Order Confirmed" to "Delivered".',
    },
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-950 font-heading">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Find fast answers to common questions about orders, shipping, and returns.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs divide-y divide-slate-100">
        {faqs.map((faq, idx) => (
          <div key={idx} className="py-4 first:pt-0 last:pb-0">
            <button
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              className="w-full flex items-center justify-between text-left font-bold text-sm text-slate-900 hover:text-amber-800 transition-colors py-1"
            >
              <span>{faq.q}</span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                  openIdx === idx ? 'rotate-180 text-amber-600' : ''
                }`}
              />
            </button>
            {openIdx === idx && (
              <p className="text-xs text-slate-600 leading-relaxed mt-2 animate-in fade-in duration-200">
                {faq.a}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export const PolicyView: React.FC<{
  type: 'terms' | 'privacy' | 'refund' | 'shipping';
}> = ({ type }) => {
  const titles = {
    terms: 'Terms & Conditions',
    privacy: 'Privacy Policy',
    refund: 'Refund & Cancellation Policy',
    shipping: 'Shipping & Delivery Policy',
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs space-y-6 text-xs text-slate-700 leading-relaxed py-8">
      <h1 className="text-2xl font-bold text-slate-950 font-heading">{titles[type]}</h1>
      <span className="text-[11px] text-slate-400 block -mt-4">Last Updated: October 2026 · Badawat Shopping</span>

      {type === 'shipping' && (
        <div className="space-y-4">
          <p>
            Badawat Shopping is committed to delivering your orders accurately, in good condition, and always on time. We partner with premier logistics carriers including BlueDart, Delhivery, and India Post Air Logistics.
          </p>
          <h3 className="font-bold text-slate-900 text-sm">Shipping Charges</h3>
          <p>
            Orders valued at ₹499 or higher qualify for <strong>FREE Pan-India Delivery</strong>. Orders below this threshold incur a nominal handling and delivery fee of ₹49.
          </p>
          <h3 className="font-bold text-slate-900 text-sm">Delivery Timelines</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Metro Cities (Delhi NCR, Mumbai, Jaipur, Bengaluru): 24 to 48 Hours.</li>
            <li>Tier 2 and Tier 3 Cities: 2 to 4 Business Days.</li>
            <li>Special Economic Zones & Remote Pincodes: 4 to 6 Business Days.</li>
          </ul>
        </div>
      )}

      {type === 'refund' && (
        <div className="space-y-4">
          <p>
            We want you to be completely delighted with your purchase. If for any reason you are not satisfied, you may initiate a return or replacement within 7 calendar days of delivery.
          </p>
          <h3 className="font-bold text-slate-900 text-sm">Reverse Pickup Process</h3>
          <p>
            Upon submitting a return request via your User Dashboard, our courier partner will arrive at your registered address within 24-48 hours to collect the item in its original packaging with product tags intact.
          </p>
          <h3 className="font-bold text-slate-900 text-sm">Refund Crediting</h3>
          <p>
            For prepaid orders (UPI / Card / Net Banking), refunds are credited back to the original source within 3-5 business days. For Cash on Delivery orders, funds are credited instantly to your designated bank account or UPI ID.
          </p>
        </div>
      )}

      {type === 'privacy' && (
        <div className="space-y-4">
          <p>
            Badawat Shopping values your privacy and ensures your confidential information is never rented, traded, or sold to third parties.
          </p>
          <h3 className="font-bold text-slate-900 text-sm">Information Collected</h3>
          <p>
            We only collect information necessary to fulfill your orders, including your name, contact phone number, delivery address, and encrypted payment tokens processed via certified RBI-compliant payment gateways.
          </p>
          <h3 className="font-bold text-slate-900 text-sm">Data Security</h3>
          <p>
            All network communication is strictly encrypted via TLS 1.3 with 256-bit AES encryption keys.
          </p>
        </div>
      )}

      {type === 'terms' && (
        <div className="space-y-4">
          <p>
            By accessing and shopping on Badawat Shopping, you agree to comply with and be bound by the Indian Information Technology Act 2000 and consumer protection guidelines.
          </p>
          <h3 className="font-bold text-slate-900 text-sm">Product Pricing & Availability</h3>
          <p>
            All listed prices are inclusive of GST. Badawat reserves the right to adjust promotions, coupons, and discounts in accordance with active commercial campaigns.
          </p>
        </div>
      )}
    </div>
  );
};
