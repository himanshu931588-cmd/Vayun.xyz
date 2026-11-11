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
  ExternalLink,
  Radar,
  Award,
  Wind,
  KeyRound,
  Presentation
} from 'lucide-react';
import { ToolCategory, ToolId } from '../../types';
import { TOOLS } from '../../utils/toolsData';
import { getStoredApiKey } from '../../utils/geminiApi';
import { VayunLogo } from '../common/VayunLogo';
import { VayunWordmark } from '../common/VayunWordmark';
import { HeroSection3D } from './HeroSection3D';
import { SnakeGameSection } from '../game/SnakeGameSection';

interface HomeViewProps {
  onSelectTool: (id: ToolId) => void;
  selectedCategory: ToolCategory | 'all';
  onSelectCategory: (cat: ToolCategory | 'all') => void;
  onOpenApiSettings?: () => void;
  onOpenSupport?: () => void;
  onOpenExtension?: () => void;
  onOpenHelpdesk?: () => void;
  theme?: 'dark' | 'light';
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectTool,
  selectedCategory,
  onSelectCategory,
  onOpenApiSettings,
  onOpenSupport,
  onOpenExtension,
  onOpenHelpdesk,
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
        : selectedCategory === 'all'
        ? true
        : tool.category === selectedCategory;

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
    const props = { className: `w-5 h-5 shrink-0 ${isLight ? 'text-blue-600' : 'text-white'} stroke-[1.8]` };
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
      case 'Radar': return <Radar {...props} />;
      case 'Award': return <Award {...props} />;
      case 'Wind': return <Wind {...props} />;
      case 'KeyRound': return <KeyRound {...props} />;
      case 'Presentation': return <Presentation {...props} />;
      case 'Cpu': return <Cpu {...props} />;
      default: return <BrainCircuit {...props} />;
    }
  };

  return (
    <div className="space-y-10 py-10 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Interactive 3D Perspective Hero Header */}
      <HeroSection3D
        theme={theme}
        onSelectTool={onSelectTool}
        onOpenApiSettings={onOpenApiSettings}
        onOpenExtension={onOpenExtension}
        onOpenHelpdesk={onOpenHelpdesk}
        hasApiKey={hasApiKey}
      />

      {/* Toolbar & Filter Tabs */}
      <div className={`pb-4 border-b ${isLight ? 'border-slate-200/80' : 'border-neutral-800'}`}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Universal Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${
              isLight ? 'text-slate-400' : 'text-neutral-500'
            }`} />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools, formats, or tasks..."
              className={`w-full pl-10 pr-9 py-2.5 rounded-xl text-xs sm:text-[13px] transition-colors focus:outline-hidden ${
                isLight 
                  ? 'bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 shadow-xs' 
                  : 'bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 focus:border-neutral-500'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Segmented Filter Pills */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
            <button
              onClick={() => {
                onSelectCategory('all');
                setSearchQuery('');
              }}
              className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-[13px] transition-all flex items-center gap-2 whitespace-nowrap group ${
                selectedCategory === 'all' && !searchQuery
                  ? isLight ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'bg-white text-black font-medium'
                  : isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4.5 h-4.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity" />
              <span>All ({TOOLS.length})</span>
            </button>
            <button
              onClick={() => {
                onSelectCategory('developer');
                setSearchQuery('');
              }}
              className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-[13px] transition-all flex items-center gap-2 whitespace-nowrap group ${
                selectedCategory === 'developer' && !searchQuery
                  ? isLight ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'bg-white text-black font-medium'
                  : isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Network className="w-4.5 h-4.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity" />
              <span>Developer Flow ({TOOLS.filter(t => t.category === 'developer').length})</span>
            </button>
            <button
              onClick={() => {
                onSelectCategory('pdf');
                setSearchQuery('');
              }}
              className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-[13px] transition-all flex items-center gap-2 whitespace-nowrap group ${
                selectedCategory === 'pdf' && !searchQuery
                  ? isLight ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'bg-white text-black font-medium'
                  : isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <FileText className="w-4.5 h-4.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity" />
              <span>PDF Suite ({TOOLS.filter(t => t.category === 'pdf').length})</span>
            </button>
            <button
              onClick={() => {
                onSelectCategory('ai');
                setSearchQuery('');
              }}
              className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-[13px] transition-all flex items-center gap-2 whitespace-nowrap group ${
                selectedCategory === 'ai' && !searchQuery
                  ? isLight ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'bg-white text-black font-medium'
                  : isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <BrainCircuit className="w-4.5 h-4.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity" />
              <span>AI Context ({TOOLS.filter(t => t.category === 'ai').length})</span>
            </button>
            <button
              onClick={() => {
                onSelectCategory('billing');
                setSearchQuery('');
              }}
              className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-[13px] transition-all flex items-center gap-2 whitespace-nowrap group ${
                selectedCategory === 'billing' && !searchQuery
                  ? isLight ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'bg-white text-black font-medium'
                  : isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Receipt className="w-4.5 h-4.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity" />
              <span>Invoicing ({TOOLS.filter(t => t.category === 'billing').length})</span>
            </button>
            <button
              onClick={() => {
                onSelectCategory('tabular');
                setSearchQuery('');
              }}
              className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-[13px] transition-all flex items-center gap-2 whitespace-nowrap group ${
                selectedCategory === 'tabular' && !searchQuery
                  ? isLight ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'bg-white text-black font-medium'
                  : isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Table className="w-4.5 h-4.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity" />
              <span>Tabular ({TOOLS.filter(t => t.category === 'tabular').length})</span>
            </button>
          </div>
        </div>

        {searchQuery && (
          <div className="pt-2 text-xs font-mono text-slate-500 flex items-center justify-between">
            <span>
              Showing {filteredTools.length} result{filteredTools.length === 1 ? '' : 's'} for "{searchQuery}"
            </span>
            <button
              onClick={() => setSearchQuery('')}
              className="text-[11px] underline hover:text-slate-900 dark:hover:text-white"
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
              className={`p-5 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between space-y-4 ${
                isLight 
                  ? 'bg-white border-slate-200/90 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5' 
                  : 'bg-neutral-950 border-neutral-800 hover:border-neutral-500 hover:bg-neutral-900/60 hover:shadow-xl hover:shadow-black/60'
              }`}
            >
              <div className="space-y-3.5">
                {/* Top Badge Strip: Crisp JetBrains Mono Labels */}
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl border transition-colors ${
                    isLight ? 'border-blue-100 bg-blue-50/70 text-blue-700 group-hover:bg-blue-600 group-hover:text-white' : 'border-neutral-800 bg-neutral-900 group-hover:bg-neutral-800'
                  }`}>
                    {getToolIcon(tool.icon)}
                  </div>
                  <span className={`text-[11px] font-mono font-medium tracking-wide uppercase px-2 py-0.5 rounded border ${
                    isLight ? 'border-slate-200 bg-slate-50 text-slate-600' : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                  }`}>
                    {tool.categoryName}
                  </span>
                </div>

                {/* Editorial Serif Headline Paired with Crisp Mono Tagline */}
                <div>
                  <h3 className={`text-lg font-serif font-bold tracking-tight transition-colors leading-snug ${
                    isLight ? 'text-slate-900 group-hover:text-blue-600' : 'text-white group-hover:text-white'
                  }`}>
                    {tool.name}
                  </h3>
                  <p className={`text-xs mt-1 font-mono font-medium ${
                    isLight ? 'text-blue-700/80' : 'text-neutral-400'
                  }`}>
                    {tool.tagline}
                  </p>
                </div>

                {/* Description */}
                <p className={`text-xs leading-relaxed ${
                  isLight ? 'text-slate-600 font-normal' : 'text-neutral-400'
                }`}>
                  {tool.description}
                </p>
              </div>

              {/* Bottom Card Action Footer */}
              <div className={`pt-3 border-t flex items-center justify-between text-xs font-mono transition-colors ${
                isLight ? 'border-slate-100 text-blue-600 group-hover:text-blue-700 font-semibold' : 'border-neutral-900 text-neutral-400 group-hover:text-white'
              }`}>
                <span>Open tool</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty Search State */
        <div className={`py-16 px-6 text-center rounded-2xl border ${
          isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-neutral-950/50 border-neutral-800'
        }`}>
          <Search className="w-6 h-6 mx-auto text-slate-400 mb-2 opacity-50" />
          <h3 className="font-serif text-base font-semibold mb-1">
            No tools found matching "{searchQuery}"
          </h3>
          <p className={`text-xs max-w-sm mx-auto mb-4 ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
            Try searching for terms like <strong>API</strong>, <strong>Flow</strong>, <strong>Viva</strong>, <strong>Resume</strong>, <strong>PDF</strong>, or <strong>Invoicing</strong>.
          </p>

          <button
            onClick={() => {
              setSearchQuery('');
              onSelectCategory('all');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium ${
              isLight ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white text-black'
            }`}
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Community Contribution & Support Section */}
      <div className={`p-6 sm:p-8 rounded-2xl border transition-all ${
        isLight ? 'bg-white/95 border-slate-200/90 shadow-sm' : 'bg-neutral-950/70 border-neutral-800'
      }`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left max-w-xl">
            <div className={`flex items-center justify-center md:justify-start gap-2 text-xs font-mono ${
              isLight ? 'text-slate-500' : 'text-neutral-400'
            }`}>
              <Coffee className="w-4 h-4 text-amber-500" />
              <span>Independent & Privacy-First Project</span>
            </div>
            <h3 className={`text-lg sm:text-xl font-serif font-bold ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              Contribute to Vayun.xyz
            </h3>
            <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
              Vayun.xyz is maintained independently with zero remote uploads, zero tracking, no accounts, and no paywalls. If these tools help your workflow, consider buying a coffee to support development and hosting.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            {onOpenSupport && (
              <button
                onClick={onOpenSupport}
                className={`px-4 py-2.5 rounded-xl text-xs font-mono font-medium flex items-center gap-2 border transition-all ${
                  isLight 
                    ? 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800 shadow-xs' 
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
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20' 
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

      {/* Developer Arcade: Terminal Snake Game at Bottom of Page */}
      <div id="arcade-snake">
        <SnakeGameSection theme={theme} />
      </div>
    </div>
  );
};
