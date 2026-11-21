import React, { useRef, useState } from 'react';
import { 
  ArrowRight, 
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
          ? 'bg-[#FFFDF9]/95 border-[#E8E1D3] shadow-[0_20px_50px_rgba(10,38,24,0.04)] backdrop-blur-md'
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
      <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-4xl space-y-6">
        
        {/* Eyebrow Status Pill */}
        <div className="flex items-center gap-2.5">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono font-medium tracking-wide ${
            isLight 
              ? 'bg-[#EFE9DC]/90 border-[#DDD3C1] text-[#0A2618] shadow-xs' 
              : 'bg-[#0D2E20]/80 border-[#194E36] text-[#A3C7B5]'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span>Zero-Data-Leakage Workstation • 100% In-Browser RAM</span>
          </div>
        </div>

        {/* Main Headline & Description */}
        <div className="space-y-3.5">
          <h1 className="text-3xl sm:text-5xl lg:text-5xl font-serif tracking-tight leading-[1.12] text-[#0A2618] dark:text-[#FAF7F2]">
            The Autonomous Intelligence Platform <br className="hidden sm:inline" />
            <span className={`italic font-serif ${isLight ? 'text-[#12432B]' : 'text-[#6EE7B7]'}`}>
              for Fast-Moving Startups.
            </span>
          </h1>

          <p className={`text-sm sm:text-base leading-relaxed max-w-2xl font-normal ${
            isLight ? 'text-[#2D4A39]' : 'text-[#8AA898]'
          }`}>
            Built for founders, CTOs, and high-velocity engineers. Audit code architectures, extract deep data insights from PDF/CSV, eliminate AI smells, and slash LLM token costs—without sending a single byte to an external cloud.
          </p>
        </div>

        {/* Core Architecture Trust Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className={`px-2.5 py-1 rounded-md border ${
            isLight 
              ? 'border-[#E8E1D3] bg-[#FFFDF9] text-[#0A2618] font-medium shadow-xs' 
              : 'border-[#123826] bg-[#0A2419] text-[#A3C7B5]'
          }`}>
            <span>Zero Remote Uploads</span>
          </span>
          <span className={`px-2.5 py-1 rounded-md border ${
            isLight 
              ? 'border-[#E8E1D3] bg-[#FFFDF9] text-[#0A2618] font-medium shadow-xs' 
              : 'border-[#123826] bg-[#0A2419] text-[#A3C7B5]'
          }`}>
            <span>100% In-Memory RAM</span>
          </span>
          <span className={`px-2.5 py-1 rounded-md border ${
            isLight 
              ? 'border-[#E8E1D3] bg-[#FFFDF9] text-[#0A2618] font-medium shadow-xs' 
              : 'border-[#123826] bg-[#0A2419] text-[#A3C7B5]'
          }`}>
            <span>Free for Early-Stage Startups</span>
          </span>
        </div>

        {/* Clean, Focused Action Controls */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
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
            <span>Vayun Convert (12 Tools)</span>
          </button>

          <button
            onClick={handleScrollToTools}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-[13px] font-mono font-medium flex items-center gap-1.5 transition-all select-none ${
              isLight 
                ? 'text-[#2D4A39] hover:text-[#0A2618] hover:bg-[#EFE9DC]/70' 
                : 'text-[#8AA898] hover:text-[#FAF7F2] hover:bg-[#0A2419]'
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
