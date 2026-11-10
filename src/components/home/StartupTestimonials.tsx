import React from 'react';
import { Star, Quote } from 'lucide-react';

interface StartupTestimonialsProps {
  theme?: 'dark' | 'light';
}

export const StartupTestimonials: React.FC<StartupTestimonialsProps> = ({ theme = 'dark' }) => {
  const isLight = theme === 'light';

  const testimonials = [
    {
      quote: "We turned our monthly Stripe metrics and churn numbers into a 5-slide seed investor update in literally 4 seconds. No manual Canva formatting, just pure quantitative insights.",
      author: "Alex Chen",
      role: "Co-Founder & CEO",
      company: "NexusAI (YC W24)",
      badge: "YC W24 Alum"
    },
    {
      quote: "Vayun Flow caught a silent unhandled promise leak and an N+1 query in our Prisma backend right before our Product Hunt launch. It saved us from a disastrous Day 1 outage.",
      author: "Priya Nair",
      role: "Chief Technology Officer",
      company: "FleetScale Engine",
      badge: "Seed-Stage Fintech"
    },
    {
      quote: "The Token Slimmer and Secret Detonator cut our OpenAI API bills from $3,800 to $1,450 a month. For a bootstrapped startup, that's two months of additional runway.",
      author: "Marcus Vance",
      role: "Solo Founder",
      company: "DocuSense Labs",
      badge: "IndieHacker"
    }
  ];

  return (
    <div className={`p-6 sm:p-10 rounded-3xl border ${
      isLight ? 'bg-gradient-to-b from-white to-blue-50/20 border-slate-200/90' : 'bg-neutral-950/80 border-neutral-800'
    }`}>
      <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
        <span className={`text-[11px] font-mono font-bold tracking-widest uppercase px-2.5 py-0.5 rounded border ${
          isLight ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-blue-900 bg-blue-950/60 text-blue-400'
        }`}>
          WALL OF PROOF
        </span>
        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white">
          Loved by High-Velocity Founders & Tech Leads
        </h3>
        <p className={`text-xs sm:text-sm ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
          See how early-stage teams use Vayun to ship cleaner code and fundraise faster.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {testimonials.map((t, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-2xl border flex flex-col justify-between space-y-4 transition-all ${
              isLight 
                ? 'bg-white border-slate-200/90 shadow-xs hover:border-blue-300' 
                : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                  isLight ? 'border-blue-100 bg-blue-50 text-blue-700' : 'border-neutral-700 bg-neutral-800 text-neutral-300'
                }`}>
                  {t.badge}
                </span>
              </div>
              <p className={`text-xs sm:text-[13px] leading-relaxed italic ${
                isLight ? 'text-slate-700' : 'text-neutral-300'
              }`}>
                "{t.quote}"
              </p>
            </div>

            <div className={`pt-3 border-t flex items-center gap-3 ${
              isLight ? 'border-slate-100' : 'border-neutral-800'
            }`}>
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-mono text-xs font-bold flex items-center justify-center shrink-0">
                {t.author.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-serif font-bold truncate text-slate-900 dark:text-white">
                  {t.author}
                </div>
                <div className={`text-[10px] font-mono truncate ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                  {t.role} • {t.company}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
