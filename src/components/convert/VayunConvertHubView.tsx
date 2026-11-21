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
          ? 'bg-gradient-to-br from-blue-50/80 via-white to-slate-50 border-slate-200/90 shadow-sm'
          : 'bg-gradient-to-br from-neutral-950 via-[#0d0e14] to-black border-neutral-800 shadow-2xl'
      }`}>
        <div className="max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold border ${
              isLight ? 'border-blue-200 bg-blue-100/70 text-blue-800' : 'border-blue-900/60 bg-blue-950/40 text-blue-400'
            }`}>
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Vayun Convert • Developer Converter Hub</span>
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              PRD v0.1 • by Himanshu Mishra
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
            Developer Formats & Encodings <br className="hidden sm:inline" />
            <span className={`italic font-serif ${isLight ? 'text-blue-600' : 'text-neutral-300'}`}>
              Converted in One Click.
            </span>
          </h1>

          <p className={`text-xs sm:text-sm leading-relaxed max-w-2xl font-normal ${
            isLight ? 'text-slate-600' : 'text-neutral-400'
          }`}>
            A free, fast, no-signup hub where developers convert data, configs, tokens, timestamps, and colors in one paste-and-click step. 100% client-side in your browser RAM with zero server telemetry.
          </p>

          {/* Guarantee Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-mono">
            <span className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${
              isLight ? 'border-slate-200 bg-white text-slate-700 shadow-xs' : 'border-neutral-800 bg-neutral-900/80 text-neutral-300'
            }`}>
              <Lock className="w-3.5 h-3.5 text-emerald-500" />
              <span>Zero Server Uploads</span>
            </span>
            <span className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${
              isLight ? 'border-slate-200 bg-white text-slate-700 shadow-xs' : 'border-neutral-800 bg-neutral-900/80 text-neutral-300'
            }`}>
              <Zap className="w-3.5 h-3.5 text-blue-500" />
              <span>Sub-2s Conversion</span>
            </span>
            <span className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${
              isLight ? 'border-slate-200 bg-white text-slate-700 shadow-xs' : 'border-neutral-800 bg-neutral-900/80 text-neutral-300'
            }`}>
              <Share2 className="w-3.5 h-3.5 text-purple-500" />
              <span>Private Shareable URLs</span>
            </span>
          </div>
        </div>
      </div>

      {/* Universal Search Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-2 border-b border-slate-200/80 dark:border-neutral-800">
        <div className="relative w-full sm:w-96">
          <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${
            isLight ? 'text-slate-400' : 'text-neutral-500'
          }`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search all 12 converters (e.g. JSON, YAML, JWT, IST, INR)..."
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-[13px] font-mono transition-colors focus:outline-hidden ${
              isLight 
                ? 'bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 shadow-xs' 
                : 'bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 focus:border-neutral-600'
            }`}
          />
        </div>

        <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
          <span>Showing {filteredConverters.length} of {converters.length} converters</span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-blue-500 hover:underline"
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
                    isLight ? 'border-blue-100 bg-blue-50 text-blue-600' : 'border-neutral-800 bg-neutral-900 text-blue-400'
                  }`}>
                    <GroupIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-serif font-bold tracking-tight text-slate-900 dark:text-white">
                      {grp.name}
                    </h2>
                    <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                      {grp.description}
                    </p>
                  </div>
                </div>

                <span className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded border ${
                  isLight ? 'border-slate-200 bg-white text-slate-600' : 'border-neutral-800 bg-neutral-900 text-neutral-400'
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
                        ? 'bg-white border-slate-200/90 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-0.5' 
                        : 'bg-neutral-950 border-neutral-800/90 hover:border-neutral-700 hover:bg-neutral-900/40 hover:shadow-xl hover:shadow-black/60 hover:-translate-y-0.5'
                    }`}
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-mono font-semibold tracking-wider uppercase px-2 py-0.5 rounded border ${
                          isLight ? 'border-slate-200 bg-slate-50 text-slate-600' : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                        }`}>
                          {conv.group}
                        </span>
                        <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Client-side</span>
                        </span>
                      </div>

                      <h3 className={`text-base font-serif font-bold tracking-tight transition-colors leading-snug ${
                        isLight ? 'text-slate-900 group-hover:text-blue-600' : 'text-white group-hover:text-neutral-200'
                      }`}>
                        {conv.name}
                      </h3>

                      <p className={`text-xs leading-relaxed line-clamp-2 ${
                        isLight ? 'text-slate-500' : 'text-neutral-400'
                      }`}>
                        {conv.tagline}
                      </p>
                    </div>

                    <div className={`pt-3 border-t flex items-center justify-between text-xs font-mono font-medium transition-colors ${
                      isLight 
                        ? 'border-slate-100 text-slate-500 group-hover:text-blue-600' 
                        : 'border-neutral-900 text-neutral-500 group-hover:text-neutral-200'
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
