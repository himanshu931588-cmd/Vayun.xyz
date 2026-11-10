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
  Keyboard,
  ShieldCheck,
  Network,
  Key,
  Coffee
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
  onOpenShortcuts,
  onOpenApiSettings,
  onOpenSupport
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isLight = theme === 'light';
  const hasApiKey = Boolean(getStoredApiKey());

  const isDeveloperTool = 
    selectedCategory === 'developer' || 
    currentTool === 'vayun-flow' || 
    currentTool === 'vayun-viva' || 
    currentTool === 'vayun-break' || 
    currentTool === 'vayun-spec';

  return (
    <header className={`sticky top-0 z-40 w-full transition-colors ${
      isLight ? 'bg-white/95 border-b border-neutral-200' : 'bg-black/95 border-b border-neutral-800'
    } backdrop-blur-md`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 gap-4">
          {/* Left Brand Mark & Main Nav */}
          <div className="flex items-center gap-6 lg:gap-8 min-w-0 shrink-0">
            {/* Clean Brand Mark */}
            <div 
              onClick={() => {
                onSelectTool('home');
                onSelectCategory('all');
              }}
              className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0 pr-2"
            >
              <VayunLogo size={28} className="transition-transform group-hover:scale-105 shrink-0" />
              <VayunWordmark height={24} theme={theme} className="shrink-0" />
            </div>

            {/* Categorized Navigation */}
            <nav className="hidden lg:flex items-center gap-1 text-xs shrink-0">
              <button
                onClick={() => {
                  onSelectTool('home');
                  onSelectCategory('all');
                }}
                className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 shrink-0 ${
                  currentTool === 'home' && selectedCategory === 'all'
                    ? isLight ? 'text-black font-semibold bg-neutral-100' : 'text-white font-semibold bg-neutral-900'
                    : isLight ? 'text-neutral-600 hover:text-black hover:bg-neutral-50' : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Overview</span>
              </button>

            <button
              onClick={() => {
                onSelectTool('vayun-flow');
                onSelectCategory('developer');
              }}
              className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
                isDeveloperTool
                  ? isLight ? 'text-black font-semibold bg-neutral-100' : 'text-white font-semibold bg-neutral-900'
                  : isLight ? 'text-neutral-600 hover:text-black hover:bg-neutral-50' : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>Developer Flow</span>
            </button>

            <button
              onClick={() => {
                onSelectTool('merge-pdf');
                onSelectCategory('pdf');
              }}
              className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
                selectedCategory === 'pdf' || currentTool === 'merge-pdf' || currentTool === 'split-pdf' || currentTool === 'compress-pdf' || currentTool === 'image-to-pdf' || currentTool === 'resume-builder'
                  ? isLight ? 'text-black font-semibold bg-neutral-100' : 'text-white font-semibold bg-neutral-900'
                  : isLight ? 'text-neutral-600 hover:text-black hover:bg-neutral-50' : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              PDF Suite
            </button>

            <button
              onClick={() => {
                onSelectTool('thread-rescuer');
                onSelectCategory('ai');
              }}
              className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
                selectedCategory === 'ai' || currentTool === 'thread-rescuer' || currentTool === 'token-slimmer' || currentTool === 'prompt-sanitizer'
                  ? isLight ? 'text-black font-semibold bg-neutral-100' : 'text-white font-semibold bg-neutral-900'
                  : isLight ? 'text-neutral-600 hover:text-black hover:bg-neutral-50' : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50'
              }`}
            >
              <BrainCircuit className="w-3.5 h-3.5" />
              AI Context
            </button>

            <button
              onClick={() => {
                onSelectTool('invoice-maker');
                onSelectCategory('billing');
              }}
              className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
                selectedCategory === 'billing' || currentTool === 'invoice-maker' || currentTool === 'paylink-view' || currentTool === 'receipt-matcher'
                  ? isLight ? 'text-black font-semibold bg-neutral-100' : 'text-white font-semibold bg-neutral-900'
                  : isLight ? 'text-neutral-600 hover:text-black hover:bg-neutral-50' : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50'
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              Invoicing
            </button>

            <button
              onClick={() => {
                onSelectTool('clean-csv');
                onSelectCategory('tabular');
              }}
              className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
                selectedCategory === 'tabular' || currentTool === 'clean-csv' || currentTool === 'preserve-zeros' || currentTool === 'table-converter'
                  ? isLight ? 'text-black font-semibold bg-neutral-100' : 'text-white font-semibold bg-neutral-900'
                  : isLight ? 'text-neutral-600 hover:text-black hover:bg-neutral-50' : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Tabular</span>
            </button>
          </nav>
        </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* AI API Button */}
            {onOpenApiSettings && (
              <button
                onClick={onOpenApiSettings}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded border text-xs font-mono transition-colors ${
                  hasApiKey
                    ? isLight ? 'border-neutral-300 bg-neutral-100 text-black' : 'border-neutral-700 bg-neutral-900 text-white'
                    : isLight 
                    ? 'border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100' 
                    : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:bg-neutral-900'
                }`}
                title="Configure Gemini API Key"
              >
                <Key className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{hasApiKey ? 'Gemini API' : 'API Key'}</span>
              </button>
            )}

            {/* Zero-Upload RAM Auditor Trigger */}
            {onOpenSecurityAuditor && (
              <button
                onClick={onOpenSecurityAuditor}
                className={`hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded border text-xs font-mono transition-colors ${
                  isLight 
                    ? 'border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100' 
                    : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:bg-neutral-900'
                }`}
                title="Zero-Upload RAM Security Guarantee"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-neutral-500" />
                <span>Zero-Upload RAM</span>
              </button>
            )}

            {/* Command Palette Trigger */}
            <button
              onClick={onOpenCommandPalette}
              className={`px-2.5 py-1.5 rounded border text-xs font-mono flex items-center gap-2 transition-colors ${
                isLight 
                  ? 'border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100' 
                  : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:bg-neutral-900'
              }`}
            >
              <Search className="w-3.5 h-3.5 opacity-60" />
              <span className="hidden sm:inline text-xs">Search</span>
              <kbd className={`px-1 py-0.5 rounded text-[10px] border ${
                isLight ? 'border-neutral-300 bg-white text-neutral-600' : 'border-neutral-700 bg-neutral-900 text-neutral-400'
              }`}>
                ⌘K
              </kbd>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={onToggleTheme}
              title={`Switch to ${isLight ? 'Dark' : 'Light'} Mode`}
              className={`p-1.5 rounded border transition-colors ${
                isLight 
                  ? 'border-neutral-200 text-neutral-700 hover:bg-neutral-100' 
                  : 'border-neutral-800 text-neutral-300 hover:bg-neutral-900'
              }`}
            >
              {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* Support / Contribute Button */}
            {onOpenSupport && (
              <button
                onClick={onOpenSupport}
                title="Support Vayun.xyz on Buy Me a Coffee"
                className={`px-2.5 py-1.5 rounded-full border text-xs font-mono flex items-center gap-1.5 transition-colors ${
                  isLight 
                    ? 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100' 
                    : 'border-neutral-800 bg-neutral-900 text-neutral-300 hover:bg-neutral-850'
                }`}
              >
                <Coffee className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Support</span>
              </button>
            )}

            {/* Zero Tracking & No Accounts Badge */}
            <div 
              onClick={onOpenSecurityAuditor}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-mono select-none cursor-pointer transition-colors ${
                isLight 
                  ? 'border-neutral-200 bg-neutral-100/70 text-neutral-700 hover:bg-neutral-200/60' 
                  : 'border-neutral-800 bg-neutral-900/70 text-neutral-300 hover:bg-neutral-850'
              }`}
              title="Zero remote uploads, zero tracking, no accounts, no paywalls."
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>No Accounts • 100% Free</span>
            </div>

            {/* Mobile / Tablet Hamburger Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
              className={`p-1.5 rounded border transition-colors lg:hidden flex items-center justify-center ${
                isLight 
                  ? 'border-neutral-200 text-neutral-700 hover:bg-neutral-100' 
                  : 'border-neutral-800 text-neutral-300 hover:bg-neutral-900'
              }`}
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile / Tablet Slide-down Navigation Menu */}
      {isMobileMenuOpen && (
        <div className={`lg:hidden border-b px-4 py-4 space-y-2 transition-colors ${
          isLight ? 'bg-white border-neutral-200 text-black' : 'bg-black border-neutral-900 text-white'
        }`}>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => {
                onSelectTool('home');
                onSelectCategory('all');
                setIsMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded border text-left flex items-center gap-2 ${
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
              className={`p-2.5 rounded border text-left flex items-center gap-2 ${
                isDeveloperTool
                  ? isLight ? 'bg-black text-white border-black' : 'bg-white text-black border-white'
                  : isLight ? 'border-neutral-200 hover:bg-neutral-100' : 'border-neutral-800 hover:bg-neutral-900'
              }`}
            >
              <Network className="w-4 h-4 shrink-0" />
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
              className={`p-2.5 rounded border text-left flex items-center gap-2 ${
                selectedCategory === 'pdf'
                  ? isLight ? 'bg-black text-white border-black' : 'bg-white text-black border-white'
                  : isLight ? 'border-neutral-200 hover:bg-neutral-100' : 'border-neutral-800 hover:bg-neutral-900'
              }`}
            >
              <FileText className="w-4 h-4 shrink-0" />
              <div>
                <div className="font-semibold">PDF Suite</div>
                <div className="text-[10px] opacity-70">5 tools</div>
              </div>
            </button>

            <button
              onClick={() => {
                onSelectTool('thread-rescuer');
                onSelectCategory('ai');
                setIsMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded border text-left flex items-center gap-2 ${
                selectedCategory === 'ai'
                  ? isLight ? 'bg-black text-white border-black' : 'bg-white text-black border-white'
                  : isLight ? 'border-neutral-200 hover:bg-neutral-100' : 'border-neutral-800 hover:bg-neutral-900'
              }`}
            >
              <BrainCircuit className="w-4 h-4 shrink-0" />
              <div>
                <div className="font-semibold">AI Context</div>
                <div className="text-[10px] opacity-70">Tokens & sanitize</div>
              </div>
            </button>

            <button
              onClick={() => {
                onSelectTool('invoice-maker');
                onSelectCategory('billing');
                setIsMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded border text-left flex items-center gap-2 ${
                selectedCategory === 'billing'
                  ? isLight ? 'bg-black text-white border-black' : 'bg-white text-black border-white'
                  : isLight ? 'border-neutral-200 hover:bg-neutral-100' : 'border-neutral-800 hover:bg-neutral-900'
              }`}
            >
              <Receipt className="w-4 h-4 shrink-0" />
              <div>
                <div className="font-semibold">Invoicing</div>
                <div className="text-[10px] opacity-70">Invoices & PayLinks</div>
              </div>
            </button>

            <button
              onClick={() => {
                if (onOpenApiSettings) {
                  onOpenApiSettings();
                }
                setIsMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded border text-left flex items-center gap-2 ${
                isLight ? 'border-neutral-200 hover:bg-neutral-100' : 'border-neutral-800 hover:bg-neutral-900'
              }`}
            >
              <Key className="w-4 h-4 shrink-0" />
              <div>
                <div className="font-semibold">API Key</div>
                <div className="text-[10px] opacity-70">{hasApiKey ? 'Connected' : 'Configure'}</div>
              </div>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
