import React, { useRef, useState } from 'react';
import { 
  Network, 
  ShieldCheck, 
  Key, 
  ArrowRight, 
  Cpu, 
  CheckCircle2, 
  Lock, 
  LifeBuoy, 
  Download 
} from 'lucide-react';
import { ToolId } from '../../types';
import { VayunLogo } from '../common/VayunLogo';
import { VayunWordmark } from '../common/VayunWordmark';

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
  onSelectTool,
  onOpenApiSettings,
  onOpenExtension,
  onOpenHelpdesk,
  hasApiKey
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
          ? 'bg-white/95 border-slate-200/80 shadow-[0_20px_50px_rgba(15,23,42,0.05)] backdrop-blur-md'
          : 'bg-gradient-to-b from-neutral-950 via-[#0d0e12] to-black border-neutral-800/80 shadow-2xl shadow-black/80'
      }`}
    >
      {/* Dynamic Ambient Spotlight that follows cursor */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          background: isHovering
            ? `radial-gradient(750px circle at ${mouse.x}% ${mouse.y}%, ${
                isLight ? 'rgba(59,130,246,0.06)' : 'rgba(255,255,255,0.06)'
              }, transparent 80%)`
            : `radial-gradient(600px circle at 50% 50%, ${
                isLight ? 'rgba(59,130,246,0.03)' : 'rgba(255,255,255,0.025)'
              }, transparent 80%)`,
          opacity: 1
        }}
      />

      {/* Cyber Grid Mesh */}
      <div 
        className={`pointer-events-none absolute inset-0 ${isLight ? 'opacity-0' : 'opacity-[0.02]'}`}
        style={{
          backgroundImage: `linear-gradient(${isLight ? '#0A2540' : '#fff'} 1px, transparent 1px), linear-gradient(90deg, ${isLight ? '#0A2540' : '#fff'} 1px, transparent 1px)`,
          backgroundSize: '36px 36px'
        }}
      />

      {/* Hero Content: Clean, Wide, Elegant */}
      <div className="relative z-10 p-6 sm:p-10 lg:p-14 max-w-4xl space-y-6">
        
        {/* Header Eyebrow Pill */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2.5">
            <VayunLogo size={36} className="transition-transform hover:scale-105" />
            <VayunWordmark height={28} theme={theme} />
          </div>

          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-mono font-semibold tracking-wide ${
            isLight 
              ? 'bg-blue-50/90 border-blue-200/80 text-blue-900 shadow-xs' 
              : 'bg-white/5 border-white/10 text-neutral-300'
          }`}>
            <span>The Startup Developer OS</span>
          </div>
        </div>

        {/* Main Tagline & Headline */}
        <div className="space-y-3">
          <div className={`inline-block text-xs font-mono font-bold tracking-widest uppercase px-2.5 py-0.5 rounded ${
            isLight
              ? 'bg-blue-100/80 text-blue-800 border border-blue-200/80'
              : 'bg-blue-950/60 text-blue-400 border border-blue-800/60'
          }`}>
            Zero-Data-Leakage Platform • 100% In-Browser RAM
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-5xl font-serif tracking-tight leading-[1.14] text-slate-900 dark:text-white">
            The Autonomous Intelligence Platform <br className="hidden sm:inline" />
            <span className={`italic font-serif ${isLight ? 'text-blue-700' : 'text-neutral-200'}`}>
              For Fast-Moving Startups.
            </span>
          </h1>

          <p className={`text-sm sm:text-base leading-relaxed max-w-2xl ${
            isLight ? 'text-slate-600 font-normal' : 'text-neutral-400'
          }`}>
            Engineered for founders, CTOs, and high-velocity engineers. Extract deep data insights from PDF/CSV, eliminate AI code smells in <strong className={isLight ? 'text-slate-900 font-semibold' : 'text-white'}>Vayun Flow</strong>, and slash LLM API burn by 60%—without sending a single byte to an external cloud.
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

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => onSelectTool('vayun-flow')}
            className={`px-5 py-3 rounded-xl text-xs font-mono font-semibold flex items-center gap-2.5 transition-all shadow-md group ${
              isLight 
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 border border-blue-600' 
                : 'bg-white text-black hover:bg-neutral-200 hover:shadow-lg hover:shadow-white/10'
            }`}
          >
            <Network className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span>Launch Vayun Flow</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={() => onSelectTool('data-analytics')}
            className={`px-4 py-3 rounded-xl text-xs font-mono font-medium flex items-center gap-2 border transition-all ${
              isLight 
                ? 'border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 shadow-xs hover:border-slate-300' 
                : 'border-neutral-800 bg-neutral-900/80 hover:bg-neutral-800 text-white'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Data Insights</span>
          </button>

          <button
            onClick={() => onSelectTool('vayun-viva')}
            className={`px-4 py-3 rounded-xl text-xs font-mono font-medium flex items-center gap-2 border transition-all ${
              isLight 
                ? 'border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 shadow-xs hover:border-slate-300' 
                : 'border-neutral-800 bg-neutral-900/80 hover:bg-neutral-800 text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Socratic Viva</span>
          </button>

          {onOpenExtension && (
            <button
              onClick={onOpenExtension}
              className={`px-4 py-3 rounded-xl text-xs font-mono font-medium flex items-center gap-2 border transition-all ${
                isLight 
                  ? 'border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 shadow-xs hover:border-slate-300' 
                  : 'border-neutral-800 bg-neutral-900/80 hover:bg-neutral-800 text-white'
              }`}
              title="Install Vayun as a Desktop PWA, Browser Extension, or Terminal CLI"
            >
              <Download className="w-4 h-4 opacity-70 shrink-0" />
              <span>Install App</span>
            </button>
          )}

          {onOpenHelpdesk && (
            <button
              onClick={onOpenHelpdesk}
              className={`px-4 py-3 rounded-xl text-xs font-mono font-medium flex items-center gap-2 border transition-all ${
                isLight 
                  ? 'border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 shadow-xs hover:border-slate-300' 
                  : 'border-neutral-800 bg-neutral-900/80 hover:bg-neutral-800 text-white'
              }`}
              title="Open Helpdesk, Knowledge Base & Diagnostics"
            >
              <LifeBuoy className="w-4 h-4 opacity-70 shrink-0" />
              <span>Helpdesk</span>
            </button>
          )}

          {onOpenApiSettings && (
            <button
              onClick={onOpenApiSettings}
              className={`px-3 py-3 rounded-xl text-xs font-mono font-medium flex items-center gap-2 border transition-all ${
                isLight 
                  ? 'border-slate-200/90 bg-white hover:bg-slate-50 text-slate-600 shadow-xs' 
                  : 'border-neutral-800/80 bg-neutral-900/40 hover:bg-neutral-900 text-neutral-300'
              }`}
              title="Configure Gemini API Key"
            >
              <Key className="w-3.5 h-3.5 text-neutral-400" />
              <span className="hidden sm:inline">{hasApiKey ? 'Gemini API' : 'Configure API'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSection3D;
