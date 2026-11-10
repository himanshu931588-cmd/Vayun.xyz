import React, { useState, useRef, useEffect } from 'react';
import { 
  Network, 
  ShieldCheck, 
  FileText, 
  Key, 
  ArrowRight, 
  Cpu,
  Activity,
  CheckCircle2,
  Lock,
  Puzzle,
  LifeBuoy
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
  const card3dRef = useRef<HTMLDivElement>(null);

  const [mouse, setMouse] = useState({ x: 50, y: 50 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [pulseStep, setPulseStep] = useState(0);

  // Periodic pulse step for the 3D execution visualizer
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseStep(prev => (prev + 1) % 4);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Smooth tilt angle calculation
    const tiltX = (0.5 - (y / 100)) * 14;
    const tiltY = ((x / 100) - 0.5) * 18;

    setMouse({ x, y });
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => {
    setIsHovering(false);
    setTilt({ x: 0, y: 0 });
    setMouse({ x: 50, y: 50 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-3xl border overflow-hidden transition-all duration-300 ${
        isLight
          ? 'bg-gradient-to-b from-white via-neutral-50/80 to-neutral-100/60 border-neutral-200/90 shadow-xl shadow-neutral-200/50'
          : 'bg-gradient-to-b from-neutral-950 via-[#0d0e12] to-black border-neutral-800/80 shadow-2xl shadow-black/80'
      }`}
    >
      {/* Dynamic Ambient Spotlight that follows cursor */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          background: isHovering
            ? `radial-gradient(750px circle at ${mouse.x}% ${mouse.y}%, ${
                isLight ? 'rgba(0,0,0,0.035)' : 'rgba(255,255,255,0.06)'
              }, transparent 80%)`
            : `radial-gradient(600px circle at 50% 50%, ${
                isLight ? 'rgba(0,0,0,0.015)' : 'rgba(255,255,255,0.025)'
              }, transparent 80%)`,
          opacity: 1
        }}
      />

      {/* Cyber Grid Reflection Mesh */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(${isLight ? '#000' : '#fff'} 1px, transparent 1px), linear-gradient(90deg, ${isLight ? '#000' : '#fff'} 1px, transparent 1px)`,
          backgroundSize: '36px 36px'
        }}
      />

      {/* Main Responsive Grid: Content (Left) + 3D Holographic Engine (Right) */}
      <div className="relative z-10 p-6 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        
        {/* Left Column: Branding, Mission, and Direct Actions */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Header Eyebrow Pill */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2.5">
              <VayunLogo size={36} className="transition-transform hover:scale-105" />
              <VayunWordmark height={28} theme={theme} />
            </div>

            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-mono font-medium ${
              isLight 
                ? 'bg-neutral-100 border-neutral-200 text-neutral-700' 
                : 'bg-white/5 border-white/10 text-neutral-300'
            }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Anti-Black-Box Platform</span>
            </div>
          </div>

          {/* Main Headline */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-serif tracking-tight leading-[1.12]">
              Understand Every Line <br className="hidden sm:inline" />
              <span className={`italic font-serif ${isLight ? 'text-neutral-800' : 'text-neutral-200'}`}>
                You Ship to Production.
              </span>
            </h1>

            <p className={`text-sm sm:text-base leading-relaxed max-w-xl ${
              isLight ? 'text-neutral-600' : 'text-neutral-400'
            }`}>
              The developer workstation for coding students and software engineers. Trace multi-file runtime logic in <strong>Vayun Flow</strong> and defend code in interactive Socratic <strong>Vayun Viva</strong> simulations.
            </p>
          </div>

          {/* Core Architecture Trust Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className={`px-2.5 py-1 rounded-md border flex items-center gap-1.5 ${
              isLight ? 'border-neutral-200 bg-white text-neutral-700' : 'border-neutral-800 bg-neutral-900/80 text-neutral-300'
            }`}>
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>Zero Remote Uploads</span>
            </span>
            <span className={`px-2.5 py-1 rounded-md border flex items-center gap-1.5 ${
              isLight ? 'border-neutral-200 bg-white text-neutral-700' : 'border-neutral-800 bg-neutral-900/80 text-neutral-300'
            }`}>
              <Cpu className="w-3 h-3 text-cyan-400" />
              <span>100% In-Memory RAM</span>
            </span>
            <span className={`px-2.5 py-1 rounded-md border flex items-center gap-1.5 ${
              isLight ? 'border-neutral-200 bg-white text-neutral-700' : 'border-neutral-800 bg-neutral-900/80 text-neutral-300'
            }`}>
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>No Accounts • No Paywalls</span>
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onSelectTool('vayun-flow')}
              className={`px-5 py-3 rounded-xl text-xs font-mono font-medium flex items-center gap-2.5 transition-all shadow-md group ${
                isLight 
                  ? 'bg-black text-white hover:bg-neutral-800 hover:shadow-lg' 
                  : 'bg-white text-black hover:bg-neutral-200 hover:shadow-lg hover:shadow-white/10'
              }`}
            >
              <Network className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span>Launch Vayun Flow</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => onSelectTool('vayun-viva')}
              className={`px-4 py-3 rounded-xl text-xs font-mono font-medium flex items-center gap-2 border transition-all ${
                isLight 
                  ? 'border-neutral-300 bg-white hover:bg-neutral-100 text-black' 
                  : 'border-neutral-800 bg-neutral-900/80 hover:bg-neutral-800 text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Vayun Viva Defense</span>
            </button>

            <button
              onClick={() => onSelectTool('resume-builder')}
              className={`px-4 py-3 rounded-xl text-xs font-mono font-medium flex items-center gap-2 border transition-all ${
                isLight 
                  ? 'border-neutral-300 bg-white hover:bg-neutral-100 text-black' 
                  : 'border-neutral-800 bg-neutral-900/80 hover:bg-neutral-800 text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Resume Builder</span>
            </button>

            {onOpenExtension && (
              <button
                onClick={onOpenExtension}
                className={`px-4 py-3 rounded-xl text-xs font-mono font-medium flex items-center gap-2 border transition-all ${
                  isLight 
                    ? 'border-neutral-300 bg-white hover:bg-neutral-100 text-black' 
                    : 'border-neutral-800 bg-neutral-900/80 hover:bg-neutral-800 text-white'
                }`}
                title="Download Vayun Browser Extension for Chrome, Edge, and Brave"
              >
                <Puzzle className="w-4 h-4 text-emerald-400" />
                <span>Extension</span>
              </button>
            )}

            {onOpenHelpdesk && (
              <button
                onClick={onOpenHelpdesk}
                className={`px-4 py-3 rounded-xl text-xs font-mono font-medium flex items-center gap-2 border transition-all ${
                  isLight 
                    ? 'border-neutral-300 bg-white hover:bg-neutral-100 text-black' 
                    : 'border-neutral-800 bg-neutral-900/80 hover:bg-neutral-800 text-white'
                }`}
                title="Open Helpdesk, Knowledge Base & Diagnostics"
              >
                <LifeBuoy className="w-4 h-4 text-cyan-400" />
                <span>Helpdesk</span>
              </button>
            )}

            {onOpenApiSettings && (
              <button
                onClick={onOpenApiSettings}
                className={`px-3 py-3 rounded-xl text-xs font-mono font-medium flex items-center gap-2 border transition-all ${
                  isLight 
                    ? 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-700' 
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

        {/* Right Column: Interactive 3D Perspective Holographic Visualizer */}
        <div className="lg:col-span-5 flex justify-center items-center">
          <div
            ref={card3dRef}
            style={{
              transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(${
                isHovering ? '1.02, 1.02, 1.02' : '1, 1, 1'
              })`,
              transformStyle: 'preserve-3d',
              transition: isHovering ? 'transform 0.1s ease-out' : 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)'
            }}
            className={`w-full max-w-md rounded-2xl border p-5 shadow-2xl relative select-none backdrop-blur-md ${
              isLight
                ? 'bg-white/90 border-neutral-200/90 shadow-neutral-300/40'
                : 'bg-neutral-900/80 border-white/10 shadow-black/80'
            }`}
          >
            {/* Top macOS-style window header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="text-[11px] font-mono text-neutral-400 ml-2">vayun-flow://inspect</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>ACTIVE TRACE</span>
              </div>
            </div>

            {/* 3D Flow Visualizer Nodes with Animated Pulse Cables */}
            <div className="space-y-3 relative py-1">
              
              {/* Connecting Wire SVG with animated pulse dot */}
              <svg 
                className="absolute left-6 top-6 bottom-6 w-8 pointer-events-none stroke-neutral-500/30"
                fill="none"
              >
                <path d="M 4 10 L 4 110" strokeDasharray="3 3" strokeWidth="1.5" />
              </svg>

              {/* Node 1: Entry Point */}
              <div className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                pulseStep === 0 || pulseStep === 1
                  ? isLight ? 'bg-neutral-100 border-neutral-400' : 'bg-white/10 border-white/30 shadow-md'
                  : isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-neutral-950/80 border-neutral-800'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                    pulseStep === 0 ? 'bg-emerald-500 text-black' : isLight ? 'bg-neutral-200 text-black' : 'bg-neutral-800 text-white'
                  }`}>
                    01
                  </div>
                  <div>
                    <div className="text-xs font-mono font-semibold flex items-center gap-1.5">
                      <span>main.ts &rarr; handleRequest()</span>
                    </div>
                    <div className="text-[10px] font-mono text-neutral-400">
                      Multi-file execution root
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  200 OK
                </span>
              </div>

              {/* Node 2: Socratic Defense Check */}
              <div className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                pulseStep === 2
                  ? isLight ? 'bg-neutral-100 border-neutral-400' : 'bg-white/10 border-white/30 shadow-md'
                  : isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-neutral-950/80 border-neutral-800'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                    pulseStep === 2 ? 'bg-cyan-500 text-black' : isLight ? 'bg-neutral-200 text-black' : 'bg-neutral-800 text-white'
                  }`}>
                    02
                  </div>
                  <div>
                    <div className="text-xs font-mono font-semibold">
                      viva_defense.ts &rarr; verify()
                    </div>
                    <div className="text-[10px] font-mono text-neutral-400">
                      Socratic logic examination
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  DEFENDED
                </span>
              </div>

              {/* Node 3: Zero-Upload Local Memory Isolation */}
              <div className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                pulseStep === 3
                  ? isLight ? 'bg-neutral-100 border-neutral-400' : 'bg-white/10 border-white/30 shadow-md'
                  : isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-neutral-950/80 border-neutral-800'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                    pulseStep === 3 ? 'bg-amber-400 text-black' : isLight ? 'bg-neutral-200 text-black' : 'bg-neutral-800 text-white'
                  }`}>
                    03
                  </div>
                  <div>
                    <div className="text-xs font-mono font-semibold">
                      ram_sandbox.wasm
                    </div>
                    <div className="text-[10px] font-mono text-neutral-400">
                      Client-side RAM execution
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20">
                  0 UPLOADS
                </span>
              </div>

            </div>

            {/* Bottom Telemetry Bar */}
            <div className={`mt-4 pt-3 border-t flex items-center justify-between text-[10px] font-mono ${
              isLight ? 'border-neutral-200 text-neutral-500' : 'border-white/10 text-neutral-400'
            }`}>
              <div className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>Memory: 14.8 MB (RAM only)</span>
              </div>
              <div className="text-neutral-500">
                Latency: 8ms
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HeroSection3D;
