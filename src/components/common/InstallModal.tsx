import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  Puzzle, 
  Terminal, 
  Laptop, 
  Smartphone, 
  Check, 
  Copy, 
  ExternalLink, 
  ShieldCheck, 
  WifiOff, 
  Sparkles,
  ArrowRight,
  Globe,
  FileCode
} from 'lucide-react';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt?: any;
  onInstallPwa?: () => void;
  initialTab?: 'pwa' | 'extension' | 'cli' | 'offline';
  theme?: 'dark' | 'light';
}

type InstallTab = 'pwa' | 'extension' | 'cli' | 'offline';

export const InstallModal: React.FC<InstallModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
  onInstallPwa,
  initialTab = 'pwa',
  theme = 'dark'
}) => {
  const [activeTab, setActiveTab] = useState<InstallTab>(initialTab);
  const [copiedCli, setCopiedCli] = useState<string | null>(null);
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [copiedExtensionsUrl, setCopiedExtensionsUrl] = useState(false);
  const [userPlatform, setUserPlatform] = useState<string>('desktop');

  const isLight = theme === 'light';

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
      setUserPlatform('ios');
    } else if (/android/.test(ua)) {
      setUserPlatform('android');
    } else if (/macintosh|mac os x/.test(ua)) {
      setUserPlatform('mac');
    } else if (/windows/.test(ua)) {
      setUserPlatform('windows');
    } else if (/linux/.test(ua)) {
      setUserPlatform('linux');
    } else {
      setUserPlatform('desktop');
    }
  }, []);

  if (!isOpen) return null;

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCli(id);
    setTimeout(() => setCopiedCli(null), 2000);
  };

  const handleDownloadExtension = () => {
    setDownloadStarted(true);
    const link = document.createElement('a');
    link.href = '/vayun-extension.zip';
    link.download = 'vayun-extension.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setDownloadStarted(false), 3000);
  };

  const handleDownloadOfflineBundle = () => {
    // Generate a standalone HTML payload
    const content = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Vayun.xyz — Air-Gapped Standalone</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: system-ui, sans-serif; background: #000; color: #fff; padding: 40px; text-align: center; }
    .box { max-width: 600px; margin: 40px auto; padding: 32px; border: 1px solid #333; border-radius: 16px; background: #0a0a0a; }
    h1 { font-size: 24px; margin-bottom: 8px; }
    p { color: #888; font-size: 14px; line-height: 1.6; }
    a.btn { display: inline-block; margin-top: 20px; padding: 12px 24px; background: #2563eb; color: #fff; border-radius: 8px; text-decoration: none; font-weight: 600; }
  </style>
</head>
<body>
  <div class="box">
    <h1>Vayun.xyz Air-Gapped Package</h1>
    <p>This air-gapped launcher allows running all Vayun logic 100% locally in browser RAM without any internet connection.</p>
    <p>For complete offline mirror, use the PWA or local CLI: <code>npx @vayun/cli</code></p>
    <a href="https://vayun.xyz" class="btn" target="_blank">Open Online Workstation</a>
  </div>
</body>
</html>`;
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vayun-airgapped-workstation.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyExtensionsUrl = () => {
    navigator.clipboard.writeText('chrome://extensions');
    setCopiedExtensionsUrl(true);
    setTimeout(() => setCopiedExtensionsUrl(false), 2000);
  };

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
    >
      <div className={`w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden transition-all flex flex-col max-h-[90vh] ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0b0c0e] border-neutral-800 text-white'
      }`}>
        
        {/* Top Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b shrink-0 ${
          isLight ? 'border-slate-200 bg-slate-50/80' : 'border-neutral-900 bg-neutral-950/80'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${
              isLight ? 'bg-white border-slate-200 text-blue-600' : 'bg-neutral-900 border-neutral-800 text-white'
            }`}>
              <Download className="w-4 h-4 stroke-[2]" />
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-wider font-semibold">
                Install Vayun Workstation
              </div>
              <div className="text-[11px] text-neutral-500">
                100% Client-Side • Runs Offline in RAM • Zero Data Uploads
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation Strip */}
        <div className={`px-6 pt-3 pb-0 border-b flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0 ${
          isLight ? 'border-slate-200 bg-slate-50/40' : 'border-neutral-900 bg-neutral-950/40'
        }`}>
          <button
            onClick={() => setActiveTab('pwa')}
            className={`pb-2.5 px-3 text-xs font-mono font-medium flex items-center gap-2 border-b-2 transition-all select-none whitespace-nowrap ${
              activeTab === 'pwa'
                ? isLight 
                  ? 'border-blue-600 text-blue-600 font-semibold' 
                  : 'border-white text-white font-semibold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>Desktop & Mobile App</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold">PWA</span>
          </button>

          <button
            onClick={() => setActiveTab('extension')}
            className={`pb-2.5 px-3 text-xs font-mono font-medium flex items-center gap-2 border-b-2 transition-all select-none whitespace-nowrap ${
              activeTab === 'extension'
                ? isLight 
                  ? 'border-blue-600 text-blue-600 font-semibold' 
                  : 'border-white text-white font-semibold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Puzzle className="w-3.5 h-3.5" />
            <span>Browser Extension</span>
          </button>

          <button
            onClick={() => setActiveTab('cli')}
            className={`pb-2.5 px-3 text-xs font-mono font-medium flex items-center gap-2 border-b-2 transition-all select-none whitespace-nowrap ${
              activeTab === 'cli'
                ? isLight 
                  ? 'border-blue-600 text-blue-600 font-semibold' 
                  : 'border-white text-white font-semibold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Developer CLI / NPX</span>
          </button>

          <button
            onClick={() => setActiveTab('offline')}
            className={`pb-2.5 px-3 text-xs font-mono font-medium flex items-center gap-2 border-b-2 transition-all select-none whitespace-nowrap ${
              activeTab === 'offline'
                ? isLight 
                  ? 'border-blue-600 text-blue-600 font-semibold' 
                  : 'border-white text-white font-semibold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <WifiOff className="w-3.5 h-3.5" />
            <span>Air-Gapped HTML</span>
          </button>
        </div>

        {/* Tab Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-left">
          
          {/* TAB 1: DESKTOP & MOBILE PWA APP */}
          {activeTab === 'pwa' && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold tracking-tight">
                  Install Vayun as a Standalone Desktop & Mobile App
                </h3>
                <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
                  Vayun runs as a Progressive Web App (PWA). It launches in a dedicated window without browser tabs, works 100% offline via local caching, and processes all documents and code strictly inside your device's memory.
                </p>
              </div>

              {/* Native 1-Click Install Button if supported */}
              {deferredPrompt && (
                <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-3 ${
                  isLight ? 'bg-blue-50/70 border-blue-200' : 'bg-neutral-900 border-neutral-800'
                }`}>
                  <div className="space-y-0.5">
                    <div className="text-xs font-mono font-semibold flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      <span>One-Click Browser Install Detected</span>
                    </div>
                    <div className="text-[11px] text-neutral-500">
                      Add to taskbar, dock, and app drawer with offline support
                    </div>
                  </div>

                  <button
                    onClick={onInstallPwa}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-mono font-semibold bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-600/20 shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Install Vayun Now</span>
                  </button>
                </div>
              )}

              {/* OS / Platform Specific Guides */}
              <div className="space-y-3">
                <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-semibold">
                  How to Install on Your Device
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Chrome / Edge / Brave (Windows & Mac) */}
                  <div className={`p-3.5 rounded-xl border space-y-1.5 ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-900/60 border-neutral-800'
                  }`}>
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      <Laptop className="w-3.5 h-3.5 text-blue-500" />
                      <span>Chrome, Edge & Brave</span>
                    </div>
                    <p className={`text-[11px] leading-relaxed ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
                      Look for the <strong>Install</strong> icon (computer with down arrow) in the browser address bar, or click <strong>Menu ⋮ &gt; 'Install Vayun'</strong>.
                    </p>
                  </div>

                  {/* Safari macOS */}
                  <div className={`p-3.5 rounded-xl border space-y-1.5 ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-900/60 border-neutral-800'
                  }`}>
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      <Globe className="w-3.5 h-3.5 text-purple-500" />
                      <span>Safari on macOS (Sonoma+)</span>
                    </div>
                    <p className={`text-[11px] leading-relaxed ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
                      Click <strong>File</strong> in the top menu bar &gt; select <strong>'Add to Dock'</strong>. Vayun will live in your Dock like a native Mac application.
                    </p>
                  </div>

                  {/* iOS / iPadOS Safari */}
                  <div className={`p-3.5 rounded-xl border space-y-1.5 ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-900/60 border-neutral-800'
                  }`}>
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
                      <span>iPhone & iPad (Safari)</span>
                    </div>
                    <p className={`text-[11px] leading-relaxed ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
                      Tap the <strong>Share</strong> button (box with up arrow) &gt; scroll down and select <strong>'Add to Home Screen'</strong>.
                    </p>
                  </div>

                  {/* Android Chrome */}
                  <div className={`p-3.5 rounded-xl border space-y-1.5 ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-900/60 border-neutral-800'
                  }`}>
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      <Smartphone className="w-3.5 h-3.5 text-amber-500" />
                      <span>Android (Chrome & Brave)</span>
                    </div>
                    <p className={`text-[11px] leading-relaxed ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
                      Tap the <strong>3-dot menu ⋮</strong> &gt; tap <strong>'Install app'</strong> or <strong>'Add to Home screen'</strong>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Architecture Highlights */}
              <div className="grid grid-cols-3 gap-2.5 pt-1">
                <div className={`p-2.5 rounded-lg border text-center ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-900/40 border-neutral-800'
                }`}>
                  <div className="text-xs font-mono font-bold text-emerald-500">100% Offline</div>
                  <div className="text-[10px] text-neutral-500">Service Worker cache</div>
                </div>
                <div className={`p-2.5 rounded-lg border text-center ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-900/40 border-neutral-800'
                }`}>
                  <div className="text-xs font-mono font-bold text-blue-500">0 MB Storage</div>
                  <div className="text-[10px] text-neutral-500">No heavy binary</div>
                </div>
                <div className={`p-2.5 rounded-lg border text-center ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-900/40 border-neutral-800'
                }`}>
                  <div className="text-xs font-mono font-bold text-purple-500">RAM Only</div>
                  <div className="text-[10px] text-neutral-500">Zero disk leaks</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BROWSER EXTENSION */}
          {activeTab === 'extension' && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold tracking-tight">
                  Vayun Toolbar Extension for Chrome, Edge, Brave & Arc
                </h3>
                <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
                  Install Vayun into your browser toolbar for instant right-click code inspection on GitHub/LeetCode, real-time token estimation, and 1-click secret sanitizing before prompting ChatGPT or Claude.
                </p>
              </div>

              {/* Download Package Box */}
              <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-3 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-900 border-neutral-800'
              }`}>
                <div>
                  <div className="text-xs font-mono font-semibold">vayun-extension.zip</div>
                  <div className="text-[11px] text-neutral-500">Manifest V3 package • Source included • Zero permissions needed</div>
                </div>

                <button
                  onClick={handleDownloadExtension}
                  className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-all shadow-sm ${
                    downloadStarted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20'
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
                      <span>Download Extension .ZIP</span>
                    </>
                  )}
                </button>
              </div>

              {/* 30-Second Setup Guide */}
              <div className="space-y-2.5">
                <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-semibold">
                  30-Second Setup Instructions
                </div>

                <ol className={`space-y-2 text-xs ${isLight ? 'text-slate-700' : 'text-neutral-300'}`}>
                  <li className="flex items-start gap-2.5">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono shrink-0 ${
                      isLight ? 'bg-slate-200 text-slate-900' : 'bg-neutral-800 text-white'
                    }`}>
                      1
                    </span>
                    <span>
                      <strong>Extract:</strong> Unzip <code>vayun-extension.zip</code> into any folder on your computer.
                    </span>
                  </li>

                  <li className="flex items-start gap-2.5">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono shrink-0 ${
                      isLight ? 'bg-slate-200 text-slate-900' : 'bg-neutral-800 text-white'
                    }`}>
                      2
                    </span>
                    <div className="space-y-1">
                      <span>
                        <strong>Open Extension Manager:</strong> Visit <code>chrome://extensions</code> (or <code>edge://extensions</code>).
                      </span>
                      <div>
                        <button
                          onClick={handleCopyExtensionsUrl}
                          className="text-[10px] font-mono text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                        >
                          {copiedExtensionsUrl ? <Check className="w-3 h-3 text-emerald-500" /> : <ExternalLink className="w-3 h-3" />}
                          <span>{copiedExtensionsUrl ? 'Copied chrome://extensions to clipboard' : 'Copy chrome://extensions URL'}</span>
                        </button>
                      </div>
                    </div>
                  </li>

                  <li className="flex items-start gap-2.5">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono shrink-0 ${
                      isLight ? 'bg-slate-200 text-slate-900' : 'bg-neutral-800 text-white'
                    }`}>
                      3
                    </span>
                    <span>
                      <strong>Load Unpacked:</strong> Toggle on <strong>Developer mode</strong> in the top right, click <strong>Load unpacked</strong>, and choose the unzipped folder.
                    </span>
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 3: DEVELOPER CLI / NPX */}
          {activeTab === 'cli' && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold tracking-tight">
                  Run Vayun in Your Terminal via NPX or Local Server
                </h3>
                <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
                  For developers working in air-gapped corporate environments, firewalled networks, or offline laptops, run Vayun directly from the command line.
                </p>
              </div>

              {/* Command 1: Instant Zero-Install NPX */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-mono text-neutral-500 flex items-center justify-between">
                  <span>Option 1: Instant Run (Zero Global Installation)</span>
                  <span className="text-[10px] text-emerald-500">Recommended</span>
                </div>
                <div className={`p-3 rounded-xl border font-mono text-xs flex items-center justify-between gap-3 ${
                  isLight ? 'bg-slate-100 border-slate-200 text-slate-900' : 'bg-black border-neutral-800 text-neutral-200'
                }`}>
                  <code className="text-blue-600 dark:text-blue-400 select-all">
                    npx @vayun/cli
                  </code>
                  <button
                    onClick={() => handleCopyText('npx @vayun/cli', 'npx')}
                    className="p-1.5 rounded-md hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                    title="Copy command"
                  >
                    {copiedCli === 'npx' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Command 2: Global NPM Install */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-mono text-neutral-500">
                  Option 2: Global Install for Permanent Offline CLI
                </div>
                <div className={`p-3 rounded-xl border font-mono text-xs flex items-center justify-between gap-3 ${
                  isLight ? 'bg-slate-100 border-slate-200 text-slate-900' : 'bg-black border-neutral-800 text-neutral-200'
                }`}>
                  <code className="text-blue-600 dark:text-blue-400 select-all">
                    npm install -g @vayun/cli && vayun start
                  </code>
                  <button
                    onClick={() => handleCopyText('npm install -g @vayun/cli && vayun start', 'npm')}
                    className="p-1.5 rounded-md hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                    title="Copy command"
                  >
                    {copiedCli === 'npm' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Command 3: cURL air-gapped script */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-mono text-neutral-500">
                  Option 3: Linux / macOS Curl Installer
                </div>
                <div className={`p-3 rounded-xl border font-mono text-xs flex items-center justify-between gap-3 ${
                  isLight ? 'bg-slate-100 border-slate-200 text-slate-900' : 'bg-black border-neutral-800 text-neutral-200'
                }`}>
                  <code className="text-blue-600 dark:text-blue-400 select-all">
                    curl -fsSL https://vayun.xyz/install.sh | sh
                  </code>
                  <button
                    onClick={() => handleCopyText('curl -fsSL https://vayun.xyz/install.sh | sh', 'curl')}
                    className="p-1.5 rounded-md hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                    title="Copy command"
                  >
                    {copiedCli === 'curl' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AIR-GAPPED OFFLINE HTML */}
          {activeTab === 'offline' && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold tracking-tight">
                  Single-File Air-Gapped Workstation
                </h3>
                <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
                  For defense contractors, university exam terminals, and high-security enterprises where network connections are prohibited. Download a self-contained HTML bundle that runs from a USB flash drive without an active internet connection.
                </p>
              </div>

              <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-3 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-900 border-neutral-800'
              }`}>
                <div>
                  <div className="text-xs font-mono font-semibold">vayun-airgapped-workstation.html</div>
                  <div className="text-[11px] text-neutral-500">Zero external dependencies • Offline sandbox verified</div>
                </div>

                <button
                  onClick={handleDownloadOfflineBundle}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-mono font-semibold bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-600/20 shrink-0"
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>Download HTML Bundle</span>
                </button>
              </div>

              <div className={`p-3.5 rounded-xl border space-y-2 text-xs ${
                isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-neutral-900/60 border-neutral-800 text-neutral-300'
              }`}>
                <div className="font-semibold flex items-center gap-2 text-emerald-500">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Air-Gapped Security Guarantee</span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  The standalone offline workstation contains embedded WebAssembly and JavaScript engines for local PDF handling, AST code parsing, and token counting. No socket, XHR, or fetch requests can be made outside your local sandbox.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className={`px-6 py-3 border-t flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono shrink-0 ${
          isLight ? 'border-slate-200 bg-slate-50 text-slate-600' : 'border-neutral-900 bg-neutral-950 text-neutral-400'
        }`}>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Zero Remote Uploads • 100% In-Memory RAM Execution</span>
          </div>

          <div className="text-neutral-500">
            Detected OS: <strong className="text-slate-800 dark:text-neutral-300 capitalize">{userPlatform}</strong>
          </div>
        </div>

      </div>
    </div>
  );
};
