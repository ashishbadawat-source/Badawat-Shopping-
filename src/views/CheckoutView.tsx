import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Address } from '../types';
import {
  MapPin,
  CreditCard,
  QrCode,
  Building,
  Banknote,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Plus,
  ArrowRight,
  Truck,
} from 'lucide-react';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    cartDiscount,
    deliveryFee,
    grandTotal,
    appliedCoupon,
    addresses,
    addAddress,
    placeOrder,
    setActivePage,
    currentUser,
    addToast,
  } = useStore();

  // Selected saved address ID or 'new'
  const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
  const [selectedAddressId, setSelectedAddressId] = useState<string>(defaultAddr ? defaultAddr.id : 'new');
  
  // New address form state
  const [newAddrName, setNewAddrName] = useState(currentUser?.name || '');
  const [newAddrPhone, setNewAddrPhone] = useState(currentUser?.phone || '+91 98290 12345');
  const [newAddrStreet, setNewAddrStreet] = useState('');
  const [newAddrLandmark, setNewAddrLandmark] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('Jaipur');
  const [newAddrState, setNewAddrState] = useState('Rajasthan');
  const [newAddrPincode, setNewAddrPincode] = useState('302004');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'cod'>('upi');
  const [upiId, setUpiId] = useState('ashish@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8912');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('•••');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [isProcessing, setIsProcessing] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 max-w-lg mx-auto">
        <h2 className="text-lg font-bold text-slate-900 mb-2">No items to checkout</h2>
        <p className="text-xs text-slate-500 mb-4">Please add products to your cart before proceeding.</p>
        <button
          onClick={() => setActivePage('shop')}
          className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold"
        >
          Explore Shop
        </button>
      </div>
    );
  }

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    let targetAddress: Address;

    if (selectedAddressId === 'new') {
      if (!newAddrName || !newAddrPhone || !newAddrStreet || !newAddrCity || !newAddrState || !newAddrPincode) {
        addToast('Please fill in all address fields', 'error');
        return;
      }
      const created: Address = {
        id: `addr-${Date.now()}`,
        name: newAddrName,
        phone: newAddrPhone,
        street: newAddrStreet,
        landmark: newAddrLandmark,
        city: newAddrCity,
        state: newAddrState,
        pincode: newAddrPincode,
        isDefault: addresses.length === 0,
        type: 'home',
      };
      addAddress(created);
      targetAddress = created;
    } else {
      const found = addresses.find((a) => a.id === selectedAddressId);
      if (!found) {
        addToast('Please select a valid delivery address', 'error');
        return;
      }
      targetAddress = found;
    }

    setIsProcessing(true);
    setTimeout(() => {
      placeOrder(targetAddress, paymentMethod);
      setIsProcessing(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-950 font-heading">
          Secure Checkout
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Step 1: Delivery Address · Step 2: Payment Verification · Step 3: Order Confirmation
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Address & Payment Methods (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Section 1: Delivery Address */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-950 font-heading flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-600" />
                1. Delivery Address
              </h2>
              {selectedAddressId !== 'new' && (
                <button
                  type="button"
                  onClick={() => setSelectedAddressId('new')}
                  className="text-xs font-semibold text-amber-700 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add New Address
                </button>
              )}
            </div>

            {/* Saved Addresses List */}
            {addresses.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`p-4 rounded-2xl border text-xs cursor-pointer transition-all ${
                      selectedAddressId === addr.id
                        ? 'border-slate-950 bg-slate-950 text-white shadow-md'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold mb-1">
                      <span>{addr.name}</span>
                      <span
                        className={`text-[10px] uppercase px-2 py-0.5 rounded ${
                          selectedAddressId === addr.id ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {addr.type}
                      </span>
                    </div>
                    <p className={`text-[11px] leading-relaxed ${selectedAddressId === addr.id ? 'text-slate-300' : 'text-slate-600'}`}>
                      {addr.street}, {addr.landmark ? `${addr.landmark}, ` : ''}{addr.city}, {addr.state} - {addr.pincode}
                    </p>
                    <p className={`mt-2 font-mono text-[11px] ${selectedAddressId === addr.id ? 'text-amber-300' : 'text-slate-500'}`}>
                      Phone: {addr.phone}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Address Form (shown if 'new' is selected or no addresses) */}
            {selectedAddressId === 'new' && (
              <div className="pt-2 space-y-4">
                <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Fill In Delivery Details
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={newAddrName}
                      onChange={(e) => setNewAddrName(e.target.value)}
                      placeholder="e.g. Ashish Badawat"
                      className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Mobile Number</label>
                    <input
                      type="tel"
                      required
                      value={newAddrPhone}
                      onChange={(e) => setNewAddrPhone(e.target.value)}
                      placeholder="+91 98290 12345"
                      className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Full Street Address & House/Flat No.</label>
                  <input
                    type="text"
                    required
                    value={newAddrStreet}
                    onChange={(e) => setNewAddrStreet(e.target.value)}
                    placeholder="Flat 402, Royal Residency, Opp. Central Park"
                    className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={newAddrCity}
                      onChange={(e) => setNewAddrCity(e.target.value)}
                      placeholder="Jaipur"
                      className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">State</label>
                    <input
                      type="text"
                      required
                      value={newAddrState}
                      onChange={(e) => setNewAddrState(e.target.value)}
                      placeholder="Rajasthan"
                      className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">PIN Code</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={newAddrPincode}
                      onChange={(e) => setNewAddrPincode(e.target.value.replace(/\D/g, ''))}
                      placeholder="302004"
                      className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Landmark (Optional)</label>
                  <input
                    type="text"
                    value={newAddrLandmark}
                    onChange={(e) => setNewAddrLandmark(e.target.value)}
                    placeholder="Near Gandhi Circle"
                    className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Payment Method */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-950 font-heading flex items-center gap-2 pb-3 border-b border-slate-100">
              <CreditCard className="w-5 h-5 text-amber-600" />
              2. Payment Method
            </h2>

            {/* Payment Options Radio Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* UPI */}
              <div
                onClick={() => setPaymentMethod('upi')}
                className={`p-4 rounded-2xl border text-xs cursor-pointer transition-all flex items-start gap-3 ${
                  paymentMethod === 'upi'
                    ? 'border-slate-950 bg-slate-950 text-white shadow-md'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 text-slate-800'
                }`}
              >
                <QrCode className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Instant UPI (0% Fee)</span>
                  <p className={`text-[11px] ${paymentMethod === 'upi' ? 'text-slate-300' : 'text-slate-500'}`}>
                    Google Pay, PhonePe, Paytm, BHIM or any UPI App
                  </p>
                </div>
              </div>

              {/* Card */}
              <div
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-2xl border text-xs cursor-pointer transition-all flex items-start gap-3 ${
                  paymentMethod === 'card'
                    ? 'border-slate-950 bg-slate-950 text-white shadow-md'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 text-slate-800'
                }`}
              >
                <CreditCard className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Credit / Debit Card</span>
                  <p className={`text-[11px] ${paymentMethod === 'card' ? 'text-slate-300' : 'text-slate-500'}`}>
                    Visa, MasterCard, RuPay with 256-bit encryption
                  </p>
                </div>
              </div>

              {/* Net Banking */}
              <div
                onClick={() => setPaymentMethod('netbanking')}
                className={`p-4 rounded-2xl border text-xs cursor-pointer transition-all flex items-start gap-3 ${
                  paymentMethod === 'netbanking'
                    ? 'border-slate-950 bg-slate-950 text-white shadow-md'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 text-slate-800'
                }`}
              >
                <Building className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Net Banking</span>
                  <p className={`text-[11px] ${paymentMethod === 'netbanking' ? 'text-slate-300' : 'text-slate-500'}`}>
                    HDFC, SBI, ICICI, Axis, Kotak & 50+ banks
                  </p>
                </div>
              </div>

              {/* COD */}
              <div
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-2xl border text-xs cursor-pointer transition-all flex items-start gap-3 ${
                  paymentMethod === 'cod'
                    ? 'border-slate-950 bg-slate-950 text-white shadow-md'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 text-slate-800'
                }`}
              >
                <Banknote className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Cash on Delivery (COD)</span>
                  <p className={`text-[11px] ${paymentMethod === 'cod' ? 'text-slate-300' : 'text-slate-500'}`}>
                    Pay cash or scan QR at doorstep on delivery
                  </p>
                </div>
              </div>
            </div>

            {/* Dynamic Payment Details Fields */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs space-y-3">
              {paymentMethod === 'upi' && (
                <div className="space-y-2">
                  <span className="font-semibold text-slate-800 block">Enter UPI ID / VPA</span>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@okhdfcbank"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                  <p className="text-[11px] text-slate-500">
                    A payment request will be triggered to your UPI app for instant authorization.
                  </p>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-slate-600 block mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4532 0000 0000 8912"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-600 block mb-1">Expiry Date</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                    </div>
                    <div>
                      <label className="text-slate-600 block mb-1">CVV</label>
                      <input
                        type="password"
                        maxLength={3}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="•••"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'netbanking' && (
                <div className="space-y-2">
                  <span className="font-semibold text-slate-800 block">Select Your Bank</span>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
                  >
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="State Bank of India">State Bank of India (SBI)</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                    <option value="Punjab National Bank">Punjab National Bank</option>
                  </select>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="text-slate-700 space-y-1">
                  <p className="font-semibold text-slate-900">Cash on Delivery Selected</p>
                  <p className="text-[11px] text-slate-500">
                    You can pay the total amount of ₹{grandTotal.toLocaleString('en-IN')} in cash or via courier UPI QR upon doorstep arrival. Please ensure an adult recipient is available with an OTP.
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Order Summary & Confirm (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6 sticky top-20">
            <h2 className="text-base font-bold text-slate-950 font-heading pb-3 border-b border-slate-100">
              Order Review
            </h2>

            {/* Items Mini List */}
            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-3 text-xs">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 truncate">{item.product.name}</p>
                    <p className="text-[11px] text-slate-500">
                      Qty: {item.quantity} {item.selectedSize ? `· Size ${item.selectedSize}` : ''}
                    </p>
                  </div>
                  <span className="font-bold text-slate-900 tabular-nums">
                    ₹{(item.product.discountPrice * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  ₹{cartSubtotal.toLocaleString('en-IN')}
                </span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span className="font-bold tabular-nums">
                    -₹{cartDiscount.toLocaleString('en-IN')}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {deliveryFee === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-950">Grand Total</span>
                <span className="text-2xl font-extrabold text-slate-950 tabular-nums">
                  ₹{grandTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 px-6 bg-slate-950 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2 shadow-xl transition-all"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Securing Order...
                </span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Place Order · ₹{grandTotal.toLocaleString('en-IN')}</span>
                </>
              )}
            </button>

            <div className="pt-2 border-t border-slate-100 space-y-2 text-[11px] text-slate-500 text-center">
              <p className="flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Guaranteed Safe & Encrypted Checkout
              </p>
              <p>Badawat Shopping Fulfillments are backed by 7-Day Returns.</p>
            </div>

          </div>
        </div>

      </form>

    </div>
  );
};
