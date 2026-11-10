import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Upload, 
  Download, 
  FileText, 
  RefreshCw,
  Check
} from 'lucide-react';
import { inspectPdf, extractPdfPages, splitAllPdfPages } from '../../utils/pdfEngines';

interface SplitPdfViewProps {
  onBack: () => void;
  theme?: 'dark' | 'light';
}

export const SplitPdfView: React.FC<SplitPdfViewProps> = ({ onBack, theme = 'dark' }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [mode, setMode] = useState<'range' | 'all'>('range');
  const [rangeStr, setRangeStr] = useState('1');
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedPdfUrl, setExtractedPdfUrl] = useState<string | null>(null);
  const [splitPages, setSplitPages] = useState<{ pageNum: number; url: string }[]>([]);
  const isLight = theme === 'light';

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setExtractedPdfUrl(null);
    setSplitPages([]);
    const meta = await inspectPdf(file);
    setTotalPages(meta.pageCount);
    setRangeStr(meta.pageCount > 1 ? `1-${Math.min(meta.pageCount, 3)}` : '1');
  };

  const parseRangeIndices = (str: string, max: number): number[] => {
    const indices = new Set<number>();
    const parts = str.split(',').map(p => p.trim());

    for (const part of parts) {
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-');
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (!isNaN(start) && !isNaN(end)) {
          for (let p = Math.max(1, start); p <= Math.min(max, end); p++) {
            indices.add(p - 1); // 0-based
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

  const handleExtract = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);

    try {
      if (mode === 'range') {
        const indices = parseRangeIndices(rangeStr, totalPages);
        if (indices.length === 0) {
          alert('Please enter a valid page range.');
          setIsProcessing(false);
          return;
        }

        const bytes = await extractPdfPages(selectedFile, indices);
        const blob = new Blob([bytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setExtractedPdfUrl(url);
      } else {
        // Split all pages
        const pages = await splitAllPdfPages(selectedFile);
        const mapped = pages.map(p => ({
          pageNum: p.pageNum,
          url: URL.createObjectURL(new Blob([p.bytes], { type: 'application/pdf' }))
        }));
        setSplitPages(mapped);
      }
    } catch (err) {
      console.error('Split error:', err);
      alert('Unable to extract pages from this PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className={`flex items-center gap-1 text-xs transition-colors ${
            isLight ? 'text-neutral-500 hover:text-black' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to utilities</span>
        </button>

        {selectedFile && (
          <button
            onClick={() => { setSelectedFile(null); setExtractedPdfUrl(null); setSplitPages([]); }}
            className={`text-xs ${isLight ? 'text-neutral-500 hover:text-black' : 'text-neutral-400 hover:text-white'}`}
          >
            Change document
          </button>
        )}
      </div>

      <div className={`space-y-1.5 pb-4 border-b ${isLight ? 'border-neutral-200' : 'border-neutral-900'}`}>
        <h1 className={`text-2xl font-serif tracking-tight ${isLight ? 'text-black' : 'text-white'}`}>
          Split & Extract PDF
        </h1>
        <p className={`text-xs max-w-xl leading-relaxed ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
          Extract specific page ranges into a separate document or separate every single page into standalone files.
        </p>
      </div>

      {!selectedFile ? (
        <label className={`border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer transition-colors ${
          isLight ? 'border-neutral-300 hover:border-black bg-neutral-50/50' : 'border-neutral-800 hover:border-neutral-600 bg-[#0a0a0a]'
        }`}>
          <Upload className={`w-8 h-8 mb-3 ${isLight ? 'text-neutral-400' : 'text-neutral-600'}`} />
          <span className={`text-sm font-medium ${isLight ? 'text-black' : 'text-white'}`}>
            Click to upload PDF
          </span>
          <span className="text-xs text-neutral-500 mt-1">Select any multi-page PDF document</span>
          <input type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" />
        </label>
      ) : (
        <div className="space-y-5">
          {/* File summary bar */}
          <div className={`p-3.5 border rounded flex items-center justify-between text-xs ${
            isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#0a0a0a] border-neutral-800'
          }`}>
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-neutral-400" />
              <div>
                <span className={`font-medium block ${isLight ? 'text-black' : 'text-white'}`}>
                  {selectedFile.name}
                </span>
                <span className="text-neutral-500 font-mono text-[11px]">
                  {totalPages} total pages • {(selectedFile.size / 1024).toFixed(0)} KB
                </span>
              </div>
            </div>

            <span className="font-mono text-neutral-500 text-xs">
              Client-side RAM
            </span>
          </div>

          {/* Mode Selector */}
          <div className={`p-4 border rounded space-y-4 text-xs ${
            isLight ? 'bg-white border-neutral-200' : 'bg-[#0a0a0a] border-neutral-800'
          }`}>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="splitMode"
                  checked={mode === 'range'}
                  onChange={() => { setMode('range'); setExtractedPdfUrl(null); setSplitPages([]); }}
                  className="rounded-full bg-neutral-900 border-neutral-700"
                />
                <span className={`font-medium ${isLight ? 'text-black' : 'text-white'}`}>Extract Range</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="splitMode"
                  checked={mode === 'all'}
                  onChange={() => { setMode('all'); setExtractedPdfUrl(null); setSplitPages([]); }}
                  className="rounded-full bg-neutral-900 border-neutral-700"
                />
                <span className={`font-medium ${isLight ? 'text-black' : 'text-white'}`}>Split All Pages Separately</span>
              </label>
            </div>

            {mode === 'range' && (
              <div className="space-y-1.5 pt-2 border-t border-neutral-800/80">
                <label className="text-[11px] font-mono text-neutral-500 uppercase block">
                  Page range to extract (e.g. 1-3, 5)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={rangeStr}
                    onChange={(e) => { setRangeStr(e.target.value); setExtractedPdfUrl(null); }}
                    placeholder="1-3, 5"
                    className={`px-3 py-1.5 border rounded text-xs font-mono w-48 focus:outline-none ${
                      isLight ? 'bg-neutral-50 border-neutral-300 text-black' : 'bg-black border-neutral-800 text-white'
                    }`}
                  />
                  <span className="text-neutral-500 text-[11px]">
                    (Available: 1 to {totalPages})
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={handleExtract}
              disabled={isProcessing}
              className={`px-5 py-2 font-medium text-xs rounded transition-colors flex items-center gap-2 ${
                isLight ? 'bg-black text-white hover:bg-neutral-800' : 'bg-white text-black hover:bg-neutral-200'
              }`}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>{mode === 'range' ? 'Extract Selected Range' : 'Split Every Page'}</span>
              )}
            </button>
          </div>

          {/* Results */}
          {extractedPdfUrl && (
            <div className={`p-4 border rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
              isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-black border-neutral-800'
            }`}>
              <div>
                <span className={`font-medium block ${isLight ? 'text-black' : 'text-white'}`}>
                  Extracted PDF Ready
                </span>
                <span className="text-neutral-500 font-mono text-[11px]">
                  Pages: {rangeStr}
                </span>
              </div>

              <a
                href={extractedPdfUrl}
                download={`extracted_pages_${rangeStr.replace(/\s+/g, '')}.pdf`}
                className={`px-4 py-1.5 font-medium text-xs rounded transition-colors flex items-center gap-1.5 ${
                  isLight ? 'bg-black text-white hover:bg-neutral-800' : 'bg-white text-black hover:bg-neutral-200'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Extracted PDF</span>
              </a>
            </div>
          )}

          {splitPages.length > 0 && (
            <div className="space-y-3">
              <span className="font-mono text-[11px] uppercase text-neutral-500 block">
                Extracted Individual Pages ({splitPages.length})
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {splitPages.map(page => (
                  <div
                    key={page.pageNum}
                    className={`p-3 border rounded flex flex-col justify-between gap-3 text-xs ${
                      isLight ? 'bg-white border-neutral-200' : 'bg-[#0a0a0a] border-neutral-800'
                    }`}
                  >
                    <span className="font-mono text-neutral-400">Page {page.pageNum}</span>
                    <a
                      href={page.url}
                      download={`page_${page.pageNum}.pdf`}
                      className={`py-1 text-center font-medium rounded text-[11px] transition-colors flex items-center justify-center gap-1 ${
                        isLight ? 'bg-neutral-100 hover:bg-neutral-200 text-black' : 'bg-neutral-900 hover:bg-neutral-800 text-white'
                      }`}
                    >
                      <Download className="w-3 h-3" />
                      <span>Download</span>
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
