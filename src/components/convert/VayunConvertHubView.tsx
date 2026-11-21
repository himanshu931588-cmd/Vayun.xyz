import React, { useState } from 'react';
import { 
  ArrowLeftRight, 
  Search, 
  Lock, 
  Zap, 
  FileCode2, 
  Key, 
  Clock, 
  Palette, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  Layers,
  CheckCircle2,
  Table,
  FileSpreadsheet,
  Cpu,
  Share2
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
      icon: Table,
      description: 'Nested JSON, CSV spreadsheets, YAML manifests, and structured XML',
      badge: '5 Tools',
      items: filteredConverters.filter(c => c.group === 'Data Formats')
    },
    {
      name: 'Encoding',
      icon: Key,
      description: 'UTF-8 safe Base64, URL percent-encoding, and client-side JWT claims',
      badge: '3 Tools',
      items: filteredConverters.filter(c => c.group === 'Encoding')
    },
    {
      name: 'Time & Numbers',
      icon: Clock,
      description: 'Epoch timestamp to IST/UTC, and INR currency amount to words (Lakh/Crore)',
      badge: '2 Tools',
      items: filteredConverters.filter(c => c.group === 'Time & Numbers')
    },
    {
      name: 'Frontend',
      icon: Palette,
      description: 'HEX to RGB/HSL with live color preview, and px to rem with custom root font',
      badge: '2 Tools',
      items: filteredConverters.filter(c => c.group === 'Frontend')
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10 animate-fade-in">
      
      {/* Vayun Convert Hero Banner */}
      <div className={`p-6 sm:p-10 rounded-3xl border relative overflow-hidden transition-all ${
        isLight
          ? 'bg-[#FFFDF9]/95 border-[#E8E1D3] shadow-sm'
          : 'bg-gradient-to-br from-[#0A2419] via-[#061A12] to-[#04120C] border-[#133A27] shadow-2xl'
      }`}>
        <div className="max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold border ${
              isLight ? 'border-[#DDD3C1] bg-[#EFE9DC] text-[#0A2618]' : 'border-[#194E36] bg-[#0D2E20] text-[#A3C7B5]'
            }`}>
              <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-500" />
              <span>Vayun Convert • Developer Converter Hub</span>
            </span>
            <span className={`text-[11px] font-mono ${isLight ? 'text-[#3B5445]' : 'text-[#8AA898]'}`}>
              PRD v0.1 • by Himanshu Mishra
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-[#0A2618] dark:text-[#FAF7F2] leading-tight">
            Developer Formats & Encodings <br className="hidden sm:inline" />
            <span className={`italic font-serif ${isLight ? 'text-[#12432B]' : 'text-[#6EE7B7]'}`}>
              Converted in One Click.
            </span>
          </h1>

          <p className={`text-xs sm:text-sm leading-relaxed max-w-2xl font-normal ${
            isLight ? 'text-[#2D4A39]' : 'text-[#8AA898]'
          }`}>
            A free, fast, no-signup hub where developers convert data, configs, tokens, timestamps, and colors in one paste-and-click step. 100% client-side in your browser RAM with zero server telemetry.
          </p>

          {/* Guarantee Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-mono">
            <span className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${
              isLight ? 'border-[#E8E1D3] bg-[#FFFDF9] text-[#0A2618] shadow-xs' : 'border-[#123826] bg-[#0A2419] text-[#A3C7B5]'
            }`}>
              <Lock className="w-3.5 h-3.5 text-emerald-500" />
              <span>Zero Server Uploads</span>
            </span>
            <span className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${
              isLight ? 'border-[#E8E1D3] bg-[#FFFDF9] text-[#0A2618] shadow-xs' : 'border-[#123826] bg-[#0A2419] text-[#A3C7B5]'
            }`}>
              <Zap className="w-3.5 h-3.5 text-emerald-500" />
              <span>Sub-2s Conversion</span>
            </span>
            <span className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${
              isLight ? 'border-[#E8E1D3] bg-[#FFFDF9] text-[#0A2618] shadow-xs' : 'border-[#123826] bg-[#0A2419] text-[#A3C7B5]'
            }`}>
              <Share2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Private Shareable URLs</span>
            </span>
          </div>
        </div>
      </div>

      {/* Universal Search Filter */}
      <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 pb-2 border-b ${
        isLight ? 'border-[#E8E1D3]' : 'border-[#123826]'
      }`}>
        <div className="relative w-full sm:w-96">
          <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${
            isLight ? 'text-[#718E7E]' : 'text-[#5A7A6A]'
          }`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search all 12 converters (e.g. JSON, YAML, JWT, IST, INR)..."
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-[13px] font-mono transition-colors focus:outline-hidden ${
              isLight 
                ? 'bg-[#FFFDF9] border border-[#E8E1D3] text-[#0A2618] placeholder-[#718E7E] focus:border-[#1E5638] shadow-xs' 
                : 'bg-[#0A2419] border border-[#123826] text-[#FAF7F2] placeholder-[#5A7A6A] focus:border-[#226343]'
            }`}
          />
        </div>

        <div className={`text-xs font-mono flex items-center gap-2 ${
          isLight ? 'text-[#3B5445]' : 'text-[#8AA898]'
        }`}>
          <span>Showing {filteredConverters.length} of {converters.length} converters</span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-emerald-600 dark:text-emerald-400 hover:underline"
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
          const GroupIcon = grp.icon;

          return (
            <div key={grp.name} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl border ${
                    isLight ? 'border-[#DDD3C1] bg-[#EFE9DC] text-[#0A2618]' : 'border-[#194E36] bg-[#0D2E20] text-[#6EE7B7]'
                  }`}>
                    <GroupIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-serif font-bold tracking-tight text-[#0A2618] dark:text-[#FAF7F2]">
                      {grp.name}
                    </h2>
                    <p className={`text-xs ${isLight ? 'text-[#3B5445]' : 'text-[#8AA898]'}`}>
                      {grp.description}
                    </p>
                  </div>
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
                        <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Client-side</span>
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
