import React, { useState, useEffect } from 'react';
import { 
  Network, 
  ShieldCheck, 
  Flame, 
  Sliders, 
  Activity, 
  Zap, 
  Check, 
  FileText, 
  FileCode2, 
  Table, 
  Layers, 
  Scissors, 
  RotateCcw,
  Sparkles,
  Cpu,
  Radar,
  Award,
  Wind,
  KeyRound,
  FileArchive,
  Image as ImageIcon,
  Receipt,
  Link,
  Minimize2,
  FileSpreadsheet
} from 'lucide-react';
import { ToolId } from '../../types';

interface ToolCardLivePreviewProps {
  toolId: ToolId;
  isLight: boolean;
}

export const ToolCardLivePreview: React.FC<ToolCardLivePreviewProps> = ({ toolId, isLight }) => {
  // Compression slider state for PDF Compress card
  const [compressRatio, setCompressRatio] = useState<number>(85);
  
  // Vayun Flow 3-node pulse step
  const [flowPulse, setFlowPulse] = useState<number>(0);

  // Chaos gust selector state
  const [selectedGust, setSelectedGust] = useState<'race' | 'latency' | 'socket'>('race');

  // Token diff toggle
  const [diffView, setDiffView] = useState<'diff' | 'clean'>('diff');

  // Pulsing animation cycle for Vayun Flow
  useEffect(() => {
    if (toolId !== 'vayun-flow') return;
    const interval = setInterval(() => {
      setFlowPulse(prev => (prev + 1) % 3);
    }, 1200);
    return () => clearInterval(interval);
  }, [toolId]);

  // 1. Vayun Flow: Animated 3-node AST graph pulsing inside the card
  if (toolId === 'vayun-flow') {
    return (
      <div className={`p-3 rounded-lg border font-mono text-[11px] select-none ${
        isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-900/80 border-neutral-800'
      }`}>
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-black/5 dark:border-white/10 text-[10px] text-neutral-400">
          <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live AST Graph
          </span>
          <span>14 Nodes • 0 Leaks</span>
        </div>

        {/* 3 Nodes with Animated Connection Flow */}
        <div className="grid grid-cols-3 gap-1.5 items-center text-center">
          {/* Node 1 */}
          <div className={`p-1.5 rounded border transition-all ${
            flowPulse === 0 
              ? isLight ? 'bg-[#0A2540] text-white border-[#0A2540] shadow-xs' : 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold'
              : isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-black/40 border-neutral-800 text-neutral-400'
          }`}>
            <div className="text-[9px] uppercase text-neutral-400">01 Root</div>
            <div className="truncate font-semibold text-[10px]">main.ts</div>
          </div>

          {/* Node 2 */}
          <div className={`p-1.5 rounded border transition-all ${
            flowPulse === 1 
              ? isLight ? 'bg-[#0A2540] text-white border-[#0A2540] shadow-xs' : 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
              : isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-black/40 border-neutral-800 text-neutral-400'
          }`}>
            <div className="text-[9px] uppercase text-neutral-400">02 Guard</div>
            <div className="truncate font-semibold text-[10px]">viva_auth()</div>
          </div>

          {/* Node 3 */}
          <div className={`p-1.5 rounded border transition-all ${
            flowPulse === 2 
              ? isLight ? 'bg-[#0A2540] text-white border-[#0A2540] shadow-xs' : 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
              : isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-black/40 border-neutral-800 text-neutral-400'
          }`}>
            <div className="text-[9px] uppercase text-neutral-400">03 Query</div>
            <div className="truncate font-semibold text-[10px]">db.find()</div>
          </div>
        </div>

        <div className="mt-2 text-[10px] text-neutral-400 flex items-center justify-between">
          <span>Execution path: 01 &rarr; 02 &rarr; 03</span>
          <span className="text-emerald-400 font-semibold">200 OK</span>
        </div>
      </div>
    );
  }

  // 2. PDF Compress: Real visual slider knob ([ ● ] 12MB → 1.8MB (-85%))
  if (toolId === 'compress-pdf') {
    const originalMb = 12.4;
    const compressedMb = (originalMb * (1 - compressRatio / 100)).toFixed(1);

    return (
      <div 
        onClick={(e) => e.stopPropagation()} 
        className={`p-3 rounded-lg border font-mono text-[11px] select-none ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-900/80 border-neutral-800'
        }`}
      >
        <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-black/5 dark:border-white/10 text-[10px]">
          <span className="text-neutral-400 font-bold uppercase tracking-wider">
            Live Stream Reducer
          </span>
          <span className="text-emerald-400 font-bold">
            -{compressRatio}% Target
          </span>
        </div>

        <div className="flex items-baseline justify-between text-xs py-1">
          <span className="text-neutral-400 line-through">
            {originalMb} MB
          </span>
          <span className="font-bold text-sm text-emerald-400">
            &rarr; {compressedMb} MB
          </span>
          <span className={`px-1.5 py-0.5 rounded text-[10px] ${
            isLight ? 'bg-[#0A2540] text-white font-semibold' : 'bg-white/10 text-white font-semibold'
          }`}>
            {(originalMb - parseFloat(compressedMb)).toFixed(1)} MB Saved
          </span>
        </div>

        {/* Real Interactive Slider Control */}
        <div className="mt-1.5 space-y-1">
          <input
            type="range"
            min="20"
            max="90"
            step="5"
            value={compressRatio}
            onChange={(e) => setCompressRatio(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer h-1.5 rounded-lg"
          />
          <div className="flex justify-between text-[9px] text-neutral-400">
            <span>Light (20%)</span>
            <span>Balanced (60%)</span>
            <span>Extreme (90%)</span>
          </div>
        </div>
      </div>
    );
  }

  // 3. Token Slimmer: Live diff preview with struck-through red comments & green clean code
  if (toolId === 'token-slimmer') {
    return (
      <div className={`p-3 rounded-lg border font-mono text-[10px] select-none overflow-hidden ${
        isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-900/80 border-neutral-800'
      }`}>
        <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-black/5 dark:border-white/10">
          <span className="text-neutral-400 font-bold uppercase tracking-wider">
            Live Prompt Diff
          </span>
          <span className="text-emerald-400 font-bold">
            -58% Token Cost
          </span>
        </div>

        <div className="space-y-0.5 text-[10px] leading-tight">
          <div className="p-1 rounded bg-rose-500/10 text-rose-400 line-through truncate">
            - // TODO: remove debug log before release
          </div>
          <div className="p-1 rounded bg-rose-500/10 text-rose-400 line-through truncate">
            - console.log("User session JWT payload:", token);
          </div>
          <div className="p-1 rounded bg-emerald-500/10 text-emerald-400 font-semibold truncate">
            + return await auth.verify(token);
          </div>
        </div>

        <div className="mt-2 text-[9px] text-neutral-400 flex items-center justify-between pt-1 border-t border-black/5 dark:border-white/5">
          <span>Tokens: 142 &rarr; 60</span>
          <span className="text-emerald-400 font-bold">$0.00 Client-Side RAM</span>
        </div>
      </div>
    );
  }

  // 4. AI Smells & Logic Radar: Live radar sweep & fragility score
  if (toolId === 'ai-smells-radar') {
    return (
      <div className={`p-3 rounded-lg border font-mono text-[11px] select-none ${
        isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-900/80 border-neutral-800'
      }`}>
        <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-black/5 dark:border-white/10 text-[10px]">
          <span className="flex items-center gap-1.5 text-rose-400 font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
            AI Fragility: 78% [HIGH RISK]
          </span>
          <span className="text-neutral-400">AST Scanner</span>
        </div>

        <div className="space-y-1">
          <div className={`p-1.5 rounded border text-[10px] ${
            isLight ? 'bg-white border-rose-200 text-rose-700' : 'bg-black/40 border-rose-900/50 text-rose-300'
          }`}>
            <span className="font-bold text-rose-500">⚠️ Line 14:</span> Unhandled Promise (Missing AbortController)
          </div>
          <div className={`p-1.5 rounded border text-[10px] ${
            isLight ? 'bg-white border-amber-200 text-amber-700' : 'bg-black/40 border-amber-900/50 text-amber-300'
          }`}>
            <span className="font-bold text-amber-500">⚠️ Line 22:</span> N+1 Database Iteration Loop
          </div>
        </div>

        <div className="mt-2 text-[10px] text-neutral-400 flex items-center justify-between">
          <span>Copilot hallucination signature</span>
          <span className="text-emerald-400 font-semibold">1-Click Auto-Fix</span>
        </div>
      </div>
    );
  }

  // 5. Chaos Wind Tunnel: Interactive wind gust simulator
  if (toolId === 'chaos-wind-tunnel') {
    return (
      <div 
        onClick={(e) => e.stopPropagation()}
        className={`p-3 rounded-lg border font-mono text-[11px] select-none ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-900/80 border-neutral-800'
        }`}
      >
        <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-black/5 dark:border-white/10 text-[10px]">
          <span className="text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1">
            <Wind className="w-3 h-3 animate-spin" />
            Turbine: 74 Knots
          </span>
          <span className="text-emerald-400 font-bold">Resilience: 96%</span>
        </div>

        {/* Gust Selector Pills */}
        <div className="grid grid-cols-3 gap-1 py-1">
          {[
            { id: 'race', label: 'Race Cond' },
            { id: 'latency', label: 'Slow 3G' },
            { id: 'socket', label: 'Drop TCP' }
          ].map(g => (
            <button
              key={g.id}
              onClick={() => setSelectedGust(g.id as any)}
              className={`p-1 rounded text-[9px] font-bold text-center transition-all ${
                selectedGust === g.id
                  ? isLight ? 'bg-[#0A2540] text-white shadow-xs' : 'bg-cyan-500 text-black font-extrabold'
                  : isLight ? 'bg-white border border-slate-200 text-slate-700' : 'bg-black/40 border border-neutral-800 text-neutral-400'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>

        <div className="mt-1.5 text-[9px] text-neutral-400 flex items-center justify-between">
          <span>Stress-testing Node/WASM loop</span>
          <span className="text-emerald-400 font-semibold">Zero Double-Spend</span>
        </div>
      </div>
    );
  }

  // 6. Viva Defense Badge: Live GitHub badge & proof token
  if (toolId === 'viva-defense-badge') {
    return (
      <div className={`p-3 rounded-lg border font-mono text-[11px] select-none ${
        isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-900/80 border-neutral-800'
      }`}>
        <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-black/5 dark:border-white/10 text-[10px]">
          <span className="text-amber-400 font-bold uppercase tracking-wider">
            Verified by Vayun
          </span>
          <span className="text-neutral-400">README Badge</span>
        </div>

        <div className="flex items-center justify-center py-1">
          <div className="inline-flex items-center rounded overflow-hidden shadow-xs">
            <span className="px-2 py-0.5 bg-[#0A2540] text-white text-[10px] font-bold">
              Verified by Vayun
            </span>
            <span className="px-2 py-0.5 bg-emerald-500 text-black text-[10px] font-extrabold">
              Defended 96%
            </span>
          </div>
        </div>

        <div className="mt-1 text-[9px] text-neutral-400 flex items-center justify-between">
          <span className="truncate">SHA256: 7f8a9...b4c</span>
          <span className="text-cyan-400 font-semibold">Recruiter Audit</span>
        </div>
      </div>
    );
  }

  // 7. Secret Detonator: Two-way secret transformation demo
  if (toolId === 'secret-detonator') {
    return (
      <div className={`p-3 rounded-lg border font-mono text-[11px] select-none ${
        isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-900/80 border-neutral-800'
      }`}>
        <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-black/5 dark:border-white/10 text-[10px]">
          <span className="text-amber-400 font-bold uppercase tracking-wider">
            Detonator &bull; Rehydrator
          </span>
          <span className="text-emerald-400 font-bold">In-Memory RAM</span>
        </div>

        <div className="space-y-1 text-[10px]">
          <div className="p-1 rounded bg-rose-500/10 text-rose-400 flex items-center justify-between">
            <span className="truncate">sk-proj-7F8A9C2... (Real Key)</span>
            <span className="text-[9px] uppercase font-bold text-rose-500">Stripped</span>
          </div>
          <div className="p-1 rounded bg-emerald-500/10 text-emerald-400 flex items-center justify-between font-semibold">
            <span className="truncate">sk-proj-MOCK_KEY_1 (Mock Token)</span>
            <span className="text-[9px] uppercase font-bold text-emerald-500">Safe Prompt</span>
          </div>
        </div>

        <div className="mt-1.5 text-[9px] text-neutral-400 flex items-center justify-between">
          <span>Reverse on return</span>
          <span className="text-cyan-400 font-semibold">Auto-Rehydrate</span>
        </div>
      </div>
    );
  }

  // 8. Local WebGPU Brain: Hardware GPU compute shader telemetry
  if (toolId === 'webgpu-brain') {
    return (
      <div className={`p-3 rounded-lg border font-mono text-[11px] select-none ${
        isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-900/80 border-neutral-800'
      }`}>
        <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-black/5 dark:border-white/10 text-[10px]">
          <span className="text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1">
            <Cpu className="w-3 h-3" />
            WebGPU Direct
          </span>
          <span className="text-emerald-400 font-bold">28.4 tok/s</span>
        </div>

        <div className="space-y-1 text-[10px]">
          <div className="flex items-center justify-between text-neutral-400">
            <span>Model:</span>
            <span className="text-slate-900 dark:text-white font-semibold">Llama 3.2 1B (Meta)</span>
          </div>
          <div className="flex items-center justify-between text-neutral-400">
            <span>VRAM Allocation:</span>
            <span className="text-emerald-400 font-semibold">880 MB Shader Buffer</span>
          </div>
        </div>

        <div className="mt-1.5 text-[9px] text-neutral-400 flex items-center justify-between">
          <span>Zero cloud egress</span>
          <span className="text-emerald-400 font-semibold">100% Offline</span>
        </div>
      </div>
    );
  }

  // 9. Resume Builder: Miniature executive A4 preview with ATS score
  if (toolId === 'resume-builder') {
    return (
      <div className={`p-3 rounded-lg border font-mono text-[11px] select-none ${
        isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-900/80 border-neutral-800'
      }`}>
        <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-black/5 dark:border-white/10 text-[10px]">
          <span className="text-neutral-400 font-bold uppercase tracking-wider">
            6 Formats &bull; Vector PDF
          </span>
          <span className="text-emerald-400 font-bold">ATS: 98/100</span>
        </div>

        <div className="flex items-center gap-2 py-1">
          <div className="w-7 h-7 rounded-full bg-[#0A2540] text-white flex items-center justify-center font-bold text-[10px]">
            CV
          </div>
          <div className="space-y-0.5 flex-1">
            <div className="h-2 w-24 bg-neutral-300 dark:bg-neutral-700 rounded-sm" />
            <div className="h-1.5 w-16 bg-neutral-200 dark:bg-neutral-800 rounded-sm" />
          </div>
          <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
            Executive
          </span>
        </div>

        <div className="mt-1 text-[9px] text-neutral-400 flex items-center justify-between">
          <span>Client-side PDF vector</span>
          <span className="text-slate-900 dark:text-white font-semibold">Photo &amp; Layout Switcher</span>
        </div>
      </div>
    );
  }

  // 10. Split PDF: High-capacity batch chunks
  if (toolId === 'split-pdf') {
    return (
      <div className={`p-3 rounded-lg border font-mono text-[11px] select-none ${
        isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-900/80 border-neutral-800'
      }`}>
        <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-black/5 dark:border-white/10 text-[10px]">
          <span className="text-neutral-400 font-bold uppercase tracking-wider">
            Multi-Hundred Pages
          </span>
          <span className="text-cyan-400 font-bold">Batch Mode</span>
        </div>

        <div className="flex items-center gap-1.5 py-1 text-[10px]">
          <span className={`px-2 py-0.5 rounded border ${
            isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-black/40 border-neutral-800 text-neutral-300'
          }`}>
            1 - 50
          </span>
          <span className={`px-2 py-0.5 rounded border ${
            isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-black/40 border-neutral-800 text-neutral-300'
          }`}>
            51 - 100
          </span>
          <span className={`px-2 py-0.5 rounded border ${
            isLight ? 'bg-[#0A2540] text-white' : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
          }`}>
            101 - 500+
          </span>
        </div>

        <div className="mt-1 text-[9px] text-neutral-400 flex items-center justify-between">
          <span>Split into fixed chunks</span>
          <span className="text-emerald-400 font-semibold">Instant Zip Export</span>
        </div>
      </div>
    );
  }

  // 11. Merge PDF: Document stack visual
  if (toolId === 'merge-pdf') {
    return (
      <div className={`p-3 rounded-lg border font-mono text-[11px] select-none ${
        isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-900/80 border-neutral-800'
      }`}>
        <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-black/5 dark:border-white/10 text-[10px]">
          <span className="text-neutral-400 font-bold uppercase tracking-wider">
            Document Combiner
          </span>
          <span className="text-emerald-400 font-bold">Lossless PDF</span>
        </div>

        <div className="flex items-center justify-between py-1 text-[10px]">
          <div className="flex items-center gap-1">
            <span className="p-1 rounded bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 truncate">
              report.pdf
            </span>
            <span>+</span>
            <span className="p-1 rounded bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 truncate">
              appendix.pdf
            </span>
          </div>
          <span className="text-emerald-400 font-bold">&rarr; unified</span>
        </div>

        <div className="mt-1 text-[9px] text-neutral-400 flex items-center justify-between">
          <span>Drag to reorder pages</span>
          <span className="text-slate-900 dark:text-white font-semibold">0 Remote Uploads</span>
        </div>
      </div>
    );
  }

  // 12. Instant Invoice: Printable invoice receipt
  if (toolId === 'invoice-maker') {
    return (
      <div className={`p-3 rounded-lg border font-mono text-[11px] select-none ${
        isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-900/80 border-neutral-800'
      }`}>
        <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-black/5 dark:border-white/10 text-[10px]">
          <span className="text-neutral-400 font-bold uppercase tracking-wider">
            INV-2026-042
          </span>
          <span className="text-emerald-400 font-bold">Total: $1,450.00</span>
        </div>

        <div className="space-y-0.5 text-[10px] text-neutral-400">
          <div className="flex justify-between">
            <span>&bull; Full-Stack React Engineering</span>
            <span className="text-slate-900 dark:text-white">$1,200.00</span>
          </div>
          <div className="flex justify-between">
            <span>&bull; Cloud Database Index Tuning</span>
            <span className="text-slate-900 dark:text-white">$250.00</span>
          </div>
        </div>

        <div className="mt-1.5 text-[9px] text-neutral-400 flex items-center justify-between pt-1 border-t border-black/5 dark:border-white/5">
          <span>Client-side PDF &amp; QR</span>
          <span className="text-cyan-400 font-semibold">PayLink Ready</span>
        </div>
      </div>
    );
  }

  // 13. Clean CSV: 2-row before-after table
  if (toolId === 'clean-csv') {
    return (
      <div className={`p-3 rounded-lg border font-mono text-[10px] select-none ${
        isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-900/80 border-neutral-800'
      }`}>
        <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-black/5 dark:border-white/10">
          <span className="text-neutral-400 font-bold uppercase tracking-wider">
            Tabular Sanitizer
          </span>
          <span className="text-emerald-400 font-bold">14 Empty Pruned</span>
        </div>

        <div className="space-y-1">
          <div className="p-1 rounded bg-rose-500/10 text-rose-400 line-through truncate">
            "John  ",  "Doe",   ,  "NA"
          </div>
          <div className="p-1 rounded bg-emerald-500/10 text-emerald-400 font-semibold truncate">
            "John","Doe","Active"
          </div>
        </div>

        <div className="mt-1 text-[9px] text-neutral-400 flex items-center justify-between">
          <span>Trim whitespace &amp; dedup</span>
          <span className="text-slate-900 dark:text-white font-semibold">100% In-RAM</span>
        </div>
      </div>
    );
  }

  // 14. Vayun Viva: Socratic examiner question
  if (toolId === 'vayun-viva') {
    return (
      <div className={`p-3 rounded-lg border font-mono text-[11px] select-none ${
        isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-900/80 border-neutral-800'
      }`}>
        <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-black/5 dark:border-white/10 text-[10px]">
          <span className="text-amber-400 font-bold uppercase tracking-wider">
            Socratic Examiner
          </span>
          <span className="text-emerald-400 font-bold">Tier III Ready</span>
        </div>

        <div className={`p-1.5 rounded border text-[10px] italic leading-tight ${
          isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-black/40 border-neutral-800 text-neutral-300'
        }`}>
          "Why did you choose a Set over an Array on line 42 for lock token lookup?"
        </div>

        <div className="mt-1.5 text-[9px] text-neutral-400 flex items-center justify-between">
          <span>O(1) vs O(N) evaluation</span>
          <span className="text-emerald-400 font-semibold">No Autocomplete AI</span>
        </div>
      </div>
    );
  }

  // Default fallback appliance preview for any other tool
  return (
    <div className={`p-3 rounded-lg border font-mono text-[11px] select-none ${
      isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-900/80 border-neutral-800'
    }`}>
      <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-black/5 dark:border-white/10 text-[10px]">
        <span className="text-neutral-400 font-bold uppercase tracking-wider">
          Client Appliance
        </span>
        <span className="text-emerald-400 font-bold">100% RAM</span>
      </div>

      <div className="py-1 text-[10px] text-neutral-400 flex items-center justify-between">
        <span>Zero server roundtrips</span>
        <span className="text-slate-900 dark:text-white font-semibold">WebAssembly</span>
      </div>

      <div className="mt-1 text-[9px] text-neutral-400 flex items-center justify-between">
        <span>Runs locally on device</span>
        <span className="text-cyan-400 font-semibold">Offline Ready</span>
      </div>
    </div>
  );
};
