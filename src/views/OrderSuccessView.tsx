import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  CheckCircle2,
  Package,
  FileText,
  ArrowRight,
  Truck,
  MapPin,
  Calendar,
  CreditCard,
} from 'lucide-react';

export const OrderSuccessView: React.FC = () => {
  const { orders, selectedOrderId, setActivePage, setSelectedOrderId } = useStore();

  const order = orders.find((o) => o.id === selectedOrderId) || orders[0];

  if (!order) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl p-8 max-w-lg mx-auto">
        <p className="text-sm text-slate-500">Order not found.</p>
        <button
          onClick={() => setActivePage('home')}
          className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs"
        >
          Return Home
        </button>
      </div>
    );
  }

  const handleTrackOrder = () => {
    setSelectedOrderId(order.id);
    setActivePage('order-tracking');
  };

  const handleViewInvoice = () => {
    setSelectedOrderId(order.id);
    setActivePage('invoice');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-6">
      
      {/* Confirmation Celebration Header */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner animate-in zoom-in-50 duration-300">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
            Payment Verified · Order Placed
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-heading mt-1">
            Thank You For Your Order!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
            We have received your order. A confirmation email and SMS with live tracking link has been sent to your registered contact.
          </p>
        </div>

        {/* Order Reference Badge */}
        <div className="inline-flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Order Number</span>
            <span className="font-mono font-bold text-slate-900 text-sm">{order.orderNumber}</span>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Estimated Delivery</span>
            <span className="font-semibold text-emerald-800 text-xs">{order.estimatedDeliveryDate}</span>
          </div>
        </div>

        {/* Actions Strip */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={handleTrackOrder}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
          >
            <Truck className="w-4 h-4" />
            <span>Track Live Shipment</span>
          </button>
          <button
            onClick={handleViewInvoice}
            className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <FileText className="w-4 h-4 text-amber-600" />
            <span>View Tax Invoice</span>
          </button>
          <button
            onClick={() => setActivePage('shop')}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>

      {/* Order Stages Progress Diagram */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <h2 className="text-base font-bold text-slate-950 font-heading">
          Order Fulfillment Progress
        </h2>

        {/* Desktop Pipeline Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
            <span className="font-bold text-emerald-900 block">1. Confirmed</span>
            <span className="text-[10px] text-emerald-700">Payment received</span>
          </div>
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <span className="font-bold text-amber-900 block">2. Processing</span>
            <span className="text-[10px] text-amber-700">Quality check</span>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl opacity-60">
            <span className="font-bold text-slate-700 block">3. Shipped</span>
            <span className="text-[10px] text-slate-500">Air courier</span>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl opacity-60">
            <span className="font-bold text-slate-700 block">4. Out for Delivery</span>
            <span className="text-[10px] text-slate-500">Local delivery</span>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl opacity-60">
            <span className="font-bold text-slate-700 block">5. Delivered</span>
            <span className="text-[10px] text-slate-500">Doorstep OTP</span>
          </div>
        </div>
      </div>

      {/* Order Details & Summary Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <h2 className="text-base font-bold text-slate-950 font-heading pb-3 border-b border-slate-100">
          Items Ordered ({order.items.length})
        </h2>

        <div className="divide-y divide-slate-100">
          {order.items.map((item, index) => (
            <div key={index} className="py-3 flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div>
                  <h4 className="font-bold text-slate-900">{item.name}</h4>
                  <p className="text-[11px] text-slate-500">
                    Quantity: {item.quantity} {item.size ? `· Size: ${item.size}` : ''} {item.color ? `· Color: ${item.color}` : ''}
                  </p>
                </div>
              </div>
              <span className="font-bold text-slate-900 tabular-nums">
                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
              </span>
            </div>
          ))}
        </div>

        {/* Pricing Summary */}
        <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-semibold text-slate-900 tabular-nums">₹{order.subtotal.toLocaleString('en-IN')}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-700">
              <span>Coupon Discount ({order.couponCode})</span>
              <span className="font-bold tabular-nums">-₹{order.discount.toLocaleString('en-IN')}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span className="font-semibold text-slate-900 tabular-nums">
              {order.deliveryCharge === 0 ? 'FREE' : `₹${order.deliveryCharge}`}
            </span>
          </div>
          <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline font-bold text-slate-950 text-base">
            <span>Amount Paid</span>
            <span className="text-xl tabular-nums">₹{order.grandTotal.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Shipping Destination */}
        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Delivery Address
            </span>
            <p className="font-semibold text-slate-900">{order.shippingAddress.name}</p>
            <p className="text-slate-600 leading-relaxed">
              {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
            </p>
            <p className="text-slate-500 font-mono mt-0.5">Phone: {order.shippingAddress.phone}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Payment Method
            </span>
            <p className="font-semibold text-slate-900 uppercase">
              {order.paymentMethod} ({order.paymentStatus})
            </p>
            <p className="text-slate-500 text-[11px] mt-0.5">
              Invoice #{order.invoiceNumber}
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
