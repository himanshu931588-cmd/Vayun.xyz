import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Upload, 
  Download, 
  FileText, 
  RefreshCw,
  Check,
  Layers,
  Sparkles,
  SlidersHorizontal,
  CheckSquare,
  Square,
  ArrowRight
} from 'lucide-react';
import { 
  inspectPdf, 
  extractPdfPages, 
  splitAllPdfPages, 
  splitPdfIntoChunks 
} from '../../utils/pdfEngines';

interface SplitPdfViewProps {
  onBack: () => void;
  theme?: 'dark' | 'light';
}

type SplitMode = 'range' | 'chunks' | 'all';

export const SplitPdfView: React.FC<SplitPdfViewProps> = ({ onBack, theme = 'dark' }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [mode, setMode] = useState<SplitMode>('range');
  const [rangeStr, setRangeStr] = useState('1');
  const [chunkSize, setChunkSize] = useState<number>(10);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  
  // Results
  const [extractedPdfUrl, setExtractedPdfUrl] = useState<string | null>(null);
  const [splitPages, setSplitPages] = useState<{ pageNum: number; url: string }[]>([]);
  const [chunkFiles, setChunkFiles] = useState<{ partIndex: number; startPage: number; endPage: number; url: string }[]>([]);

  const isLight = theme === 'light';

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setExtractedPdfUrl(null);
    setSplitPages([]);
    setChunkFiles([]);
    setProgressMsg('Analyzing document structure...');

    try {
      const meta = await inspectPdf(file);
      setTotalPages(meta.pageCount);
      setRangeStr(meta.pageCount > 1 ? `1-${Math.min(meta.pageCount, 50)}` : '1');
    } catch {
      setTotalPages(1);
      setRangeStr('1');
    } finally {
      setProgressMsg('');
    }
  };

  // High-Capacity Smart Range Parser
  // Supports: "1-100", "1-50, 60-120", "odd", "even", "all", "first 20", "last 20"
  const parseRangeIndices = (str: string, max: number): number[] => {
    if (max <= 0) return [];
    const clean = str.trim().toLowerCase();
    const indices = new Set<number>();

    if (clean === 'all') {
      for (let i = 0; i < max; i++) indices.add(i);
      return Array.from(indices);
    }

    if (clean === 'odd') {
      for (let i = 0; i < max; i += 2) indices.add(i);
      return Array.from(indices);
    }

    if (clean === 'even') {
      for (let i = 1; i < max; i += 2) indices.add(i);
      return Array.from(indices);
    }

    if (clean.startsWith('first')) {
      const num = parseInt(clean.replace('first', '').trim(), 10) || 10;
      for (let i = 0; i < Math.min(max, num); i++) indices.add(i);
      return Array.from(indices);
    }

    if (clean.startsWith('last')) {
      const num = parseInt(clean.replace('last', '').trim(), 10) || 10;
      const start = Math.max(0, max - num);
      for (let i = start; i < max; i++) indices.add(i);
      return Array.from(indices);
    }

    const parts = clean.split(',').map(p => p.trim());
    for (const part of parts) {
      if (part.includes('-') || part.includes('to')) {
        const separator = part.includes('to') ? 'to' : '-';
        const [startStr, endStr] = part.split(separator);
        const start = parseInt(startStr.trim(), 10);
        const end = parseInt(endStr.trim(), 10);
        if (!isNaN(start) && !isNaN(end)) {
          const lo = Math.max(1, Math.min(start, end));
          const hi = Math.min(max, Math.max(start, end));
          for (let p = lo; p <= hi; p++) {
            indices.add(p - 1); // 0-based index
          }
        }
      } else {
        const single = parseInt(part, 10);
        if (!isNaN(single) && single >= 1 && single <= max) {
          indices.add(single - 1);
        }
      }
    }

    return Array.from(indices).sort((a, b) => a - b);
  };

  const selectedIndices = useMemo(() => {
    if (mode !== 'range') return [];
    return parseRangeIndices(rangeStr, totalPages);
  }, [rangeStr, totalPages, mode]);

  const handleApplyPreset = (preset: string) => {
    setRangeStr(preset);
    setExtractedPdfUrl(null);
  };

  const handleTogglePage = (pageIndex: number) => {
    const isSelected = selectedIndices.includes(pageIndex);
    let newSet = new Set(selectedIndices);
    if (isSelected) {
      newSet.delete(pageIndex);
    } else {
      newSet.add(pageIndex);
    }
    const sorted = Array.from(newSet).sort((a, b) => a - b);
    
    // Format into compact range string
    if (sorted.length === 0) {
      setRangeStr('');
      return;
    }
    
    // Group into intervals
    const intervals: string[] = [];
    let start = sorted[0];
    let prev = sorted[0];

    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i] === prev + 1) {
        prev = sorted[i];
      } else {
        intervals.push(start === prev ? `${start + 1}` : `${start + 1}-${prev + 1}`);
        start = sorted[i];
        prev = sorted[i];
      }
    }
    intervals.push(start === prev ? `${start + 1}` : `${start + 1}-${prev + 1}`);
    setRangeStr(intervals.join(', '));
    setExtractedPdfUrl(null);
  };

  const handleSelectAll = () => {
    setRangeStr(`1-${totalPages}`);
    setExtractedPdfUrl(null);
  };

  const handleDeselectAll = () => {
    setRangeStr('');
    setExtractedPdfUrl(null);
  };

  const handleInvertSelection = () => {
    const currentSet = new Set(selectedIndices);
    const inverted: number[] = [];
    for (let i = 0; i < totalPages; i++) {
      if (!currentSet.has(i)) inverted.push(i + 1);
    }
    if (inverted.length === 0) {
      setRangeStr('');
    } else {
      setRangeStr(inverted.join(', '));
    }
    setExtractedPdfUrl(null);
  };

  const handleExtract = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    setProgressMsg('Extracting in browser RAM...');

    try {
      if (mode === 'range') {
        const indices = parseRangeIndices(rangeStr, totalPages);
        if (indices.length === 0) {
          alert('Please enter or select at least one page to extract.');
          setIsProcessing(false);
          return;
        }

        const bytes = await extractPdfPages(selectedFile, indices);
        const blob = new Blob([bytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setExtractedPdfUrl(url);
      } else if (mode === 'chunks') {
        setProgressMsg(`Splitting into chunks of ${chunkSize} pages...`);
        const chunks = await splitPdfIntoChunks(selectedFile, chunkSize);
        const mapped = chunks.map(c => ({
          partIndex: c.partIndex,
          startPage: c.startPage,
          endPage: c.endPage,
          url: URL.createObjectURL(new Blob([c.bytes], { type: 'application/pdf' }))
        }));
        setChunkFiles(mapped);
      } else {
        // Split all individual pages
        setProgressMsg(`Separating all ${totalPages} pages into standalone files...`);
        const pages = await splitAllPdfPages(selectedFile);
        const mapped = pages.map(p => ({
          pageNum: p.pageNum,
          url: URL.createObjectURL(new Blob([p.bytes], { type: 'application/pdf' }))
        }));
        setSplitPages(mapped);
      }
    } catch (err) {
      console.error('Split error:', err);
      alert('Unable to extract pages from this PDF. Please check the document.');
    } finally {
      setIsProcessing(false);
      setProgressMsg('');
    }
  };

  const handleBatchDownloadAll = (urls: { name: string; url: string }[]) => {
    urls.forEach((item, index) => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = item.url;
        link.download = item.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, index * 120);
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className={`flex items-center gap-1.5 text-xs font-mono transition-colors ${
            isLight ? 'text-neutral-500 hover:text-black' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to utilities</span>
        </button>

        {selectedFile && (
          <button
            onClick={() => { 
              setSelectedFile(null); 
              setExtractedPdfUrl(null); 
              setSplitPages([]); 
              setChunkFiles([]);
            }}
            className={`text-xs font-mono underline hover:no-underline ${
              isLight ? 'text-neutral-500 hover:text-black' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Change document
          </button>
        )}
      </div>

      <div className={`space-y-1.5 pb-4 border-b ${isLight ? 'border-neutral-200' : 'border-neutral-900'}`}>
        <h1 className={`text-2xl font-serif tracking-tight ${isLight ? 'text-black' : 'text-white'}`}>
          High-Capacity Split & Extract PDF
        </h1>
        <p className={`text-xs max-w-xl leading-relaxed ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
          Extract custom page ranges (e.g. 1-100, 1-500), split by fixed chunk sizes (every 10 or 50 pages), or separate individual pages. 100% in-browser RAM execution.
        </p>
      </div>

      {!selectedFile ? (
        <label className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer transition-all ${
          isLight ? 'border-neutral-300 hover:border-black bg-neutral-50/50' : 'border-neutral-800 hover:border-neutral-600 bg-[#0a0a0a]'
        }`}>
          <Upload className={`w-8 h-8 mb-3 ${isLight ? 'text-neutral-400' : 'text-neutral-600'}`} />
          <span className={`text-sm font-medium ${isLight ? 'text-black' : 'text-white'}`}>
            Click to upload multi-page PDF
          </span>
          <span className="text-xs text-neutral-500 mt-1">
            Supports documents with 1 to 1,000+ pages • Zero uploads to servers
          </span>
          <input type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" />
        </label>
      ) : (
        <div className="space-y-6">
          {/* File summary bar */}
          <div className={`p-4 border rounded-xl flex items-center justify-between text-xs ${
            isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#0a0a0a] border-neutral-800'
          }`}>
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-neutral-400" />
              <div>
                <span className={`font-semibold block text-sm ${isLight ? 'text-black' : 'text-white'}`}>
                  {selectedFile.name}
                </span>
                <span className="text-neutral-500 font-mono text-xs">
                  {totalPages} total pages • {(selectedFile.size / 1024).toFixed(0)} KB
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-mono border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                In-Memory RAM
              </span>
            </div>
          </div>

          {/* Mode Selector */}
          <div className={`p-5 border rounded-2xl space-y-5 text-xs ${
            isLight ? 'bg-white border-neutral-200' : 'bg-[#0f0f10] border-neutral-800'
          }`}>
            <div className="flex flex-wrap items-center gap-6">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="radio"
                  name="splitMode"
                  checked={mode === 'range'}
                  onChange={() => { setMode('range'); setExtractedPdfUrl(null); }}
                  className="rounded-full bg-neutral-900 border-neutral-700"
                />
                <span className={`font-medium ${isLight ? 'text-black' : 'text-white'}`}>
                  Custom Page Range (1-100+)
                </span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="radio"
                  name="splitMode"
                  checked={mode === 'chunks'}
                  onChange={() => { setMode('chunks'); setChunkFiles([]); }}
                  className="rounded-full bg-neutral-900 border-neutral-700"
                />
                <span className={`font-medium ${isLight ? 'text-black' : 'text-white'}`}>
                  Split by Fixed Chunks
                </span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="radio"
                  name="splitMode"
                  checked={mode === 'all'}
                  onChange={() => { setMode('all'); setSplitPages([]); }}
                  className="rounded-full bg-neutral-900 border-neutral-700"
                />
                <span className={`font-medium ${isLight ? 'text-black' : 'text-white'}`}>
                  Split Every Single Page
                </span>
              </label>
            </div>

            {/* Custom Range Mode Options */}
            {mode === 'range' && (
              <div className="space-y-4 pt-3 border-t border-neutral-800/80">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">
                    Page Range Expression (e.g. 1-50, 60-100, odd, even)
                  </label>
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      type="text"
                      value={rangeStr}
                      onChange={(e) => { setRangeStr(e.target.value); setExtractedPdfUrl(null); }}
                      placeholder="1-50, 75, 100-200"
                      className={`px-3.5 py-2 border rounded-xl text-xs font-mono w-full sm:w-80 focus:outline-hidden ${
                        isLight ? 'bg-neutral-50 border-neutral-300 text-black' : 'bg-black border-neutral-800 text-white'
                      }`}
                    />
                    <div className="text-neutral-500 font-mono text-xs">
                      Selected: <strong>{selectedIndices.length}</strong> of {totalPages} pages
                    </div>
                  </div>
                </div>

                {/* Instant Presets */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase text-neutral-500 block">
                    Fast Range Presets:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleApplyPreset(`1-${totalPages}`)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-mono border transition-colors ${
                        isLight ? 'bg-neutral-100 border-neutral-200 hover:bg-neutral-200' : 'bg-neutral-900 border-neutral-800 hover:bg-neutral-800'
                      }`}
                    >
                      All (1 - {totalPages})
                    </button>
                    {totalPages > 10 && (
                      <button
                        type="button"
                        onClick={() => handleApplyPreset('first 10')}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-mono border transition-colors ${
                          isLight ? 'bg-neutral-100 border-neutral-200 hover:bg-neutral-200' : 'bg-neutral-900 border-neutral-800 hover:bg-neutral-800'
                        }`}
                      >
                        First 10 Pages
                      </button>
                    )}
                    {totalPages > 50 && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleApplyPreset('1-50')}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-mono border transition-colors ${
                            isLight ? 'bg-neutral-100 border-neutral-200 hover:bg-neutral-200' : 'bg-neutral-900 border-neutral-800 hover:bg-neutral-800'
                          }`}
                        >
                          1 - 50
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApplyPreset(`51-${Math.min(totalPages, 100)}`)}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-mono border transition-colors ${
                            isLight ? 'bg-neutral-100 border-neutral-200 hover:bg-neutral-200' : 'bg-neutral-900 border-neutral-800 hover:bg-neutral-800'
                          }`}
                        >
                          51 - {Math.min(totalPages, 100)}
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() => handleApplyPreset('odd')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-mono border transition-colors ${
                        isLight ? 'bg-neutral-100 border-neutral-200 hover:bg-neutral-200' : 'bg-neutral-900 border-neutral-800 hover:bg-neutral-800'
                      }`}
                    >
                      Odd Pages
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyPreset('even')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-mono border transition-colors ${
                        isLight ? 'bg-neutral-100 border-neutral-200 hover:bg-neutral-200' : 'bg-neutral-900 border-neutral-800 hover:bg-neutral-800'
                      }`}
                    >
                      Even Pages
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyPreset(`1-${Math.ceil(totalPages / 2)}`)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-mono border transition-colors ${
                        isLight ? 'bg-neutral-100 border-neutral-200 hover:bg-neutral-200' : 'bg-neutral-900 border-neutral-800 hover:bg-neutral-800'
                      }`}
                    >
                      First Half (1-{Math.ceil(totalPages / 2)})
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyPreset(`${Math.ceil(totalPages / 2) + 1}-${totalPages}`)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-mono border transition-colors ${
                        isLight ? 'bg-neutral-100 border-neutral-200 hover:bg-neutral-200' : 'bg-neutral-900 border-neutral-800 hover:bg-neutral-800'
                      }`}
                    >
                      Second Half
                    </button>
                  </div>
                </div>

                {/* Visual Page Selector Grid (for up to 120 pages preview) */}
                {totalPages <= 120 && (
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase text-neutral-500">
                        Interactive Page Grid (Click to toggle):
                      </span>
                      <div className="flex items-center gap-2 text-[10px] font-mono">
                        <button onClick={handleSelectAll} className="hover:underline">All</button>
                        <span>•</span>
                        <button onClick={handleDeselectAll} className="hover:underline">None</button>
                        <span>•</span>
                        <button onClick={handleInvertSelection} className="hover:underline">Invert</button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-2 rounded-xl border border-neutral-800/60 bg-black/40">
                      {Array.from({ length: totalPages }).map((_, idx) => {
                        const isSelected = selectedIndices.includes(idx);
                        return (
                          <button
                            type="button"
                            key={idx}
                            onClick={() => handleTogglePage(idx)}
                            className={`w-7 h-7 rounded text-[11px] font-mono font-medium transition-all ${
                              isSelected
                                ? isLight ? 'bg-black text-white' : 'bg-white text-black font-bold shadow-xs'
                                : isLight ? 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200' : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800'
                            }`}
                          >
                            {idx + 1}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Chunks Mode Options */}
            {mode === 'chunks' && (
              <div className="space-y-3 pt-3 border-t border-neutral-800/80">
                <label className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">
                  Pages Per Document Chunk
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  {[2, 5, 10, 25, 50, 100].map(sz => (
                    <button
                      type="button"
                      key={sz}
                      onClick={() => setChunkSize(sz)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                        chunkSize === sz
                          ? isLight ? 'bg-black text-white border-black' : 'bg-white text-black border-white font-bold'
                          : isLight ? 'bg-neutral-100 border-neutral-200 text-neutral-700' : 'bg-neutral-900 border-neutral-800 text-neutral-300'
                      }`}
                    >
                      Every {sz} pages
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-neutral-500 font-mono">
                  Will produce <strong>{Math.ceil(totalPages / chunkSize)}</strong> separate PDF documents.
                </p>
              </div>
            )}

            {/* Execute Button */}
            <div className="pt-2">
              <button
                onClick={handleExtract}
                disabled={isProcessing}
                className={`px-6 py-2.5 font-medium text-xs font-mono rounded-xl transition-all flex items-center gap-2 shadow-sm ${
                  isLight 
                    ? 'bg-black text-white hover:bg-neutral-800' 
                    : 'bg-white text-black hover:bg-neutral-200'
                }`}
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>{progressMsg || 'Processing in RAM...'}</span>
                  </>
                ) : (
                  <>
                    <span>
                      {mode === 'range' 
                        ? `Extract ${selectedIndices.length} Selected Pages` 
                        : mode === 'chunks'
                        ? `Split into ${Math.ceil(totalPages / chunkSize)} Chunks`
                        : `Separate All ${totalPages} Pages`}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results: Single Range Extracted PDF */}
          {extractedPdfUrl && (
            <div className={`p-5 border rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs ${
              isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#0f0f10] border-neutral-800'
            }`}>
              <div className="space-y-1">
                <span className={`font-semibold block text-sm ${isLight ? 'text-black' : 'text-white'}`}>
                  Extracted PDF Ready for Download
                </span>
                <span className="text-neutral-500 font-mono text-xs">
                  Included pages: {rangeStr} ({selectedIndices.length} total)
                </span>
              </div>

              <a
                href={extractedPdfUrl}
                download={`extracted_pages_${rangeStr.replace(/[^a-zA-Z0-9-]/g, '_')}.pdf`}
                className={`px-5 py-2.5 font-medium text-xs font-mono rounded-xl transition-all flex items-center gap-2 shadow-sm ${
                  isLight ? 'bg-black text-white hover:bg-neutral-800' : 'bg-white text-black hover:bg-neutral-200'
                }`}
              >
                <Download className="w-4 h-4" />
                <span>Download Extracted PDF</span>
              </a>
            </div>
          )}

          {/* Results: Chunks Mode */}
          {chunkFiles.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase text-neutral-400 font-semibold block">
                  Generated Document Chunks ({chunkFiles.length} files)
                </span>
                <button
                  onClick={() => handleBatchDownloadAll(chunkFiles.map(c => ({
                    name: `part_${c.partIndex}_pages_${c.startPage}-${c.endPage}.pdf`,
                    url: c.url
                  })))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 border transition-all ${
                    isLight ? 'bg-black text-white border-black' : 'bg-white text-black border-white'
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download All Chunks</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {chunkFiles.map(chunk => (
                  <div
                    key={chunk.partIndex}
                    className={`p-3.5 border rounded-xl flex items-center justify-between gap-3 text-xs ${
                      isLight ? 'bg-white border-neutral-200' : 'bg-[#0f0f10] border-neutral-800'
                    }`}
                  >
                    <div>
                      <span className={`font-semibold block font-mono ${isLight ? 'text-black' : 'text-white'}`}>
                        Part {chunk.partIndex}
                      </span>
                      <span className="text-neutral-500 font-mono text-[11px]">
                        Pages {chunk.startPage} – {chunk.endPage}
                      </span>
                    </div>

                    <a
                      href={chunk.url}
                      download={`part_${chunk.partIndex}_pages_${chunk.startPage}-${chunk.endPage}.pdf`}
                      className={`p-2 rounded-lg transition-colors ${
                        isLight ? 'bg-neutral-100 hover:bg-neutral-200 text-black' : 'bg-neutral-900 hover:bg-neutral-800 text-white'
                      }`}
                      title="Download this part"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results: Split Every Single Page */}
          {splitPages.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase text-neutral-400 font-semibold block">
                  Extracted Individual Pages ({splitPages.length} files)
                </span>
                <button
                  onClick={() => handleBatchDownloadAll(splitPages.map(p => ({
                    name: `page_${p.pageNum}.pdf`,
                    url: p.url
                  })))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 border transition-all ${
                    isLight ? 'bg-black text-white border-black' : 'bg-white text-black border-white'
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download All Pages</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {splitPages.map(page => (
                  <div
                    key={page.pageNum}
                    className={`p-3 border rounded-xl flex flex-col justify-between gap-2.5 text-xs ${
                      isLight ? 'bg-white border-neutral-200' : 'bg-[#0f0f10] border-neutral-800'
                    }`}
                  >
                    <span className="font-mono font-medium text-neutral-400">Page {page.pageNum}</span>
                    <a
                      href={page.url}
                      download={`page_${page.pageNum}.pdf`}
                      className={`py-1 text-center font-mono font-medium rounded-lg text-[11px] transition-colors flex items-center justify-center gap-1 ${
                        isLight ? 'bg-neutral-100 hover:bg-neutral-200 text-black' : 'bg-neutral-900 hover:bg-neutral-800 text-white'
                      }`}
                    >
                      <Download className="w-3 h-3" />
                      <span>Save</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SplitPdfView;
