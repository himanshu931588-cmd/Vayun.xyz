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
  Download,
  ArrowLeftRight
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

  const isConvertTool = 
    selectedCategory === 'convert' ||
    currentTool === 'vayun-convert' ||
    currentTool === 'json-to-csv' ||
    currentTool === 'csv-to-json' ||
    currentTool === 'json-to-yaml' ||
    currentTool === 'yaml-to-json' ||
    currentTool === 'json-to-xml' ||
    currentTool === 'base64-converter' ||
    currentTool === 'url-converter' ||
    currentTool === 'jwt-decoder' ||
    currentTool === 'unix-timestamp' ||
    currentTool === 'number-to-words-inr' ||
    currentTool === 'hex-to-rgb' ||
    currentTool === 'px-to-rem';

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
    currentTool === 'table-converter' ||
    currentTool === 'data-analytics';

  return (
    <header className={`sticky top-0 z-40 w-full transition-colors ${
      isLight ? 'bg-[#FAF7F2]/90 border-b border-[#E8E1D3] shadow-xs' : 'bg-[#061A12]/95 border-b border-[#123826]'
    } backdrop-blur-md`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-[68px] gap-4">
          
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
              <VayunLogo size={32} className="transition-transform group-hover:scale-105 shrink-0" />
              <VayunWordmark height={26} theme={theme} className="shrink-0" />
            </div>

            {/* Streamlined Navigation Tabs (Clean, uncluttered, balanced with big icons) */}
            <nav className="hidden md:flex items-center gap-1.5 text-xs sm:text-[13px] shrink-0 font-medium">
              <button
                onClick={() => {
                  onSelectTool('home');
                  onSelectCategory('all');
                }}
                className={`h-10 px-3 rounded-xl transition-all flex items-center gap-2 shrink-0 select-none active:scale-95 group ${
                  currentTool === 'home' && selectedCategory === 'all'
                    ? isLight ? 'text-[#0A2618] font-semibold bg-[#EFE9DC]/90 border border-[#DDD3C1]' : 'text-[#FAF7F2] font-semibold bg-[#0D2E20] border border-[#194E36]'
                    : isLight ? 'text-[#2D4A39] hover:text-[#0A2618] hover:bg-[#F2ECE1]' : 'text-[#8AA898] hover:text-[#FAF7F2] hover:bg-[#0A2419]'
                }`}
              >
                <LayoutGrid className="w-4.5 h-4.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity" />
                <span>Overview</span>
              </button>

              <button
                onClick={() => {
                  onSelectTool('vayun-convert');
                  onSelectCategory('convert');
                }}
                className={`h-10 px-3 rounded-xl transition-all flex items-center gap-2 shrink-0 select-none active:scale-95 group ${
                  isConvertTool
                    ? isLight ? 'text-[#0A2618] font-semibold bg-[#EFE9DC]/90 border border-[#DDD3C1]' : 'text-[#FAF7F2] font-semibold bg-[#0D2E20] border border-[#194E36]'
                    : isLight ? 'text-[#2D4A39] hover:text-[#0A2618] hover:bg-[#F2ECE1]' : 'text-[#8AA898] hover:text-[#FAF7F2] hover:bg-[#0A2419]'
                }`}
              >
                <ArrowLeftRight className="w-4.5 h-4.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity" />
                <span>Convert</span>
              </button>

              <button
                onClick={() => {
                  onSelectTool('vayun-flow');
                  onSelectCategory('developer');
                }}
                className={`h-10 px-3 rounded-xl transition-all flex items-center gap-2 shrink-0 select-none active:scale-95 group ${
                  isDeveloperTool
                    ? isLight ? 'text-[#0A2618] font-semibold bg-[#EFE9DC]/90 border border-[#DDD3C1]' : 'text-[#FAF7F2] font-semibold bg-[#0D2E20] border border-[#194E36]'
                    : isLight ? 'text-[#2D4A39] hover:text-[#0A2618] hover:bg-[#F2ECE1]' : 'text-[#8AA898] hover:text-[#FAF7F2] hover:bg-[#0A2419]'
                }`}
              >
                <Network className="w-4.5 h-4.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity" />
                <span>Flow</span>
              </button>

              <button
                onClick={() => {
                  onSelectTool('merge-pdf');
                  onSelectCategory('pdf');
                }}
                className={`h-10 px-3 rounded-xl transition-all flex items-center gap-2 shrink-0 select-none active:scale-95 group ${
                  isPdfTool
                    ? isLight ? 'text-[#0A2618] font-semibold bg-[#EFE9DC]/90 border border-[#DDD3C1]' : 'text-[#FAF7F2] font-semibold bg-[#0D2E20] border border-[#194E36]'
                    : isLight ? 'text-[#2D4A39] hover:text-[#0A2618] hover:bg-[#F2ECE1]' : 'text-[#8AA898] hover:text-[#FAF7F2] hover:bg-[#0A2419]'
                }`}
              >
                <FileText className="w-4.5 h-4.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity" />
                <span>PDF</span>
              </button>

              <button
                onClick={() => {
                  onSelectTool('thread-rescuer');
                  onSelectCategory('ai');
                }}
                className={`h-10 px-3 rounded-xl transition-all flex items-center gap-2 shrink-0 select-none active:scale-95 group ${
                  isAiTool
                    ? isLight ? 'text-[#0A2618] font-semibold bg-[#EFE9DC]/90 border border-[#DDD3C1]' : 'text-[#FAF7F2] font-semibold bg-[#0D2E20] border border-[#194E36]'
                    : isLight ? 'text-[#2D4A39] hover:text-[#0A2618] hover:bg-[#F2ECE1]' : 'text-[#8AA898] hover:text-[#FAF7F2] hover:bg-[#0A2419]'
                }`}
              >
                <BrainCircuit className="w-4.5 h-4.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity" />
                <span>AI</span>
              </button>

              <button
                onClick={() => {
                  onSelectTool('invoice-maker');
                  onSelectCategory('billing');
                }}
                className={`h-10 px-3 rounded-xl transition-all flex items-center gap-2 shrink-0 select-none active:scale-95 group ${
                  isBillingTool
                    ? isLight ? 'text-[#0A2618] font-semibold bg-[#EFE9DC]/90 border border-[#DDD3C1]' : 'text-[#FAF7F2] font-semibold bg-[#0D2E20] border border-[#194E36]'
                    : isLight ? 'text-[#2D4A39] hover:text-[#0A2618] hover:bg-[#F2ECE1]' : 'text-[#8AA898] hover:text-[#FAF7F2] hover:bg-[#0A2419]'
                }`}
              >
                <Receipt className="w-4.5 h-4.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity" />
                <span>Invoicing</span>
              </button>

              <button
                onClick={() => {
                  onSelectTool('clean-csv');
                  onSelectCategory('tabular');
                }}
                className={`h-10 px-3 rounded-xl transition-all flex items-center gap-2 shrink-0 select-none active:scale-95 group ${
                  isTabularTool
                    ? isLight ? 'text-[#0A2618] font-semibold bg-[#EFE9DC]/90 border border-[#DDD3C1]' : 'text-[#FAF7F2] font-semibold bg-[#0D2E20] border border-[#194E36]'
                    : isLight ? 'text-[#2D4A39] hover:text-[#0A2618] hover:bg-[#F2ECE1]' : 'text-[#8AA898] hover:text-[#FAF7F2] hover:bg-[#0A2419]'
                }`}
              >
                <Table className="w-4.5 h-4.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity" />
                <span>Tabular</span>
              </button>
            </nav>
          </div>

          {/* Right: Clean, Balanced Action Controls (Zero overflow, enlarged icons) */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Quick Search Spotlight (⌘K) */}
            <button
              onClick={onOpenCommandPalette}
              title="Search tools or commands (⌘K)"
              className={`h-10 px-3.5 rounded-xl border text-xs sm:text-[13px] font-mono flex items-center gap-2 transition-all active:scale-95 group ${
                isLight 
                  ? 'border-[#E8E1D3] bg-[#FFFDF9] text-[#0A2618] hover:bg-[#F5F0E6] hover:border-[#DDD3C1] shadow-xs' 
                  : 'border-[#123826] bg-[#0A2419]/90 text-[#A3C7B5] hover:text-white hover:bg-[#0E3223] hover:border-[#194E36]'
              }`}
            >
              <Search className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity shrink-0" />
              <span className="hidden sm:inline">Search</span>
              <kbd className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${
                isLight 
                  ? 'border-[#DDD3C1] bg-[#F5F0E6] text-[#2D4A39]' 
                  : 'border-[#194E36] bg-[#061A12] text-[#8AA898]'
              }`}>
                ⌘K
              </kbd>
            </button>

            {/* Install Quick Access Button (Desktop App, Extension, CLI) */}
            {onOpenExtension && (
              <button
                onClick={onOpenExtension}
                title="Install Vayun (Desktop App, Extension, Terminal CLI)"
                className={`h-10 px-3.5 rounded-xl border text-xs sm:text-[13px] font-mono hidden sm:inline-flex items-center gap-2 transition-all select-none active:scale-95 group ${
                  isLight 
                    ? 'border-[#E8E1D3] bg-[#FFFDF9] text-[#0A2618] hover:bg-[#F5F0E6] hover:border-[#DDD3C1] shadow-xs' 
                    : 'border-[#123826] bg-[#0A2419]/90 text-[#A3C7B5] hover:text-white hover:bg-[#0E3223] hover:border-[#194E36]'
                }`}
              >
                <Download className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity shrink-0" />
                <span className="hidden lg:inline">Install</span>
              </button>
            )}

            {/* Theme Toggle Button (Dark Green / Cream) */}
            <button
              onClick={onToggleTheme}
              title={`Switch to ${isLight ? 'Dark Green' : 'Cream'} Mode (D)`}
              className={`h-10 w-10 rounded-xl border flex items-center justify-center transition-all select-none active:scale-95 group ${
                isLight 
                  ? 'border-[#E8E1D3] bg-[#FFFDF9] text-[#0A2618] hover:bg-[#F5F0E6] hover:border-[#DDD3C1] shadow-xs' 
                  : 'border-[#123826] bg-[#0A2419]/90 text-[#A3C7B5] hover:text-white hover:bg-[#0E3223] hover:border-[#194E36]'
              }`}
              aria-label="Toggle Theme"
            >
              {isLight ? (
                <Moon className="w-4.5 h-4.5 shrink-0 transition-transform group-hover:rotate-12 text-[#0A2618]" />
              ) : (
                <Sun className="w-4.5 h-4.5 shrink-0 transition-transform group-hover:rotate-45 text-[#6EE7B7] group-hover:text-white" />
              )}
            </button>

            {/* Mobile / Tablet Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
              className={`h-10 w-10 rounded-xl border transition-all md:hidden flex items-center justify-center active:scale-95 ${
                isLight 
                  ? 'border-[#E8E1D3] bg-[#FFFDF9] text-[#0A2618] hover:bg-[#F5F0E6]' 
                  : 'border-[#123826] bg-[#0A2419]/90 text-[#A3C7B5] hover:bg-[#0E3223]'
              }`}
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 shrink-0" /> : <Menu className="w-5 h-5 shrink-0" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-down Navigation Menu */}
      {isMobileMenuOpen && (
        <div className={`md:hidden border-b px-4 py-4 space-y-3 transition-colors ${
          isLight ? 'bg-[#FAF7F2] border-[#E8E1D3] text-[#0A2618]' : 'bg-[#061A12] border-[#123826] text-[#E8F3ED]'
        }`}>
          <div className={`text-[10px] font-mono uppercase tracking-wider font-semibold px-1 ${
            isLight ? 'text-[#3B5445]' : 'text-[#8AA898]'
          }`}>
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
                  ? isLight ? 'bg-[#0A2618] text-[#FAF7F2] border-[#0A2618]' : 'bg-[#FAF7F2] text-[#061A12] border-[#FAF7F2]'
                  : isLight ? 'border-[#E8E1D3] bg-[#FFFDF9] hover:bg-[#F5F0E6]' : 'border-[#123826] bg-[#0A2419] hover:bg-[#0E3223]'
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
                onSelectTool('vayun-convert');
                onSelectCategory('convert');
                setIsMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition-all ${
                isConvertTool
                  ? isLight ? 'bg-[#0A2618] text-[#FAF7F2] border-[#0A2618]' : 'bg-[#FAF7F2] text-[#061A12] border-[#FAF7F2]'
                  : isLight ? 'border-[#E8E1D3] bg-[#FFFDF9] hover:bg-[#F5F0E6]' : 'border-[#123826] bg-[#0A2419] hover:bg-[#0E3223]'
              }`}
            >
              <ArrowLeftRight className="w-4 h-4 opacity-80 shrink-0" />
              <div>
                <div className="font-semibold">Convert Hub</div>
                <div className="text-[10px] opacity-70">12 Converters</div>
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
                  ? isLight ? 'bg-[#0A2618] text-[#FAF7F2] border-[#0A2618]' : 'bg-[#FAF7F2] text-[#061A12] border-[#FAF7F2]'
                  : isLight ? 'border-[#E8E1D3] bg-[#FFFDF9] hover:bg-[#F5F0E6]' : 'border-[#123826] bg-[#0A2419] hover:bg-[#0E3223]'
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
                  ? isLight ? 'bg-[#0A2618] text-[#FAF7F2] border-[#0A2618]' : 'bg-[#FAF7F2] text-[#061A12] border-[#FAF7F2]'
                  : isLight ? 'border-[#E8E1D3] bg-[#FFFDF9] hover:bg-[#F5F0E6]' : 'border-[#123826] bg-[#0A2419] hover:bg-[#0E3223]'
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
                  ? isLight ? 'bg-[#0A2618] text-[#FAF7F2] border-[#0A2618]' : 'bg-[#FAF7F2] text-[#061A12] border-[#FAF7F2]'
                  : isLight ? 'border-[#E8E1D3] bg-[#FFFDF9] hover:bg-[#F5F0E6]' : 'border-[#123826] bg-[#0A2419] hover:bg-[#0E3223]'
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
                  ? isLight ? 'bg-[#0A2618] text-[#FAF7F2] border-[#0A2618]' : 'bg-[#FAF7F2] text-[#061A12] border-[#FAF7F2]'
                  : isLight ? 'border-[#E8E1D3] bg-[#FFFDF9] hover:bg-[#F5F0E6]' : 'border-[#123826] bg-[#0A2419] hover:bg-[#0E3223]'
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
                  ? isLight ? 'bg-[#0A2618] text-[#FAF7F2] border-[#0A2618]' : 'bg-[#FAF7F2] text-[#061A12] border-[#FAF7F2]'
                  : isLight ? 'border-[#E8E1D3] bg-[#FFFDF9] hover:bg-[#F5F0E6]' : 'border-[#123826] bg-[#0A2419] hover:bg-[#0E3223]'
              }`}
            >
              <Table className="w-4 h-4 opacity-80 shrink-0" />
              <div>
                <div className="font-semibold">Tabular</div>
                <div className="text-[10px] opacity-70">CSV & Tables</div>
              </div>
            </button>
          </div>

          <div className={`text-[10px] font-mono uppercase tracking-wider font-semibold px-1 pt-2 ${
            isLight ? 'text-[#3B5445]' : 'text-[#8AA898]'
          }`}>
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
                  isLight ? 'border-[#E8E1D3] bg-[#FFFDF9] hover:bg-[#F5F0E6]' : 'border-[#123826] bg-[#0A2419] hover:bg-[#0E3223]'
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
                  isLight ? 'border-[#E8E1D3] bg-[#FFFDF9] hover:bg-[#F5F0E6]' : 'border-[#123826] bg-[#0A2419] hover:bg-[#0E3223]'
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
                  isLight ? 'border-[#E8E1D3] bg-[#FFFDF9] hover:bg-[#F5F0E6]' : 'border-[#123826] bg-[#0A2419] hover:bg-[#0E3223]'
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
                  isLight ? 'border-[#E8E1D3] bg-[#FFFDF9] hover:bg-[#F5F0E6]' : 'border-[#123826] bg-[#0A2419] hover:bg-[#0E3223]'
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
                  isLight ? 'border-[#E8E1D3] bg-[#FFFDF9] hover:bg-[#F5F0E6]' : 'border-[#123826] bg-[#0A2419] hover:bg-[#0E3223]'
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
