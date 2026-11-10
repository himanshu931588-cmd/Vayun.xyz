import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  Download
} from 'lucide-react';
import { InvoiceData } from '../../types';

interface PayLinkViewProps {
  invoice: InvoiceData;
  onBack: () => void;
  onCreateNewInvoice: () => void;
  theme?: 'dark' | 'light';
}

export const PayLinkView: React.FC<PayLinkViewProps> = ({
  invoice,
  onBack,
  theme = 'dark'
}) => {
  const [isPaid, setIsPaid] = useState(invoice.status === 'paid');
  const [copiedLink, setCopiedLink] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const isLight = theme === 'light';

  const subtotal = invoice.items.reduce((acc, item) => acc + (item.quantity * item.rate), 0);
  const discountAmount = (subtotal * (invoice.discountPercent || 0)) / 100;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = (taxableAmount * (invoice.taxPercent || 0)) / 100;
  const grandTotal = taxableAmount + taxAmount;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Action Header */}
      <div className="flex items-center justify-between no-print">
        <button
          onClick={onBack}
          className={`flex items-center gap-1 text-xs transition-colors ${
            isLight ? 'text-neutral-500 hover:text-black' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to invoice editor</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className={`px-2.5 py-1 text-xs border rounded transition-colors flex items-center gap-1 ${
              isLight ? 'text-neutral-700 bg-neutral-100 hover:bg-neutral-200 border-neutral-300' : 'text-neutral-300 bg-neutral-900 hover:bg-neutral-800 border-neutral-800'
            }`}
          >
            {copiedLink ? <Check className="w-3 h-3 text-neutral-400" /> : <Copy className="w-3 h-3" />}
            <span>{copiedLink ? 'Link copied' : 'Copy link'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className={`px-2.5 py-1 text-xs border rounded transition-colors flex items-center gap-1 ${
              isLight ? 'text-neutral-700 bg-neutral-100 hover:bg-neutral-200 border-neutral-300' : 'text-neutral-300 bg-neutral-900 hover:bg-neutral-800 border-neutral-800'
            }`}
          >
            <Download className="w-3 h-3" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Clean Client Card */}
      <div className="bg-white text-black rounded-sm shadow-sm p-4 sm:p-10 md:p-14 border border-neutral-200 overflow-x-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-neutral-300 pb-8">
          <div>
            {invoice.sender.logo ? (
              <img src={invoice.sender.logo} alt="Logo" className="w-12 h-12 object-contain mb-3" />
            ) : (
              <div className="w-10 h-10 rounded bg-black text-white font-mono font-bold text-sm flex items-center justify-center mb-3">
                {invoice.sender.name.charAt(0) || 'V'}
              </div>
            )}
            <h1 className="text-xl font-bold text-black">{invoice.sender.name}</h1>
            <p className="text-xs text-neutral-500 whitespace-pre-line mt-1">{invoice.sender.address}</p>
            <p className="text-xs text-neutral-500 mt-0.5">{invoice.sender.email} • {invoice.sender.phone}</p>
          </div>

          <div className="sm:text-right space-y-1 font-mono text-xs">
            <div className="mb-2">
              {isPaid ? (
                <span className="px-2.5 py-0.5 border border-black text-black text-[11px] font-bold uppercase tracking-wider">
                  PAID
                </span>
              ) : (
                <span className="px-2.5 py-0.5 border border-neutral-400 text-neutral-700 text-[11px] font-bold uppercase tracking-wider">
                  DUE
                </span>
              )}
            </div>
            <p className="text-neutral-500">Invoice: <span className="text-black font-semibold">{invoice.invoiceNumber}</span></p>
            <p className="text-neutral-500">Date: <span className="text-black">{invoice.date}</span></p>
            <p className="text-neutral-500">Due: <span className="text-black">{invoice.dueDate}</span></p>
          </div>
        </div>

        {/* Bill to */}
        <div className="py-6 border-b border-neutral-200 text-xs">
          <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 block mb-1">
            Billed To
          </span>
          <div className="font-semibold text-black text-sm">{invoice.client.name}</div>
          <div className="text-neutral-500 whitespace-pre-line mt-0.5">{invoice.client.address}</div>
          <div className="text-neutral-500 mt-0.5">{invoice.client.email}</div>
        </div>

        {/* Items */}
        <div className="py-6 border-b border-neutral-200 overflow-x-auto">
          <table className="min-w-[450px] sm:min-w-full text-xs text-left">
            <thead>
              <tr className="border-b border-neutral-900 text-black font-mono text-[11px] uppercase tracking-wider">
                <th className="py-2 px-1">Description</th>
                <th className="py-2 px-1 text-right">Qty</th>
                <th className="py-2 px-1 text-right">Rate</th>
                <th className="py-2 px-1 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-mono text-xs">
              {invoice.items.map(item => (
                <tr key={item.id}>
                  <td className="py-2.5 px-1 font-sans text-black">{item.description}</td>
                  <td className="py-2.5 px-1 text-right text-neutral-600">{item.quantity}</td>
                  <td className="py-2.5 px-1 text-right text-neutral-600">{invoice.currency}{item.rate}</td>
                  <td className="py-2.5 px-1 text-right font-medium text-black">{invoice.currency}{item.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary & Action */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between gap-6 text-xs">
          <div className="space-y-2 max-w-sm">
            {invoice.paymentTerms && (
              <div>
                <span className="font-mono text-[10px] uppercase text-neutral-400 block mb-0.5">Instructions</span>
                <p className="text-neutral-600">{invoice.paymentTerms}</p>
              </div>
            )}
            {invoice.notes && (
              <div>
                <span className="font-mono text-[10px] uppercase text-neutral-400 block mb-0.5">Notes</span>
                <p className="text-neutral-600">{invoice.notes}</p>
              </div>
            )}
          </div>

          <div className="w-full sm:w-64 space-y-2 font-mono text-xs">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal:</span>
              <span>{invoice.currency}{subtotal.toFixed(2)}</span>
            </div>
            {invoice.taxPercent > 0 && (
              <div className="flex justify-between text-neutral-600">
                <span>Tax ({invoice.taxPercent}%):</span>
                <span>{invoice.currency}{taxAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t border-neutral-900 pt-2 flex justify-between font-bold text-black text-sm">
              <span>Total:</span>
              <span>{invoice.currency}{grandTotal.toFixed(2)}</span>
            </div>

            <div className="pt-3 no-print">
              {!isPaid ? (
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full py-2.5 bg-black hover:bg-neutral-800 text-white font-medium text-xs rounded transition-colors"
                >
                  Pay Invoice ({invoice.currency}{grandTotal.toFixed(2)})
                </button>
              ) : (
                <div className="w-full py-2 border border-neutral-300 text-neutral-700 text-center text-xs font-medium">
                  Payment Recorded
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment details modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`border rounded p-5 max-w-sm w-full space-y-4 text-xs ${
            isLight ? 'bg-white border-neutral-300 text-black' : 'bg-[#111111] border-neutral-800 text-white'
          }`}>
            <div className={`flex items-center justify-between border-b pb-2 ${isLight ? 'border-neutral-200' : 'border-neutral-800'}`}>
              <span className="font-medium">Payment Options</span>
              <button onClick={() => setShowPaymentModal(false)} className="text-neutral-400 hover:text-black">✕</button>
            </div>

            <div className="space-y-3 font-mono">
              {invoice.paymentDetails.bankName && (
                <div className={`p-2.5 rounded border space-y-0.5 ${
                  isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#0a0a0a] border-neutral-800'
                }`}>
                  <div className="text-neutral-500 font-sans text-[11px]">Bank Wire</div>
                  <div className="font-semibold">Bank: {invoice.paymentDetails.bankName}</div>
                  <div className="text-neutral-500">Account: {invoice.paymentDetails.accountNumber}</div>
                  <div className="text-neutral-500">Routing: {invoice.paymentDetails.routingCode}</div>
                </div>
              )}

              {invoice.paymentDetails.stripePaymentUrl && (
                <a
                  href={invoice.paymentDetails.stripePaymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block p-2.5 rounded border transition-colors ${
                    isLight ? 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-black' : 'bg-[#0a0a0a] hover:bg-neutral-900 border-neutral-800 text-white'
                  }`}
                >
                  Open Card Checkout
                </a>
              )}

              {invoice.paymentDetails.paypalEmail && (
                <div className={`p-2.5 rounded border ${
                  isLight ? 'bg-neutral-50 border-neutral-200 text-neutral-700' : 'bg-[#0a0a0a] border-neutral-800 text-neutral-300'
                }`}>
                  PayPal: {invoice.paymentDetails.paypalEmail}
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setIsPaid(true);
                setShowPaymentModal(false);
              }}
              className={`w-full py-2 font-medium rounded transition-colors ${
                isLight ? 'bg-black text-white hover:bg-neutral-800' : 'bg-white text-black hover:bg-neutral-200'
              }`}
            >
              Confirm Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
