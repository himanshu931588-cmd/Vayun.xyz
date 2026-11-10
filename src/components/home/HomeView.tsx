import React, { useState } from 'react';
import { 
  Layers,
  Scissors,
  FileArchive,
  Image as ImageIcon,
  BrainCircuit, 
  Minimize2, 
  ShieldCheck, 
  Receipt, 
  Link, 
  Sparkles, 
  Table, 
  FileSpreadsheet, 
  FileCode2, 
  FileText,
  LayoutGrid,
  ArrowRight,
  Search,
  Cpu,
  Network,
  Flame,
  Scale,
  Key,
  X,
  Coffee,
  ExternalLink
} from 'lucide-react';
import { ToolCategory, ToolId } from '../../types';
import { TOOLS } from '../../utils/toolsData';
import { getStoredApiKey } from '../../utils/geminiApi';
import { VayunLogo } from '../common/VayunLogo';
import { VayunWordmark } from '../common/VayunWordmark';

interface HomeViewProps {
  onSelectTool: (id: ToolId) => void;
  selectedCategory: ToolCategory | 'all';
  onSelectCategory: (cat: ToolCategory | 'all') => void;
  onOpenApiSettings?: () => void;
  onOpenSupport?: () => void;
  theme?: 'dark' | 'light';
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectTool,
  selectedCategory,
  onSelectCategory,
  onOpenApiSettings,
  onOpenSupport,
  theme = 'dark'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const isLight = theme === 'light';
  const hasApiKey = Boolean(getStoredApiKey());

  const cleanQuery = searchQuery.trim().toLowerCase();

  const filteredTools = TOOLS.filter(tool => {
    const matchesCategory = 
      cleanQuery.length > 0 
        ? true 
        : selectedCategory === 'all' || tool.category === selectedCategory;

    if (!cleanQuery) {
      return matchesCategory;
    }

    const matchesName = tool.name.toLowerCase().includes(cleanQuery);
    const matchesTagline = tool.tagline.toLowerCase().includes(cleanQuery);
    const matchesDescription = tool.description.toLowerCase().includes(cleanQuery);
    const matchesCategoryName = tool.categoryName.toLowerCase().includes(cleanQuery);
    const matchesSlug = tool.seoSlug.toLowerCase().includes(cleanQuery);
    const matchesKeywords = tool.keywords?.some(k => k.toLowerCase().includes(cleanQuery)) || false;

    return matchesName || matchesTagline || matchesDescription || matchesCategoryName || matchesSlug || matchesKeywords;
  });

  const getToolIcon = (iconName: string) => {
    const props = { className: `w-4 h-4 ${isLight ? 'text-black' : 'text-white'}` };
    switch (iconName) {
      case 'Network': return <Network {...props} />;
      case 'ShieldCheck': return <ShieldCheck {...props} />;
      case 'Flame': return <Flame {...props} />;
      case 'Scale': return <Scale {...props} />;
      case 'Layers': return <Layers {...props} />;
      case 'Scissors': return <Scissors {...props} />;
      case 'FileArchive': return <FileArchive {...props} />;
      case 'Image': return <ImageIcon {...props} />;
      case 'FileText': return <FileText {...props} />;
      case 'BrainCircuit': return <BrainCircuit {...props} />;
      case 'Minimize2': return <Minimize2 {...props} />;
      case 'Receipt': return <Receipt {...props} />;
      case 'Link': return <Link {...props} />;
      case 'Sparkles': return <Sparkles {...props} />;
      case 'Table': return <Table {...props} />;
      case 'FileSpreadsheet': return <FileSpreadsheet {...props} />;
      case 'FileCode2': return <FileCode2 {...props} />;
      default: return <BrainCircuit {...props} />;
    }
  };

