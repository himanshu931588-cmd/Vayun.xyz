import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  ArrowRight, 
  CornerDownLeft,
  ShieldAlert,
  Layers,
  Scissors,
  FileArchive,
  Image as ImageIcon,
  FileText,
  BrainCircuit, 
  Minimize2, 
  ShieldCheck, 
  Receipt, 
  Link, 
  Sparkles, 
  Table, 
  FileSpreadsheet, 
  FileCode2,
  Network,
  Flame,
  Scale,
  Puzzle,
  LifeBuoy,
  Bot,
  Radar,
  Award,
  Wind,
  KeyRound,
  Cpu
} from 'lucide-react';
import { TOOLS } from '../../utils/toolsData';
import { ToolId } from '../../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (id: ToolId) => void;
  onOpenOwnerConsole?: () => void;
  onOpenExtension?: () => void;
  onOpenHelpdesk?: () => void;
  onOpenChatbot?: () => void;
  theme?: 'dark' | 'light';
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectTool,
  onOpenOwnerConsole,
  onOpenExtension,
  onOpenHelpdesk,
  onOpenChatbot,
  theme = 'dark'
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const isLight = theme === 'light';

  const getToolIcon = (iconName: string) => {
    const props = { className: `w-3.5 h-3.5 stroke-[1.75] ${isLight ? 'text-black' : 'text-white'}` };
    switch (iconName) {
      case 'Network': return <Network {...props} />;
      case 'ShieldCheck': return <ShieldCheck {...props} />;
      case 'Flame': return <Flame {...props} />;
      case 'Scale': return <Scale {...props} />;
      case 'Layers': return <Layers {...props} />;
      case 'Scissors': return <Scissors {...props} />;
      case 'FileArchive': return <FileArchive {...props} />;
      case 'Image': return <ImageIcon {...props} />;
      case 'FileText': return <FileText {...props} />;
      case 'BrainCircuit': return <BrainCircuit {...props} />;
      case 'Minimize2': return <Minimize2 {...props} />;
      case 'Receipt': return <Receipt {...props} />;
      case 'Link': return <Link {...props} />;
      case 'Sparkles': return <Sparkles {...props} />;
      case 'Table': return <Table {...props} />;
      case 'FileSpreadsheet': return <FileSpreadsheet {...props} />;
      case 'FileCode2': return <FileCode2 {...props} />;
      case 'Radar': return <Radar {...props} />;
      case 'Award': return <Award {...props} />;
      case 'Wind': return <Wind {...props} />;
      case 'KeyRound': return <KeyRound {...props} />;
      case 'Cpu': return <Cpu {...props} />;
      default: return <FileText {...props} />;
    }
  };

  const cleanQuery = query.trim().toLowerCase();
  const filtered = TOOLS.filter(t => 
    !cleanQuery ||
    t.name.toLowerCase().includes(cleanQuery) ||
    t.tagline.toLowerCase().includes(cleanQuery) ||
    t.categoryName.toLowerCase().includes(cleanQuery) ||
    t.description.toLowerCase().includes(cleanQuery) ||
    t.seoSlug.toLowerCase().includes(cleanQuery) ||
    (t.keywords && t.keywords.some(k => k.toLowerCase().includes(cleanQuery)))
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % Math.max(1, filtered.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          onSelectTool(filtered[selectedIndex].id);
          onClose();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onSelectTool, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Palette Container */}
      <div className={`relative w-full max-w-xl rounded-lg border shadow-2xl overflow-hidden transition-all z-10 ${
        isLight ? 'bg-white border-neutral-300' : 'bg-neutral-950 border-neutral-800'
      }`}>
        {/* Search Input Bar */}
        <div className={`flex items-center px-4 border-b ${
          isLight ? 'border-neutral-200 bg-neutral-50/50' : 'border-neutral-800 bg-black/40'
        }`}>
          <Search className={`w-4 h-4 mr-3 shrink-0 ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a tool name, viva, flow, pdf, or token task..."
            className={`w-full py-3.5 text-xs bg-transparent focus:outline-hidden ${
              isLight ? 'text-black placeholder-neutral-400' : 'text-white placeholder-neutral-500'
            }`}
          />
          <button 
            onClick={onClose}
            className={`p-1 rounded text-xs transition-colors ${
              isLight ? 'text-neutral-400 hover:text-black' : 'text-neutral-500 hover:text-white'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {onOpenChatbot && (!cleanQuery || cleanQuery.includes('bot') || cleanQuery.includes('ai') || cleanQuery.includes('vayun') || cleanQuery.includes('chat') || cleanQuery.includes('ask') || cleanQuery.includes('copilot')) && (
            <div
              onClick={() => {
                onOpenChatbot();
                onClose();
              }}
              className="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors text-xs border border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 mb-2"
            >
              <div className="flex items-center gap-2.5">
                <Bot className="w-4 h-4 text-purple-400 shrink-0" />
                <div>
                  <div className="font-semibold text-white flex items-center gap-1.5 font-mono">
                    <span>Ask Vayun AI Copilot</span>
                    <span className="text-[9px] px-1 rounded bg-purple-500/30 text-purple-300 font-bold">ASSISTANT</span>
                  </div>
                  <div className="text-[10px] text-neutral-400 font-mono">Chat about all workstation tools, code debugging & PDF tasks (⌘J)</div>
                </div>
              </div>
              <CornerDownLeft className="w-3.5 h-3.5 opacity-60 text-purple-400" />
            </div>
          )}

          {onOpenHelpdesk && (!cleanQuery || cleanQuery.includes('help') || cleanQuery.includes('desk') || cleanQuery.includes('faq') || cleanQuery.includes('support') || cleanQuery.includes('trouble') || cleanQuery.includes('guide')) && (
            <div
              onClick={() => {
                onOpenHelpdesk();
                onClose();
              }}
              className="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors text-xs border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 mb-2"
            >
              <div className="flex items-center gap-2.5">
                <LifeBuoy className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <div className="font-semibold text-white flex items-center gap-1.5 font-mono">
                    <span>Helpdesk & Knowledge Base</span>
                    <span className="text-[9px] px-1 rounded bg-cyan-500/30 text-cyan-300 font-bold">SUPPORT</span>
                  </div>
                  <div className="text-[10px] text-neutral-400 font-mono">Search FAQs, troubleshooting guides & runtime diagnostics</div>
                </div>
              </div>
              <CornerDownLeft className="w-3.5 h-3.5 opacity-60 text-cyan-400" />
            </div>
          )}

          {onOpenExtension && (!cleanQuery || cleanQuery.includes('ext') || cleanQuery.includes('chrome') || cleanQuery.includes('edge') || cleanQuery.includes('brave') || cleanQuery.includes('plugin') || cleanQuery.includes('browser')) && (
            <div
              onClick={() => {
                onOpenExtension();
                onClose();
              }}
              className="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors text-xs border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 mb-2"
            >
              <div className="flex items-center gap-2.5">
                <Puzzle className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="font-semibold text-white flex items-center gap-1.5 font-mono">
                    <span>Vayun Browser Extension</span>
                    <span className="text-[9px] px-1 rounded bg-emerald-500/30 text-emerald-300 font-bold">CHROME & EDGE</span>
                  </div>
                  <div className="text-[10px] text-neutral-400 font-mono">Download and load unpacked 1-click toolbar extension</div>
                </div>
              </div>
              <CornerDownLeft className="w-3.5 h-3.5 opacity-60 text-emerald-400" />
            </div>
          )}

          {onOpenOwnerConsole && (cleanQuery.includes('owner') || cleanQuery.includes('log') || cleanQuery.includes('admin') || cleanQuery.includes('user')) && (
            <div
              onClick={() => {
                onOpenOwnerConsole();
                onClose();
              }}
              className="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors text-xs border border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20 mb-2"
            >
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                <div>
                  <div className="font-semibold text-white flex items-center gap-1.5 font-mono">
                    <span>Owner Backend Log Console</span>
                    <span className="text-[9px] px-1 rounded bg-red-500/30 text-red-300 font-bold">OWNER</span>
                  </div>
                  <div className="text-[10px] text-neutral-400 font-mono">View backend/logs/owner_auth.log & user registry</div>
                </div>
              </div>
              <CornerDownLeft className="w-3.5 h-3.5 opacity-60 text-red-400" />
            </div>
          )}

          {filtered.length === 0 ? (
            <div className={`py-8 text-center text-xs ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>
              No tools found matching "{query}"
            </div>
          ) : (
            filtered.map((tool, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={tool.id}
                  onClick={() => {
                    onSelectTool(tool.id);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-md cursor-pointer transition-colors text-xs ${
                    isSelected
                      ? isLight ? 'bg-neutral-100 text-black' : 'bg-neutral-900 text-white'
                      : isLight ? 'text-neutral-600 hover:bg-neutral-50' : 'text-neutral-400 hover:bg-neutral-900/50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-1.5 rounded border shrink-0 ${
                      isLight ? 'border-neutral-200 bg-white' : 'border-neutral-800 bg-neutral-950'
                    }`}>
                      {getToolIcon(tool.icon)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium truncate ${
                          isSelected 
                            ? isLight ? 'text-black' : 'text-white'
                            : isLight ? 'text-neutral-800' : 'text-neutral-200'
                        }`}>
                          {tool.name}
                        </span>
                        <span className={`text-[9px] font-mono uppercase px-1 rounded ${
                          tool.category === 'developer'
                            ? 'bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300'
                            : isLight ? 'bg-neutral-100 text-neutral-600' : 'bg-neutral-800 text-neutral-400'
                        }`}>
                          {tool.categoryName}
                        </span>
                      </div>
                      <div className={`text-[11px] truncate mt-0.5 ${
                        isLight ? 'text-neutral-500' : 'text-neutral-400'
                      }`}>
                        {tool.tagline}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="flex items-center gap-1.5 shrink-0 pl-3">
                      <span className={`text-[10px] font-mono ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>
                        Jump
                      </span>
                      <CornerDownLeft className="w-3.5 h-3.5 opacity-60" />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer Hints */}
        <div className={`px-4 py-2 border-t text-[11px] font-mono flex items-center justify-between ${
          isLight ? 'bg-neutral-50 border-neutral-200 text-neutral-500' : 'bg-black/60 border-neutral-800 text-neutral-400'
        }`}>
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <div className="text-[10px]">
            RAM Local Workstation
          </div>
        </div>
      </div>
    </div>
  );
};
