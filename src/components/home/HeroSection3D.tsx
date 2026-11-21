import React, { useRef, useState } from 'react';
import { 
  ArrowRight, 
  ArrowDown,
  Sparkles,
  Search
} from 'lucide-react';
import { ToolId } from '../../types';

interface HeroSection3DProps {
  theme: 'dark' | 'light';
  onSelectTool: (id: ToolId) => void;
  onOpenApiSettings?: () => void;
  onOpenExtension?: () => void;
  onOpenHelpdesk?: () => void;
  hasApiKey: boolean;
}

export const HeroSection3D: React.FC<HeroSection3DProps> = ({
  theme,
  onSelectTool
}) => {
  const isLight = theme === 'light';
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMouse({ x, y });
  };

  const handleScrollToTools = () => {
    const el = document.getElementById('tools-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const flagshipSuites = [
    {
      id: 'vayun-flow' as ToolId,
      name: 'Developer Flow',
      tagline: 'AST call graphs & viva defense',
      badge: 'Flagship'
    },
    {
      id: 'vayun-convert' as ToolId,
      name: 'Vayun Convert',
      tagline: '12 client-side format converters',
      badge: '12 Tools'
    },
    {
      id: 'merge-pdf' as ToolId,
      name: 'PDF & Documents',
      tagline: 'Merge, split & vector compress',
      badge: 'Client-side'
    },
    {
      id: 'token-slimmer' as ToolId,
      name: 'AI & Tokens',
      tagline: 'Slim LLM context & save 40%',
      badge: 'Cost Saver'
    }
  ];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setMouse({ x: 50, y: 50 });
      }}
      className={`relative rounded-3xl border overflow-hidden transition-all duration-300 ${
        isLight
          ? 'bg-[#FFFDF9]/95 border-[#E8E1D3] shadow-[0_20px_50px_rgba(10,38,24,0.03)] backdrop-blur-md'
          : 'bg-gradient-to-b from-[#0A2419] via-[#061A12] to-[#04120C] border-[#133A27] shadow-2xl shadow-black/80'
      }`}
    >
      {/* Dynamic Ambient Spotlight that follows cursor */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          background: isHovering
            ? `radial-gradient(750px circle at ${mouse.x}% ${mouse.y}%, ${
                isLight ? 'rgba(16,185,129,0.06)' : 'rgba(110,231,183,0.06)'
              }, transparent 80%)`
            : `radial-gradient(600px circle at 50% 50%, ${
                isLight ? 'rgba(16,185,129,0.03)' : 'rgba(110,231,183,0.03)'
              }, transparent 80%)`,
          opacity: 1
        }}
      />

      {/* Subtle Matrix Grid */}
      <div 
        className={`pointer-events-none absolute inset-0 ${isLight ? 'opacity-0' : 'opacity-[0.03]'}`}
        style={{
          backgroundImage: `linear-gradient(${isLight ? '#0A2618' : '#6EE7B7'} 1px, transparent 1px), linear-gradient(90deg, ${isLight ? '#0A2618' : '#6EE7B7'} 1px, transparent 1px)`,
          backgroundSize: '36px 36px'
        }}
      />

      {/* Hero Content: Balanced, Authoritative, Minimal */}
      <div className="relative z-10 p-6 sm:p-10 lg:p-12 space-y-8">
        
        {/* Top Status & Verification Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border tracking-wide ${
            isLight 
              ? 'bg-[#EFE9DC]/90 border-[#DDD3C1] text-[#0A2618] shadow-xs' 
              : 'bg-[#0D2E20]/80 border-[#194E36] text-[#A3C7B5]'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span>Active Workstation • 100% In-Browser RAM</span>
          </div>

          <div className={`hidden sm:flex items-center gap-2 text-[11px] ${
            isLight ? 'text-[#3B5445]' : 'text-[#8AA898]'
          }`}>
            <span>Telemetry: Zero</span>
            <span>•</span>
            <span>Local Compute</span>
            <span>•</span>
            <span>No Accounts Required</span>
          </div>
        </div>

        {/* Main Headline & Description */}
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-serif tracking-tight leading-[1.12] text-[#0A2618] dark:text-[#FAF7F2]">
            The Autonomous Developer Workstation <br className="hidden sm:inline" />
            <span className={`italic font-serif ${isLight ? 'text-[#12432B]' : 'text-[#6EE7B7]'}`}>
              for High-Velocity Teams.
            </span>
          </h1>

          <p className={`text-sm sm:text-base leading-relaxed font-normal max-w-2xl ${
            isLight ? 'text-[#2D4A39]' : 'text-[#8AA898]'
          }`}>
            Audit code architectures, convert developer formats, extract tabular intelligence, and slash LLM tokens in memory—with absolute zero remote data leakage.
          </p>
        </div>

        {/* 4 Interactive Featured Suite Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {flagshipSuites.map((suite) => (
            <div
              key={suite.id}
              onClick={() => onSelectTool(suite.id)}
              className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer group flex flex-col justify-between ${
                isLight 
                  ? 'bg-white/80 border-[#E8E1D3] hover:border-[#1E5638] hover:bg-white hover:shadow-md hover:-translate-y-0.5' 
                  : 'bg-[#0A2419]/80 border-[#123826] hover:border-[#1F593C] hover:bg-[#0D2E20] hover:shadow-lg hover:-translate-y-0.5'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${
                    isLight ? 'border-[#E8E1D3] bg-[#F5F0E6] text-[#2D4A39]' : 'border-[#123826] bg-[#061A12] text-[#8AA898]'
                  }`}>
                    {suite.badge}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className={`text-sm font-serif font-bold tracking-tight pt-1 ${
                  isLight ? 'text-[#0A2618] group-hover:text-[#12432B]' : 'text-[#FAF7F2] group-hover:text-[#6EE7B7]'
                }`}>
                  {suite.name}
                </h3>
                <p className={`text-xs font-mono line-clamp-1 ${
                  isLight ? 'text-[#3B5445]' : 'text-[#8AA898]'
                }`}>
                  {suite.tagline}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Clean, Focused Action Controls */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => onSelectTool('vayun-flow')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-[13px] font-mono font-semibold flex items-center gap-2 transition-all shadow-md active:scale-95 group ${
              isLight 
                ? 'bg-[#0A2618] text-[#FAF7F2] hover:bg-[#12432B] shadow-[#0A2618]/20 hover:shadow-lg hover:shadow-[#0A2618]/30 border border-[#0A2618]' 
                : 'bg-[#FAF7F2] text-[#061A12] hover:bg-[#EAE4D8] hover:shadow-lg hover:shadow-white/10 font-bold'
            }`}
          >
            <span>Launch Vayun Flow</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>

          <button
            onClick={() => onSelectTool('vayun-convert')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-[13px] font-mono font-medium flex items-center gap-2 border transition-all active:scale-95 ${
              isLight 
                ? 'border-[#E8E1D3] bg-[#FFFDF9] hover:bg-[#F5F0E6] text-[#0A2618] shadow-xs hover:border-[#DDD3C1]' 
                : 'border-[#123826] bg-[#0A2419] hover:bg-[#0E3223] text-[#FAF7F2]'
            }`}
          >
            <span>Vayun Convert Hub</span>
          </button>

          <button
            onClick={handleScrollToTools}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-[13px] font-mono font-medium flex items-center gap-1.5 transition-all select-none ${
              isLight 
                ? 'text-[#2D4A39] hover:text-[#0A2618] hover:bg-[#EFE9DC]/70' 
                : 'text-[#8AA898] hover:text-[#FAF7F2] hover:bg-[#0A2419]'
            }`}
          >
            <span>All 22 Tools</span>
            <ArrowDown className="w-3.5 h-3.5 opacity-70" />
          </button>
        </div>
      </div>
    </div>
  );
};