  return (
    <div className="space-y-10 py-10 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Clean Hero Header */}
      <div className={`p-6 sm:p-10 rounded-lg border transition-all ${
        isLight 
          ? 'bg-neutral-50/50 border-neutral-200 text-black' 
          : 'bg-neutral-950/50 border-neutral-800 text-white'
      }`}>
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-3">
            <VayunLogo size={40} />
            <div className="flex items-center gap-2.5">
              <VayunWordmark height={32} theme={theme} />
              <span className="text-neutral-500 font-mono text-xs">/</span>
              <span className="text-neutral-400 font-mono text-xs">anti-black-box</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif tracking-tight leading-[1.15]">
            Understand Every Line You Ship.
          </h1>

          <p className={`text-sm sm:text-base leading-relaxed ${
            isLight ? 'text-neutral-600' : 'text-neutral-400'
          }`}>
            The Anti-Black-Box Developer & Defense Platform for coding students and software engineers. Visualize multi-file execution traces in <strong>Vayun Flow</strong>, defend code in live Socratic <strong>Vayun Viva</strong> simulations, and edit documents. <strong>Zero remote uploads, zero tracking, no accounts, no paywalls.</strong>
          </p>

          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <button
              onClick={() => onSelectTool('vayun-flow')}
              className={`px-4 py-2 rounded text-xs font-mono font-medium flex items-center gap-2 transition-all ${
                isLight 
                  ? 'bg-black text-white hover:bg-neutral-800' 
                  : 'bg-white text-black hover:bg-neutral-200'
              }`}
            >
              <Network className="w-4 h-4" />
              <span>Vayun Flow</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onSelectTool('vayun-viva')}
              className={`px-4 py-2 rounded text-xs font-mono font-medium flex items-center gap-2 border transition-all ${
                isLight 
                  ? 'border-neutral-300 bg-white text-black hover:bg-neutral-100' 
                  : 'border-neutral-700 bg-neutral-900 text-white hover:bg-neutral-800'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Vayun Viva Defense</span>
            </button>

            <button
              onClick={() => onSelectTool('resume-builder')}
              className={`px-4 py-2 rounded text-xs font-mono font-medium flex items-center gap-2 border transition-all ${
                isLight 
                  ? 'border-neutral-300 bg-white text-black hover:bg-neutral-100' 
                  : 'border-neutral-700 bg-neutral-900 text-white hover:bg-neutral-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Resume Builder</span>
            </button>

            {onOpenApiSettings && (
              <button
                onClick={onOpenApiSettings}
                className={`px-4 py-2 rounded text-xs font-mono font-medium flex items-center gap-2 border transition-all ${
                  isLight 
                    ? 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-100' 
                    : 'border-neutral-700 bg-neutral-900 text-neutral-300 hover:bg-neutral-800'
                }`}
              >
                <Key className="w-4 h-4" />
                <span>{hasApiKey ? 'Gemini API Connected' : 'Configure API'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Toolbar & Filter Tabs */}
      <div className={`pb-4 border-b ${isLight ? 'border-neutral-200' : 'border-neutral-800'}`}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Universal Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${
              isLight ? 'text-neutral-400' : 'text-neutral-600'
            }`} />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools, formats, or tasks..."
              className={`w-full pl-9 pr-8 py-2 rounded text-xs transition-colors focus:outline-hidden ${
                isLight 
                  ? 'bg-neutral-50 border border-neutral-200 text-black placeholder-neutral-400 focus:border-black' 
                  : 'bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 focus:border-neutral-500'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black dark:hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Segmented Filter Pills */}
          <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
            <button
              onClick={() => {
                onSelectCategory('all');
                setSearchQuery('');
              }}
              className={`px-3 py-1.5 rounded text-xs transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                selectedCategory === 'all' && !searchQuery
                  ? isLight ? 'bg-black text-white font-medium' : 'bg-white text-black font-medium'
                  : isLight ? 'text-neutral-600 hover:text-black' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              All ({TOOLS.length})
            </button>
            <button
              onClick={() => {
                onSelectCategory('developer');
                setSearchQuery('');
              }}
              className={`px-3 py-1.5 rounded text-xs transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                selectedCategory === 'developer' && !searchQuery
                  ? isLight ? 'bg-black text-white font-medium' : 'bg-white text-black font-medium'
                  : isLight ? 'text-neutral-600 hover:text-black' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              Developer Flow ({TOOLS.filter(t => t.category === 'developer').length})
            </button>
            <button
              onClick={() => {
                onSelectCategory('pdf');
                setSearchQuery('');
              }}
              className={`px-3 py-1.5 rounded text-xs transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                selectedCategory === 'pdf' && !searchQuery
                  ? isLight ? 'bg-black text-white font-medium' : 'bg-white text-black font-medium'
                  : isLight ? 'text-neutral-600 hover:text-black' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              PDF Suite ({TOOLS.filter(t => t.category === 'pdf').length})
            </button>
            <button
              onClick={() => {
                onSelectCategory('ai');
                setSearchQuery('');
              }}
              className={`px-3 py-1.5 rounded text-xs transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                selectedCategory === 'ai' && !searchQuery
                  ? isLight ? 'bg-black text-white font-medium' : 'bg-white text-black font-medium'
                  : isLight ? 'text-neutral-600 hover:text-black' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <BrainCircuit className="w-3.5 h-3.5" />
              AI Context ({TOOLS.filter(t => t.category === 'ai').length})
            </button>
            <button
              onClick={() => {
                onSelectCategory('billing');
                setSearchQuery('');
              }}
              className={`px-3 py-1.5 rounded text-xs transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                selectedCategory === 'billing' && !searchQuery
                  ? isLight ? 'bg-black text-white font-medium' : 'bg-white text-black font-medium'
                  : isLight ? 'text-neutral-600 hover:text-black' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              Invoicing ({TOOLS.filter(t => t.category === 'billing').length})
            </button>
            <button
              onClick={() => {
                onSelectCategory('tabular');
                setSearchQuery('');
              }}
              className={`px-3 py-1.5 rounded text-xs transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                selectedCategory === 'tabular' && !searchQuery
                  ? isLight ? 'bg-black text-white font-medium' : 'bg-white text-black font-medium'
                  : isLight ? 'text-neutral-600 hover:text-black' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              Tabular ({TOOLS.filter(t => t.category === 'tabular').length})
            </button>
          </div>
        </div>

        {searchQuery && (
          <div className="pt-2 text-xs font-mono text-neutral-500 flex items-center justify-between">
            <span>
              Showing {filteredTools.length} result{filteredTools.length === 1 ? '' : 's'} for "{searchQuery}"
            </span>
            <button
              onClick={() => setSearchQuery('')}
              className="text-[11px] underline hover:text-black dark:hover:text-white"
            >
              Clear filter
            </button>
          </div>
        )}
      </div>

      {/* Grid of Tools — Clean, Minimalist, No Stickers */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTools.map((tool) => (
            <div
              key={tool.id}
              onClick={() => onSelectTool(tool.id)}
              className={`p-5 rounded-lg border transition-all cursor-pointer group flex flex-col justify-between ${
                isLight 
                  ? 'bg-white border-neutral-200 hover:border-black hover:shadow-xs' 
                  : 'bg-neutral-950 border-neutral-800 hover:border-neutral-500 hover:bg-neutral-900/60'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`p-1.5 rounded border transition-colors ${
                    isLight ? 'border-neutral-200 bg-neutral-50 group-hover:bg-neutral-100' : 'border-neutral-800 bg-neutral-900 group-hover:bg-neutral-800'
                  }`}>
                    {getToolIcon(tool.icon)}
                  </div>
                  <span className={`text-[11px] font-mono ${
                    isLight ? 'text-neutral-400' : 'text-neutral-500'
                  }`}>
                    {tool.categoryName}
                  </span>
                </div>

                <div>
                  <h3 className={`text-base font-semibold tracking-tight transition-colors ${
                    isLight ? 'text-black group-hover:text-black' : 'text-white group-hover:text-white'
                  }`}>
                    {tool.name}
                  </h3>
                  <p className={`text-xs mt-0.5 font-mono ${
                    isLight ? 'text-neutral-500' : 'text-neutral-400'
                  }`}>
                    {tool.tagline}
                  </p>
                </div>

                <p className={`text-xs leading-relaxed ${
                  isLight ? 'text-neutral-600' : 'text-neutral-400'
                }`}>
                  {tool.description}
                </p>
              </div>

              <div className={`mt-5 pt-3 border-t flex items-center justify-between text-xs font-mono transition-colors ${
                isLight ? 'border-neutral-100 text-neutral-500 group-hover:text-black' : 'border-neutral-900 text-neutral-400 group-hover:text-white'
              }`}>
                <span>Open tool</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty Search State */
        <div className={`py-16 px-6 text-center rounded-lg border ${
          isLight ? 'bg-neutral-50/50 border-neutral-200' : 'bg-neutral-950/50 border-neutral-800'
        }`}>
          <Search className="w-6 h-6 mx-auto text-neutral-400 mb-2 opacity-50" />
          <h3 className="font-serif text-base font-semibold mb-1">
            No tools found matching "{searchQuery}"
          </h3>
          <p className={`text-xs max-w-sm mx-auto mb-4 ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
            Try searching for terms like <strong>API</strong>, <strong>Flow</strong>, <strong>Viva</strong>, <strong>Resume</strong>, <strong>PDF</strong>, or <strong>Invoicing</strong>.
          </p>

          <button
            onClick={() => {
              setSearchQuery('');
              onSelectCategory('all');
            }}
            className={`px-3 py-1.5 rounded text-xs font-mono font-medium ${
              isLight ? 'bg-black text-white' : 'bg-white text-black'
            }`}
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Community Contribution & Support Section */}
      <div className={`p-6 sm:p-8 rounded-2xl border transition-all ${
        isLight ? 'bg-neutral-50/70 border-neutral-200' : 'bg-neutral-950/70 border-neutral-800'
      }`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left max-w-xl">
            <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-mono text-neutral-400">
              <Coffee className="w-4 h-4 text-amber-500" />
              <span>Independent & Privacy-First Project</span>
            </div>
            <h3 className="text-lg sm:text-xl font-serif font-medium">
              Contribute to Vayun.xyz
            </h3>
            <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
              Vayun.xyz is maintained independently with zero remote uploads, zero tracking, no accounts, and no paywalls. If these tools help your workflow, consider buying a coffee to support development and hosting.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            {onOpenSupport && (
              <button
                onClick={onOpenSupport}
                className={`px-4 py-2.5 rounded-xl text-xs font-mono font-medium flex items-center gap-2 border transition-all ${
                  isLight 
                    ? 'border-neutral-300 bg-white hover:bg-neutral-100 text-black' 
                    : 'border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-white'
                }`}
              >
                <span>Scan QR Code</span>
              </button>
            )}
            <a
              href="https://buymeacoffee.com/himanshu.mishra1185"
              target="_blank"
              rel="noopener noreferrer"
              className={`px-5 py-2.5 rounded-xl text-xs font-mono font-medium flex items-center gap-2 transition-all shadow-sm ${
                isLight 
                  ? 'bg-black text-white hover:bg-neutral-800' 
                  : 'bg-white text-black hover:bg-neutral-200'
              }`}
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>Buy Me a Coffee</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
