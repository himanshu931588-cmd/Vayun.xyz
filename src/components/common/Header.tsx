import React, { useState } from 'react';
import { ToolCategory, ToolId } from '../../types';
import { VayunLogo } from './VayunLogo';
import { VayunWordmark } from './VayunWordmark';
import { 
  Sun, 
  Moon, 
  Search, 
  LayoutGrid, 
  FileText, 
  BrainCircuit, 
  Receipt, 
  Table,
  Menu,
  X,
  Network,
  Puzzle,
  LifeBuoy,
  Key,
  Coffee,
  ShieldCheck,
  Download
} from 'lucide-react';
import { getStoredApiKey } from '../../utils/geminiApi';

interface HeaderProps {
  currentTool: ToolId;
  onSelectTool: (id: ToolId) => void;
  selectedCategory: ToolCategory | 'all';
  onSelectCategory: (cat: ToolCategory | 'all') => void;
  savedTokensTotal?: number;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenCommandPalette: () => void;
  onOpenSecurityAuditor?: () => void;
  onOpenShortcuts?: () => void;
  onOpenApiSettings?: () => void;
  onOpenSupport?: () => void;
  onOpenExtension?: () => void;
  onOpenHelpdesk?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTool,
  onSelectTool,
  selectedCategory,
  onSelectCategory,
  theme,
  onToggleTheme,
  onOpenCommandPalette,
  onOpenSecurityAuditor,
  onOpenApiSettings,
  onOpenSupport,
  onOpenExtension,
  onOpenHelpdesk
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isLight = theme === 'light';
  const hasApiKey = Boolean(getStoredApiKey());

  const isDeveloperTool = 
    selectedCategory === 'developer' || 
    currentTool === 'vayun-flow' || 
    currentTool === 'vayun-viva' || 
    currentTool === 'vayun-break' || 
    currentTool === 'vayun-spec' ||
    currentTool === 'ai-smells-radar' ||
    currentTool === 'viva-defense-badge' ||
    currentTool === 'chaos-wind-tunnel';

  const isPdfTool =
    selectedCategory === 'pdf' || 
    currentTool === 'merge-pdf' || 
    currentTool === 'split-pdf' || 
    currentTool === 'compress-pdf' || 
    currentTool === 'image-to-pdf' || 
    currentTool === 'resume-builder';

  const isAiTool =
    selectedCategory === 'ai' || 
    currentTool === 'thread-rescuer' || 
    currentTool === 'token-slimmer' || 
    currentTool === 'prompt-sanitizer' ||
    currentTool === 'secret-detonator' ||
    currentTool === 'webgpu-brain';

  const isBillingTool =
    selectedCategory === 'billing' || 
    currentTool === 'invoice-maker' || 
    currentTool === 'paylink-view' || 
    currentTool === 'receipt-matcher';

  const isTabularTool =
    selectedCategory === 'tabular' || 
    currentTool === 'clean-csv' || 
    currentTool === 'preserve-zeros' || 
    currentTool === 'table-converter';

