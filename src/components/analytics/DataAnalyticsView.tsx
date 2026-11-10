import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  Upload, 
  FileText, 
  Table, 
  Sparkles, 
  Zap, 
  Download, 
  Copy, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  ShieldCheck, 
  BarChart3, 
  Presentation, 
  HelpCircle, 
  Eye, 
  Key, 
  Layers, 
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import { 
  SlideDeck, 
  SlideData, 
  generatePresentationDeck, 
  extractTextFromPdf, 
  exportDeckToPdf, 
  formatDeckForPowerPointClipboard, 
  formatDeckAsMarkdown,
  ColumnMetric
} from '../../utils/dataAnalyticsEngine';
import { getStoredApiKey } from '../../utils/geminiApi';

interface DataAnalyticsViewProps {
  onBack: () => void;
  onOpenApiSettings?: () => void;
  theme?: 'dark' | 'light';
}

const SAMPLE_SAAS_CSV = `Month,MRR_USD,New_Customers,Churned_Customers,CAC_USD,Expansion_MRR
Jan,45200,28,4,1200,3200
Feb,48900,34,5,1150,4100
Mar,53400,41,6,1080,4800
Apr,58200,39,7,1120,5300
May,64100,48,5,990,6200
Jun,71500,56,8,950,7400
Jul,79800,62,7,920,8900
Aug,87400,69,9,890,9800
Sep,96200,78,8,860,11200`;

const SAMPLE_ECOMMERCE_CSV = `Category,Orders,Revenue_USD,Avg_Order_Value,Return_Rate_Pct,Customer_Satisfaction
Electronics,1420,184600,130,4.2,4.8
Apparel,3850,154000,40,9.8,4.3
Home_Living,980,88200,90,3.1,4.6
Books_Media,2100,42000,20,1.4,4.9
Fitness_Sports,1250,112500,90,5.6,4.7`;

const SAMPLE_OPS_DOC = `QUARTERLY ENGINEERING OPERATIONS & INFRASTRUCTURE REPORT
Period: Q3 Strategic Review
Author: VP of Platform & Systems

1. EXECUTIVE SUMMARY & KEY OBJECTIVES
During Q3, engineering throughput reached an all-time peak across our core services. Cloud infrastructure costs decreased by 18.4% through client-side WebAssembly migrations and database query index optimizations. Core system uptime maintained a 99.98% reliability SLA.

2. QUANTITATIVE PERFORMANCE HIGHLIGHTS
- Sprint Velocity: 482 story points delivered (up +14.2% quarter-over-quarter)
- Mean Time to Recovery (MTTR): Reduced from 42 minutes to 11.4 minutes
- Infrastructure Spend: $42,300/mo (budget variance of -$9,200 favorable)
- Release Frequency: 84 production deployments with 0 critical rollbacks
- Developer Retention: 96.5% satisfaction rating across tooling and workflow

3. BOTTLENECK ANALYSIS & RISKS
While API response latencies averaged 48ms, our batch analytics jobs experienced peak load spikes on Sunday midnight processing. Two secondary database replicas experienced 82% disk utilization requiring auto-expansion.

4. STRATEGIC RECOMMENDATIONS FOR Q4
- Migrate remaining batch workloads to local client-first workers.
- Enforce strict database index audits to prevent unindexed sequential table scans.
- Allocate 15% of sprint velocity to architectural resilience and developer ergonomics.`;

