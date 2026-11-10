import React, { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { CommandPalette } from './components/common/CommandPalette';
import { SecurityAuditorModal } from './components/common/SecurityAuditorModal';
import { KeyboardShortcutsModal } from './components/common/KeyboardShortcutsModal';
import { ApiSettingsModal } from './components/common/ApiSettingsModal';
import { OwnerConsoleModal } from './components/common/OwnerConsoleModal';
import { SupportModal } from './components/common/SupportModal';
import { ExtensionModal } from './components/common/ExtensionModal';
import { HelpdeskModal } from './components/common/HelpdeskModal';
import { VayunChatbot } from './components/ai/VayunChatbot';
import { HomeView } from './components/home/HomeView';

// Developer Flow & Viva Suite (Flagship)
import { VayunFlowView } from './components/flow/VayunFlowView';
import { VayunVivaView } from './components/viva/VayunVivaView';
import { VayunBreakView } from './components/break/VayunBreakView';
import { ChaosWindTunnelView } from './components/break/ChaosWindTunnelView';
import { VayunSpecView } from './components/spec/VayunSpecView';
import { InkGardenAsciiView } from './components/ascii/InkGardenAsciiView';
import { AiSmellsRadarView } from './components/developer/AiSmellsRadarView';
import { VivaDefenseBadgeView } from './components/developer/VivaDefenseBadgeView';

// Classic PDF Suite & Resume
import { MergePdfView } from './components/pdf/MergePdfView';
import { SplitPdfView } from './components/pdf/SplitPdfView';
import { CompressPdfView } from './components/pdf/CompressPdfView';
import { ImageToPdfView } from './components/pdf/ImageToPdfView';
import { ResumeBuilderView } from './components/resume/ResumeBuilderView';

// AI & Token Tools
import { ThreadRescuerView } from './components/ai/ThreadRescuerView';
import { TokenSlimmerView } from './components/ai/TokenSlimmerView';
import { PromptSanitizerView } from './components/ai/PromptSanitizerView';
import { SecretDetonatorView } from './components/ai/SecretDetonatorView';
import { LocalWebGpuBrainView } from './components/ai/LocalWebGpuBrainView';

// Invoicing & Micro-Transactions
import { InvoiceMakerView } from './components/invoice/InvoiceMakerView';
import { PayLinkView } from './components/invoice/PayLinkView';
import { ReceiptMatcherView } from './components/invoice/ReceiptMatcherView';

// Tabular Tools
import { CleanCsvView } from './components/tabular/CleanCsvView';
import { PreserveZerosView } from './components/tabular/PreserveZerosView';
import { TableConverterView } from './components/tabular/TableConverterView';

import { ToolCategory, ToolId, InvoiceData, InvoiceItem } from './types';
import { decodePayLink } from './utils/invoiceStorage';

export function App() {
  const [currentTool, setCurrentTool] = useState<ToolId>('home');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'all'>('all');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isSecurityAuditorOpen, setIsSecurityAuditorOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isApiSettingsOpen, setIsApiSettingsOpen] = useState(false);
  const [isOwnerConsoleOpen, setIsOwnerConsoleOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isExtensionOpen, setIsExtensionOpen] = useState(false);
  const [isHelpdeskOpen, setIsHelpdeskOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [savedTokensTotal, setSavedTokensTotal] = useState<number>(() => {
    const saved = localStorage.getItem('vayun_total_tokens_saved');
    return saved ? parseInt(saved, 10) : 48250;
  });

  const [activePayLinkInvoice, setActivePayLinkInvoice] = useState<InvoiceData | null>(null);
  const [importedReceiptItems, setImportedReceiptItems] = useState<InvoiceItem[]>([]);

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  }, [theme]);

  // Check URL hash for direct PayLink on mount
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/p/')) {
        const encoded = hash.replace('#/p/', '');
        const decoded = decodePayLink(encoded);
        if (decoded) {
          setActivePayLinkInvoice(decoded);
          setCurrentTool('paylink-view');
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Global Workstation Hotkeys (⌘K, ?, D, Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setIsChatbotOpen(prev => !prev);
      } else if (e.key === '?' && !isInput) {
        e.preventDefault();
        setIsShortcutsOpen(prev => !prev);
      } else if (e.key.toLowerCase() === 'h' && !isInput && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setIsHelpdeskOpen(prev => !prev);
      } else if (e.key.toLowerCase() === 'd' && !isInput && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setTheme(t => t === 'dark' ? 'light' : 'dark');
      } else if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setIsSecurityAuditorOpen(false);
        setIsShortcutsOpen(false);
        setIsApiSettingsOpen(false);
        setIsSupportOpen(false);
        setIsExtensionOpen(false);
        setIsHelpdeskOpen(false);
        setIsChatbotOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleRecordTokensSaved = (tokens: number) => {
    setSavedTokensTotal(prev => {
      const updated = prev + tokens;
      localStorage.setItem('vayun_total_tokens_saved', updated.toString());
      return updated;
    });
  };

  const handleSelectTool = (id: ToolId) => {
    setCurrentTool(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenPayLink = (invoice: InvoiceData) => {
    setActivePayLinkInvoice(invoice);
    setCurrentTool('paylink-view');
  };

  const handleSendReceiptsToInvoice = (items: InvoiceItem[]) => {
    setImportedReceiptItems(items);
    setCurrentTool('invoice-maker');
  };

  const isLight = theme === 'light';

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors ${
      isLight ? 'bg-[#f8fafc] bg-grid-light text-slate-900 selection:bg-blue-100 selection:text-blue-900' : 'bg-black bg-grid-dark text-neutral-100 selection:bg-neutral-800 selection:text-white'
    }`}>
      {/* Top Header */}
      <Header
        currentTool={currentTool}
        onSelectTool={handleSelectTool}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        savedTokensTotal={savedTokensTotal}
        theme={theme}
        onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenSecurityAuditor={() => setIsSecurityAuditorOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onOpenApiSettings={() => setIsApiSettingsOpen(true)}
        onOpenSupport={() => setIsSupportOpen(true)}
        onOpenExtension={() => setIsExtensionOpen(true)}
        onOpenHelpdesk={() => setIsHelpdeskOpen(true)}
      />

      {/* Main Content Workspace */}
      <main className="flex-1">
        {currentTool === 'home' && (
          <HomeView
            onSelectTool={handleSelectTool}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onOpenApiSettings={() => setIsApiSettingsOpen(true)}
            onOpenSupport={() => setIsSupportOpen(true)}
            onOpenExtension={() => setIsExtensionOpen(true)}
            onOpenHelpdesk={() => setIsHelpdeskOpen(true)}
            theme={theme}
          />
        )}

        {/* Flagship Pillar 0: Developer Flow & Viva Suite */}
        {currentTool === 'vayun-flow' && (
          <VayunFlowView
            onBack={() => handleSelectTool('home')}
            onNavigateToViva={() => handleSelectTool('vayun-viva')}
            onNavigateToRadar={() => handleSelectTool('ai-smells-radar')}
            onOpenApiSettings={() => setIsApiSettingsOpen(true)}
            theme={theme}
          />
        )}

        {currentTool === 'vayun-viva' && (
          <VayunVivaView
            onBack={() => handleSelectTool('home')}
            onNavigateToFlow={() => handleSelectTool('vayun-flow')}
            onNavigateToBadge={() => handleSelectTool('viva-defense-badge')}
            onOpenApiSettings={() => setIsApiSettingsOpen(true)}
            theme={theme}
          />
        )}

        {currentTool === 'vayun-break' && (
          <VayunBreakView
            onBack={() => handleSelectTool('home')}
            onNavigateToFlow={() => handleSelectTool('vayun-flow')}
            theme={theme}
          />
        )}

        {currentTool === 'vayun-spec' && (
          <VayunSpecView
            onBack={() => handleSelectTool('home')}
            onNavigateToFlow={() => handleSelectTool('vayun-flow')}
            theme={theme}
          />
        )}

        {currentTool === 'ascii-art' && (
          <InkGardenAsciiView
            onBack={() => handleSelectTool('home')}
            theme={theme}
          />
        )}

        {currentTool === 'ai-smells-radar' && (
          <AiSmellsRadarView
            onBack={() => handleSelectTool('home')}
            onNavigateToFlow={() => handleSelectTool('vayun-flow')}
            theme={theme}
          />
        )}

        {currentTool === 'viva-defense-badge' && (
          <VivaDefenseBadgeView
            onBack={() => handleSelectTool('home')}
            onNavigateToViva={() => handleSelectTool('vayun-viva')}
            theme={theme}
          />
        )}

        {currentTool === 'chaos-wind-tunnel' && (
          <ChaosWindTunnelView
            onBack={() => handleSelectTool('home')}
            onNavigateToBreak={() => handleSelectTool('vayun-break')}
            theme={theme}
          />
        )}

        {/* Pillar 1: Core PDF Suite & Resume */}
        {currentTool === 'merge-pdf' && (
          <MergePdfView
            onBack={() => handleSelectTool('home')}
            theme={theme}
          />
        )}

        {currentTool === 'split-pdf' && (
          <SplitPdfView
            onBack={() => handleSelectTool('home')}
            theme={theme}
          />
        )}

        {currentTool === 'compress-pdf' && (
          <CompressPdfView
            onBack={() => handleSelectTool('home')}
            theme={theme}
          />
        )}

        {currentTool === 'image-to-pdf' && (
          <ImageToPdfView
            onBack={() => handleSelectTool('home')}
            theme={theme}
          />
        )}

        {currentTool === 'resume-builder' && (
          <ResumeBuilderView
            onBack={() => handleSelectTool('home')}
            onNavigateToTool={handleSelectTool}
            theme={theme}
          />
        )}

        {/* Pillar 2: AI & Context */}
        {currentTool === 'thread-rescuer' && (
          <ThreadRescuerView
            onBack={() => handleSelectTool('home')}
            onRecordTokensSaved={handleRecordTokensSaved}
            theme={theme}
          />
        )}

        {currentTool === 'token-slimmer' && (
          <TokenSlimmerView
            onBack={() => handleSelectTool('home')}
            onRecordTokensSaved={handleRecordTokensSaved}
            theme={theme}
          />
        )}

        {currentTool === 'prompt-sanitizer' && (
          <PromptSanitizerView
            onBack={() => handleSelectTool('home')}
            theme={theme}
          />
        )}

        {currentTool === 'secret-detonator' && (
          <SecretDetonatorView
            onBack={() => handleSelectTool('home')}
            theme={theme}
          />
        )}

        {currentTool === 'webgpu-brain' && (
          <LocalWebGpuBrainView
            onBack={() => handleSelectTool('home')}
            onOpenApiSettings={() => setIsApiSettingsOpen(true)}
            theme={theme}
          />
        )}

        {/* Pillar 3: Invoicing */}
        {currentTool === 'invoice-maker' && (
          <InvoiceMakerView
            onBack={() => handleSelectTool('home')}
            onOpenPayLink={handleOpenPayLink}
            onOpenReceiptMatcher={() => handleSelectTool('receipt-matcher')}
            importedItems={importedReceiptItems}
            theme={theme}
          />
        )}

        {currentTool === 'paylink-view' && (
          activePayLinkInvoice ? (
            <PayLinkView
              invoice={activePayLinkInvoice}
              onBack={() => handleSelectTool('invoice-maker')}
              onCreateNewInvoice={() => handleSelectTool('invoice-maker')}
              theme={theme}
            />
          ) : (
            <div className="text-center py-20 text-xs">
              <p className={isLight ? 'text-neutral-500' : 'text-neutral-400'}>No invoice selected.</p>
              <button
                onClick={() => handleSelectTool('invoice-maker')}
                className={`mt-4 px-3 py-1.5 rounded text-xs font-medium ${
                  isLight ? 'bg-black text-white' : 'bg-white text-black'
                }`}
              >
                Go to Invoice Maker
              </button>
            </div>
          )
        )}

        {currentTool === 'receipt-matcher' && (
          <ReceiptMatcherView
            onBack={() => handleSelectTool('invoice-maker')}
            onSendToInvoice={handleSendReceiptsToInvoice}
            theme={theme}
          />
        )}

        {/* Pillar 4: Tabular */}
        {currentTool === 'clean-csv' && (
          <CleanCsvView
            onBack={() => handleSelectTool('home')}
            theme={theme}
          />
        )}

        {currentTool === 'preserve-zeros' && (
          <PreserveZerosView
            onBack={() => handleSelectTool('home')}
            theme={theme}
          />
        )}

        {currentTool === 'table-converter' && (
          <TableConverterView
            onBack={() => handleSelectTool('home')}
            theme={theme}
          />
        )}
      </main>

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTool={handleSelectTool}
        onOpenOwnerConsole={() => setIsOwnerConsoleOpen(true)}
        onOpenExtension={() => setIsExtensionOpen(true)}
        onOpenHelpdesk={() => setIsHelpdeskOpen(true)}
        onOpenChatbot={() => setIsChatbotOpen(true)}
        theme={theme}
      />

      {/* API Key Settings Modal */}
      <ApiSettingsModal
        isOpen={isApiSettingsOpen}
        onClose={() => setIsApiSettingsOpen(false)}
        theme={theme}
      />

      {/* Security Auditor & Privacy Modal */}
      <SecurityAuditorModal
        isOpen={isSecurityAuditorOpen}
        onClose={() => setIsSecurityAuditorOpen(false)}
        theme={theme}
      />

      {/* Keyboard Shortcuts Cheatsheet Modal */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
        theme={theme}
      />

      {/* Owner Backend Log Console Modal */}
      <OwnerConsoleModal
        isOpen={isOwnerConsoleOpen}
        onClose={() => setIsOwnerConsoleOpen(false)}
        theme={theme}
      />

      {/* Buy Me a Coffee Support Modal */}
      <SupportModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
        theme={theme}
      />

      {/* Browser Extension Modal */}
      <ExtensionModal
        isOpen={isExtensionOpen}
        onClose={() => setIsExtensionOpen(false)}
        theme={theme}
      />

      {/* Helpdesk & Knowledge Base Modal */}
      <HelpdeskModal
        isOpen={isHelpdeskOpen}
        onClose={() => setIsHelpdeskOpen(false)}
        onOpenApiSettings={() => setIsApiSettingsOpen(true)}
        onOpenExtension={() => setIsExtensionOpen(true)}
        onOpenSupport={() => setIsSupportOpen(true)}
        theme={theme}
      />

      {/* Vayun AI Chatbot Assistant */}
      <VayunChatbot
        isOpen={isChatbotOpen}
        onToggle={() => setIsChatbotOpen(prev => !prev)}
        onSelectTool={handleSelectTool}
        onOpenApiSettings={() => setIsApiSettingsOpen(true)}
        theme={theme}
      />

      {/* Footer */}
      <Footer
        onSelectTool={handleSelectTool}
        onOpenSecurityAuditor={() => setIsSecurityAuditorOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onOpenOwnerConsole={() => setIsOwnerConsoleOpen(true)}
        onOpenSupport={() => setIsSupportOpen(true)}
        onOpenExtension={() => setIsExtensionOpen(true)}
        onOpenHelpdesk={() => setIsHelpdeskOpen(true)}
        onOpenChatbot={() => setIsChatbotOpen(true)}
        theme={theme}
      />
    </div>
  );
}
export default App;