  return (
    <header className={`sticky top-0 z-40 w-full transition-colors ${
      isLight ? 'bg-white/90 border-b border-slate-200/80 shadow-xs' : 'bg-black/95 border-b border-neutral-800'
    } backdrop-blur-md`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 gap-4">
          
          {/* Left: Brand Wordmark & Streamlined Navigation */}
          <div className="flex items-center gap-5 lg:gap-6 min-w-0">
            {/* Clean Brand Mark */}
            <div 
              onClick={() => {
                onSelectTool('home');
                onSelectCategory('all');
              }}
              className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0 pr-1 transition-transform active:scale-98"
              title="Vayun.xyz Home"
            >
              <VayunLogo size={26} className="transition-transform group-hover:scale-105 shrink-0" />
              <VayunWordmark height={22} theme={theme} className="shrink-0" />
            </div>

            {/* Streamlined Navigation Tabs (Clean, uncluttered, balanced) */}
            <nav className="hidden md:flex items-center gap-1 text-xs shrink-0 font-medium">
              <button
                onClick={() => {
                  onSelectTool('home');
                  onSelectCategory('all');
                }}
                className={`h-8 px-2.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 select-none active:scale-95 group ${
                  currentTool === 'home' && selectedCategory === 'all'
                    ? isLight ? 'text-blue-700 font-semibold bg-blue-50/80 border border-blue-200/50' : 'text-white font-semibold bg-neutral-900 border border-neutral-800'
                    : isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70' : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity" />
                <span>Overview</span>
              </button>

              <button
                onClick={() => {
                  onSelectTool('vayun-flow');
                  onSelectCategory('developer');
                }}
                className={`h-8 px-2.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 select-none active:scale-95 group ${
                  isDeveloperTool
                    ? isLight ? 'text-blue-700 font-semibold bg-blue-50/80 border border-blue-200/50' : 'text-white font-semibold bg-neutral-900 border border-neutral-800'
                    : isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70' : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
                }`}
              >
                <Network className="w-3.5 h-3.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity" />
                <span>Flow</span>
              </button>

              <button
                onClick={() => {
                  onSelectTool('merge-pdf');
                  onSelectCategory('pdf');
                }}
                className={`h-8 px-2.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 select-none active:scale-95 group ${
                  isPdfTool
                    ? isLight ? 'text-blue-700 font-semibold bg-blue-50/80 border border-blue-200/50' : 'text-white font-semibold bg-neutral-900 border border-neutral-800'
                    : isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70' : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
                }`}
              >
                <FileText className="w-3.5 h-3.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity" />
                <span>PDF</span>
              </button>

              <button
                onClick={() => {
                  onSelectTool('thread-rescuer');
                  onSelectCategory('ai');
                }}
                className={`h-8 px-2.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 select-none active:scale-95 group ${
                  isAiTool
                    ? isLight ? 'text-blue-700 font-semibold bg-blue-50/80 border border-blue-200/50' : 'text-white font-semibold bg-neutral-900 border border-neutral-800'
                    : isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70' : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
                }`}
              >
                <BrainCircuit className="w-3.5 h-3.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity" />
                <span>AI</span>
              </button>

              <button
                onClick={() => {
                  onSelectTool('invoice-maker');
                  onSelectCategory('billing');
                }}
                className={`h-8 px-2.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 select-none active:scale-95 group ${
                  isBillingTool
                    ? isLight ? 'text-blue-700 font-semibold bg-blue-50/80 border border-blue-200/50' : 'text-white font-semibold bg-neutral-900 border border-neutral-800'
                    : isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70' : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
                }`}
              >
                <Receipt className="w-3.5 h-3.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity" />
                <span>Invoicing</span>
              </button>

              <button
                onClick={() => {
                  onSelectTool('clean-csv');
                  onSelectCategory('tabular');
                }}
                className={`h-8 px-2.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 select-none active:scale-95 group ${
                  isTabularTool
                    ? isLight ? 'text-blue-700 font-semibold bg-blue-50/80 border border-blue-200/50' : 'text-white font-semibold bg-neutral-900 border border-neutral-800'
                    : isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70' : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
                }`}
              >
                <Table className="w-3.5 h-3.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity" />
                <span>Tabular</span>
              </button>
            </nav>
          </div>

          {/* Right: Clean, Balanced Action Controls (Zero overflow, perfectly proportioned) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Quick Search Spotlight (⌘K) */}
            <button
              onClick={onOpenCommandPalette}
              title="Search tools or commands (⌘K)"
              className={`h-8 px-2.5 rounded-lg border text-xs font-mono flex items-center gap-2 transition-all active:scale-95 group ${
                isLight 
                  ? 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-xs' 
                  : 'border-neutral-800 bg-neutral-900/70 text-neutral-300 hover:bg-neutral-850 hover:border-neutral-700'
              }`}
            >
              <Search className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity shrink-0" />
              <span className="hidden sm:inline text-xs">Search</span>
              <kbd className={`px-1 py-0.2 rounded text-[10px] font-mono border ${
                isLight 
                  ? 'border-slate-200 bg-slate-100 text-slate-600' 
                  : 'border-neutral-700 bg-neutral-950 text-neutral-400'
              }`}>
                ⌘K
              </kbd>
            </button>

            {/* Install Quick Access Button (Desktop App, Extension, CLI) */}
            {onOpenExtension && (
              <button
                onClick={onOpenExtension}
                title="Install Vayun (Desktop App, Extension, Terminal CLI)"
                className={`h-8 px-2.5 rounded-lg border text-xs font-mono hidden sm:inline-flex items-center gap-1.5 transition-all select-none active:scale-95 group ${
                  isLight 
                    ? 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-xs' 
                    : 'border-neutral-800 bg-neutral-900/70 text-neutral-300 hover:text-white hover:bg-neutral-850 hover:border-neutral-700'
                }`}
              >
                <Download className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity shrink-0" />
                <span className="hidden lg:inline">Install</span>
              </button>
            )}

            {/* Theme Toggle Button (Dark / Light) */}
            <button
              onClick={onToggleTheme}
              title={`Switch to ${isLight ? 'Dark' : 'Light'} Mode (D)`}
              className={`h-8 w-8 rounded-lg border flex items-center justify-center transition-all select-none active:scale-95 group ${
                isLight 
                  ? 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-xs' 
                  : 'border-neutral-800 bg-neutral-900/70 text-neutral-400 hover:text-white hover:bg-neutral-850 hover:border-neutral-700'
              }`}
              aria-label="Toggle Theme"
            >
              {isLight ? (
                <Moon className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:rotate-12 text-slate-700" />
              ) : (
                <Sun className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:rotate-45 text-neutral-300 group-hover:text-white" />
              )}
            </button>

            {/* Mobile / Tablet Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
              className={`h-8 w-8 rounded-lg border transition-all md:hidden flex items-center justify-center active:scale-95 ${
                isLight 
                  ? 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50' 
                  : 'border-neutral-800 bg-neutral-900/70 text-neutral-300 hover:bg-neutral-850'
              }`}
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4 shrink-0" /> : <Menu className="w-4 h-4 shrink-0" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-down Navigation Menu */}
      {isMobileMenuOpen && (
        <div className={`md:hidden border-b px-4 py-4 space-y-3 transition-colors ${
          isLight ? 'bg-white border-neutral-200 text-black' : 'bg-black border-neutral-900 text-white'
        }`}>
          <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-semibold px-1">
            Workstation Suites
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => {
                onSelectTool('home');
                onSelectCategory('all');
                setIsMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition-all ${
                currentTool === 'home' && selectedCategory === 'all'
                  ? isLight ? 'bg-black text-white border-black' : 'bg-white text-black border-white'
                  : isLight ? 'border-neutral-200 hover:bg-neutral-100' : 'border-neutral-800 hover:bg-neutral-900'
              }`}
            >
              <LayoutGrid className="w-4 h-4 shrink-0" />
              <div>
                <div className="font-semibold">Overview</div>
                <div className="text-[10px] opacity-70">All tools</div>
              </div>
            </button>

            <button
              onClick={() => {
                onSelectTool('vayun-flow');
                onSelectCategory('developer');
                setIsMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition-all ${
                isDeveloperTool
                  ? isLight ? 'bg-black text-white border-black' : 'bg-white text-black border-white'
                  : isLight ? 'border-neutral-200 hover:bg-neutral-100' : 'border-neutral-800 hover:bg-neutral-900'
              }`}
            >
              <Network className="w-4 h-4 opacity-80 shrink-0" />
              <div>
                <div className="font-semibold">Developer Flow</div>
                <div className="text-[10px] opacity-70">Flow & Viva</div>
              </div>
            </button>

            <button
              onClick={() => {
                onSelectTool('merge-pdf');
                onSelectCategory('pdf');
                setIsMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition-all ${
                isPdfTool
                  ? isLight ? 'bg-black text-white border-black' : 'bg-white text-black border-white'
                  : isLight ? 'border-neutral-200 hover:bg-neutral-100' : 'border-neutral-800 hover:bg-neutral-900'
              }`}
            >
              <FileText className="w-4 h-4 opacity-80 shrink-0" />
              <div>
                <div className="font-semibold">PDF Suite</div>
                <div className="text-[10px] opacity-70">Split & Merge</div>
              </div>
            </button>

            <button
              onClick={() => {
                onSelectTool('thread-rescuer');
                onSelectCategory('ai');
                setIsMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition-all ${
                isAiTool
                  ? isLight ? 'bg-black text-white border-black' : 'bg-white text-black border-white'
                  : isLight ? 'border-neutral-200 hover:bg-neutral-100' : 'border-neutral-800 hover:bg-neutral-900'
              }`}
            >
              <BrainCircuit className="w-4 h-4 opacity-80 shrink-0" />
              <div>
                <div className="font-semibold">AI Context</div>
                <div className="text-[10px] opacity-70">Tokens & Prompt</div>
              </div>
            </button>

            <button
              onClick={() => {
                onSelectTool('invoice-maker');
                onSelectCategory('billing');
                setIsMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition-all ${
                isBillingTool
                  ? isLight ? 'bg-black text-white border-black' : 'bg-white text-black border-white'
                  : isLight ? 'border-neutral-200 hover:bg-neutral-100' : 'border-neutral-800 hover:bg-neutral-900'
              }`}
            >
              <Receipt className="w-4 h-4 opacity-80 shrink-0" />
              <div>
                <div className="font-semibold">Invoicing</div>
                <div className="text-[10px] opacity-70">Invoices & PayLinks</div>
              </div>
            </button>

            <button
              onClick={() => {
                onSelectTool('clean-csv');
                onSelectCategory('tabular');
                setIsMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition-all ${
                isTabularTool
                  ? isLight ? 'bg-black text-white border-black' : 'bg-white text-black border-white'
                  : isLight ? 'border-neutral-200 hover:bg-neutral-100' : 'border-neutral-800 hover:bg-neutral-900'
              }`}
            >
              <Table className="w-4 h-4 opacity-80 shrink-0" />
              <div>
                <div className="font-semibold">Tabular</div>
                <div className="text-[10px] opacity-70">CSV & Tables</div>
              </div>
            </button>
          </div>

          <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-semibold px-1 pt-2">
            Utilities & Integrations
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {onOpenApiSettings && (
              <button
                onClick={() => {
                  onOpenApiSettings();
                  setIsMobileMenuOpen(false);
                }}
                className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition-all ${
                  isLight ? 'border-neutral-200 hover:bg-neutral-100' : 'border-neutral-800 hover:bg-neutral-900'
                }`}
              >
                <Key className="w-4 h-4 opacity-80 shrink-0" />
                <div>
                  <div className="font-semibold">API Key</div>
                  <div className="text-[10px] opacity-70">{hasApiKey ? 'Connected' : 'Configure'}</div>
                </div>
              </button>
            )}

            {onOpenExtension && (
              <button
                onClick={() => {
                  onOpenExtension();
                  setIsMobileMenuOpen(false);
                }}
                className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition-all ${
                  isLight ? 'border-neutral-200 hover:bg-neutral-100' : 'border-neutral-800 hover:bg-neutral-900'
                }`}
              >
                <Download className="w-4 h-4 opacity-80 shrink-0" />
                <div>
                  <div className="font-semibold">Install Vayun</div>
                  <div className="text-[10px] opacity-70">Desktop PWA, Extension & CLI</div>
                </div>
              </button>
            )}

            {onOpenHelpdesk && (
              <button
                onClick={() => {
                  onOpenHelpdesk();
                  setIsMobileMenuOpen(false);
                }}
                className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition-all ${
                  isLight ? 'border-neutral-200 hover:bg-neutral-100' : 'border-neutral-800 hover:bg-neutral-900'
                }`}
              >
                <LifeBuoy className="w-4 h-4 opacity-80 shrink-0" />
                <div>
                  <div className="font-semibold">Helpdesk</div>
                  <div className="text-[10px] opacity-70">FAQ & Diagnostics</div>
                </div>
              </button>
            )}

            {onOpenSupport && (
              <button
                onClick={() => {
                  onOpenSupport();
                  setIsMobileMenuOpen(false);
                }}
                className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition-all ${
                  isLight ? 'border-neutral-200 hover:bg-neutral-100' : 'border-neutral-800 hover:bg-neutral-900'
                }`}
              >
                <Coffee className="w-4 h-4 opacity-80 shrink-0" />
                <div>
                  <div className="font-semibold">Support</div>
                  <div className="text-[10px] opacity-70">Buy Me a Coffee</div>
                </div>
              </button>
            )}

            {onOpenSecurityAuditor && (
              <button
                onClick={() => {
                  onOpenSecurityAuditor();
                  setIsMobileMenuOpen(false);
                }}
                className={`col-span-2 p-2.5 rounded-lg border text-left flex items-center gap-2 transition-all ${
                  isLight ? 'border-neutral-200 hover:bg-neutral-100' : 'border-neutral-800 hover:bg-neutral-900'
                }`}
              >
                <ShieldCheck className="w-4 h-4 opacity-80 shrink-0" />
                <div>
                  <div className="font-semibold">Zero-Upload RAM Security Guarantee</div>
                  <div className="text-[10px] opacity-70">100% Client-side execution audit</div>
                </div>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