export const DataAnalyticsView: React.FC<DataAnalyticsViewProps> = ({
  onBack,
  onOpenApiSettings,
  theme = 'dark'
}) => {
  const isLight = theme === 'light';
  const hasApiKey = Boolean(getStoredApiKey());

  // Input state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [rawText, setRawText] = useState<string>('');
  const [inputType, setInputType] = useState<'upload' | 'paste'>('upload');
  const [fileType, setFileType] = useState<'csv' | 'pdf' | 'text'>('csv');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStage, setProgressStage] = useState('');
  const [progressPercent, setProgressPercent] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<any>(null);

  // Deck Output state
  const [deck, setDeck] = useState<SlideDeck | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [showSpeakerNotes, setShowSpeakerNotes] = useState(true);
  const [copiedPpt, setCopiedPpt] = useState(false);
  const [copiedMd, setCopiedMd] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stopwatch timer for < 10 second guarantee
  useEffect(() => {
    if (isProcessing) {
      setElapsedSeconds(0);
      const start = Date.now();
      timerRef.current = setInterval(() => {
        setElapsedSeconds(Math.round((Date.now() - start) / 100) / 10);
      }, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isProcessing]);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension === 'pdf') {
      setFileType('pdf');
    } else if (extension === 'csv' || extension === 'tsv') {
      setFileType('csv');
    } else {
      setFileType('text');
    }
  };

  const loadSample = (sampleType: 'saas' | 'ecommerce' | 'ops') => {
    setSelectedFile(null);
    if (sampleType === 'saas') {
      setRawText(SAMPLE_SAAS_CSV);
      setFileType('csv');
      setSelectedFile(new File([SAMPLE_SAAS_CSV], 'saas_revenue_q3.csv', { type: 'text/csv' }));
    } else if (sampleType === 'ecommerce') {
      setRawText(SAMPLE_ECOMMERCE_CSV);
      setFileType('csv');
      setSelectedFile(new File([SAMPLE_ECOMMERCE_CSV], 'ecommerce_cohorts.csv', { type: 'text/csv' }));
    } else {
      setRawText(SAMPLE_OPS_DOC);
      setFileType('text');
      setSelectedFile(new File([SAMPLE_OPS_DOC], 'engineering_ops_report.pdf', { type: 'application/pdf' }));
    }
    setInputType('upload');
  };

  const handleStartAnalysis = async () => {
    setIsProcessing(true);
    setProgressPercent(10);
    setProgressStage('Reading document stream in client RAM...');

    try {
      let content = '';
      let filename = selectedFile?.name || 'custom_data.csv';
      let type: 'csv' | 'pdf' | 'text' = fileType;

      if (selectedFile) {
        if (fileType === 'pdf') {
          setProgressStage('Extracting text and tables from PDF binary...');
          content = await extractTextFromPdf(selectedFile);
        } else {
          content = await selectedFile.text();
        }
      } else {
        content = rawText.trim();
        filename = fileType === 'csv' ? 'pasted_dataset.csv' : 'pasted_briefing.txt';
      }

      if (!content) {
        alert('Please choose a file or paste data first.');
        setIsProcessing(false);
        return;
      }

      const generatedDeck = await generatePresentationDeck(
        { name: filename, type, content },
        (stage, percent) => {
          setProgressStage(stage);
          setProgressPercent(percent);
        }
      );

      setDeck(generatedDeck);
      setActiveSlideIndex(0);
    } catch (err: any) {
      console.error('Error generating analytics deck:', err);
      alert(`Analysis failed: ${err?.message || 'Unknown parsing error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyPpt = () => {
    if (!deck) return;
    const text = formatDeckForPowerPointClipboard(deck);
    navigator.clipboard.writeText(text);
    setCopiedPpt(true);
    setTimeout(() => setCopiedPpt(false), 2500);
  };

  const handleCopyMd = () => {
    if (!deck) return;
    const md = formatDeckAsMarkdown(deck);
    navigator.clipboard.writeText(md);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2500);
  };

  const handleDownloadPdfSlides = async () => {
    if (!deck) return;
    setIsExportingPdf(true);
    try {
      const blob = await exportDeckToPdf(deck);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${deck.deckTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}_Slides.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting PDF slides:', err);
      alert('Failed to generate PDF slides.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className={`min-h-screen py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-8 ${
      isLight ? 'text-slate-900' : 'text-neutral-100'
    }`}>
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className={`p-2 rounded-xl border transition-all ${
              isLight ? 'border-slate-200 hover:bg-slate-100 text-slate-700' : 'border-neutral-800 hover:bg-neutral-900 text-neutral-300'
            }`}
            title="Back to home"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-serif font-bold tracking-tight">
                Data Insights & PPT Deck AI
              </h1>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase border ${
                isLight ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-blue-900 bg-blue-950/60 text-blue-400'
              }`}>
                &lt; 10s Guarantee
              </span>
            </div>
            <p className={`text-xs mt-0.5 font-mono ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
              Turn any PDF or CSV into executive insights & a 5-slide PowerPoint deck within 10 seconds.
            </p>
          </div>
        </div>

        {/* Security & API Status Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-1.5 ${
            isLight ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-emerald-900/60 bg-emerald-950/40 text-emerald-400'
          }`}>
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Client RAM</span>
          </div>

          {onOpenApiSettings && (
            <button
              onClick={onOpenApiSettings}
              className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-all ${
                hasApiKey 
                  ? isLight ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-blue-900/60 bg-blue-950/40 text-blue-400'
                  : isLight ? 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50' : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>{hasApiKey ? 'Gemini AI Active' : 'Offline Engine (No Key Required)'}</span>
            </button>
          )}
        </div>
      </div>

      {!deck ? (
        /* Upload & Configuration Section */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Upload Dropzone */}
          <div className="lg:col-span-8 space-y-5">
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleFileSelect(e.dataTransfer.files[0]);
                }
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`p-8 sm:p-12 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center space-y-4 group ${
                isDragging
                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30'
                  : selectedFile
                  ? isLight ? 'border-blue-400 bg-blue-50/20' : 'border-blue-600/50 bg-blue-950/10'
                  : isLight 
                    ? 'border-slate-300 hover:border-blue-400 bg-white hover:bg-slate-50/50' 
                    : 'border-neutral-800 hover:border-neutral-600 bg-neutral-950 hover:bg-neutral-900/40'
              }`}
            >
              <input 
                ref={fileInputRef}
                type="file"
                accept=".csv,.tsv,.pdf,.txt,.json"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileSelect(e.target.files[0]);
                  }
                }}
              />

              <div className="mx-auto w-14 h-14 rounded-2xl border flex items-center justify-center transition-transform group-hover:scale-105 shadow-xs border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                {fileType === 'pdf' ? (
                  <FileText className="w-7 h-7" />
                ) : fileType === 'csv' ? (
                  <FileSpreadsheet className="w-7 h-7" />
                ) : (
                  <Upload className="w-7 h-7" />
                )}
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-serif font-bold">
                  {selectedFile ? selectedFile.name : 'Drop your PDF report or CSV spreadsheet here'}
                </h3>
                <p className={`text-xs mt-1 font-mono ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                  {selectedFile 
                    ? `${(selectedFile.size / 1024).toFixed(1)} KB • ${selectedFile.type || fileType.toUpperCase()} file loaded` 
                    : 'Supports PDF reports, CSV, TSV, or plain text data • 100% processed in browser RAM'}
                </p>
              </div>

              <div className="pt-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-medium transition-colors ${
                  isLight ? 'border-slate-200 bg-slate-100 text-slate-800' : 'border-neutral-800 bg-neutral-900 text-neutral-300'
                }`}>
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  <span>Browse File or Drag & Drop</span>
                </span>
              </div>
            </div>

            {/* Quick Sample Selector */}
            <div className={`p-4 rounded-xl border ${isLight ? 'border-slate-200 bg-white' : 'border-neutral-800 bg-neutral-950'}`}>
              <div className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-neutral-400 font-semibold mb-2.5 flex items-center justify-between">
                <span>Or test with instant pre-loaded sample datasets</span>
                <span className="text-[10px] text-blue-600 dark:text-blue-400">1-click demo</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => loadSample('saas')}
                  className={`p-3 rounded-lg border text-left transition-all group ${
                    isLight ? 'border-slate-200 hover:border-blue-400 hover:bg-blue-50/40' : 'border-neutral-800 hover:border-neutral-600 hover:bg-neutral-900'
                  }`}
                >
                  <div className="font-semibold text-xs flex items-center gap-1.5">
                    <Table className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>SaaS Sales Metrics (CSV)</span>
                  </div>
                  <div className={`text-[10px] font-mono mt-1 ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                    MRR, Churn, CAC & expansion
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => loadSample('ecommerce')}
                  className={`p-3 rounded-lg border text-left transition-all group ${
                    isLight ? 'border-slate-200 hover:border-blue-400 hover:bg-blue-50/40' : 'border-neutral-800 hover:border-neutral-600 hover:bg-neutral-900'
                  }`}
                >
                  <div className="font-semibold text-xs flex items-center gap-1.5">
                    <BarChart3 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>E-Commerce Cohorts (CSV)</span>
                  </div>
                  <div className={`text-[10px] font-mono mt-1 ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                    Orders, AOV, returns & ratings
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => loadSample('ops')}
                  className={`p-3 rounded-lg border text-left transition-all group ${
                    isLight ? 'border-slate-200 hover:border-blue-400 hover:bg-blue-50/40' : 'border-neutral-800 hover:border-neutral-600 hover:bg-neutral-900'
                  }`}
                >
                  <div className="font-semibold text-xs flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                    <span>Engineering Ops (PDF)</span>
                  </div>
                  <div className={`text-[10px] font-mono mt-1 ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                    Q3 SLAs, velocity & recommendations
                  </div>
                </button>
              </div>
            </div>

            {/* Launch Analysis Button */}
            <div>
              <button
                type="button"
                disabled={isProcessing || (!selectedFile && !rawText.trim())}
                onClick={handleStartAnalysis}
                className={`w-full py-3.5 rounded-xl font-mono text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99] ${
                  isProcessing || (!selectedFile && !rawText.trim())
                    ? 'opacity-50 cursor-not-allowed bg-slate-300 dark:bg-neutral-800 text-slate-500'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/25'
                }`}
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Generate Executive Insights & 5-Slide PPT Deck (&lt; 10s)</span>
              </button>
            </div>

            {/* 10-Second Live Telemetry Speedometer */}
            {isProcessing && (
              <div className={`p-4 rounded-xl border space-y-3 animate-pulse ${
                isLight ? 'border-blue-200 bg-blue-50/70 text-slate-800' : 'border-blue-900/60 bg-blue-950/30 text-white'
              }`}>
                <div className="flex items-center justify-between text-xs font-mono font-semibold">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500 animate-spin" />
                    <span>{progressStage}</span>
                  </div>
                  <span className="text-blue-600 dark:text-blue-400 font-bold">
                    Elapsed: {elapsedSeconds.toFixed(1)}s / 10s
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-neutral-800 overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 transition-all duration-300 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Sidebar / Instructions & Value Pitch */}
          <div className="lg:col-span-4 space-y-5">
            <div className={`p-5 rounded-2xl border space-y-3.5 ${
              isLight ? 'bg-white border-slate-200' : 'bg-neutral-950 border-neutral-800'
            }`}>
              <div className="flex items-center gap-2">
                <Presentation className="w-4 h-4 text-blue-500" />
                <h4 className="font-serif font-bold text-sm">How it builds PPTs for people</h4>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-neutral-400">
                <li className="flex items-start gap-2">
                  <span className="font-mono text-blue-500 font-bold">01.</span>
                  <span><strong>Automatic Schema & Metric Discovery:</strong> Scans numerical columns, aggregates sums, averages, and trend deviations.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono text-blue-500 font-bold">02.</span>
                  <span><strong>McKinsey 5-Slide Structure:</strong> Generates Title, Scorecard KPIs, Segment Breakdowns, Strategic Actions, and Appendix.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono text-blue-500 font-bold">03.</span>
                  <span><strong>One-Click Export:</strong> Download 16:9 PDF slides or copy text formatted directly for PowerPoint, Canva, and Google Slides.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono text-blue-500 font-bold">04.</span>
                  <span><strong>Speaker Notes Included:</strong> Gives you the exact talking points for presentations and viva defenses.</span>
                </li>
              </ul>
            </div>

            <div className={`p-4 rounded-xl border text-xs font-mono space-y-2 ${
              isLight ? 'border-slate-200 bg-slate-50 text-slate-600' : 'border-neutral-800 bg-neutral-900/40 text-neutral-400'
            }`}>
              <div className="font-semibold text-slate-800 dark:text-neutral-200 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Zero Cloud Storage Policy</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Files dropped into this engine never touch any remote database. Everything is parsed inside your local browser memory and discarded on close.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Results & Presentation Studio */
        <div className="space-y-6">
          {/* Deck Overview & Action Strip */}
          <div className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            isLight ? 'bg-white border-slate-200' : 'bg-neutral-950 border-neutral-800'
          }`}>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-serif font-bold tracking-tight">
                  {deck.deckTitle}
                </h2>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${
                  isLight ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-emerald-900 bg-emerald-950/60 text-emerald-400'
                }`}>
                  Ready in {deck.executionTimeMs}ms
                </span>
              </div>
              <p className={`text-xs mt-1 font-mono ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                Source: {deck.sourceFilename} • {deck.totalRecords} records • 5 Slides Synthesized
              </p>
            </div>

            {/* Export Toolbar */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleDownloadPdfSlides}
                disabled={isExportingPdf}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-semibold flex items-center gap-1.5 transition-all active:scale-95 shadow-xs ${
                  isLight 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
                title="Download 16:9 Presentation Slides as PDF"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isExportingPdf ? 'Exporting...' : 'Download PDF Slides'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopyPpt}
                className={`px-3.5 py-2 rounded-xl border text-xs font-mono font-semibold flex items-center gap-1.5 transition-all active:scale-95 ${
                  copiedPpt
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600'
                    : isLight 
                      ? 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700' 
                      : 'border-neutral-800 bg-neutral-900 hover:bg-neutral-850 text-neutral-300'
                }`}
                title="Copy formatted slide outline to paste into PowerPoint, Canva, or Keynote"
              >
                {copiedPpt ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPpt ? 'Copied for PPT!' : 'Copy for PPT'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopyMd}
                className={`px-3.5 py-2 rounded-xl border text-xs font-mono font-semibold flex items-center gap-1.5 transition-all active:scale-95 ${
                  copiedMd
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600'
                    : isLight 
                      ? 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700' 
                      : 'border-neutral-800 bg-neutral-900 hover:bg-neutral-850 text-neutral-300'
                }`}
                title="Copy Marp / Gamma Markdown presentation slides"
              >
                {copiedMd ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <FileText className="w-3.5 h-3.5" />}
                <span>{copiedMd ? 'Copied Markdown!' : 'Marp/Gamma'}</span>
              </button>

              <button
                type="button"
                onClick={() => setDeck(null)}
                className={`px-3 py-2 rounded-xl border text-xs font-mono transition-all ${
                  isLight ? 'border-slate-200 hover:bg-slate-100 text-slate-600' : 'border-neutral-800 hover:bg-neutral-900 text-neutral-400'
                }`}
              >
                New Analysis
              </button>
            </div>
          </div>

          {/* Interactive 16:9 Widescreen Slide Presentation Canvas */}
          <div className="space-y-4">
            {/* Slide Navigation Thumbnails Header */}
            <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 no-scrollbar">
              <div className="flex items-center gap-1.5">
                {deck.slides.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveSlideIndex(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 whitespace-nowrap ${
                      activeSlideIndex === idx
                        ? isLight 
                          ? 'bg-blue-600 text-white font-semibold shadow-xs' 
                          : 'bg-white text-black font-semibold'
                        : isLight 
                          ? 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100' 
                          : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span>Slide {s.slideNumber}:</span>
                    <span className="truncate max-w-[120px] sm:max-w-none">{s.title.split(':')[0]}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  disabled={activeSlideIndex === 0}
                  onClick={() => setActiveSlideIndex(i => Math.max(0, i - 1))}
                  className={`p-1.5 rounded-lg border transition-all ${
                    activeSlideIndex === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono px-1">
                  {activeSlideIndex + 1} / {deck.slides.length}
                </span>
                <button
                  type="button"
                  disabled={activeSlideIndex === deck.slides.length - 1}
                  onClick={() => setActiveSlideIndex(i => Math.min(deck.slides.length - 1, i + 1))}
                  className={`p-1.5 rounded-lg border transition-all ${
                    activeSlideIndex === deck.slides.length - 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 16:9 Presentation Stage Card */}
            {deck.slides[activeSlideIndex] && (
              <div className={`aspect-16/9 w-full rounded-2xl border p-6 sm:p-10 flex flex-col justify-between shadow-2xl relative overflow-hidden transition-all ${
                isLight 
                  ? 'bg-gradient-to-br from-white via-slate-50 to-blue-50/20 border-slate-300/80 text-slate-900' 
                  : 'bg-gradient-to-br from-slate-950 via-neutral-950 to-blue-950/30 border-neutral-800 text-white shadow-black/80'
              }`}>
                {/* Slide Accent Top Glow */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-400" />

                {/* Slide Header */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono tracking-widest uppercase font-semibold text-blue-600 dark:text-blue-400">
                      SLIDE {deck.slides[activeSlideIndex].slideNumber} • {deck.slides[activeSlideIndex].layout.toUpperCase()}
                    </span>
                    <span className={`text-[10px] font-mono ${isLight ? 'text-slate-400' : 'text-neutral-500'}`}>
                      {deck.sourceFilename}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-3xl font-serif font-bold tracking-tight">
                    {deck.slides[activeSlideIndex].title}
                  </h3>
                  <p className={`text-xs sm:text-sm font-sans ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
                    {deck.slides[activeSlideIndex].subtitle}
                  </p>
                </div>

                {/* Slide Content Body */}
                <div className="py-4 my-auto space-y-4">
                  {/* KPI Cards Strip if present */}
                  {deck.slides[activeSlideIndex].kpis && deck.slides[activeSlideIndex].kpis!.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {deck.slides[activeSlideIndex].kpis!.map((kpi, kIdx) => (
                        <div 
                          key={kIdx} 
                          className={`p-3.5 rounded-xl border transition-all ${
                            isLight 
                              ? 'bg-white border-slate-200/90 shadow-xs' 
                              : 'bg-neutral-900/80 border-neutral-800'
                          }`}
                        >
                          <div className={`text-[11px] font-mono truncate ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                            {kpi.label}
                          </div>
                          <div className="text-xl sm:text-2xl font-bold font-sans mt-0.5 tracking-tight text-blue-600 dark:text-blue-400">
                            {kpi.value}
                          </div>
                          {kpi.trend && (
                            <div className="text-[10px] font-mono mt-1 text-emerald-600 dark:text-emerald-400 font-medium truncate">
                              {kpi.trend}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Key Takeaway Bullets */}
                  <div className="space-y-2.5 max-w-4xl">
                    {deck.slides[activeSlideIndex].keyPoints.map((point, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-3 text-xs sm:text-sm leading-relaxed">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                        <span className={`${isLight ? 'text-slate-800' : 'text-neutral-200'}`}>
                          {point}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Slide Bottom Footer */}
                <div className={`pt-3 border-t flex items-center justify-between text-[10px] font-mono ${
                  isLight ? 'border-slate-200 text-slate-400' : 'border-neutral-800 text-neutral-500'
                }`}>
                  <span>Vayun Presentation Deck Engine • Confidential</span>
                  <span>Slide {deck.slides[activeSlideIndex].slideNumber} of {deck.slides.length}</span>
                </div>
              </div>
            )}

            {/* Toggleable Speaker Notes Drawer */}
            <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
              isLight ? 'bg-white border-slate-200' : 'bg-neutral-950 border-neutral-800'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Presentation className="w-4 h-4 text-blue-500" />
                  <span className="font-mono text-xs uppercase tracking-wider font-semibold">
                    Speaker Notes (What to say during your presentation)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSpeakerNotes(s => !s)}
                  className={`text-xs font-mono underline ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}
                >
                  {showSpeakerNotes ? 'Hide notes' : 'Show notes'}
                </button>
              </div>

              {showSpeakerNotes && (
                <p className={`text-xs sm:text-sm leading-relaxed font-sans italic p-3 rounded-xl border ${
                  isLight 
                    ? 'bg-amber-50/50 border-amber-200/60 text-slate-800' 
                    : 'bg-amber-950/20 border-amber-900/40 text-amber-200/90'
                }`}>
                  "{deck.slides[activeSlideIndex].speakerNotes}"
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
