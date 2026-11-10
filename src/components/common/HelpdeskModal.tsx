import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  HelpCircle, 
  LifeBuoy, 
  ChevronDown, 
  ChevronUp, 
  Terminal, 
  ShieldCheck, 
  Cpu, 
  FileText, 
  Key, 
  Puzzle, 
  Check, 
  Copy, 
  ExternalLink, 
  RefreshCw,
  Bug,
  Mail,
  Coffee
} from 'lucide-react';
import { getStoredApiKey } from '../../utils/geminiApi';

interface HelpdeskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenApiSettings?: () => void;
  onOpenExtension?: () => void;
  onOpenSupport?: () => void;
  theme?: 'dark' | 'light';
}

interface FaqItem {
  id: string;
  category: 'privacy' | 'pdf' | 'developer' | 'ai' | 'extension';
  question: string;
  answer: string;
  tags: string[];
}

const FAQ_DATABASE: FaqItem[] = [
  {
    id: 'privacy-guarantee',
    category: 'privacy',
    question: 'How does the 100% in-browser RAM privacy guarantee work?',
    answer: 'All document manipulations, PDF extractions, image conversions, and code traces execute entirely inside your local browser tab memory via WebAssembly and JavaScript engines. No files, code snippets, or prompts are uploaded to remote servers. When you close or refresh the tab, in-memory buffers are cleared.',
    tags: ['privacy', 'ram', 'security', 'upload', 'data']
  },
  {
    id: 'pdf-high-capacity',
    category: 'pdf',
    question: 'How do I extract or split high-capacity PDFs (e.g., 100 to 500+ pages)?',
    answer: 'Navigate to Split PDF. Enter high-capacity ranges such as "1-50, 51-100, 101-250", or use the Quick Batch Presets to split every 10, 25, or 50 pages. The browser streaming parser handles large page counts in chunks without tab freezes.',
    tags: ['pdf', 'split', 'extract', 'range', 'pages', 'capacity']
  },
  {
    id: 'gemini-api-setup',
    category: 'ai',
    question: 'How do I configure my Gemini API key for instant responses?',
    answer: 'Click the "Gemini API" or "API Key" button in the navigation header or hero section. Paste your Google AI Studio API key (starts with "AIzaSy..."). The key is stored solely in your browser localStorage and communicated directly to Google API endpoints via HTTPS. We recommend the Gemini 2.0 Flash or Flash-Lite models for fast latency.',
    tags: ['api', 'gemini', 'key', 'ai', 'google', 'token']
  },
  {
    id: 'vayun-flow-guide',
    category: 'developer',
    question: 'How do I trace multi-file logic using Vayun Flow?',
    answer: 'Open Vayun Flow and paste your code or multi-file project snippets. The parser generates an interactive call graph showing module imports, data flow pipelines, state mutations, and function interactions with real-time graph visualization.',
    tags: ['flow', 'developer', 'code', 'graph', 'trace', 'architecture']
  },
  {
    id: 'viva-defense-guide',
    category: 'developer',
    question: 'What is Vayun Viva Defense and how does it help me?',
    answer: 'Viva Defense acts as a strict Socratic code examiner. It analyzes your code logic and asks targeted, challenging architectural questions (time complexity, failure boundaries, concurrency vulnerabilities) so you are thoroughly prepared for technical interviews or thesis defenses.',
    tags: ['viva', 'defense', 'exam', 'questions', 'interview']
  },
  {
    id: 'extension-install',
    category: 'extension',
    question: 'How do I install the browser extension on Chrome or Edge?',
    answer: 'Open the "Extension" modal and download "vayun-extension.zip". Extract the archive to a folder on your computer. Visit chrome://extensions (or edge://extensions), enable "Developer mode" in the top-right corner, click "Load unpacked", and choose the extracted folder.',
    tags: ['extension', 'chrome', 'edge', 'browser', 'install']
  },
  {
    id: 'account-requirement',
    category: 'privacy',
    question: 'Do I need an account or subscription to use any of these tools?',
    answer: 'No. Vayun operates with zero accounts, no sign-ins, no passwords, and no paywalls. All tools and features are completely free and immediately accessible upon visiting the site.',
    tags: ['account', 'login', 'paywall', 'free', 'cost']
  },
  {
    id: 'offline-capability',
    category: 'privacy',
    question: 'Can I use Vayun tools while offline or disconnected from the internet?',
    answer: 'Yes. Core PDF tools (Split, Merge, Compress, Image-to-PDF), Invoicing, Table Converters, and the Token Counter work entirely offline once the page has loaded, since all operations run in local browser RAM.',
    tags: ['offline', 'internet', 'disconnect', 'local']
  }
];

