import React from 'react';
import { Keyboard, X, Command } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: 'dark' | 'light';
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
  theme = 'dark'
}) => {
  const isLight = theme === 'light';
  if (!isOpen) return null;

  const shortcuts = [
    { key: '⌘K / Ctrl+K', desc: 'Open global command spotlight to jump to any tool' },
    { key: '⌘J / Ctrl+J', desc: 'Ask Vayun AI Chatbot anything about tools, code, or privacy' },
    { key: 'D', desc: 'Toggle between pure black and pure white monochrome theme' },
    { key: '1 - 5', desc: 'Jump to category (Overview, PDF, AI, Invoices, Tabular)' },
    { key: 'R', desc: 'Launch Resume Builder with photo and PDF export' },
    { key: 'M', desc: 'Launch Merge PDF utility' },
    { key: 'I', desc: 'Launch Invoice Maker' },
    { key: 'H', desc: 'Open Helpdesk, Knowledge Base & Diagnostics' },
    { key: '?', desc: 'Show this keyboard shortcuts guide' },
    { key: 'Esc', desc: 'Close any active modal or return to Overview' }
  ];

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
    >
      <div className={`w-full max-w-md rounded-xl border shadow-2xl overflow-hidden transition-colors ${
        isLight ? 'bg-white border-neutral-300 text-black' : 'bg-[#0e0e0e] border-neutral-800 text-white'
      }`}>
        <div className={`flex items-center justify-between px-5 py-4 border-b ${
          isLight ? 'border-neutral-200 bg-neutral-50' : 'border-neutral-900 bg-neutral-950'
        }`}>
          <div className="flex items-center gap-2">
            <Keyboard className="w-4 h-4 stroke-[1.75]" />
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">
              Workstation Shortcuts
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-2 text-xs">
          {shortcuts.map((s, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between p-2 rounded border ${
                isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-black border-neutral-900'
              }`}
            >
              <span className={isLight ? 'text-neutral-700' : 'text-neutral-300'}>
                {s.desc}
              </span>
              <kbd className={`px-2 py-0.5 rounded text-[11px] font-mono border ${
                isLight ? 'bg-white border-neutral-300 text-black font-semibold' : 'bg-neutral-900 border-neutral-700 text-white font-semibold'
              }`}>
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className={`px-5 py-3 border-t text-right ${
          isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-neutral-950 border-neutral-900'
        }`}>
          <button
            onClick={onClose}
            className={`px-3 py-1 rounded text-xs font-medium ${
              isLight ? 'bg-black text-white hover:bg-neutral-800' : 'bg-white text-black hover:bg-neutral-200'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
