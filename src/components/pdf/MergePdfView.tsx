import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Upload, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Download,
  FileText,
  RefreshCw,
  Plus
} from 'lucide-react';
import { mergePdfFiles, inspectPdf } from '../../utils/pdfEngines';

interface MergePdfViewProps {
  onBack: () => void;
  theme?: 'dark' | 'light';
}

interface UploadedPdfItem {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount: number;
}

export const MergePdfView: React.FC<MergePdfViewProps> = ({ onBack, theme = 'dark' }) => {
  const [files, setFiles] = useState<UploadedPdfItem[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [mergedBlobUrl, setMergedBlobUrl] = useState<string | null>(null);
  const isLight = theme === 'light';

  const handleAddFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputFiles = e.target.files;
    if (!inputFiles || inputFiles.length === 0) return;

    const newItems: UploadedPdfItem[] = [];
    for (let i = 0; i < inputFiles.length; i++) {
      const file = inputFiles[i];
      const meta = await inspectPdf(file);
      newItems.push({
        id: Math.random().toString(36).substring(2, 9),
        file,
        name: file.name,
        size: file.size,
        pageCount: meta.pageCount
      });
    }

    setFiles(prev => [...prev, ...newItems]);
    setMergedBlobUrl(null);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= files.length) return;

    const updated = [...files];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setFiles(updated);
    setMergedBlobUrl(null);
  };

  const handleRemove = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    setMergedBlobUrl(null);
  };

  const handleMerge = async () => {
    if (files.length < 2) return;
    setIsMerging(true);

    try {
      const mergedBytes = await mergePdfFiles(files.map(f => f.file));
      const blob = new Blob([mergedBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setMergedBlobUrl(url);
    } catch (err) {
      console.error('Merge error:', err);
      alert('Unable to merge selected PDFs. Please verify files are not encrypted.');
    } finally {
      setIsMerging(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
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

        <label className={`cursor-pointer px-2.5 py-1 text-xs border rounded transition-colors flex items-center gap-1.5 ${
          isLight ? 'text-neutral-700 bg-neutral-100 hover:bg-neutral-200 border-neutral-300' : 'text-neutral-300 bg-neutral-900 hover:bg-neutral-800 border-neutral-800'
        }`}>
          <Plus className="w-3.5 h-3.5" />
          <span>Add PDF files</span>
          <input type="file" accept=".pdf" multiple onChange={handleAddFiles} className="hidden" />
        </label>
      </div>

      <div className={`space-y-1.5 pb-4 border-b ${isLight ? 'border-neutral-200' : 'border-neutral-900'}`}>
        <h1 className={`text-2xl font-serif tracking-tight ${isLight ? 'text-black' : 'text-white'}`}>
          Merge PDF
        </h1>
        <p className={`text-xs max-w-xl leading-relaxed ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
          Combine multiple PDF files into one clean document in the exact order you specify. Runs 100% locally in your browser.
        </p>
      </div>

      {files.length === 0 ? (
        <label className={`border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer transition-colors ${
          isLight ? 'border-neutral-300 hover:border-black bg-neutral-50/50' : 'border-neutral-800 hover:border-neutral-600 bg-[#0a0a0a]'
        }`}>
          <Upload className={`w-8 h-8 mb-3 ${isLight ? 'text-neutral-400' : 'text-neutral-600'}`} />
          <span className={`text-sm font-medium ${isLight ? 'text-black' : 'text-white'}`}>
            Click to upload PDF files
          </span>
          <span className="text-xs text-neutral-500 mt-1">Select 2 or more PDF documents to merge</span>
          <input type="file" accept=".pdf" multiple onChange={handleAddFiles} className="hidden" />
        </label>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-neutral-500 font-mono">
            <span>{files.length} documents selected</span>
            <button onClick={() => setFiles([])} className="hover:text-neutral-300">
              Clear all
            </button>
          </div>

          <div className="space-y-2">
            {files.map((item, idx) => (
              <div
                key={item.id}
                className={`p-3 border rounded flex items-center justify-between gap-4 text-xs ${
                  isLight ? 'bg-white border-neutral-200' : 'bg-[#0a0a0a] border-neutral-800'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <span className="font-mono text-neutral-500 w-5 text-right">{idx + 1}.</span>
                  <FileText className="w-4 h-4 shrink-0 text-neutral-400" />
                  <div className="truncate">
                    <span className={`font-medium block truncate ${isLight ? 'text-black' : 'text-white'}`}>
                      {item.name}
                    </span>
                    <span className="text-[11px] text-neutral-500 font-mono">
                      {item.pageCount} {item.pageCount === 1 ? 'page' : 'pages'} • {formatFileSize(item.size)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleMove(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1 text-neutral-400 hover:text-black disabled:opacity-20"
                    title="Move up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMove(idx, 'down')}
                    disabled={idx === files.length - 1}
                    className="p-1 text-neutral-400 hover:text-black disabled:opacity-20"
                    title="Move down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="p-1 text-neutral-400 hover:text-neutral-700 ml-1"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <label className={`cursor-pointer px-3 py-2 text-xs border rounded transition-colors flex items-center justify-center gap-1.5 ${
              isLight ? 'text-neutral-700 bg-neutral-100 hover:bg-neutral-200 border-neutral-300' : 'text-neutral-300 bg-neutral-900 hover:bg-neutral-800 border-neutral-800'
            }`}>
              <Plus className="w-3.5 h-3.5" />
              <span>Add more files</span>
              <input type="file" accept=".pdf" multiple onChange={handleAddFiles} className="hidden" />
            </label>

            {!mergedBlobUrl ? (
              <button
                onClick={handleMerge}
                disabled={files.length < 2 || isMerging}
                className={`px-5 py-2 font-medium text-xs rounded transition-colors flex items-center justify-center gap-2 ${
                  isLight ? 'bg-black text-white hover:bg-neutral-800 disabled:opacity-40' : 'bg-white text-black hover:bg-neutral-200 disabled:opacity-40'
                }`}
              >
                {isMerging ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Merging in memory...</span>
                  </>
                ) : (
                  <span>Merge PDF Documents</span>
                )}
              </button>
            ) : (
              <a
                href={mergedBlobUrl}
                download="merged_document.pdf"
                className={`px-5 py-2 font-medium text-xs rounded transition-colors flex items-center justify-center gap-2 ${
                  isLight ? 'bg-black text-white hover:bg-neutral-800' : 'bg-white text-black hover:bg-neutral-200'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Merged PDF</span>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
