import React from 'react';
import { X, Check } from 'lucide-react';
import { VayunLogo } from './VayunLogo';

interface ProPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: 'dark' | 'light';
}

export const ProPassModal: React.FC<ProPassModalProps> = ({ isOpen, onClose, theme = 'dark' }) => {
  if (!isOpen) return null;
  const isLight = theme === 'light';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className={`relative w-full max-w-md border rounded-lg shadow-2xl overflow-hidden p-6 space-y-6 ${
        isLight ? 'bg-white border-neutral-300 text-neutral-900' : 'bg-[#0f0f0f] border-neutral-800 text-neutral-100'
      }`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <VayunLogo size={36} />
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase text-neutral-500">Vayun Pro</span>
              <h3 className="text-xl font-serif">Enhanced Capabilities</h3>
              <p className={`text-xs ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
                Dedicated features for teams and high-volume usage.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className={`space-y-3 text-xs ${isLight ? 'text-neutral-700' : 'text-neutral-300'}`}>
          <div className="flex items-start gap-2.5">
            <Check className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
            <span>Persistent team PayLinks with custom domains.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <Check className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
            <span>White-label invoice rendering with custom brand signatures.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <Check className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
            <span>Extended context chunking up to 500,000 tokens.</span>
          </div>
        </div>

        <div className={`pt-2 border-t flex items-center justify-between text-xs ${
          isLight ? 'border-neutral-200' : 'border-neutral-800'
        }`}>
          <div>
            <span className="font-semibold">$49</span>
            <span className="text-neutral-500"> / lifetime license</span>
          </div>
          <button
            onClick={() => {
              alert('All features are currently active in this build.');
              onClose();
            }}
            className={`px-4 py-2 font-medium rounded transition-colors ${
              isLight ? 'bg-black text-white hover:bg-neutral-800' : 'bg-white text-black hover:bg-neutral-200'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
