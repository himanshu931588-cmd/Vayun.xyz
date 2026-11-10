import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  Plus, 
  Trash2, 
  Upload, 
  Check, 
  Save
} from 'lucide-react';
import { InvoiceData, InvoiceItem } from '../../types';
import { 
  saveBusinessProfile, 
  loadBusinessProfile, 
  saveInvoiceRecord, 
  encodePayLink 
} from '../../utils/invoiceStorage';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface InvoiceMakerViewProps {
  onBack: () => void;
  onOpenPayLink: (invoice: InvoiceData) => void;
  onOpenReceiptMatcher: () => void;
  importedItems?: InvoiceItem[];
  theme?: 'dark' | 'light';
}

export const InvoiceMakerView: React.FC<InvoiceMakerViewProps> = ({
  onBack,
  onOpenPayLink,
  onOpenReceiptMatcher,
  importedItems,
  theme = 'dark'
}) => {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [profileSavedToast, setProfileSavedToast] = useState(false);
  const [copiedPayLink, setCopiedPayLink] = useState(false);
  const isLight = theme === 'light';

  const [invoice, setInvoice] = useState<InvoiceData>(() => {
    const saved = loadBusinessProfile();
    return {
      id: 'inv_' + Math.random().toString(36).substring(2, 9),
      invoiceNumber: 'INV-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      currency: '$',
      status: 'unpaid',
      sender: {
        name: saved?.name || 'Apex Design Studio LLC',
        email: saved?.email || 'billing@apexstudio.design',
        address: saved?.address || '742 Evergreen Terrace, Suite 400\nSan Francisco, CA 94107',
        phone: saved?.phone || '+1 (415) 890-2341',
        taxId: saved?.taxId || 'US-94-3829102',
        logo: saved?.logo || ''
      },
      client: {
        name: 'Nexus Cloud Technologies Inc.',
        email: 'accounts-payable@nexuscloud.io',
        address: '500 Howard Street, Floor 12\nSan Francisco, CA 94105',
        phone: '+1 (415) 555-0199'
      },
      items: [
        {
          id: 'item_1',
          description: 'Frontend Web Application Architecture & Design System',
          quantity: 40,
          rate: 150,
          amount: 6000
        },
        {
          id: 'item_2',
          description: 'API & Prompt Pipeline Integration',
          quantity: 25,
          rate: 160,
          amount: 4000
        }
      ],
      discountPercent: 0,
      taxPercent: 8.5,
      notes: 'Payment is requested within 14 days of invoice issuance.',
      paymentTerms: 'Net 14 Days. Direct deposit or wire transfer.',
      paymentDetails: {
        bankName: saved?.paymentDetails?.bankName || 'Commercial Bank',
        accountNumber: saved?.paymentDetails?.accountNumber || '**** 9283',
        routingCode: saved?.paymentDetails?.routingCode || '121000358',
        stripePaymentUrl: saved?.paymentDetails?.stripePaymentUrl || 'https://buy.stripe.com/test_docukit',
        paypalEmail: saved?.paymentDetails?.paypalEmail || 'payments@apexstudio.design',
        upiId: saved?.paymentDetails?.upiId || 'apexstudio@okaxis'
      },
      createdAt: new Date().toISOString()
    };
  });

  useEffect(() => {
    if (importedItems && importedItems.length > 0) {
      setInvoice(prev => ({
        ...prev,
        items: [...prev.items, ...importedItems]
      }));
    }
  }, [importedItems]);

  const subtotal = invoice.items.reduce((acc, item) => acc + (item.quantity * item.rate), 0);
  const discountAmount = (subtotal * (invoice.discountPercent || 0)) / 100;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = (taxableAmount * (invoice.taxPercent || 0)) / 100;
  const grandTotal = taxableAmount + taxAmount;

  const handleSaveProfile = () => {
    saveBusinessProfile({
      name: invoice.sender.name,
      email: invoice.sender.email,
      address: invoice.sender.address,
      phone: invoice.sender.phone,
      taxId: invoice.sender.taxId,
      logo: invoice.sender.logo,
      paymentDetails: invoice.paymentDetails
    });
    setProfileSavedToast(true);
    setTimeout(() => setProfileSavedToast(false), 2000);
  };

  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: 'item_' + Date.now(),
      description: 'Consulting & Development Services',
      quantity: 1,
      rate: 100,
      amount: 100
    };
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const handleRemoveItem = (id: string) => {
    if (invoice.items.length <= 1) return;
    setInvoice(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const handleUpdateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updated.amount = (Number(updated.quantity) || 0) * (Number(updated.rate) || 0);
        }
        return updated;
      })
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = String(event.target?.result || '');
      setInvoice(prev => ({
        ...prev,
        sender: { ...prev.sender, logo: base64 }
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleDownloadPdf = async () => {
    if (!invoiceRef.current) return;
    setIsGeneratingPdf(true);
    saveInvoiceRecord(invoice);

    try {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${invoice.invoiceNumber}.pdf`);
    } catch (err) {
      console.error('PDF error:', err);
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleGeneratePayLink = () => {
    saveInvoiceRecord(invoice);
    const encoded = encodePayLink(invoice);
    const url = `${window.location.origin}${window.location.pathname}#/p/${encoded}`;
    navigator.clipboard.writeText(url);
    setCopiedPayLink(true);
    setTimeout(() => setCopiedPayLink(false), 2000);
    onOpenPayLink(invoice);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 no-print">
        <button
          onClick={onBack}
          className={`flex items-center gap-1 text-xs transition-colors ${
            isLight ? 'text-neutral-500 hover:text-black' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to utilities</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenReceiptMatcher}
            className={`px-2.5 py-1 text-xs border rounded transition-colors ${
              isLight ? 'text-neutral-700 bg-neutral-100 hover:bg-neutral-200 border-neutral-300' : 'text-neutral-300 bg-neutral-900 hover:bg-neutral-800 border-neutral-800'
            }`}
          >
            Import receipts
          </button>

          <button
            onClick={handleSaveProfile}
            className={`px-2.5 py-1 text-xs border rounded transition-colors flex items-center gap-1 ${
              isLight ? 'text-neutral-700 bg-neutral-100 hover:bg-neutral-200 border-neutral-300' : 'text-neutral-300 bg-neutral-900 hover:bg-neutral-800 border-neutral-800'
            }`}
          >
            {profileSavedToast ? <Check className="w-3 h-3 text-neutral-400" /> : <Save className="w-3 h-3 text-neutral-400" />}
            <span>{profileSavedToast ? 'Saved' : 'Save business'}</span>
          </button>

          <button
            onClick={handleGeneratePayLink}
            className={`px-2.5 py-1 text-xs border rounded transition-colors flex items-center gap-1 ${
              isLight ? 'text-neutral-700 bg-neutral-100 hover:bg-neutral-200 border-neutral-300' : 'text-neutral-300 bg-neutral-900 hover:bg-neutral-800 border-neutral-800'
            }`}
          >
            <Share2 className="w-3 h-3" />
            <span>{copiedPayLink ? 'Link copied' : 'PayLink'}</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors flex items-center gap-1 ${
              isLight ? 'bg-black text-white hover:bg-neutral-800' : 'bg-white text-black hover:bg-neutral-200'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isGeneratingPdf ? 'Generating...' : 'Download PDF'}</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet (Classic Minimalist Style) */}
      <div className={`border rounded-lg p-2 sm:p-6 no-print ${
        isLight ? 'bg-neutral-100 border-neutral-200' : 'bg-[#0a0a0a] border-neutral-900'
      }`}>
        <div 
          ref={invoiceRef}
          className="bg-white text-black rounded-sm p-4 sm:p-8 md:p-14 shadow-sm max-w-3xl mx-auto invoice-printable font-sans border border-neutral-200 overflow-x-auto"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-neutral-300 pb-8">
            <div className="space-y-2 max-w-sm">
              <div className="flex items-center gap-3">
                {invoice.sender.logo ? (
                  <div className="relative group">
                    <img src={invoice.sender.logo} alt="Logo" className="w-12 h-12 object-contain" />
                    <label className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer text-[9px] no-print">
                      Edit
                      <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                    </label>
                  </div>
                ) : (
                  <label className="w-12 h-12 border border-dashed border-neutral-300 rounded flex flex-col items-center justify-center text-neutral-400 hover:border-neutral-500 cursor-pointer transition-colors no-print">
                    <Upload className="w-3.5 h-3.5" />
                    <span className="text-[8px] uppercase">Logo</span>
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                )}

                <input
                  type="text"
                  value={invoice.sender.name}
                  onChange={e => setInvoice({ ...invoice, sender: { ...invoice.sender, name: e.target.value } })}
                  placeholder="Business Name"
                  className="font-bold text-lg sm:text-xl text-black border-b border-transparent hover:border-neutral-200 focus:outline-none w-full"
                />
              </div>

              <textarea
                value={invoice.sender.address}
                onChange={e => setInvoice({ ...invoice, sender: { ...invoice.sender, address: e.target.value } })}
                placeholder="Business Address"
                rows={2}
                className="w-full text-xs text-neutral-600 border-b border-transparent hover:border-neutral-200 focus:outline-none resize-none leading-relaxed"
              />

              <div className="flex items-center gap-3 text-xs text-neutral-600">
                <input
                  type="email"
                  value={invoice.sender.email}
                  onChange={e => setInvoice({ ...invoice, sender: { ...invoice.sender, email: e.target.value } })}
                  placeholder="email@domain.com"
                  className="w-1/2 border-b border-transparent hover:border-neutral-200 focus:outline-none"
                />
                <input
                  type="text"
                  value={invoice.sender.phone}
                  onChange={e => setInvoice({ ...invoice, sender: { ...invoice.sender, phone: e.target.value } })}
                  placeholder="Phone"
                  className="w-1/2 border-b border-transparent hover:border-neutral-200 focus:outline-none"
                />
              </div>
            </div>

            <div className="sm:text-right space-y-1.5 w-full sm:w-auto">
              <span className="font-serif italic text-2xl text-black block">Invoice</span>
              
              <div className="text-xs text-neutral-600 flex sm:justify-end gap-2">
                <span>Number:</span>
                <input
                  type="text"
                  value={invoice.invoiceNumber}
                  onChange={e => setInvoice({ ...invoice, invoiceNumber: e.target.value })}
                  className="font-mono font-medium text-black sm:text-right w-28 border-b border-transparent hover:border-neutral-200 focus:outline-none"
                />
              </div>

              <div className="text-xs text-neutral-600 flex sm:justify-end gap-2">
                <span>Date:</span>
                <input
                  type="date"
                  value={invoice.date}
                  onChange={e => setInvoice({ ...invoice, date: e.target.value })}
                  className="text-black sm:text-right border-b border-transparent hover:border-neutral-200 focus:outline-none text-xs"
                />
              </div>

              <div className="text-xs text-neutral-600 flex sm:justify-end gap-2">
                <span>Due:</span>
                <input
                  type="date"
                  value={invoice.dueDate}
                  onChange={e => setInvoice({ ...invoice, dueDate: e.target.value })}
                  className="text-black sm:text-right border-b border-transparent hover:border-neutral-200 focus:outline-none text-xs"
                />
              </div>
            </div>
          </div>

          {/* Billed To */}
          <div className="py-6 border-b border-neutral-200">
            <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 block mb-1">
              Billed To
            </span>
            <input
              type="text"
              value={invoice.client.name}
              onChange={e => setInvoice({ ...invoice, client: { ...invoice.client, name: e.target.value } })}
              placeholder="Client Name"
              className="font-semibold text-sm text-black border-b border-transparent hover:border-neutral-200 focus:outline-none w-full"
            />
            <textarea
              value={invoice.client.address}
              onChange={e => setInvoice({ ...invoice, client: { ...invoice.client, address: e.target.value } })}
              placeholder="Client Address"
              rows={2}
              className="w-full text-xs text-neutral-600 border-b border-transparent hover:border-neutral-200 focus:outline-none resize-none leading-relaxed mt-0.5"
            />
            <input
              type="email"
              value={invoice.client.email}
              onChange={e => setInvoice({ ...invoice, client: { ...invoice.client, email: e.target.value } })}
              placeholder="client@company.com"
              className="text-xs text-neutral-600 border-b border-transparent hover:border-neutral-200 focus:outline-none w-64 mt-0.5"
            />
          </div>

          {/* Line Items Table */}
          <div className="py-6 border-b border-neutral-200 overflow-x-auto">
            <table className="min-w-[500px] sm:min-w-full text-xs text-left">
              <thead>
                <tr className="border-b border-neutral-900 text-black font-mono text-[11px] uppercase tracking-wider">
                  <th className="py-2 px-1 w-1/2">Item Description</th>
                  <th className="py-2 px-1 text-right w-16">Qty</th>
                  <th className="py-2 px-1 text-right w-24">Rate</th>
                  <th className="py-2 px-1 text-right w-28">Amount</th>
                  <th className="py-2 px-1 w-6 no-print"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-mono text-xs">
                {invoice.items.map(item => (
                  <tr key={item.id} className="group hover:bg-neutral-50">
                    <td className="py-2.5 px-1 font-sans">
                      <input
                        type="text"
                        value={item.description}
                        onChange={e => handleUpdateItem(item.id, 'description', e.target.value)}
                        placeholder="Item description..."
                        className="w-full text-black border-b border-transparent hover:border-neutral-200 focus:outline-none"
                      />
                    </td>
                    <td className="py-2.5 px-1 text-right">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={e => handleUpdateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                        className="w-full text-right text-black border-b border-transparent hover:border-neutral-200 focus:outline-none"
                      />
                    </td>
                    <td className="py-2.5 px-1 text-right">
                      <input
                        type="number"
                        value={item.rate}
                        onChange={e => handleUpdateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                        className="w-full text-right text-black border-b border-transparent hover:border-neutral-200 focus:outline-none"
                      />
                    </td>
                    <td className="py-2.5 px-1 text-right font-medium text-black">
                      {invoice.currency}{item.amount.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-1 text-center no-print">
                      <button onClick={() => handleRemoveItem(item.id)} className="text-neutral-300 hover:text-black">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              onClick={handleAddItem}
              className="mt-3 text-xs text-neutral-600 hover:text-black flex items-center gap-1 no-print font-medium"
            >
              <Plus className="w-3 h-3" />
              <span>Add line item</span>
            </button>
          </div>

          {/* Totals & Notes */}
          <div className="pt-6 flex flex-col sm:flex-row justify-between gap-6 text-xs">
            <div className="space-y-3 max-w-sm">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 block mb-0.5">
                  Payment Instructions
                </span>
                <textarea
                  value={invoice.paymentTerms}
                  onChange={e => setInvoice({ ...invoice, paymentTerms: e.target.value })}
                  rows={2}
                  className="w-full text-neutral-600 border-b border-transparent hover:border-neutral-200 focus:outline-none resize-none leading-relaxed"
                />
              </div>
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 block mb-0.5">
                  Notes
                </span>
                <textarea
                  value={invoice.notes}
                  onChange={e => setInvoice({ ...invoice, notes: e.target.value })}
                  rows={2}
                  className="w-full text-neutral-600 border-b border-transparent hover:border-neutral-200 focus:outline-none resize-none leading-relaxed"
                />
              </div>
            </div>

            <div className="w-full sm:w-64 space-y-1.5 font-mono text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal:</span>
                <span>{invoice.currency}{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-600 items-center">
                <span>Tax (%):</span>
                <input
                  type="number"
                  value={invoice.taxPercent}
                  onChange={e => setInvoice({ ...invoice, taxPercent: parseFloat(e.target.value) || 0 })}
                  className="w-14 text-right border-b border-neutral-200 focus:outline-none"
                />
              </div>
              {invoice.taxPercent > 0 && (
                <div className="flex justify-between text-neutral-600 text-[11px]">
                  <span>Tax Amount:</span>
                  <span>{invoice.currency}{taxAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-neutral-900 pt-2 flex justify-between font-bold text-black text-sm">
                <span>Total Due:</span>
                <span>{invoice.currency}{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
