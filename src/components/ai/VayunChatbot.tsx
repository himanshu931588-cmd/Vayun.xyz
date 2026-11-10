import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  Sparkles, 
  ArrowRight, 
  Key, 
  Copy, 
  Check, 
  MessageSquare, 
  Terminal,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { ToolId } from '../../types';
import { TOOLS } from '../../utils/toolsData';
import { VayunLogo } from '../common/VayunLogo';
import { getStoredApiKey } from '../../utils/geminiApi';
import { askVayunBot, ChatMessage } from '../../utils/vayunBotEngine';

interface VayunChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
  onSelectTool: (id: ToolId) => void;
  onOpenApiSettings?: () => void;
  theme?: 'dark' | 'light';
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome-1',
    role: 'assistant',
    content: `Hello, I am **Vayun**, your built-in AI workstation copilot. 

I can guide you on any tool across our developer and document suites, explain how our zero-upload RAM privacy architecture works, analyze code, or troubleshoot PDF and data tasks.

How can I help you today?`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    suggestedTools: ['vayun-flow', 'split-pdf', 'vayun-viva']
  }
];

const SUGGESTED_PROMPTS = [
  'How do I split a 500-page PDF without tab lag?',
  'How do I trace multi-file code in Vayun Flow?',
  'Explain how the 100% in-browser RAM privacy works',
  'How do I prepare for technical Viva Defense?',
  'How do I install the Chrome/Edge extension?'
];