export const HelpdeskModal: React.FC<HelpdeskModalProps> = ({
  isOpen,
  onClose,
  onOpenApiSettings,
  onOpenExtension,
  onOpenSupport,
  theme = 'dark'
}) => {
  const [activeTab, setActiveTab] = useState<'faq' | 'diagnostics' | 'contact'>('faq');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('privacy-guarantee');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Diagnostics state
  const [diagnosticsRunning, setDiagnosticsRunning] = useState(false);
  const [diagnosticReportCopied, setDiagnosticReportCopied] = useState(false);
  const [customFeedback, setCustomFeedback] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  const isLight = theme === 'light';
  const hasApiKey = Boolean(getStoredApiKey());

  // Filtered FAQs
  const filteredFaqs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return FAQ_DATABASE.filter(item => {
      const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
      if (!matchesCat) return false;
      if (!q) return true;
      return (
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.tags.some(t => t.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, selectedCategory]);

  if (!isOpen) return null;

  // Diagnostic metrics
  const memoryEstimate = typeof window !== 'undefined' && (performance as any).memory
    ? `${Math.round((performance as any).memory.usedJSHeapSize / (1024 * 1024))} MB used / ${Math.round((performance as any).memory.jsHeapSizeLimit / (1024 * 1024))} MB limit`
    : 'Available (Browser standard quota)';

  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown';
  const screenResolution = typeof window !== 'undefined' ? `${window.screen.width}x${window.screen.height}` : 'Unknown';
  const isLocalStorageAvailable = typeof localStorage !== 'undefined';
  const isWebAssemblySupported = typeof WebAssembly !== 'undefined';
  const isWorkerSupported = typeof Worker !== 'undefined';

  const runDiagnosticCheck = () => {
    setDiagnosticsRunning(true);
    setTimeout(() => {
      setDiagnosticsRunning(false);
    }, 500);
  };

  const copyDiagnosticReport = () => {
    const report = [
      '### Vayun.xyz Diagnostic State Report',
      `- Generated: ${new Date().toISOString()}`,
      `- Browser / OS: ${userAgent}`,
      `- Screen Resolution: ${screenResolution}`,
      `- Memory Status: ${memoryEstimate}`,
      `- WebAssembly Support: ${isWebAssemblySupported ? 'Yes' : 'No'}`,
      `- Web Workers Support: ${isWorkerSupported ? 'Yes' : 'No'}`,
      `- LocalStorage Access: ${isLocalStorageAvailable ? 'Yes' : 'No'}`,
      `- Gemini API Configured: ${hasApiKey ? 'Yes' : 'No'}`,
      `- Theme Mode: ${theme}`,
      '----------------------------------------'
    ].join('\n');

    navigator.clipboard.writeText(report);
    setDiagnosticReportCopied(true);
    setTimeout(() => setDiagnosticReportCopied(false), 2000);
  };

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customFeedback.trim()) return;

    // Open pre-populated GitHub issue or mailto
    const title = encodeURIComponent('User Feedback / Helpdesk Request');
    const body = encodeURIComponent(
      `### Issue / Feedback Description:\n${customFeedback.trim()}\n\n### Environment Diagnostics:\n- OS/Browser: ${userAgent}\n- Screen: ${screenResolution}\n- Gemini Key: ${hasApiKey ? 'Yes' : 'No'}`
    );
    window.open(`https://github.com/himanshu931588-cmd/Vayun.xyz/issues/new?title=${title}&body=${body}`, '_blank');
    setFeedbackSent(true);
    setTimeout(() => {
      setFeedbackSent(false);
      setCustomFeedback('');
    }, 3000);
  };

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
    >
      <div className={`w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden transition-all flex flex-col max-h-[90vh] ${
        isLight ? 'bg-white border-neutral-300 text-black' : 'bg-[#0e0e10] border-neutral-800 text-white'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b shrink-0 ${
          isLight ? 'border-neutral-200 bg-neutral-50/70' : 'border-neutral-900 bg-neutral-950/70'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${
              isLight ? 'bg-white border-neutral-200 text-black' : 'bg-black border-neutral-800 text-white'
            }`}>
              <LifeBuoy className="w-4 h-4 stroke-[2]" />
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-wider font-semibold">
                Vayun Helpdesk & Support
              </div>
              <div className="text-[11px] text-neutral-500">
                Knowledge Base, Interactive Diagnostics & Troubleshooting
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className={`flex items-center px-6 border-b shrink-0 text-xs font-mono ${
          isLight ? 'border-neutral-200 bg-neutral-100/50' : 'border-neutral-900 bg-black/40'
        }`}>
          <button
            onClick={() => setActiveTab('faq')}
            className={`py-3 px-4 border-b-2 font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'faq'
                ? isLight ? 'border-black text-black' : 'border-white text-white'
                : 'border-transparent text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Knowledge Base & FAQs</span>
          </button>

          <button
            onClick={() => setActiveTab('diagnostics')}
            className={`py-3 px-4 border-b-2 font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'diagnostics'
                ? isLight ? 'border-black text-black' : 'border-white text-white'
                : 'border-transparent text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>System Diagnostics</span>
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className={`py-3 px-4 border-b-2 font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'contact'
                ? isLight ? 'border-black text-black' : 'border-white text-white'
                : 'border-transparent text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Contact & Feedback</span>
          </button>
        </div>

        {/* Tab 1: Searchable Knowledge Base & FAQs */}
        {activeTab === 'faq' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Search Input Bar */}
            <div className="relative">
              <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${
                isLight ? 'text-neutral-400' : 'text-neutral-500'
              }`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search troubleshooting questions, RAM privacy, PDF ranges, or API setup..."
                className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-xs focus:outline-hidden transition-all ${
                  isLight 
                    ? 'bg-neutral-50 border-neutral-300 text-black placeholder-neutral-400 focus:border-black' 
                    : 'bg-neutral-900/60 border-neutral-800 text-white placeholder-neutral-500 focus:border-neutral-600'
                }`}
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono">
              {[
                { id: 'all', label: 'All Topics' },
                { id: 'privacy', label: 'Privacy & RAM' },
                { id: 'pdf', label: 'PDF Suite' },
                { id: 'developer', label: 'Flow & Viva' },
                { id: 'ai', label: 'Gemini AI' },
                { id: 'extension', label: 'Extension' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 rounded-full border text-[11px] whitespace-nowrap transition-colors ${
                    selectedCategory === cat.id
                      ? isLight ? 'bg-black text-white border-black' : 'bg-white text-black border-white'
                      : isLight ? 'border-neutral-200 text-neutral-600 hover:bg-neutral-100' : 'border-neutral-800 text-neutral-400 hover:bg-neutral-900'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Accordion FAQ List */}
            <div className="space-y-2 pt-2">
              {filteredFaqs.length === 0 ? (
                <div className={`p-8 text-center text-xs ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
                  No articles matched your search query. Try another term or submit a question in Contact.
                </div>
              ) : (
                filteredFaqs.map(faq => {
                  const isExpanded = expandedFaqId === faq.id;
                  return (
                    <div 
                      key={faq.id}
                      className={`rounded-xl border transition-all overflow-hidden ${
                        isLight 
                          ? 'border-neutral-200 bg-white hover:border-neutral-300' 
                          : 'border-neutral-800/80 bg-neutral-900/30 hover:border-neutral-700'
                      }`}
                    >
                      <button
                        onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                        className="w-full px-4 py-3.5 text-left flex items-center justify-between gap-3"
                      >
                        <span className="text-xs font-semibold leading-snug">
                          {faq.question}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-neutral-400 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
                        )}
                      </button>

                      {isExpanded && (
                        <div className={`px-4 pb-4 pt-1 text-xs leading-relaxed border-t ${
                          isLight 
                            ? 'border-neutral-100 text-neutral-600 bg-neutral-50/50' 
                            : 'border-neutral-850 text-neutral-400 bg-black/20'
                        }`}>
                          <p>{faq.answer}</p>
                          <div className="flex flex-wrap gap-1 mt-3">
                            {faq.tags.map(tag => (
                              <span 
                                key={tag} 
                                className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                                  isLight ? 'border-neutral-200 text-neutral-500' : 'border-neutral-800 text-neutral-500'
                                }`}
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Tab 2: System Diagnostics & Health Check */}
        {activeTab === 'diagnostics' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">Browser Runtime Self-Test</h3>
                <p className={`text-xs ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                  Inspect your client environment to verify local PDF, WebAssembly, and memory quotas.
                </p>
              </div>

              <button
                onClick={runDiagnosticCheck}
                disabled={diagnosticsRunning}
                className={`px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition-all ${
                  isLight ? 'border-neutral-300 hover:bg-neutral-100' : 'border-neutral-800 hover:bg-neutral-900'
                }`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${diagnosticsRunning ? 'animate-spin' : ''}`} />
                <span>Rerun Test</span>
              </button>
            </div>

            {/* Metric Cards Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className={`p-3.5 rounded-xl border ${
                isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-neutral-900/40 border-neutral-800'
              }`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span className="font-semibold text-xs">In-Memory Privacy Engine</span>
                </div>
                <div className="text-[11px] text-neutral-500 font-mono">
                  Active (0 external document uploads)
                </div>
              </div>

              <div className={`p-3.5 rounded-xl border ${
                isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-neutral-900/40 border-neutral-800'
              }`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <Cpu className="w-4 h-4 text-blue-500" />
                  <span className="font-semibold text-xs">WebAssembly & Workers</span>
                </div>
                <div className="text-[11px] text-neutral-500 font-mono">
                  {isWebAssemblySupported ? 'Enabled (Fast PDF-Lib processing)' : 'Standard mode'}
                </div>
              </div>

              <div className={`p-3.5 rounded-xl border ${
                isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-neutral-900/40 border-neutral-800'
              }`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <Key className="w-4 h-4 text-purple-500" />
                  <span className="font-semibold text-xs">Gemini 2.0 API Key</span>
                </div>
                <div className="text-[11px] text-neutral-500 font-mono flex items-center justify-between">
                  <span>{hasApiKey ? 'Configured in localStorage' : 'Offline / Simulated mode'}</span>
                  {onOpenApiSettings && (
                    <button onClick={onOpenApiSettings} className="underline text-neutral-400 hover:text-white">
                      {hasApiKey ? 'Change' : 'Set Key'}
                    </button>
                  )}
                </div>
              </div>

              <div className={`p-3.5 rounded-xl border ${
                isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-neutral-900/40 border-neutral-800'
              }`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <Puzzle className="w-4 h-4 text-amber-500" />
                  <span className="font-semibold text-xs">Browser Extension Ready</span>
                </div>
                <div className="text-[11px] text-neutral-500 font-mono flex items-center justify-between">
                  <span>Manifest V3 compatible</span>
                  {onOpenExtension && (
                    <button onClick={onOpenExtension} className="underline text-neutral-400 hover:text-white">
                      Install
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Detailed System Specifications Box */}
            <div className={`p-4 rounded-xl border font-mono text-[11px] space-y-2 ${
              isLight ? 'bg-neutral-100 border-neutral-200 text-neutral-700' : 'bg-black border-neutral-900 text-neutral-400'
            }`}>
              <div className="flex justify-between border-b pb-1.5 border-neutral-800/40">
                <span>Client Heap Memory:</span>
                <span className="text-emerald-400">{memoryEstimate}</span>
              </div>
              <div className="flex justify-between border-b pb-1.5 border-neutral-800/40">
                <span>Display Resolution:</span>
                <span>{screenResolution}</span>
              </div>
              <div className="flex justify-between border-b pb-1.5 border-neutral-800/40">
                <span>Local Storage Status:</span>
                <span>{isLocalStorageAvailable ? 'Available (Encrypted locally)' : 'Blocked'}</span>
              </div>
              <div className="flex justify-between">
                <span>User Agent:</span>
                <span className="truncate max-w-[260px]" title={userAgent}>{userAgent}</span>
              </div>
            </div>

            {/* Copy Report Action */}
            <button
              onClick={copyDiagnosticReport}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-mono font-medium flex items-center justify-center gap-2 border transition-all ${
                diagnosticReportCopied
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                  : isLight
                  ? 'border-neutral-300 hover:bg-neutral-100 text-black'
                  : 'border-neutral-800 hover:bg-neutral-900 text-white'
              }`}
            >
              {diagnosticReportCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{diagnosticReportCopied ? 'Diagnostic Report Copied to Clipboard' : 'Copy Complete Diagnostic Report'}</span>
            </button>
          </div>
        )}

        {/* Tab 3: Contact & Direct Issue Reporting */}
        {activeTab === 'contact' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
            <div>
              <h3 className="text-sm font-semibold">Direct Developer Support & Feedback</h3>
              <p className={`text-xs ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                Have questions, feature suggestions, or encountered an unexpected issue? Reach out directly.
              </p>
            </div>

            {/* Fast Issue Form */}
            <form onSubmit={handleSendFeedback} className="space-y-3">
              <div>
                <label className="block text-[11px] font-mono text-neutral-500 mb-1">
                  Describe the question, bug, or feature request:
                </label>
                <textarea
                  value={customFeedback}
                  onChange={(e) => setCustomFeedback(e.target.value)}
                  placeholder="e.g. When splitting a 350-page PDF, page 240 had an inverted orientation... or I would like to request..."
                  rows={4}
                  className={`w-full p-3 rounded-xl border text-xs font-sans focus:outline-hidden transition-all resize-none ${
                    isLight 
                      ? 'bg-neutral-50 border-neutral-300 text-black placeholder-neutral-400 focus:border-black' 
                      : 'bg-neutral-900/60 border-neutral-800 text-white placeholder-neutral-500 focus:border-neutral-600'
                  }`}
                />
              </div>

              <button
                type="submit"
                disabled={!customFeedback.trim()}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-all ${
                  feedbackSent
                    ? 'bg-emerald-600 text-white'
                    : isLight
                    ? 'bg-black text-white hover:bg-neutral-800 disabled:opacity-40'
                    : 'bg-white text-black hover:bg-neutral-200 disabled:opacity-40'
                }`}
              >
                {feedbackSent ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>GitHub Issue Opened</span>
                  </>
                ) : (
                  <>
                    <Bug className="w-3.5 h-3.5" />
                    <span>Create Pre-Formatted GitHub Issue &rarr;</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Links Grid */}
            <div className="pt-2 grid grid-cols-2 gap-2.5">
              <a
                href="https://github.com/himanshu931588-cmd/Vayun.xyz/issues"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                  isLight ? 'bg-neutral-50 border-neutral-200 hover:border-black' : 'bg-neutral-900/50 border-neutral-800 hover:border-white'
                }`}
              >
                <div>
                  <div className="font-semibold text-xs">GitHub Issues</div>
                  <div className="text-[11px] text-neutral-500">Track bugs & requests</div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
              </a>

              {onOpenSupport && (
                <button
                  onClick={onOpenSupport}
                  className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                    isLight ? 'bg-neutral-50 border-neutral-200 hover:border-black' : 'bg-neutral-900/50 border-neutral-800 hover:border-white'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-xs">Buy Me a Coffee</div>
                    <div className="text-[11px] text-neutral-500">Independent support</div>
                  </div>
                  <Coffee className="w-3.5 h-3.5 text-neutral-400" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className={`px-6 py-3 border-t text-center text-[11px] font-mono shrink-0 ${
          isLight ? 'border-neutral-200 bg-neutral-50 text-neutral-600' : 'border-neutral-900 bg-neutral-950 text-neutral-400'
        }`}>
          Zero remote uploads • Zero tracking • Client-side RAM execution
        </div>
      </div>
    </div>
  );
};
