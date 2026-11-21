import React, { useState } from 'react';
import { 
  ArrowRight,
  Search,
  X,
  Coffee,
  ExternalLink
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
      <div id="tools-section" className={`pt-2 pb-4 border-b ${isLight ? 'border-[#E8E1D3]' : 'border-[#123826]'}`}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Universal Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${
              isLight ? 'text-[#5E7A6B]' : 'text-[#5A7A6A]'
            }`} />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools, formats, or tasks..."
              className={`w-full pl-10 pr-9 py-2 rounded-xl text-xs sm:text-[13px] transition-colors focus:outline-hidden ${
                isLight 
                  ? 'bg-[#FFFDF9] border border-[#E8E1D3] text-[#0A2618] placeholder-[#718E7E] focus:border-[#1E5638] shadow-xs' 
                  : 'bg-[#0A2419] border border-[#123826] text-[#FAF7F2] placeholder-[#5A7A6A] focus:border-[#226343]'
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
          <div className={`p-1 rounded-2xl border flex items-center gap-1 w-full sm:w-auto overflow-x-auto no-scrollbar ${
            isLight ? 'bg-[#EFE9DC]/90 border-[#DDD3C1]' : 'bg-[#04120C] border-[#123826]'
          }`}>
            <button
              onClick={() => {
                onSelectCategory('all');
                setSearchQuery('');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-[13px] transition-all whitespace-nowrap select-none font-medium ${
                selectedCategory === 'all' && !searchQuery
                  ? isLight 
                    ? 'bg-[#FFFDF9] text-[#0A2618] font-semibold shadow-xs border border-[#DDD3C1]' 
                    : 'bg-[#0D2E20] text-[#FAF7F2] font-semibold border border-[#1B4D37] shadow-xs'
                  : isLight 
                    ? 'text-[#3B5445] hover:text-[#0A2618] hover:bg-[#FAF7F2]/80' 
                    : 'text-[#8AA898] hover:text-[#FAF7F2] hover:bg-[#0A2419]/60'
              }`}
            >
              <span>All ({TOOLS.length})</span>
            </button>
            <button
              onClick={() => {
                onSelectCategory('convert');
                setSearchQuery('');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-[13px] transition-all whitespace-nowrap select-none font-medium ${
                selectedCategory === 'convert' && !searchQuery
                  ? isLight 
                    ? 'bg-[#FFFDF9] text-[#0A2618] font-semibold shadow-xs border border-[#DDD3C1]' 
                    : 'bg-[#0D2E20] text-[#FAF7F2] font-semibold border border-[#1B4D37] shadow-xs'
                  : isLight 
                    ? 'text-[#3B5445] hover:text-[#0A2618] hover:bg-[#FAF7F2]/80' 
                    : 'text-[#8AA898] hover:text-[#FAF7F2] hover:bg-[#0A2419]/60'
              }`}
            >
              <span>Converters ({TOOLS.filter(t => t.category === 'convert').length})</span>
            </button>
            <button
              onClick={() => {
                onSelectCategory('developer');
                setSearchQuery('');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-[13px] transition-all whitespace-nowrap select-none font-medium ${
                selectedCategory === 'developer' && !searchQuery
                  ? isLight 
                    ? 'bg-[#FFFDF9] text-[#0A2618] font-semibold shadow-xs border border-[#DDD3C1]' 
                    : 'bg-[#0D2E20] text-[#FAF7F2] font-semibold border border-[#1B4D37] shadow-xs'
                  : isLight 
                    ? 'text-[#3B5445] hover:text-[#0A2618] hover:bg-[#FAF7F2]/80' 
                    : 'text-[#8AA898] hover:text-[#FAF7F2] hover:bg-[#0A2419]/60'
              }`}
            >
              <span>Developer Flow ({TOOLS.filter(t => t.category === 'developer').length})</span>
            </button>
            <button
              onClick={() => {
                onSelectCategory('pdf');
                setSearchQuery('');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-[13px] transition-all whitespace-nowrap select-none font-medium ${
                selectedCategory === 'pdf' && !searchQuery
                  ? isLight 
                    ? 'bg-[#FFFDF9] text-[#0A2618] font-semibold shadow-xs border border-[#DDD3C1]' 
                    : 'bg-[#0D2E20] text-[#FAF7F2] font-semibold border border-[#1B4D37] shadow-xs'
                  : isLight 
                    ? 'text-[#3B5445] hover:text-[#0A2618] hover:bg-[#FAF7F2]/80' 
                    : 'text-[#8AA898] hover:text-[#FAF7F2] hover:bg-[#0A2419]/60'
              }`}
            >
              <span>PDF Suite ({TOOLS.filter(t => t.category === 'pdf').length})</span>
            </button>
            <button
              onClick={() => {
                onSelectCategory('ai');
                setSearchQuery('');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-[13px] transition-all whitespace-nowrap select-none font-medium ${
                selectedCategory === 'ai' && !searchQuery
                  ? isLight 
                    ? 'bg-[#FFFDF9] text-[#0A2618] font-semibold shadow-xs border border-[#DDD3C1]' 
                    : 'bg-[#0D2E20] text-[#FAF7F2] font-semibold border border-[#1B4D37] shadow-xs'
                  : isLight 
                    ? 'text-[#3B5445] hover:text-[#0A2618] hover:bg-[#FAF7F2]/80' 
                    : 'text-[#8AA898] hover:text-[#FAF7F2] hover:bg-[#0A2419]/60'
              }`}
            >
              <span>AI Context ({TOOLS.filter(t => t.category === 'ai').length})</span>
            </button>
            <button
              onClick={() => {
                onSelectCategory('billing');
                setSearchQuery('');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-[13px] transition-all whitespace-nowrap select-none font-medium ${
                selectedCategory === 'billing' && !searchQuery
                  ? isLight 
                    ? 'bg-[#FFFDF9] text-[#0A2618] font-semibold shadow-xs border border-[#DDD3C1]' 
                    : 'bg-[#0D2E20] text-[#FAF7F2] font-semibold border border-[#1B4D37] shadow-xs'
                  : isLight 
                    ? 'text-[#3B5445] hover:text-[#0A2618] hover:bg-[#FAF7F2]/80' 
                    : 'text-[#8AA898] hover:text-[#FAF7F2] hover:bg-[#0A2419]/60'
              }`}
            >
              <span>Invoicing ({TOOLS.filter(t => t.category === 'billing').length})</span>
            </button>
            <button
              onClick={() => {
                onSelectCategory('tabular');
                setSearchQuery('');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-[13px] transition-all whitespace-nowrap select-none font-medium ${
                selectedCategory === 'tabular' && !searchQuery
                  ? isLight 
                    ? 'bg-[#FFFDF9] text-[#0A2618] font-semibold shadow-xs border border-[#DDD3C1]' 
                    : 'bg-[#0D2E20] text-[#FAF7F2] font-semibold border border-[#1B4D37] shadow-xs'
                  : isLight 
                    ? 'text-[#3B5445] hover:text-[#0A2618] hover:bg-[#FAF7F2]/80' 
                    : 'text-[#8AA898] hover:text-[#FAF7F2] hover:bg-[#0A2419]/60'
              }`}
            >
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredTools.map((tool) => (
            <div
              key={tool.id}
              onClick={() => onSelectTool(tool.id)}
              className={`p-6 rounded-2xl border transition-all duration-200 cursor-pointer group flex flex-col justify-between h-full min-h-[220px] ${
                isLight 
                  ? 'bg-[#FFFDF9] border-[#E8E1D3] hover:border-[#1E5638] hover:shadow-xl hover:shadow-[#0A2618]/5 hover:-translate-y-0.5' 
                  : 'bg-[#0A2419]/90 border-[#123826] hover:border-[#1F593C] hover:bg-[#0D2E20] hover:shadow-xl hover:shadow-black/70 hover:-translate-y-0.5'
              }`}
            >
              <div className="space-y-3.5">
                {/* Top Category Badge */}
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-semibold tracking-wider uppercase px-2 py-0.5 rounded-md border ${
                    isLight 
                      ? 'border-[#E8E1D3] bg-[#F5F0E6] text-[#2D4A39]' 
                      : 'border-[#123826] bg-[#061A12] text-[#8AA898]'
                  }`}>
                    {tool.categoryName}
                  </span>
                </div>

                {/* Editorial Serif Headline Paired with Crisp Mono Tagline */}
                <div>
                  <h3 className={`text-base sm:text-lg font-serif font-bold tracking-tight transition-colors leading-snug ${
                    isLight ? 'text-[#0A2618] group-hover:text-[#12432B]' : 'text-[#FAF7F2] group-hover:text-[#6EE7B7]'
                  }`}>
                    {tool.name}
                  </h3>
                  <p className={`text-xs mt-1 font-mono font-medium line-clamp-1 ${
                    isLight ? 'text-[#2D4A39]' : 'text-[#8AA898]'
                  }`}>
                    {tool.tagline}
                  </p>
                </div>

                {/* Description */}
                <p className={`text-xs leading-relaxed line-clamp-2 ${
                  isLight ? 'text-[#3B5445] font-normal' : 'text-[#7C9C8C]'
                }`}>
                  {tool.description}
                </p>
              </div>

              {/* Bottom Card Action Footer */}
              <div className={`pt-3.5 border-t flex items-center justify-between text-xs font-mono transition-colors ${
                isLight 
                  ? 'border-[#EFE9DC] text-[#4A6354] group-hover:text-[#0A2618] font-medium' 
                  : 'border-[#0E2C1D] text-[#698A7A] group-hover:text-[#FAF7F2] font-medium'
              }`}>
                <span>Launch tool</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty Search State */
        <div className={`py-16 px-6 text-center rounded-2xl border ${
          isLight ? 'bg-[#FFFDF9] border-[#E8E1D3] text-[#0A2618]' : 'bg-[#0A2419]/50 border-[#123826]'
        }`}>
          <Search className="w-6 h-6 mx-auto text-[#718E7E] mb-2 opacity-50" />
          <h3 className="font-serif text-base font-semibold mb-1">
            No tools found matching "{searchQuery}"
          </h3>
          <p className={`text-xs max-w-sm mx-auto mb-4 ${isLight ? 'text-[#3B5445]' : 'text-[#8AA898]'}`}>
            Try searching for terms like <strong>API</strong>, <strong>Flow</strong>, <strong>Viva</strong>, <strong>Resume</strong>, <strong>PDF</strong>, or <strong>Invoicing</strong>.
          </p>

          <button
            onClick={() => {
              setSearchQuery('');
              onSelectCategory('all');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium ${
              isLight ? 'bg-[#0A2618] text-[#FAF7F2] hover:bg-[#12432B]' : 'bg-[#FAF7F2] text-[#061A12]'
            }`}
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Community Contribution & Support Section */}
      <div className={`p-6 sm:p-8 rounded-2xl border transition-all ${
        isLight ? 'bg-[#FFFDF9]/95 border-[#E8E1D3] shadow-sm' : 'bg-[#0A2419]/70 border-[#123826]'
      }`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left max-w-xl">
            <div className={`flex items-center justify-center md:justify-start gap-2 text-xs font-mono ${
              isLight ? 'text-[#3B5445]' : 'text-[#8AA898]'
            }`}>
              <Coffee className="w-4 h-4 text-amber-500" />
              <span>Independent & Privacy-First Project</span>
            </div>
            <h3 className={`text-lg sm:text-xl font-serif font-bold ${
              isLight ? 'text-[#0A2618]' : 'text-[#FAF7F2]'
            }`}>
              Contribute to Vayun.xyz
            </h3>
            <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-[#3B5445]' : 'text-[#8AA898]'}`}>
              Vayun.xyz is maintained independently with zero remote uploads, zero tracking, no accounts, and no paywalls. If these tools help your workflow, consider buying a coffee to support development and hosting.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            {onOpenSupport && (
              <button
                onClick={onOpenSupport}
                className={`px-4 py-2.5 rounded-xl text-xs font-mono font-medium flex items-center gap-2 border transition-all ${
                  isLight 
                    ? 'border-[#DDD3C1] bg-[#FFFDF9] hover:bg-[#EFE9DC] text-[#0A2618] shadow-xs' 
                    : 'border-[#123826] bg-[#0A2419] hover:bg-[#0F3625] text-[#FAF7F2]'
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
                  ? 'bg-[#0A2618] text-[#FAF7F2] hover:bg-[#12432B]' 
                  : 'bg-[#FAF7F2] text-[#061A12] hover:bg-[#EAE4D8]'
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
