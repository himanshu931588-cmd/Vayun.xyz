import React, { useState } from 'react';
import { X, ExternalLink, Copy, Check, Heart, Coffee } from 'lucide-react';
import qrImage from '../../assets/buymeacoffee-qr.png';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: 'dark' | 'light';
}

export const SupportModal: React.FC<SupportModalProps> = ({
  isOpen,
  onClose,
  theme = 'dark'
}) => {
  const [copied, setCopied] = useState(false);
  const isLight = theme === 'light';
  const supportUrl = 'https://buymeacoffee.com/himanshu.mishra1185';

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(supportUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
    >
      <div className={`w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden transition-all ${
        isLight ? 'bg-white border-neutral-300 text-black' : 'bg-[#0f0f10] border-neutral-800 text-white'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          isLight ? 'border-neutral-200 bg-neutral-50/70' : 'border-neutral-900 bg-neutral-950/70'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${
              isLight ? 'bg-white border-neutral-200 text-black' : 'bg-black border-neutral-800 text-white'
            }`}>
              <Coffee className="w-4 h-4 stroke-[2]" />
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-wider font-semibold">
                Support Vayun.xyz
              </div>
              <div className="text-[11px] text-neutral-500">
                Independent & Privacy-First
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col items-center text-center space-y-5">
          <p className={`text-xs leading-relaxed max-w-sm ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
            Vayun.xyz runs with <strong>zero remote uploads, zero tracking, no accounts, and no paywalls</strong>. If these in-browser tools save you time or help your studies, consider supporting continuous development and hosting.
          </p>

          {/* QR Code Container */}
          <div className="p-3 rounded-2xl bg-white border border-neutral-200 shadow-md flex flex-col items-center">
            <img 
              src={qrImage} 
              alt="Buy Me a Coffee QR Code - himanshu.mishra1185" 
              className="w-52 h-52 object-contain rounded-xl"
            />
            <span className="text-[10px] font-mono text-neutral-500 mt-2">
              Scan with camera or UPI / payment app
            </span>
          </div>

          {/* Direct Link & Copy Actions */}
          <div className="w-full space-y-2 pt-1">
            <a
              href={supportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-mono font-medium flex items-center justify-center gap-2 transition-all shadow-sm ${
                isLight 
                  ? 'bg-black text-white hover:bg-neutral-800' 
                  : 'bg-white text-black hover:bg-neutral-200'
              }`}
            >
              <span>buymeacoffee.com/himanshu.mishra1185</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={handleCopy}
              className={`w-full py-2 px-4 rounded-xl text-xs font-mono flex items-center justify-center gap-2 border transition-all ${
                isLight 
                  ? 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100' 
                  : 'border-neutral-800 bg-neutral-900/60 text-neutral-300 hover:bg-neutral-900'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Link Copied to Clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Support Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className={`px-6 py-3 border-t text-[11px] font-mono text-center ${
          isLight ? 'border-neutral-200 bg-neutral-50 text-neutral-500' : 'border-neutral-900 bg-neutral-950 text-neutral-500'
        }`}>
          Every contribution directly supports server maintenance and open tools.
        </div>
      </div>
    </div>
  );
};

export default SupportModal;
