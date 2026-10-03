import React from 'react';
import { useStore } from '../context/StoreContext';
import { Printer, ArrowLeft, ShieldCheck, Download, Award } from 'lucide-react';

export const InvoiceView: React.FC = () => {
  const { orders, selectedOrderId, setActivePage, settings } = useStore();

  const order = orders.find((o) => o.id === selectedOrderId) || orders[0];

  if (!order) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 max-w-lg mx-auto">
        <p className="text-sm text-slate-500">Order invoice not found.</p>
        <button
          onClick={() => setActivePage('user-dashboard')}
          className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  // Calculations for Indian GST breakdown
  const taxableAmount = Math.round(order.grandTotal / 1.18);
  const gstTotal = order.grandTotal - taxableAmount;
  const cgst = Math.round(gstTotal / 2);
  const sgst = gstTotal - cgst;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Action Bar (Hidden in Print) */}
      <div className="flex items-center justify-between no-print">
        <button
          onClick={() => setActivePage('user-dashboard')}
          className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Orders</span>
        </button>

        <button
          onClick={handlePrint}
          className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors shadow-md"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save Tax Invoice (PDF)</span>
        </button>
      </div>

      {/* Printable Invoice Container */}
      <div
        id="printable-invoice"
        className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8 text-slate-900"
      >
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="font-extrabold tracking-tight text-slate-950 text-2xl font-heading">
                BADAWAT
              </span>
              <span className="text-amber-600 font-extrabold text-2xl font-heading">
                SHOPPING
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Badawat E-Commerce Private Limited</p>
            <p className="text-[11px] text-slate-500 max-w-xs mt-0.5">{settings.warehouseLocation}</p>
            <div className="text-[11px] text-slate-700 mt-2 space-y-0.5">
              <p>
                <strong>GSTIN:</strong> {settings.gstNumber}
              </p>
              <p>
                <strong>PAN:</strong> AAACB2026B
              </p>
              <p>
                <strong>Contact:</strong> support@badawatshopping.in | +91 98290 12345
              </p>
            </div>
          </div>

          <div className="sm:text-right space-y-1">
            <span className="inline-block px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-md text-xs font-bold uppercase tracking-wider">
              Tax Invoice (Original for Recipient)
            </span>
            <p className="text-sm font-mono font-bold text-slate-950 pt-2">
              Invoice #{order.invoiceNumber}
            </p>
            <p className="text-xs text-slate-500">
              <strong>Order No:</strong> {order.orderNumber}
            </p>
            <p className="text-xs text-slate-500">
              <strong>Invoice Date:</strong> {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
            <p className="text-xs text-emerald-800 font-semibold uppercase">
              Payment Status: {order.paymentStatus} via {order.paymentMethod}
            </p>
          </div>
        </div>

        {/* Billing & Shipping Address Split */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs pb-6 border-b border-slate-200">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Billed To (Customer Details)
            </span>
            <p className="font-bold text-slate-900 text-sm">{order.customerName}</p>
            <p className="text-slate-600 mt-0.5">{order.shippingAddress.street}</p>
            <p className="text-slate-600">
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
            </p>
            <p className="text-slate-500 mt-1 font-mono">Mobile: {order.shippingAddress.phone}</p>
            <p className="text-slate-500 font-mono">Email: {order.customerEmail}</p>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Shipped To & Place of Supply
            </span>
            <p className="font-bold text-slate-900 text-sm">{order.shippingAddress.name}</p>
            <p className="text-slate-600 mt-0.5">{order.shippingAddress.street}</p>
            <p className="text-slate-600">
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
            </p>
            <p className="text-slate-700 font-semibold mt-1">
              State / Code: {order.shippingAddress.state} (08)
            </p>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                <th className="py-2.5 px-3 font-bold">#</th>
                <th className="py-2.5 px-3 font-bold">Description of Goods</th>
                <th className="py-2.5 px-3 font-bold">HSN Code</th>
                <th className="py-2.5 px-3 font-bold text-center">Qty</th>
                <th className="py-2.5 px-3 font-bold text-right">Unit Price</th>
                <th className="py-2.5 px-3 font-bold text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {order.items.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="py-3 px-3 text-slate-400">{idx + 1}</td>
                  <td className="py-3 px-3 font-semibold text-slate-900">
                    {item.name}
                    {item.size ? ` (Size: ${item.size})` : ''}
                    {item.color ? ` (Color: ${item.color})` : ''}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-500">8518.30</td>
                  <td className="py-3 px-3 text-center tabular-nums">{item.quantity}</td>
                  <td className="py-3 px-3 text-right tabular-nums">
                    ₹{item.price.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-slate-900 tabular-nums">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* GST & Totals Breakdown */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-4 border-t border-slate-200 text-xs">
          <div className="space-y-2 max-w-sm">
            <span className="font-bold text-slate-900 block">Terms & Declarations:</span>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct. Goods once sold are backed by Badawat Shopping 7-Day return policy.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-emerald-800 font-semibold text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Computer Generated Digital Tax Invoice
            </div>
          </div>

          <div className="w-full sm:w-72 space-y-2 text-slate-600">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="font-semibold text-slate-900 tabular-nums">
                ₹{order.subtotal.toLocaleString('en-IN')}
              </span>
            </div>

            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount ({order.couponCode})</span>
                <span className="font-bold tabular-nums">
                  -₹{order.discount.toLocaleString('en-IN')}
                </span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Taxable Value</span>
              <span className="tabular-nums">₹{taxableAmount.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between">
              <span>CGST (9%)</span>
              <span className="tabular-nums">₹{cgst.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between">
              <span>SGST (9%)</span>
              <span className="tabular-nums">₹{sgst.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="tabular-nums">{order.deliveryCharge === 0 ? 'FREE' : `₹${order.deliveryCharge}`}</span>
            </div>

            <div className="pt-2 border-t border-slate-300 flex justify-between items-baseline font-bold text-slate-950 text-base">
              <span>Total Invoice Value</span>
              <span className="text-xl tabular-nums">₹{order.grandTotal.toLocaleString('en-IN')}</span>
            </div>
            <p className="text-[10px] text-slate-400 text-right">Amount in Indian Rupees (INR)</p>
          </div>
        </div>

        {/* Signature Stamp Block */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-end justify-between gap-4 text-xs">
          <div className="text-slate-400 text-[10px]">
            E. & O.E. · This is a system generated invoice requiring no physical signature.
          </div>
          <div className="text-right">
            <p className="font-bold text-slate-900">For Badawat Shopping India Pvt Ltd</p>
            <div className="my-2 inline-block px-3 py-1 bg-amber-50 border border-amber-300 rounded text-amber-900 font-mono text-[10px] uppercase font-bold tracking-wider">
              [ Digitally Authorized Signatory ]
            </div>
            <p className="text-[10px] text-slate-500">Authorized Logistics Representative</p>
          </div>
        </div>

      </div>

    </div>
  );
};
