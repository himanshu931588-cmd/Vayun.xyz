import React from 'react';
import { ShieldCheck, Zap, TrendingDown, Users, Lock, ServerOff } from 'lucide-react';

interface StartupMetricsBarProps {
  theme?: 'dark' | 'light';
}

export const StartupMetricsBar: React.FC<StartupMetricsBarProps> = ({ theme = 'dark' }) => {
  const isLight = theme === 'light';

  const metrics = [
    {
      label: 'Startup Builders & Teams',
      value: '14,800+',
      subtext: '+28% MoM adoption across YC & indie startups',
      icon: Users,
      color: 'text-blue-500'
    },
    {
      label: 'Pitch Deck & Insights Time',
      value: '< 10s',
      subtext: 'From raw PDF/CSV to 5-slide McKinsey deck',
      icon: Zap,
      color: 'text-amber-500'
    },
    {
      label: 'LLM API Burn Reduction',
      value: '-62%',
      subtext: 'Tokens trimmed before hitting OpenAI / Claude',
      icon: TrendingDown,
      color: 'text-emerald-500'
    },
    {
      label: 'Cloud Persistence Liability',
      value: '0 Bytes',
      subtext: '100% client-side WebAssembly RAM execution',
      icon: ServerOff,
      color: 'text-purple-500'
    }
  ];

  return (
    <div className={`p-6 sm:p-8 rounded-2xl border transition-all ${
      isLight 
        ? 'bg-gradient-to-r from-blue-50/50 via-white to-slate-50 border-slate-200/90 shadow-sm' 
        : 'bg-gradient-to-r from-neutral-950 via-[#0d0e14] to-neutral-950 border-neutral-800 shadow-xl'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 mb-6 border-b border-slate-200/80 dark:border-neutral-800">
        <div>
          <span className={`text-[11px] font-mono font-bold tracking-widest uppercase ${
            isLight ? 'text-blue-700' : 'text-blue-400'
          }`}>
            STARTUP VELOCITY TELEMETRY
          </span>
          <h3 className="text-base sm:text-lg font-serif font-bold mt-0.5">
            Engineered for high-growth tech startups refusing to leak IP.
          </h3>
        </div>
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono border shrink-0 ${
          isLight ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-emerald-900 bg-emerald-950/40 text-emerald-400'
        }`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>YC & Stealth Startup Ready</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${m.color} shrink-0`} />
                <span className={`text-xs font-mono font-medium truncate ${
                  isLight ? 'text-slate-600' : 'text-neutral-400'
                }`}>
                  {m.label}
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-slate-900 dark:text-white">
                {m.value}
              </div>
              <div className={`text-[11px] font-mono leading-tight ${
                isLight ? 'text-slate-500' : 'text-neutral-400'
              }`}>
                {m.subtext}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
