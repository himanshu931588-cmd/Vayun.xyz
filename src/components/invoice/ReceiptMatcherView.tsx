import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Upload, 
  Trash2, 
  ArrowRight
} from 'lucide-react';
import { InvoiceItem } from '../../types';

interface ReceiptMatcherViewProps {
  onBack: () => void;
  onSendToInvoice: (items: InvoiceItem[]) => void;
  theme?: 'dark' | 'light';
}

interface ExtractedReceipt {
  id: string;
  vendor: string;
  date: string;
  category: string;
  amount: number;
  thumbnail?: string;
}

const SAMPLE_RECEIPTS: ExtractedReceipt[] = [
  {
    id: 'rcpt_1',
    vendor: 'Cloud Compute Infrastructure',
    date: '2026-02-14',
    category: 'Hosting & GPU',
    amount: 342.50
  },
  {
    id: 'rcpt_2',
    vendor: 'Model Inference API',
    date: '2026-02-18',
    category: 'LLM Tokens',
    amount: 185.00
  },
  {
    id: 'rcpt_3',
    vendor: 'Domain Registrar',
    date: '2026-02-22',
    category: 'Web Services',
    amount: 48.75
  }
];

export const ReceiptMatcherView: React.FC<ReceiptMatcherViewProps> = ({
  onBack,
  onSendToInvoice,
  theme = 'dark'
}) => {
  const [receipts, setReceipts] = useState<ExtractedReceipt[]>(SAMPLE_RECEIPTS);
  const isLight = theme === 'light';

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const base64 = String(event.target?.result || '');
      const newReceipt: ExtractedReceipt = {
        id: 'rcpt_' + Date.now(),
        vendor: 'Uploaded Receipt',
        date: new Date().toISOString().split('T')[0],
        category: 'Reimbursable Expense',
        amount: 75.00,
        thumbnail: base64
      };

      setReceipts(prev => [newReceipt, ...prev]);
    };

    reader.readAsDataURL(file);
  };

  const handleDeleteReceipt = (id: string) => {
    setReceipts(prev => prev.filter(r => r.id !== id));
  };

  const handlePushToInvoice = () => {
    const lineItems: InvoiceItem[] = receipts.map(r => ({
      id: 'item_' + r.id,
      description: `${r.vendor} (${r.category})`,
      quantity: 1,
      rate: r.amount,
      amount: r.amount,
      receiptThumbnail: r.thumbnail
    }));

    onSendToInvoice(lineItems);
  };

  const total = receipts.reduce((acc, r) => acc + r.amount, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className={`flex items-center gap-1 text-xs transition-colors ${
            isLight ? 'text-neutral-500 hover:text-black' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to invoice</span>
        </button>

        <label className={`cursor-pointer px-2.5 py-1 text-xs border rounded transition-colors flex items-center gap-1.5 ${
          isLight ? 'text-neutral-700 bg-neutral-100 hover:bg-neutral-200 border-neutral-300' : 'text-neutral-300 bg-neutral-900 hover:bg-neutral-800 border-neutral-800'
        }`}>
          <Upload className="w-3.5 h-3.5" />
          <span>Upload receipt</span>
          <input type="file" accept="image/*,.pdf" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>

      <div className={`space-y-1.5 pb-4 border-b ${isLight ? 'border-neutral-200' : 'border-neutral-900'}`}>
        <h1 className={`text-2xl font-serif tracking-tight ${isLight ? 'text-black' : 'text-white'}`}>
          Receipt Matcher
        </h1>
        <p className={`text-xs max-w-xl leading-relaxed ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
          Extracts expense amounts and descriptions from receipts to insert directly as reimbursable line items on invoices.
        </p>
      </div>

      <div className={`p-3 border rounded flex items-center justify-between text-xs ${
        isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#0a0a0a] border-neutral-800'
      }`}>
        <span className={`font-mono ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
          Total items: {receipts.length} | Sum: ${total.toFixed(2)}
        </span>

        <button
          onClick={handlePushToInvoice}
          disabled={receipts.length === 0}
          className={`px-3 py-1.5 font-medium text-xs rounded transition-colors flex items-center gap-1.5 ${
            isLight ? 'bg-black text-white hover:bg-neutral-800' : 'bg-white text-black hover:bg-neutral-200'
          }`}
        >
          <span>Send to invoice</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-2">
        {receipts.map(rcpt => (
          <div
            key={rcpt.id}
            className={`p-3 border rounded flex items-center justify-between text-xs ${
              isLight ? 'bg-white border-neutral-200' : 'bg-[#0a0a0a] border-neutral-800'
            }`}
          >
            <div className="space-y-0.5">
              <span className={`font-medium block ${isLight ? 'text-black' : 'text-white'}`}>{rcpt.vendor}</span>
              <span className={isLight ? 'text-neutral-500' : 'text-neutral-500'}>{rcpt.category} • {rcpt.date}</span>
            </div>

            <div className="flex items-center gap-4">
              <span className={`font-mono font-medium ${isLight ? 'text-black' : 'text-neutral-200'}`}>
                ${rcpt.amount.toFixed(2)}
              </span>
              <button
                onClick={() => handleDeleteReceipt(rcpt.id)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