export const VayunChatbot: React.FC<VayunChatbotProps> = ({
  isOpen,
  onToggle,
  onSelectTool,
  onOpenApiSettings,
  theme = 'dark'
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = sessionStorage.getItem('vayun_bot_messages');
      return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
    } catch {
      return INITIAL_MESSAGES;
    }
  });

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const isLight = theme === 'light';
  const hasApiKey = Boolean(getStoredApiKey());

  // Save conversation in session
  useEffect(() => {
    try {
      sessionStorage.setItem('vayun_bot_messages', JSON.stringify(messages));
    } catch (e) {
      console.warn('Failed to save chat to sessionStorage', e);
    }
  }, [messages]);

  // Auto scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, messages, isLoading]);

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || inputQuery).trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const { reply, suggestedTools } = await askVayunBot(textToSend, messages);
      const assistantMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedTools: suggestedTools.length > 0 ? suggestedTools : undefined
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        role: 'assistant',
        content: `I encountered an unexpected issue while processing your request. Please try again or rephrase your question.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearHistory = () => {
    setMessages(INITIAL_MESSAGES);
    try {
      sessionStorage.removeItem('vayun_bot_messages');
    } catch {}
  };

  const handleCopyCode = (codeText: string, id: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const getToolName = (toolId: ToolId): string => {
    const found = TOOLS.find(t => t.id === toolId);
    return found ? found.name : toolId;
  };

  // Render markdown text with code snippets and clean paragraph formatting
  const renderFormattedContent = (content: string, messageId: string) => {
    const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;
    let snippetCount = 0;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      const matchIndex = match.index;
      if (matchIndex > lastIndex) {
        parts.push(
          <span key={`text-${lastIndex}`} className="whitespace-pre-wrap leading-relaxed">
            {formatInlineMarkdown(content.slice(lastIndex, matchIndex))}
          </span>
        );
      }

      const lang = match[1] || 'code';
      const code = match[2];
      const snippetId = `${messageId}-${snippetCount++}`;

      parts.push(
        <div key={snippetId} className="my-2 rounded-xl overflow-hidden border border-neutral-800 bg-[#07080a] text-xs font-mono">
          <div className="flex items-center justify-between px-3 py-1.5 bg-neutral-900/80 border-b border-neutral-800 text-[10px] text-neutral-400">
            <span className="uppercase">{lang}</span>
            <button
              onClick={() => handleCopyCode(code, snippetId)}
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              {copiedCodeId === snippetId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedCodeId === snippetId ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre className="p-3 overflow-x-auto text-neutral-200 leading-snug">
            <code>{code}</code>
          </pre>
        </div>
      );

      lastIndex = matchIndex + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push(
        <span key={`text-end`} className="whitespace-pre-wrap leading-relaxed">
          {formatInlineMarkdown(content.slice(lastIndex))}
        </span>
      );
    }

    return parts;
  };

  const formatInlineMarkdown = (text: string): React.ReactNode => {
    // Replace **bold**
    const boldParts = text.split(/(\*\*.*?\*\*)/g);
    return boldParts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
      }
      // Replace `code`
      const inlineCodeParts = part.split(/(`.*?`)/g);
      return inlineCodeParts.map((subPart, j) => {
        if (subPart.startsWith('`') && subPart.endsWith('`')) {
          return (
            <code 
              key={`${i}-${j}`} 
              className={`px-1.5 py-0.5 rounded text-[11px] font-mono border ${
                isLight ? 'bg-neutral-100 border-neutral-300 text-black' : 'bg-neutral-900 border-neutral-800 text-neutral-200'
              }`}
            >
              {subPart.slice(1, -1)}
            </code>
          );
        }
        return subPart;
      });
    });
  };

  return (
    <>
      {/* Floating Trigger Button (Always visible on bottom-right) */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          onClick={onToggle}
          title="Ask Vayun AI (⌘J / Click to chat)"
          className={`h-11 px-4 rounded-full border shadow-2xl flex items-center gap-2.5 transition-all select-none active:scale-95 group ${
            isOpen
              ? isLight
                ? 'bg-black text-white border-black shadow-black/20'
                : 'bg-white text-black border-white shadow-white/20'
              : isLight 
                ? 'bg-white text-black border-neutral-300 hover:border-black shadow-lg hover:shadow-xl' 
                : 'bg-neutral-900 text-white border-neutral-750 hover:border-neutral-500 shadow-2xl hover:shadow-cyan-950/20'
          }`}
          aria-label="Open Vayun AI Chatbot"
        >
          <div className="relative flex items-center justify-center">
            <VayunLogo size={20} className="transition-transform group-hover:scale-110" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <span className="text-xs font-mono font-semibold tracking-wide">
            {isOpen ? 'Close Vayun' : 'Ask Vayun'}
          </span>

          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border uppercase ${
            isOpen
              ? isLight ? 'border-neutral-700 bg-neutral-900 text-neutral-300' : 'border-neutral-300 bg-neutral-100 text-neutral-700'
              : isLight ? 'border-neutral-200 bg-neutral-100 text-neutral-600' : 'border-neutral-700 bg-neutral-800 text-neutral-300'
          }`}>
            AI
          </span>
        </button>
      </div>

      {/* Floating Chatbot Assistant Window */}
      {isOpen && (
        <div className={`fixed z-50 flex flex-col shadow-2xl border transition-all duration-200 backdrop-blur-md overflow-hidden ${
          isExpanded
            ? 'inset-4 sm:inset-10 rounded-2xl'
            : 'bottom-20 right-4 sm:right-6 w-[94vw] sm:w-[480px] h-[600px] max-h-[85vh] rounded-2xl'
        } ${
          isLight ? 'bg-white/95 border-neutral-300 text-black' : 'bg-[#0b0c0e]/95 border-neutral-800 text-white'
        }`}>
          {/* Header */}
          <div className={`flex items-center justify-between px-4 py-3 border-b shrink-0 ${
            isLight ? 'border-neutral-200 bg-neutral-50/80' : 'border-neutral-850 bg-neutral-950/80'
          }`}>
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <VayunLogo size={24} />
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-black" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mono font-semibold tracking-wide">Vayun AI</span>
                  <span className="text-[9px] font-mono px-1 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                    RAM ONLY
                  </span>
                </div>
                <div className="text-[10px] text-neutral-500 font-mono">
                  Workstation Copilot & Code Assistant
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-neutral-400">
              <button
                onClick={handleClearHistory}
                title="Reset conversation"
                className="p-1.5 rounded-lg hover:text-white hover:bg-neutral-800/50 transition-colors"
                aria-label="Clear chat"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsExpanded(prev => !prev)}
                title={isExpanded ? 'Restore window size' : 'Expand full window'}
                className="p-1.5 rounded-lg hover:text-white hover:bg-neutral-800/50 transition-colors"
                aria-label="Toggle full window"
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={onToggle}
                title="Close chat"
                className="p-1.5 rounded-lg hover:text-white hover:bg-neutral-800/50 transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 shadow-xs ${
                  msg.role === 'user'
                    ? isLight
                      ? 'bg-black text-white rounded-br-xs'
                      : 'bg-white text-black rounded-br-xs'
                    : isLight
                      ? 'bg-neutral-100 border border-neutral-200 text-neutral-900 rounded-bl-xs'
                      : 'bg-neutral-900/90 border border-neutral-800 text-neutral-200 rounded-bl-xs'
                }`}>
                  <div className="text-xs leading-relaxed">
                    {renderFormattedContent(msg.content, msg.id)}
                  </div>

                  {/* Suggested Tool Launch Badges */}
                  {msg.suggestedTools && msg.suggestedTools.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-neutral-800/50 flex flex-wrap gap-1.5">
                      {msg.suggestedTools.map(toolId => (
                        <button
                          key={toolId}
                          onClick={() => {
                            onSelectTool(toolId);
                            // Keep chat open or minimize so user can view tool alongside
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium flex items-center gap-1.5 transition-all shadow-xs ${
                            isLight
                              ? 'bg-white border border-neutral-300 text-black hover:border-black'
                              : 'bg-black border border-neutral-700 text-white hover:border-neutral-400 hover:bg-neutral-900'
                          }`}
                        >
                          <span>Launch {getToolName(toolId)}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <span className="text-[10px] text-neutral-500 font-mono mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {/* Loading Typing Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2 text-neutral-400 text-xs font-mono p-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Vayun is reasoning in RAM...</span>
              </div>
            )}

            {/* Quick Suggestion Chips (when only 1 or 2 messages exist) */}
            {messages.length <= 2 && !isLoading && (
              <div className="pt-2 space-y-1.5">
                <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider font-semibold">
                  Suggested Questions:
                </div>
                <div className="flex flex-col gap-1.5">
                  {SUGGESTED_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(prompt)}
                      className={`text-left p-2 rounded-xl text-xs border transition-all flex items-center justify-between group ${
                        isLight
                          ? 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100 hover:border-neutral-400 text-neutral-800'
                          : 'border-neutral-800/80 bg-neutral-900/40 hover:bg-neutral-850 hover:border-neutral-700 text-neutral-300 hover:text-white'
                      }`}
                    >
                      <span>{prompt}</span>
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Area */}
          <div className={`p-3 border-t shrink-0 ${
            isLight ? 'border-neutral-200 bg-neutral-50/70' : 'border-neutral-850 bg-neutral-950/70'
          }`}>
            <div className="relative">
              <textarea
                ref={inputRef}
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Vayun anything about tools, code, PDF, or privacy..."
                rows={2}
                className={`w-full pr-10 pl-3 py-2 rounded-xl border text-xs focus:outline-hidden transition-all resize-none ${
                  isLight
                    ? 'bg-white border-neutral-300 text-black placeholder-neutral-400 focus:border-black'
                    : 'bg-neutral-900/80 border-neutral-800 text-white placeholder-neutral-500 focus:border-neutral-600'
                }`}
              />

              <button
                onClick={() => handleSend()}
                disabled={!inputQuery.trim() || isLoading}
                className={`absolute right-2 bottom-3 p-1.5 rounded-lg transition-all ${
                  inputQuery.trim() && !isLoading
                    ? isLight
                      ? 'bg-black text-white hover:bg-neutral-800'
                      : 'bg-white text-black hover:bg-neutral-200'
                    : 'text-neutral-500 opacity-40 cursor-not-allowed'
                }`}
                aria-label="Send Message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Model & Privacy Indicator Status Bar */}
            <div className="flex items-center justify-between mt-2 px-1 text-[10px] font-mono text-neutral-500">
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${hasApiKey ? 'bg-emerald-400' : 'bg-cyan-400'}`} />
                <span>{hasApiKey ? 'Gemini 2.0 Flash' : 'Built-in Knowledge Engine'}</span>
              </div>

              {!hasApiKey && onOpenApiSettings && (
                <button
                  onClick={onOpenApiSettings}
                  className="underline hover:text-white transition-colors flex items-center gap-1"
                >
                  <Key className="w-3 h-3" />
                  <span>Connect Gemini API for custom coding</span>
                </button>
              )}

              {hasApiKey && (
                <span className="text-neutral-400">Zero telemetry • RAM private</span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
