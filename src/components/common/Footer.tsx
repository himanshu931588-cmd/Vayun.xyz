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
  Bot,
  Download,
  Gamepad2,
  ArrowLeftRight
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
      isLight ? 'bg-[#F5F0E6] border-[#E8E1D3] text-[#3B5445]' : 'bg-[#04120C] border-[#0E2C1D] text-[#8AA898]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <VayunLogo size={24} />
              <VayunWordmark height={24} theme={theme} />
            </div>
            <p className={`text-xs leading-relaxed max-w-sm ${isLight ? 'text-[#3B5445]' : 'text-[#7C9C8C]'}`}>
              The Autonomous Developer & AI Workstation for Modern Startups. Zero remote uploads, zero data leakage, no accounts, and no paywalls.
            </p>

            {/* Support & Extension Action Buttons */}
            <div className="pt-1 flex flex-wrap items-center gap-2">
              <button
                onClick={onOpenSupport}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono transition-all ${
                  isLight 
                    ? 'border-[#DDD3C1] bg-[#FFFDF9] hover:bg-[#EFE9DC] text-[#0A2618] shadow-xs' 
                    : 'border-[#123826] bg-[#0A2419] hover:bg-[#0F3625] text-[#FAF7F2]'
                }`}
              >
                <Coffee className="w-3.5 h-3.5 opacity-70 shrink-0 text-amber-500" />
                <span>Buy Me a Coffee</span>
              </button>

              {onOpenExtension && (
                <button
                  onClick={onOpenExtension}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono transition-all ${
                    isLight 
                      ? 'border-[#DDD3C1] bg-[#FFFDF9] hover:bg-[#EFE9DC] text-[#0A2618] shadow-xs' 
                      : 'border-[#123826] bg-[#0A2419]/90 hover:bg-[#0F3625] text-[#FAF7F2]'
                  }`}
                >
                  <Download className="w-3.5 h-3.5 opacity-70 shrink-0" />
                  <span>Install App & Extension</span>
                </button>
              )}

              {onOpenHelpdesk && (
                <button
                  onClick={onOpenHelpdesk}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono transition-all ${
                    isLight 
                      ? 'border-[#DDD3C1] bg-[#FFFDF9] hover:bg-[#EFE9DC] text-[#0A2618] shadow-xs' 
                      : 'border-[#123826] bg-[#0A2419]/90 hover:bg-[#0F3625] text-[#FAF7F2]'
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
            <h4 className={`font-mono text-xs uppercase mb-3 flex items-center gap-1.5 ${isLight ? 'text-[#0A2618] font-semibold' : 'text-[#FAF7F2]'}`}>
              <Network className="w-3.5 h-3.5 opacity-70 shrink-0" />
              Developer Flow
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onSelectTool('vayun-flow')} className={`transition-colors flex items-center gap-1.5 ${isLight ? 'hover:text-[#0A2618]' : 'hover:text-[#FAF7F2]'}`}>
                  Vayun Flow
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('vayun-viva')} className={`transition-colors flex items-center gap-1.5 ${isLight ? 'hover:text-[#0A2618]' : 'hover:text-[#FAF7F2]'}`}>
                  Vayun Viva Defense
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('vayun-break')} className={`transition-colors flex items-center gap-1.5 ${isLight ? 'hover:text-[#0A2618]' : 'hover:text-[#FAF7F2]'}`}>
                  Vayun Break
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('vayun-spec')} className={`transition-colors flex items-center gap-1.5 ${isLight ? 'hover:text-[#0A2618]' : 'hover:text-[#FAF7F2]'}`}>
                  Vayun Spec
                </button>
              </li>
            </ul>
          </div>

          {/* PDF Suite */}
          <div>
            <h4 className={`font-mono text-xs uppercase mb-3 flex items-center gap-1.5 ${isLight ? 'text-[#0A2618] font-semibold' : 'text-[#FAF7F2]'}`}>
              <FileText className="w-3.5 h-3.5 opacity-70 shrink-0" />
              PDF Suite
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onSelectTool('resume-builder')} className={`transition-colors flex items-center gap-1.5 ${isLight ? 'hover:text-[#0A2618]' : 'hover:text-[#FAF7F2]'}`}>
                  Resume Builder
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('merge-pdf')} className={`transition-colors flex items-center gap-1.5 ${isLight ? 'hover:text-[#0A2618]' : 'hover:text-[#FAF7F2]'}`}>
                  Merge PDF
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('split-pdf')} className={`transition-colors flex items-center gap-1.5 ${isLight ? 'hover:text-[#0A2618]' : 'hover:text-[#FAF7F2]'}`}>
                  Split PDF
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('compress-pdf')} className={`transition-colors flex items-center gap-1.5 ${isLight ? 'hover:text-[#0A2618]' : 'hover:text-[#FAF7F2]'}`}>
                  Compress PDF
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('image-to-pdf')} className={`transition-colors flex items-center gap-1.5 ${isLight ? 'hover:text-[#0A2618]' : 'hover:text-[#FAF7F2]'}`}>
                  Image to PDF
                </button>
              </li>
            </ul>
          </div>

          {/* AI Context */}
          <div>
            <h4 className={`font-mono text-xs uppercase mb-3 flex items-center gap-1.5 ${isLight ? 'text-[#0A2618] font-semibold' : 'text-[#FAF7F2]'}`}>
              <BrainCircuit className="w-3.5 h-3.5 opacity-70 shrink-0" />
              AI Context
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onSelectTool('thread-rescuer')} className={`transition-colors flex items-center gap-1.5 ${isLight ? 'hover:text-[#0A2618]' : 'hover:text-[#FAF7F2]'}`}>
                  Thread Rescuer
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('token-slimmer')} className={`transition-colors flex items-center gap-1.5 ${isLight ? 'hover:text-[#0A2618]' : 'hover:text-[#FAF7F2]'}`}>
                  Token Slimmer
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('prompt-sanitizer')} className={`transition-colors flex items-center gap-1.5 ${isLight ? 'hover:text-[#0A2618]' : 'hover:text-[#FAF7F2]'}`}>
                  Prompt Sanitizer
                </button>
              </li>
            </ul>
          </div>

          {/* Invoicing & Tabular */}
          <div>
            <h4 className={`font-mono text-xs uppercase mb-3 flex items-center gap-1.5 ${isLight ? 'text-[#0A2618] font-semibold' : 'text-[#FAF7F2]'}`}>
              <Table className="w-3.5 h-3.5 opacity-70 shrink-0" />
              Billing & Data
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onSelectTool('invoice-maker')} className={`transition-colors flex items-center gap-1.5 ${isLight ? 'hover:text-[#0A2618]' : 'hover:text-[#FAF7F2]'}`}>
                  Instant Invoice
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('data-analytics')} className={`transition-colors flex items-center gap-1.5 font-medium ${isLight ? 'text-[#12432B] hover:text-[#0A2618]' : 'text-[#6EE7B7] hover:text-white'}`}>
                  Data Insights & PPT AI
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('clean-csv')} className={`transition-colors flex items-center gap-1.5 ${isLight ? 'hover:text-[#0A2618]' : 'hover:text-[#FAF7F2]'}`}>
                  Clean CSV
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('preserve-zeros')} className={`transition-colors flex items-center gap-1.5 ${isLight ? 'hover:text-[#0A2618]' : 'hover:text-[#FAF7F2]'}`}>
                  Preserve Zeros
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('table-converter')} className={`transition-colors flex items-center gap-1.5 ${isLight ? 'hover:text-[#0A2618]' : 'hover:text-[#FAF7F2]'}`}>
                  Table Converter
                </button>
              </li>
            </ul>
          </div>

          {/* Vayun Convert Hub */}
          <div>
            <h4 className={`font-mono text-xs uppercase mb-3 flex items-center gap-1.5 ${isLight ? 'text-[#0A2618] font-semibold' : 'text-[#FAF7F2]'}`}>
              <ArrowLeftRight className="w-3.5 h-3.5 opacity-70 shrink-0" />
              Vayun Convert
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onSelectTool('vayun-convert')} className={`transition-colors flex items-center gap-1.5 font-medium ${isLight ? 'text-[#12432B] hover:text-[#0A2618]' : 'text-[#6EE7B7] hover:text-white'}`}>
                  Convert Hub (12)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('json-to-csv')} className={`transition-colors flex items-center gap-1.5 ${isLight ? 'hover:text-[#0A2618]' : 'hover:text-[#FAF7F2]'}`}>
                  JSON to CSV
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('json-to-yaml')} className={`transition-colors flex items-center gap-1.5 ${isLight ? 'hover:text-[#0A2618]' : 'hover:text-[#FAF7F2]'}`}>
                  JSON to YAML
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('jwt-decoder')} className={`transition-colors flex items-center gap-1.5 ${isLight ? 'hover:text-[#0A2618]' : 'hover:text-[#FAF7F2]'}`}>
                  JWT Decoder
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('unix-timestamp')} className={`transition-colors flex items-center gap-1.5 ${isLight ? 'hover:text-[#0A2618]' : 'hover:text-[#FAF7F2]'}`}>
                  Unix to IST/UTC
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('number-to-words-inr')} className={`transition-colors flex items-center gap-1.5 ${isLight ? 'hover:text-[#0A2618]' : 'hover:text-[#FAF7F2]'}`}>
                  INR to Words
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`mt-12 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono ${
          isLight ? 'border-[#E8E1D3] text-[#3B5445]' : 'border-[#0E2C1D] text-[#8AA898]'
        }`}>
          <div>
            © {new Date().getFullYear()} vayun.xyz • All operations execute client-side in RAM.
          </div>

          <div className="flex items-center gap-4">
            {onOpenChatbot && (
              <button onClick={onOpenChatbot} className="hover:underline flex items-center gap-1 text-[#3B5445] dark:text-[#A3C7B5] hover:text-[#0A2618] dark:hover:text-white">
                <Bot className="w-3 h-3 opacity-70 shrink-0" />
                <span>Ask Vayun AI</span>
              </button>
            )}
            {onOpenHelpdesk && (
              <button onClick={onOpenHelpdesk} className="hover:underline flex items-center gap-1 text-[#3B5445] dark:text-[#A3C7B5] hover:text-[#0A2618] dark:hover:text-white">
                <LifeBuoy className="w-3 h-3 opacity-70 shrink-0" />
                <span>Helpdesk</span>
              </button>
            )}
            {onOpenExtension && (
              <button onClick={onOpenExtension} className="hover:underline flex items-center gap-1 text-[#3B5445] dark:text-[#A3C7B5] hover:text-[#0A2618] dark:hover:text-white">
                <Download className="w-3 h-3 opacity-70 shrink-0" />
                <span>Install Options</span>
              </button>
            )}
            <button 
              onClick={() => {
                const el = document.getElementById('arcade-snake');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                }
              }} 
              className="hover:underline flex items-center gap-1 text-[#3B5445] dark:text-[#A3C7B5] hover:text-emerald-600 dark:hover:text-emerald-400"
              title="Play Terminal Snake Game"
            >
              <Gamepad2 className="w-3 h-3 opacity-70 shrink-0" />
              <span>Play Snake</span>
            </button>
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
              <button onClick={onOpenOwnerConsole} className="hover:underline text-[#7C9C8C] hover:text-white flex items-center gap-1">
                <span>Owner Logs</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
