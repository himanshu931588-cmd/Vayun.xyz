import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Upload, 
  Download, 
  FileArchive, 
  RefreshCw,
  Check
} from 'lucide-react';
import { compressPdf } from '../../utils/pdfEngines';

interface CompressPdfViewProps {
  onBack: () => void;
  theme?: 'dark' | 'light';
}

export const CompressPdfView: React.FC<CompressPdfViewProps> = ({ onBack, theme = 'dark' }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [level, setLevel] = useState<'low' | 'recommended' | 'extreme'>('recommended');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{
    url: string;
    originalSize: number;
    compressedSize: number;
    savedPercent: number;
  } | null>(null);
  const isLight = theme === 'light';

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setResult(null);
  };

  const handleCompress = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);

    try {
      const res = await compressPdf(selectedFile, level);
      const blob = new Blob([res.compressedBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setResult({
        url,
        originalSize: res.originalSize,
        compressedSize: res.compressedSize,
        savedPercent: res.savedPercent
      });
    } catch (err) {
      console.error('Compression error:', err);
      alert('Unable to compress selected PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatSize = (bytes: number): string => {
    if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    return (bytes / 1024).toFixed(0) + ' KB';
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
            onClick={() => { setSelectedFile(null); setResult(null); }}
            className={`text-xs ${isLight ? 'text-neutral-500 hover:text-black' : 'text-neutral-400 hover:text-white'}`}
          >
            Change document
          </button>
        )}
      </div>

      <div className={`space-y-1.5 pb-4 border-b ${isLight ? 'border-neutral-200' : 'border-neutral-900'}`}>
        <h1 className={`text-2xl font-serif tracking-tight ${isLight ? 'text-black' : 'text-white'}`}>
          Compress PDF
        </h1>
        <p className={`text-xs max-w-xl leading-relaxed ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
          Reduce PDF file size by stripping unreferenced metadata, deduplicating fonts, and compressing binary object streams client-side.
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
          <span className="text-xs text-neutral-500 mt-1">Select a PDF to compress in browser RAM</span>
          <input type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" />
        </label>
      ) : (
        <div className="space-y-5">
          {/* File summary */}
          <div className={`p-3.5 border rounded flex items-center justify-between text-xs ${
            isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#0a0a0a] border-neutral-800'
          }`}>
            <div className="flex items-center gap-2.5 truncate">
              <FileArchive className="w-4 h-4 text-neutral-400 shrink-0" />
              <div className="truncate">
                <span className={`font-medium block truncate ${isLight ? 'text-black' : 'text-white'}`}>
                  {selectedFile.name}
                </span>
                <span className="text-neutral-500 font-mono text-[11px]">
                  Original size: {formatSize(selectedFile.size)}
                </span>
              </div>
            </div>
            <span className="text-neutral-500 font-mono text-xs">
              Client-side
            </span>
          </div>

          {/* Compression Tiers */}
          <div className={`p-4 border rounded space-y-4 text-xs ${
            isLight ? 'bg-white border-neutral-200' : 'bg-[#0a0a0a] border-neutral-800'
          }`}>
            <span className="font-mono text-[11px] uppercase text-neutral-500 block">
              Compression Level
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => { setLevel('extreme'); setResult(null); }}
                className={`p-3 rounded border text-left transition-colors ${
                  level === 'extreme'
                    ? isLight ? 'bg-neutral-100 border-black' : 'bg-neutral-900 border-white'
                    : isLight ? 'border-neutral-200 hover:border-neutral-300' : 'border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div className={`font-medium ${isLight ? 'text-black' : 'text-white'}`}>Extreme</div>
                <div className="text-[11px] text-neutral-500 mt-0.5">Maximum size reduction, clean streams</div>
              </button>

              <button
                type="button"
                onClick={() => { setLevel('recommended'); setResult(null); }}
                className={`p-3 rounded border text-left transition-colors ${
                  level === 'recommended'
                    ? isLight ? 'bg-neutral-100 border-black' : 'bg-neutral-900 border-white'
                    : isLight ? 'border-neutral-200 hover:border-neutral-300' : 'border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div className={`font-medium ${isLight ? 'text-black' : 'text-white'}`}>Recommended</div>
                <div className="text-[11px] text-neutral-500 mt-0.5">Balanced quality and file size</div>
              </button>

              <button
                type="button"
                onClick={() => { setLevel('low'); setResult(null); }}
                className={`p-3 rounded border text-left transition-colors ${
                  level === 'low'
                    ? isLight ? 'bg-neutral-100 border-black' : 'bg-neutral-900 border-white'
                    : isLight ? 'border-neutral-200 hover:border-neutral-300' : 'border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div className={`font-medium ${isLight ? 'text-black' : 'text-white'}`}>Low</div>
                <div className="text-[11px] text-neutral-500 mt-0.5">High visual fidelity, strips metadata</div>
              </button>
            </div>

            <button
              onClick={handleCompress}
              disabled={isProcessing}
              className={`px-5 py-2 font-medium text-xs rounded transition-colors flex items-center gap-2 ${
                isLight ? 'bg-black text-white hover:bg-neutral-800' : 'bg-white text-black hover:bg-neutral-200'
              }`}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Compressing document...</span>
                </>
              ) : (
                <span>Compress PDF</span>
              )}
            </button>
          </div>

          {/* Result Readout */}
          {result && (
            <div className={`p-4 border rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs ${
              isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-black border-neutral-800'
            }`}>
              <div className="space-y-1 font-mono">
                <div className="flex items-center gap-3">
                  <span className="text-neutral-500">Original: {formatSize(result.originalSize)}</span>
                  <span>→</span>
                  <span className={`font-semibold ${isLight ? 'text-black' : 'text-white'}`}>
                    Compressed: {formatSize(result.compressedSize)}
                  </span>
                </div>
                <div className="text-neutral-400 text-[11px]">
                  {result.savedPercent}% file size reduction
                </div>
              </div>

              <a
                href={result.url}
                download={`compressed_${selectedFile.name}`}
                className={`px-5 py-2 font-medium text-xs rounded transition-colors flex items-center gap-1.5 ${
                  isLight ? 'bg-black text-white hover:bg-neutral-800' : 'bg-white text-black hover:bg-neutral-200'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Compressed PDF</span>
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
