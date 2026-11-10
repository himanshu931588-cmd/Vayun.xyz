import React, { useState } from 'react';
import { X, Download, Puzzle, Check, ExternalLink, ShieldCheck, Terminal, Sparkles } from 'lucide-react';

interface ExtensionModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: 'dark' | 'light';
}

export const ExtensionModal: React.FC<ExtensionModalProps> = ({
  isOpen,
  onClose,
  theme = 'dark'
}) => {
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const isLight = theme === 'light';

  if (!isOpen) return null;

  const handleDownload = () => {
    setDownloadStarted(true);
    const link = document.createElement('a');
    link.href = '/vayun-extension.zip';
    link.download = 'vayun-extension.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setDownloadStarted(false), 3000);
  };

  const handleCopyExtensionsUrl = () => {
    navigator.clipboard.writeText('chrome://extensions');
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
    >
      <div className={`w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden transition-all ${
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
              <Puzzle className="w-4 h-4 stroke-[2]" />
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-wider font-semibold">
                Browser Extension
              </div>
              <div className="text-[11px] text-neutral-500">
                Manifest V3 • Chrome, Edge, Brave, Arc & Opera
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Key Value Proposition */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold tracking-tight">
              One-Click Developer Workstation Anywhere on the Web
            </h3>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
              Install Vayun into your browser toolbar for instant access to multi-file logic tracing, Socratic code defense, high-capacity PDF tools, and real-time token estimation with zero latency and zero remote data uploads.
            </p>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className={`p-3 rounded-xl border text-left ${
              isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-neutral-900/50 border-neutral-800'
            }`}>
              <div className="flex items-center gap-1.5 text-xs font-semibold mb-1">
                <Terminal className="w-3.5 h-3.5 text-emerald-500" />
                <span>Right-Click Code Inspect</span>
              </div>
              <p className={`text-[11px] leading-snug ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                Highlight any code block on GitHub, LeetCode, or StackOverflow and inspect immediately.
              </p>
            </div>

            <div className={`p-3 rounded-xl border text-left ${
              isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-neutral-900/50 border-neutral-800'
            }`}>
              <div className="flex items-center gap-1.5 text-xs font-semibold mb-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                <span>Instant Token Counter</span>
              </div>
              <p className={`text-[11px] leading-snug ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                Paste prompts or snippets directly in the toolbar popup for character, word, and token counts.
              </p>
            </div>

            <div className={`p-3 rounded-xl border text-left ${
              isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-neutral-900/50 border-neutral-800'
            }`}>
              <div className="flex items-center gap-1.5 text-xs font-semibold mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                <span>100% In-Browser Privacy</span>
              </div>
              <p className={`text-[11px] leading-snug ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                No telemetry, no remote servers, no tracking tokens, no external API calls.
              </p>
            </div>

            <div className={`p-3 rounded-xl border text-left ${
              isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-neutral-900/50 border-neutral-800'
            }`}>
              <div className="flex items-center gap-1.5 text-xs font-semibold mb-1">
                <Puzzle className="w-3.5 h-3.5 text-purple-500" />
                <span>Cross-Browser Ready</span>
              </div>
              <p className={`text-[11px] leading-snug ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                Compatible with Google Chrome, Microsoft Edge, Brave, Arc, Opera, and Chromium.
              </p>
            </div>
          </div>

          {/* Download Box */}
          <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-3 ${
            isLight ? 'bg-neutral-100/70 border-neutral-300' : 'bg-neutral-900 border-neutral-800'
          }`}>
            <div className="text-left w-full sm:w-auto">
              <div className="text-xs font-mono font-semibold">vayun-extension.zip</div>
              <div className="text-[11px] text-neutral-500">Manifest V3 package • Source included</div>
            </div>

            <button
              onClick={handleDownload}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-all shadow-sm ${
                downloadStarted
                  ? 'bg-emerald-600 text-white'
                  : isLight
                  ? 'bg-black text-white hover:bg-neutral-800'
                  : 'bg-white text-black hover:bg-neutral-200'
              }`}
            >
              {downloadStarted ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Downloaded</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Extension</span>
                </>
              )}
            </button>
          </div>

          {/* 3-Step Installation Guide */}
          <div className="text-left space-y-2.5">
            <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-semibold">
              Simple 30-Second Installation Steps
            </div>

            <ol className={`space-y-2 text-xs ${isLight ? 'text-neutral-700' : 'text-neutral-300'}`}>
              <li className="flex items-start gap-2.5">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono shrink-0 ${
                  isLight ? 'bg-neutral-200 text-black' : 'bg-neutral-800 text-white'
                }`}>
                  1
                </span>
                <span>
                  <strong>Extract the downloaded file:</strong> Unzip <code>vayun-extension.zip</code> into any folder on your computer.
                </span>
              </li>

              <li className="flex items-start gap-2.5">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono shrink-0 ${
                  isLight ? 'bg-neutral-200 text-black' : 'bg-neutral-800 text-white'
                }`}>
                  2
                </span>
                <div className="space-y-1">
                  <span>
                    <strong>Open your browser extension manager:</strong> Navigate to <code>chrome://extensions</code> (or <code>edge://extensions</code>).
                  </span>
                  <div>
                    <button
                      onClick={handleCopyExtensionsUrl}
                      className="text-[10px] font-mono text-neutral-500 hover:text-neutral-400 underline flex items-center gap-1"
                    >
                      {copiedUrl ? <Check className="w-3 h-3 text-emerald-500" /> : <ExternalLink className="w-3 h-3" />}
                      <span>{copiedUrl ? 'Copied chrome://extensions to clipboard' : 'Copy address to clipboard'}</span>
                    </button>
                  </div>
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono shrink-0 ${
                  isLight ? 'bg-neutral-200 text-black' : 'bg-neutral-800 text-white'
                }`}>
                  3
                </span>
                <span>
                  <strong>Enable Developer mode and Load:</strong> Turn on the <strong>Developer mode</strong> toggle in the top-right corner, click <strong>Load unpacked</strong>, and select the unzipped extension folder.
                </span>
              </li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className={`px-6 py-3 border-t text-center text-[11px] font-mono ${
          isLight ? 'border-neutral-200 bg-neutral-50 text-neutral-600' : 'border-neutral-900 bg-neutral-950 text-neutral-400'
        }`}>
          Zero remote uploads • Zero tracking • 100% Client-side RAM execution
        </div>
      </div>
    </div>
  );
};
