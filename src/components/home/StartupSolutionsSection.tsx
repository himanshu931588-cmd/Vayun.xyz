import React, { useState } from 'react';
import { 
  Briefcase, 
  Code2, 
  Cpu, 
  Presentation, 
  ShieldCheck, 
  Receipt, 
  Radar, 
  Network, 
  KeyRound, 
  Minimize2, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Zap
} from 'lucide-react';
import { ToolId } from '../../types';

interface StartupSolutionsSectionProps {
  onSelectTool: (id: ToolId) => void;
  theme?: 'dark' | 'light';
}

export const StartupSolutionsSection: React.FC<StartupSolutionsSectionProps> = ({
  onSelectTool,
  theme = 'dark'
}) => {
  const isLight = theme === 'light';
  const [activeTab, setActiveTab] = useState<'founders' | 'engineers' | 'ai-ops'>('founders');

  const solutions = {
    founders: {
      badge: 'FOR FOUNDERS & CEOS',
      headline: 'Turn Financial Chaos into 10-Second Investor Decks & Instant Cashflow',
      description: 'Zero accounting headaches, zero manual slide design. Drop your Stripe, SaaS metrics, or P&L CSVs and get an investor-ready 5-slide McKinsey deck in under 10 seconds. Create instant invoices with zero backend fees.',
      cards: [
        {
          id: 'data-analytics' as ToolId,
          title: 'Data Insights & PPT Deck AI',
          tagline: '10-Second Pitch Deck from CSV/PDF',
          icon: Presentation,
          features: [
            'Instant 5-slide executive deck with KPI scorecard',
            'Full speaking script & notes for pitch meetings',
            'Download 16:9 PDF slides or copy directly to PowerPoint / Canva'
          ],
          highlight: '< 10s Time-to-Deck'
        },
        {
          id: 'invoice-maker' as ToolId,
          title: 'Instant Invoicing & PayLinks',
          tagline: 'Zero-Fee Micro-Transactions & Billing',
          icon: Receipt,
          features: [
            'Cryptographic zero-backend PayLink generation',
            'Printable corporate invoices with instant QR payments',
            'Zero transaction fees or merchant lock-in'
          ],
          highlight: '0% Platform Fee'
        },
        {
          id: 'resume-builder' as ToolId,
          title: 'Executive Founder Dossier',
          tagline: 'ATS 98/100 Pitch & Bio Builder',
          icon: Briefcase,
          features: [
            'Standardized executive formats for angel investors & accelerators',
            'Live A4 PDF export formatted in client-side RAM',
            'Highlights founder accomplishments and technical metrics'
          ],
          highlight: 'Investor-Ready'
        }
      ]
    },
    engineers: {
      badge: 'FOR CTOS & ENGINEERING TEAMS',
      headline: 'Catch Silent Bugs & Defend Multi-File Codebase Architecture',
      description: 'Ship high-velocity code without introducing AI hallucinations, memory leaks, or unhandled promise traps. Trace runtime AST execution across multi-tier files and verify team understanding with Socratic technical examinations.',
      cards: [
        {
          id: 'ai-smells-radar' as ToolId,
          title: 'AI Code Fragility & Smells Radar',
          tagline: 'Client-Side AST Hallucination Detector',
          icon: Radar,
          features: [
            'Flags fragile AI patterns and unhandled promise rejections',
            'Identifies silent memory leaks and unoptimized re-renders',
            '100% WebAssembly parsing with zero cloud code uploads'
          ],
          highlight: 'Zero Code Uploads'
        },
        {
          id: 'vayun-flow' as ToolId,
          title: 'Vayun Flow AST Scrubber',
          tagline: 'Multi-File Runtime Logic Trace',
          icon: Network,
          features: [
            'Transforms complex repositories into visual execution maps',
            'Scrub variable mutations, API routes, and DB lookups step-by-step',
            'Reveals exact control flow without configuring Docker testbeds'
          ],
          highlight: 'Visual Execution'
        },
        {
          id: 'vayun-viva' as ToolId,
          title: 'Vayun Viva Defense Simulator',
          tagline: 'Socratic Architecture Examination',
          icon: ShieldCheck,
          features: [
            'Tests actual understanding across 3 tiers of depth',
            'Generates verified GitHub proof badges for resumes & pull requests',
            'Anti-black-box technical defense against AI hallucination'
          ],
          highlight: 'Auditable Proof'
        }
      ]
    },
    'ai-ops': {
      badge: 'FOR AI OPERATORS & PRODUCT MANAGERS',
      headline: 'Cut 60% of LLM API Burn & Scrub Secrets Locally',
      description: 'Stop burning precious seed capital on bloated prompt contexts. Scrub customer PII and API keys locally before prompting models, rehydrate them automatically on return, and run offline models on your GPU.',
      cards: [
        {
          id: 'secret-detonator' as ToolId,
          title: 'Secret Detonator & Rehydrator',
          tagline: 'Two-Way Clipboard Privacy Scrubber',
          icon: KeyRound,
          features: [
            'Strips Bearer tokens, OpenAI keys, JWTs, and PII before prompting',
            'Replaces secrets with mock tokens for safe AI prompt pasting',
            'One-click local Rehydrate restores real credentials upon response'
          ],
          highlight: 'Zero PII Leaks'
        },
        {
          id: 'token-slimmer' as ToolId,
          title: 'Token Slimmer AI Prompt Compressor',
          tagline: '-60% Reduction in LLM API Costs',
          icon: Minimize2,
          features: [
            'Strips AST comments, log traces, and whitespace without breaking syntax',
            'Saves thousands of dollars monthly across OpenAI, Anthropic & DeepSeek',
            'Live visual token diff showing red struck comments and green code'
          ],
          highlight: '-60% API Bills'
        },
        {
          id: 'webgpu-brain' as ToolId,
          title: 'Local WebGPU Offline Brain',
          tagline: 'Runs Llama & DeepSeek on User Graphics Cards',
          icon: Cpu,
          features: [
            'Zero server API costs using Chrome WebGPU shader shaders',
            'Air-gapped offline inference for enterprise code inspection',
            'Optional Bring-Your-Own-Key (BYOK) for Google Gemini 2.0 Flash'
          ],
          highlight: '$0 Compute Cost'
        }
      ]
    }
  };

  const currentSolution = solutions[activeTab];

  return (
    <div className={`p-6 sm:p-10 rounded-3xl border transition-all ${
      isLight ? 'bg-white border-slate-200/90 shadow-sm' : 'bg-neutral-950 border-neutral-800 shadow-2xl'
    }`}>
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200/80 dark:border-neutral-800">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold tracking-wider uppercase border ${
              isLight ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-blue-900 bg-blue-950/60 text-blue-400'
            }`}>
              THE STARTUP STACK
            </span>
            <span className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
              • Built for Modern Venture-Backed Teams
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold tracking-tight text-slate-900 dark:text-white">
            Designed for Every Stage of Your Startup Journey
          </h2>
          <p className={`text-xs sm:text-sm font-sans ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
            Whether you are pitching seed investors, auditing pull requests before launch, or slashing LLM token costs, Vayun provides specialized client-side appliances.
          </p>
        </div>

        {/* Persona Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl border shrink-0 bg-slate-100 dark:bg-neutral-900 border-slate-200 dark:border-neutral-800">
          <button
            onClick={() => setActiveTab('founders')}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'founders'
                ? isLight ? 'bg-white text-blue-700 shadow-xs' : 'bg-black text-white shadow-xs'
                : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Founders</span>
          </button>

          <button
            onClick={() => setActiveTab('engineers')}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'engineers'
                ? isLight ? 'bg-white text-blue-700 shadow-xs' : 'bg-black text-white shadow-xs'
                : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>CTOs & Devs</span>
          </button>

          <button
            onClick={() => setActiveTab('ai-ops')}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'ai-ops'
                ? isLight ? 'bg-white text-blue-700 shadow-xs' : 'bg-black text-white shadow-xs'
                : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>AI Ops</span>
          </button>
        </div>
      </div>

      {/* Tab Context Banner */}
      <div className="pt-6 pb-4 space-y-1">
        <div className="text-[11px] font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-bold">
          {currentSolution.badge}
        </div>
        <h3 className="text-lg sm:text-xl font-serif font-bold text-slate-900 dark:text-white">
          {currentSolution.headline}
        </h3>
        <p className={`text-xs sm:text-sm max-w-3xl ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
          {currentSolution.description}
        </p>
      </div>

      {/* 3 Solution Tool Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
        {currentSolution.cards.map((tool) => {
          const Icon = tool.icon;
          return (
            <div
              key={tool.id}
              onClick={() => onSelectTool(tool.id)}
              className={`p-6 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between space-y-5 ${
                isLight 
                  ? 'bg-white border-slate-200/90 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/5' 
                  : 'bg-neutral-900/50 border-neutral-800 hover:border-neutral-500 hover:bg-neutral-900 hover:shadow-xl hover:shadow-black'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl border transition-colors ${
                    isLight 
                      ? 'border-blue-100 bg-blue-50 text-blue-700 group-hover:bg-blue-600 group-hover:text-white' 
                      : 'border-neutral-800 bg-neutral-900 text-white group-hover:bg-neutral-800'
                  }`}>
                    <Icon className="w-5 h-5 stroke-[1.8]" />
                  </div>
                  <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${
                    isLight 
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-800' 
                      : 'border-emerald-900/60 bg-emerald-950/50 text-emerald-400'
                  }`}>
                    {tool.highlight}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-serif font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                    {tool.title}
                  </h4>
                  <div className={`text-xs font-mono mt-0.5 ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                    {tool.tagline}
                  </div>
                </div>

                <ul className="space-y-2 text-xs">
                  {tool.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                      <span className={isLight ? 'text-slate-600' : 'text-neutral-300'}>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={`pt-3 border-t flex items-center justify-between text-xs font-mono font-semibold ${
                isLight ? 'border-slate-100 text-blue-600 group-hover:text-blue-700' : 'border-neutral-800 text-neutral-400 group-hover:text-white'
              }`}>
                <span>Launch tool for startup</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
