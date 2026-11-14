import React, { useRef, useState } from 'react';
import { 
  Network, 
  ArrowRight, 
  Cpu, 
  CheckCircle2, 
  Lock, 
  ArrowDown
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
          ? 'bg-white/95 border-slate-200/80 shadow-[0_20px_50px_rgba(15,23,42,0.04)] backdrop-blur-md'
          : 'bg-gradient-to-b from-neutral-950 via-[#0d0e12] to-black border-neutral-800/80 shadow-2xl shadow-black/80'
      }`}
    >
      {/* Dynamic Ambient Spotlight that follows cursor */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          background: isHovering
            ? `radial-gradient(750px circle at ${mouse.x}% ${mouse.y}%, ${
                isLight ? 'rgba(59,130,246,0.05)' : 'rgba(255,255,255,0.05)'
              }, transparent 80%)`
            : `radial-gradient(600px circle at 50% 50%, ${
                isLight ? 'rgba(59,130,246,0.025)' : 'rgba(255,255,255,0.02)'
              }, transparent 80%)`,
          opacity: 1
        }}
      />

      {/* Subtle Matrix Grid */}
      <div 
        className={`pointer-events-none absolute inset-0 ${isLight ? 'opacity-0' : 'opacity-[0.02]'}`}
        style={{
          backgroundImage: `linear-gradient(${isLight ? '#0A2540' : '#fff'} 1px, transparent 1px), linear-gradient(90deg, ${isLight ? '#0A2540' : '#fff'} 1px, transparent 1px)`,
          backgroundSize: '36px 36px'
        }}
      />

      {/* Hero Content: Balanced, Authoritative, Minimal */}
      <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-4xl space-y-6">
        
        {/* Eyebrow Status Pill */}
        <div className="flex items-center gap-2.5">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono font-medium tracking-wide ${
            isLight 
              ? 'bg-blue-50/90 border-blue-200/90 text-blue-900 shadow-xs' 
              : 'bg-white/5 border-white/10 text-neutral-300'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span>Zero-Data-Leakage Workstation • 100% In-Browser RAM</span>
          </div>
        </div>

        {/* Main Headline & Description */}
        <div className="space-y-3.5">
          <h1 className="text-3xl sm:text-5xl lg:text-5xl font-serif tracking-tight leading-[1.12] text-slate-900 dark:text-white">
            The Autonomous Intelligence Platform <br className="hidden sm:inline" />
            <span className={`italic font-serif ${isLight ? 'text-blue-600' : 'text-neutral-300'}`}>
              for Fast-Moving Startups.
            </span>
          </h1>

          <p className={`text-sm sm:text-base leading-relaxed max-w-2xl font-normal ${
            isLight ? 'text-slate-600' : 'text-neutral-400'
          }`}>
            Built for founders, CTOs, and high-velocity engineers. Audit code architectures, extract deep data insights from PDF/CSV, eliminate AI smells, and slash LLM token costs—without sending a single byte to an external cloud.
          </p>
        </div>

        {/* Core Architecture Trust Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className={`px-2.5 py-1 rounded-md border flex items-center gap-1.5 ${
            isLight 
              ? 'border-slate-200/80 bg-white text-slate-700 font-medium shadow-xs' 
              : 'border-neutral-800 bg-neutral-900/80 text-neutral-300'
          }`}>
            <Lock className={`w-3.5 h-3.5 ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`} />
            <span>Zero Remote Uploads</span>
          </span>
          <span className={`px-2.5 py-1 rounded-md border flex items-center gap-1.5 ${
            isLight 
              ? 'border-slate-200/80 bg-white text-slate-700 font-medium shadow-xs' 
              : 'border-neutral-800 bg-neutral-900/80 text-neutral-300'
          }`}>
            <Cpu className={`w-3.5 h-3.5 ${isLight ? 'text-blue-600' : 'text-cyan-400'}`} />
            <span>100% In-Memory RAM</span>
          </span>
          <span className={`px-2.5 py-1 rounded-md border flex items-center gap-1.5 ${
            isLight 
              ? 'border-slate-200/80 bg-white text-slate-700 font-medium shadow-xs' 
              : 'border-neutral-800 bg-neutral-900/80 text-neutral-300'
          }`}>
            <CheckCircle2 className={`w-3.5 h-3.5 ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`} />
            <span>Free for Early-Stage Startups</span>
          </span>
        </div>

        {/* Clean, Focused Action Controls */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            onClick={() => onSelectTool('vayun-flow')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-[13px] font-mono font-semibold flex items-center gap-2 transition-all shadow-md active:scale-95 group ${
              isLight 
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 border border-blue-600' 
                : 'bg-white text-black hover:bg-neutral-200 hover:shadow-lg hover:shadow-white/10'
            }`}
          >
            <Network className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span>Launch Vayun Flow</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>

          <button
            onClick={() => onSelectTool('data-analytics')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-[13px] font-mono font-medium flex items-center gap-2 border transition-all active:scale-95 ${
              isLight 
                ? 'border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 shadow-xs hover:border-slate-300' 
                : 'border-neutral-800 bg-neutral-900/80 hover:bg-neutral-800 text-white'
            }`}
          >
            <Cpu className="w-4 h-4 opacity-80" />
            <span>Data Insights AI</span>
          </button>

          <button
            onClick={handleScrollToTools}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-[13px] font-mono font-medium flex items-center gap-1.5 transition-all select-none ${
              isLight 
                ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70' 
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
            }`}
          >
            <span>Explore All Tools</span>
            <ArrowDown className="w-3.5 h-3.5 opacity-70" />
          </button>
        </div>
      </div>
    </div>
  );
};
