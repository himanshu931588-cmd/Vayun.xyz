import React from 'react';
import { ToolId } from '../../types';
import { VayunLogo } from './VayunLogo';
import { VayunWordmark } from './VayunWordmark';
import { 
  Layers, 
  Scissors, 
  FileArchive, 
  Image as ImageIcon, 
  FileText, 
  BrainCircuit, 
  Minimize2, 
  ShieldCheck, 
  Receipt, 
  Table, 
  FileSpreadsheet, 
  FileCode2,
  Network,
  Flame,
  Scale,
  Coffee,
  Puzzle,
  LifeBuoy,
  Bot
} from 'lucide-react';

interface FooterProps {
  onSelectTool: (id: ToolId) => void;
  onOpenSecurityAuditor?: () => void;
  onOpenShortcuts?: () => void;
  onOpenOwnerConsole?: () => void;
  onOpenSupport?: () => void;
  onOpenExtension?: () => void;
  onOpenHelpdesk?: () => void;
  onOpenChatbot?: () => void;
  theme?: 'dark' | 'light';
}

export const Footer: React.FC<FooterProps> = ({ 
  onSelectTool, 
  onOpenSecurityAuditor,
  onOpenShortcuts,
  onOpenOwnerConsole,
  onOpenSupport,
  onOpenExtension,
  onOpenHelpdesk,
  onOpenChatbot,
  theme = 'dark' 
}) => {
  const isLight = theme === 'light';

  return (
    <footer className={`mt-20 border-t text-xs transition-colors ${
      isLight ? 'bg-white/80 border-slate-200/90 text-slate-600' : 'bg-black border-neutral-900 text-neutral-400'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <VayunLogo size={24} />
              <VayunWordmark height={24} theme={theme} />
            </div>
            <p className={`text-xs leading-relaxed max-w-sm ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
              The Anti-Black-Box Developer & Defense Platform. Zero remote uploads, zero tracking, no accounts, no paywalls.
            </p>

            {/* Support & Extension Action Buttons */}
            <div className="pt-1 flex flex-wrap items-center gap-2">
              <button
                onClick={onOpenSupport}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono transition-all ${
                  isLight 
                    ? 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800 shadow-xs' 
                    : 'border-neutral-800 bg-neutral-900 hover:bg-neutral-850 text-neutral-200'
                }`}
              >
                <Coffee className="w-3.5 h-3.5 opacity-70 shrink-0" />
                <span>Buy Me a Coffee</span>
              </button>

              {onOpenExtension && (
                <button
                  onClick={onOpenExtension}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono transition-all ${
                    isLight 
                      ? 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800 shadow-xs' 
                      : 'border-neutral-800 bg-neutral-900/50 hover:bg-neutral-850 text-neutral-300'
                  }`}
                >
                  <Puzzle className="w-3.5 h-3.5 opacity-70 shrink-0" />
                  <span>Browser Extension</span>
                </button>
              )}

              {onOpenHelpdesk && (
                <button
                  onClick={onOpenHelpdesk}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono transition-all ${
                    isLight 
                      ? 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800 shadow-xs' 
                      : 'border-neutral-800 bg-neutral-900/50 hover:bg-neutral-850 text-neutral-300'
                  }`}
                >
                  <LifeBuoy className="w-3.5 h-3.5 opacity-70 shrink-0" />
                  <span>Helpdesk & FAQ</span>
                </button>
              )}
            </div>
          </div>

          {/* Developer Flow */}
          <div>
            <h4 className={`font-mono text-xs uppercase mb-3 flex items-center gap-1.5 ${isLight ? 'text-slate-900 font-semibold' : 'text-neutral-300'}`}>
              <Network className="w-3.5 h-3.5 opacity-70 shrink-0" />
              Developer Flow
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onSelectTool('vayun-flow')} className={`transition-colors flex items-center gap-1.5 ${isLight ? 'hover:text-blue-600' : 'hover:text-white'}`}>
                  Vayun Flow
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('vayun-viva')} className={`transition-colors flex items-center gap-1.5 ${isLight ? 'hover:text-blue-600' : 'hover:text-white'}`}>
                  Vayun Viva Defense
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('vayun-break')} className={`transition-colors flex items-center gap-1.5 ${isLight ? 'hover:text-blue-600' : 'hover:text-white'}`}>
                  Vayun Break
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('vayun-spec')} className={`transition-colors flex items-center gap-1.5 ${isLight ? 'hover:text-blue-600' : 'hover:text-white'}`}>
                  Vayun Spec
                </button>
              </li>
            </ul>
          </div>

          {/* PDF Suite */}
          <div>
            <h4 className={`font-mono text-xs uppercase mb-3 flex items-center gap-1.5 ${isLight ? 'text-slate-900 font-semibold' : 'text-neutral-300'}`}>
              <FileText className="w-3.5 h-3.5 opacity-70 shrink-0" />
              PDF Suite
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onSelectTool('resume-builder')} className={`transition-colors flex items-center gap-1.5 ${isLight ? 'hover:text-blue-600' : 'hover:text-white'}`}>
                  Resume Builder
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('merge-pdf')} className={`transition-colors flex items-center gap-1.5 ${isLight ? 'hover:text-blue-600' : 'hover:text-white'}`}>
                  Merge PDF
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('split-pdf')} className={`transition-colors flex items-center gap-1.5 ${isLight ? 'hover:text-blue-600' : 'hover:text-white'}`}>
                  Split PDF
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('compress-pdf')} className={`transition-colors flex items-center gap-1.5 ${isLight ? 'hover:text-blue-600' : 'hover:text-white'}`}>
                  Compress PDF
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('image-to-pdf')} className={`transition-colors flex items-center gap-1.5 ${isLight ? 'hover:text-blue-600' : 'hover:text-white'}`}>
                  Image to PDF
                </button>
              </li>
            </ul>
          </div>

          {/* AI Context */}
          <div>
            <h4 className={`font-mono text-xs uppercase mb-3 flex items-center gap-1.5 ${isLight ? 'text-slate-900 font-semibold' : 'text-neutral-300'}`}>
              <BrainCircuit className="w-3.5 h-3.5 opacity-70 shrink-0" />
              AI Context
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onSelectTool('thread-rescuer')} className={`transition-colors flex items-center gap-1.5 ${isLight ? 'hover:text-blue-600' : 'hover:text-white'}`}>
                  Thread Rescuer
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('token-slimmer')} className={`transition-colors flex items-center gap-1.5 ${isLight ? 'hover:text-blue-600' : 'hover:text-white'}`}>
                  Token Slimmer
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('prompt-sanitizer')} className={`transition-colors flex items-center gap-1.5 ${isLight ? 'hover:text-blue-600' : 'hover:text-white'}`}>
                  Prompt Sanitizer
                </button>
              </li>
            </ul>
          </div>

          {/* Invoicing & Tabular */}
          <div>
            <h4 className={`font-mono text-xs uppercase mb-3 flex items-center gap-1.5 ${isLight ? 'text-slate-900 font-semibold' : 'text-neutral-300'}`}>
              <Table className="w-3.5 h-3.5 opacity-70 shrink-0" />
              Billing & Data
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onSelectTool('invoice-maker')} className={`transition-colors flex items-center gap-1.5 ${isLight ? 'hover:text-blue-600' : 'hover:text-white'}`}>
                  Instant Invoice
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('clean-csv')} className={`transition-colors flex items-center gap-1.5 ${isLight ? 'hover:text-blue-600' : 'hover:text-white'}`}>
                  Clean CSV
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('preserve-zeros')} className={`transition-colors flex items-center gap-1.5 ${isLight ? 'hover:text-blue-600' : 'hover:text-white'}`}>
                  Preserve Zeros
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('table-converter')} className={`transition-colors flex items-center gap-1.5 ${isLight ? 'hover:text-blue-600' : 'hover:text-white'}`}>
                  Table Converter
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`mt-12 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono ${
          isLight ? 'border-slate-200 text-slate-500' : 'border-neutral-900 text-neutral-400'
        }`}>
          <div>
            © {new Date().getFullYear()} vayun.xyz • All operations execute client-side in RAM.
          </div>

          <div className="flex items-center gap-4">
            {onOpenChatbot && (
              <button onClick={onOpenChatbot} className="hover:underline flex items-center gap-1 text-slate-600 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-white">
                <Bot className="w-3 h-3 opacity-70 shrink-0" />
                <span>Ask Vayun AI</span>
              </button>
            )}
            {onOpenHelpdesk && (
              <button onClick={onOpenHelpdesk} className="hover:underline flex items-center gap-1 text-slate-600 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-white">
                <LifeBuoy className="w-3 h-3 opacity-70 shrink-0" />
                <span>Helpdesk</span>
              </button>
            )}
            {onOpenExtension && (
              <button onClick={onOpenExtension} className="hover:underline flex items-center gap-1 text-slate-600 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-white">
                <Puzzle className="w-3 h-3 opacity-70 shrink-0" />
                <span>Browser Extension</span>
              </button>
            )}
            {onOpenSecurityAuditor && (
              <button onClick={onOpenSecurityAuditor} className="hover:underline">
                RAM Security Guarantee
              </button>
            )}
            {onOpenShortcuts && (
              <button onClick={onOpenShortcuts} className="hover:underline">
                Keyboard Shortcuts (?)
              </button>
            )}
            {onOpenOwnerConsole && (
              <button onClick={onOpenOwnerConsole} className="hover:underline text-neutral-400 hover:text-white flex items-center gap-1">
                <span>Owner Logs</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
