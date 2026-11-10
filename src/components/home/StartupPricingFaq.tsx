import React, { useState } from 'react';
import { Check, ChevronDown, ChevronUp, ShieldCheck, Zap, Sparkles, Building2, Rocket } from 'lucide-react';
import { ToolId } from '../../types';

interface StartupPricingFaqProps {
  onSelectTool: (id: ToolId) => void;
  onOpenApiSettings?: () => void;
  theme?: 'dark' | 'light';
}

export const StartupPricingFaq: React.FC<StartupPricingFaqProps> = ({
  onSelectTool,
  onOpenApiSettings,
  theme = 'dark'
}) => {
  const isLight = theme === 'light';
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const plans = [
    {
      name: 'Seed & Bootstrapped',
      badge: 'POPULAR FOR FOUNDERS',
      price: '$0',
      period: 'forever',
      description: 'Ideal for early-stage founders, solo hackers, and lean YC teams building MVP to PMF.',
      features: [
        '100% In-Browser RAM execution',
        'Instant 10s Pitch Deck AI (PDF/CSV)',
        'AI Fragility & Code Smells Radar',
        'Vayun Flow AST Scrubber',
        'Zero-Backend Invoicing & PayLinks',
        'Secret Detonator & Token Slimmer',
        'No accounts, credit cards, or paywalls'
      ],
      ctaText: 'Start Building Free',
      action: () => onSelectTool('data-analytics'),
      highlighted: true
    },
    {
      name: 'Growth & Series A',
      badge: 'BRING YOUR OWN KEY',
      price: '$0',
      period: 'platform fee',
      description: 'For scaling teams with existing cloud infrastructure looking for hyper-speed Gemini 2.0 Flash reasoning.',
      features: [
        'Everything in Seed & Bootstrapped',
        'Direct connection to Google Gemini 2.0 Flash',
        'Zero markup on API token costs',
        'Custom executive pitch slide themes',
        'Multi-file Socratic Placement Examiner',
        'Local encrypted API key storage (browser-only)',
        'Prioritized local execution pipelines'
      ],
      ctaText: 'Configure BYOK Key',
      action: onOpenApiSettings || (() => onSelectTool('data-analytics')),
      highlighted: false
    },
    {
      name: 'Enterprise On-Prem',
      badge: 'AIR-GAPPED COMPLIANCE',
      price: 'Custom',
      period: 'or free local WASM',
      description: 'For regulated fintech, healthcare, and enterprise startups requiring zero external network transfer.',
      features: [
        '100% Offline WebGPU execution',
        'Zero remote network calls (air-gapped)',
        'Local Llama 3.2 & DeepSeek R1 models',
        'Strict SOC2 & GDPR data compliance',
        'Custom AST rules for internal libraries',
        'Desktop PWA & Terminal CLI integration',
        'Comprehensive RAM security audit certificate'
      ],
      ctaText: 'Audit Security Guarantee',
      action: () => onSelectTool('webgpu-brain'),
      highlighted: false
    }
  ];

  const faqs = [
    {
      q: 'Is our startup’s source code or financial data sent to your servers?',
      a: 'Never. Every calculation, CSV statistical aggregation, AST parse, and PDF extraction executes 100% inside your browser’s local memory (RAM) via WebAssembly. We do not operate an ingestion database and your data is permanently discarded the instant you close the tab.'
    },
    {
      q: 'How does the 10-Second Pitch Deck AI help in fundraising and investor updates?',
      a: 'Founders can drag and drop raw CSVs (Stripe metrics, MRR, user cohorts, unit economics) or PDF operational briefs. Within 10 seconds, Vayun computes growth deltas, averages, and anomaly flags, synthesizing a complete 5-slide McKinsey-style presentation deck with slide-by-slide speaker notes. You can export as PDF or copy directly to PowerPoint, Canva, or Google Slides.'
    },
    {
      q: 'How does Token Slimmer reduce our startup’s LLM API burn rate?',
      a: 'Most startup code bases generated with Cursor or Copilot contain repetitive boilerplate, console logs, and comments that blow up prompt tokens. Token Slimmer parses the AST locally, safely trimming up to 62% of unnecessary tokens without altering runtime logic, saving thousands of dollars every month on OpenAI and Anthropic bills.'
    },
    {
      q: 'What is the "Anti-Black-Box" philosophy and Socratic Viva Defense?',
      a: 'Investors and senior technical leaders increasingly worry that startup founders and engineering hires rely entirely on AI autocomplete without understanding core architecture. Vayun Viva conducts a rigorous 3-tier Socratic technical interview on your actual code, verifying you can defend algorithmic choices, Big-O complexity, and database transactions.'
    },
    {
      q: 'Can our startup install Vayun as a native desktop application?',
      a: 'Yes. Vayun is packaged as a Progressive Web App (PWA) with offline capabilities, a Chrome/Edge browser extension for one-click prompt scrubbing, and a terminal CLI for local script workflows.'
    },
    {
      q: 'Why is Vayun free for seed startups without a paywall?',
      a: 'Because our architecture runs client-side in your browser RAM, our backend server costs are nearly zero. We believe early-stage founders should spend their seed capital on customer acquisition and product growth, not expensive developer utility subscriptions.'
    }
  ];

  return (
    <div className="space-y-12 pt-6">
      {/* Startup Pricing Tiers */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold tracking-wider uppercase border ${
              isLight ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-blue-900 bg-blue-950/60 text-blue-400'
            }`}>
              TRANSPARENT PRICING
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold tracking-tight text-slate-900 dark:text-white">
            Zero Hidden Fees. 100% Startup Friendly.
          </h2>
          <p className={`text-xs sm:text-sm font-sans ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
            Built for bootstrapped hackers and venture-backed startups alike. No recurring subscriptions or lock-in.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((p, idx) => (
            <div
              key={idx}
              className={`p-6 sm:p-8 rounded-3xl border flex flex-col justify-between transition-all relative ${
                p.highlighted
                  ? isLight
                    ? 'bg-white border-2 border-blue-600 shadow-xl shadow-blue-500/10'
                    : 'bg-neutral-900/90 border-2 border-blue-500 shadow-2xl shadow-blue-500/10'
                  : isLight
                    ? 'bg-white border-slate-200/90 shadow-xs'
                    : 'bg-neutral-950 border-neutral-800'
              }`}
            >
              {p.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-blue-600 text-white font-mono text-[10px] font-bold tracking-wider uppercase shadow-sm">
                  {p.badge}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white">
                    {p.name}
                  </h3>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 dark:text-white">
                      {p.price}
                    </span>
                    <span className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                      / {p.period}
                    </span>
                  </div>
                  <p className={`text-xs mt-2 ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
                    {p.description}
                  </p>
                </div>

                <div className={`pt-4 border-t ${isLight ? 'border-slate-100' : 'border-neutral-800'}`}>
                  <ul className="space-y-2.5 text-xs">
                    {p.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className={isLight ? 'text-slate-700' : 'text-neutral-300'}>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="button"
                  onClick={p.action}
                  className={`w-full py-3 rounded-xl font-mono text-xs font-semibold transition-all active:scale-98 shadow-xs ${
                    p.highlighted
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                      : isLight
                        ? 'border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                        : 'border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-white'
                  }`}
                >
                  {p.ctaText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Startup FAQ Section */}
      <div className={`p-6 sm:p-10 rounded-3xl border ${
        isLight ? 'bg-white border-slate-200/90' : 'bg-neutral-950 border-neutral-800'
      }`}>
        <div className="max-w-2xl mx-auto text-center mb-8 space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold tracking-wider uppercase border ${
              isLight ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-blue-900 bg-blue-950/60 text-blue-400'
            }`}>
              KNOWLEDGE BASE
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white">
            Frequently Asked Questions for Founders & CTOs
          </h3>
          <p className={`text-xs sm:text-sm ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
            Everything you need to know about security, compliance, speed, and data privacy.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isOpen
                    ? isLight ? 'bg-blue-50/40 border-blue-200' : 'bg-neutral-900/60 border-neutral-700'
                    : isLight ? 'bg-white border-slate-200 hover:border-slate-300' : 'bg-neutral-950 border-neutral-850 hover:border-neutral-750'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 select-none"
                >
                  <span className={`text-xs sm:text-sm font-semibold font-serif ${
                    isOpen ? (isLight ? 'text-blue-900' : 'text-white') : (isLight ? 'text-slate-800' : 'text-neutral-200')
                  }`}>
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 shrink-0 text-blue-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 shrink-0 text-slate-400" />
                  )}
                </button>

                {isOpen && (
                  <div className={`px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-[13px] leading-relaxed font-sans ${
                    isLight ? 'text-slate-600' : 'text-neutral-300'
                  }`}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
