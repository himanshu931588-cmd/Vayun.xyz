import React, { useState } from 'react';
import { 
  ArrowLeft,
  Search, 
  ArrowRight
} from 'lucide-react';
import { ToolId } from '../../types';
import { CONVERTERS_REGISTRY, ConverterMetaItem } from '../../utils/converters/converterMetadata';

interface VayunConvertHubViewProps {
  theme: 'dark' | 'light';
  onSelectTool: (id: ToolId) => void;
  onBack?: () => void;
}

export const VayunConvertHubView: React.FC<VayunConvertHubViewProps> = ({
  theme,
  onSelectTool,
  onBack
}) => {
  const isLight = theme === 'light';
  const [searchQuery, setSearchQuery] = useState('');

  const converters = Object.values(CONVERTERS_REGISTRY);

  const cleanQuery = searchQuery.trim().toLowerCase();
  const filteredConverters = converters.filter(c => {
    if (!cleanQuery) return true;
    return (
      c.name.toLowerCase().includes(cleanQuery) ||
      c.tagline.toLowerCase().includes(cleanQuery) ||
      c.group.toLowerCase().includes(cleanQuery) ||
      c.id.toLowerCase().includes(cleanQuery)
    );
  });

  const groups = [
    {
      name: 'Data Formats',
      description: 'Nested JSON, CSV spreadsheets, YAML manifests, and structured XML',
      badge: '5 Tools',
      items: filteredConverters.filter(c => c.group === 'Data Formats')
    },
    {
      name: 'Encoding',
      description: 'UTF-8 safe Base64, URL percent-encoding, and client-side JWT claims',
      badge: '3 Tools',
      items: filteredConverters.filter(c => c.group === 'Encoding')
    },
    {
      name: 'Time & Numbers',
      description: 'Epoch timestamp to IST/UTC, and INR currency amount to words (Lakh/Crore)',
      badge: '2 Tools',
      items: filteredConverters.filter(c => c.group === 'Time & Numbers')
    },
    {
      name: 'Frontend',
      description: 'HEX to RGB/HSL with live color preview, and px to rem with custom root font',
      badge: '2 Tools',
      items: filteredConverters.filter(c => c.group === 'Frontend')
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
      
      {/* Sleek Top Navigation & Universal Search */}
      <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b ${
        isLight ? 'border-[#E8E1D3]' : 'border-[#123826]'
      }`}>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {onBack && (
            <button
              onClick={onBack}
              className={`p-2.5 rounded-xl border transition-all active:scale-95 ${
                isLight ? 'border-[#E8E1D3] bg-[#FFFDF9] hover:bg-[#F5F0E6] text-[#0A2618]' : 'border-[#123826] bg-[#0A2419] hover:bg-[#0E3223] text-[#FAF7F2]'
              }`}
              title="Back to Overview"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-[#0A2618] dark:text-[#FAF7F2]">
              Developer Converters
            </h1>
            <p className={`text-xs mt-0.5 font-mono ${isLight ? 'text-[#3B5445]' : 'text-[#8AA898]'}`}>
              12 Client-side converters • 100% in-browser RAM
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${
              isLight ? 'text-[#718E7E]' : 'text-[#5A7A6A]'
            }`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search converters (JSON, YAML, JWT, IST)..."
              className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-[13px] font-mono transition-colors focus:outline-hidden ${
                isLight 
                  ? 'bg-[#FFFDF9] border border-[#E8E1D3] text-[#0A2618] placeholder-[#718E7E] focus:border-[#1E5638] shadow-xs' 
                  : 'bg-[#0A2419] border border-[#123826] text-[#FAF7F2] placeholder-[#5A7A6A] focus:border-[#226343]'
              }`}
            />
          </div>

          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs font-mono text-emerald-600 dark:text-emerald-400 hover:underline shrink-0"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* 4 Feature Groups */}
      <div className="space-y-10">
        {groups.map((grp) => {
          if (grp.items.length === 0) return null;

          return (
            <div key={grp.name} className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base sm:text-lg font-serif font-bold tracking-tight text-[#0A2618] dark:text-[#FAF7F2]">
                    {grp.name}
                  </h2>
                  <p className={`text-xs ${isLight ? 'text-[#3B5445]' : 'text-[#8AA898]'}`}>
                    {grp.description}
                  </p>
                </div>

                <span className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded border ${
                  isLight ? 'border-[#E8E1D3] bg-[#FFFDF9] text-[#0A2618]' : 'border-[#123826] bg-[#0A2419] text-[#A3C7B5]'
                }`}>
                  {grp.items.length} {grp.items.length === 1 ? 'tool' : 'tools'}
                </span>
              </div>

              {/* Converter Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {grp.items.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => onSelectTool(conv.id)}
                    className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer group flex flex-col justify-between min-h-[180px] ${
                      isLight 
                        ? 'bg-[#FFFDF9] border-[#E8E1D3] hover:border-[#1E5638] hover:shadow-lg hover:shadow-[#0A2618]/5 hover:-translate-y-0.5' 
                        : 'bg-[#0A2419]/90 border-[#123826] hover:border-[#1F593C] hover:bg-[#0D2E20] hover:shadow-xl hover:shadow-black/60 hover:-translate-y-0.5'
                    }`}
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-mono font-semibold tracking-wider uppercase px-2 py-0.5 rounded border ${
                          isLight ? 'border-[#E8E1D3] bg-[#F5F0E6] text-[#2D4A39]' : 'border-[#123826] bg-[#061A12] text-[#8AA898]'
                        }`}>
                          {conv.group}
                        </span>
                        <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                          Client-side
                        </span>
                      </div>

                      <h3 className={`text-base font-serif font-bold tracking-tight transition-colors leading-snug ${
                        isLight ? 'text-[#0A2618] group-hover:text-[#12432B]' : 'text-[#FAF7F2] group-hover:text-[#6EE7B7]'
                      }`}>
                        {conv.name}
                      </h3>

                      <p className={`text-xs leading-relaxed line-clamp-2 ${
                        isLight ? 'text-[#3B5445]' : 'text-[#8AA898]'
                      }`}>
                        {conv.tagline}
                      </p>
                    </div>

                    <div className={`pt-3 border-t flex items-center justify-between text-xs font-mono font-medium transition-colors ${
                      isLight 
                        ? 'border-[#EFE9DC] text-[#4A6354] group-hover:text-[#0A2618]' 
                        : 'border-[#0E2C1D] text-[#698A7A] group-hover:text-[#FAF7F2]'
                    }`}>
                      <span>Launch converter</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
