import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Upload, 
  Trash2, 
  Download, 
  Image as ImageIcon, 
  RefreshCw,
  Plus
} from 'lucide-react';
import { convertImagesToPdf } from '../../utils/pdfEngines';

interface ImageToPdfViewProps {
  onBack: () => void;
  theme?: 'dark' | 'light';
}

interface UploadedImageItem {
  id: string;
  file: File;
  previewUrl: string;
  name: string;
}

export const ImageToPdfView: React.FC<ImageToPdfViewProps> = ({ onBack, theme = 'dark' }) => {
  const [images, setImages] = useState<UploadedImageItem[]>([]);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [margin, setMargin] = useState<number>(20);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const isLight = theme === 'light';

  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newItems: UploadedImageItem[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      newItems.push({
        id: Math.random().toString(36).substring(2, 9),
        file,
        previewUrl: URL.createObjectURL(file),
        name: file.name
      });
    }

    setImages(prev => [...prev, ...newItems]);
    setPdfUrl(null);
  };

  const handleRemove = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
    setPdfUrl(null);
  };

  const handleConvert = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);

    try {
      const bytes = await convertImagesToPdf(images.map(img => img.file), orientation, margin);
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (err) {
      console.error('Conversion error:', err);
      alert('Unable to convert images to PDF.');
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

        <label className={`cursor-pointer px-2.5 py-1 text-xs border rounded transition-colors flex items-center gap-1.5 ${
          isLight ? 'text-neutral-700 bg-neutral-100 hover:bg-neutral-200 border-neutral-300' : 'text-neutral-300 bg-neutral-900 hover:bg-neutral-800 border-neutral-800'
        }`}>
          <Plus className="w-3.5 h-3.5" />
          <span>Add images</span>
          <input type="file" accept="image/png,image/jpeg,image/webp" multiple onChange={handleAddImages} className="hidden" />
        </label>
      </div>

      <div className={`space-y-1.5 pb-4 border-b ${isLight ? 'border-neutral-200' : 'border-neutral-900'}`}>
        <h1 className={`text-2xl font-serif tracking-tight ${isLight ? 'text-black' : 'text-white'}`}>
          Image to PDF
        </h1>
        <p className={`text-xs max-w-xl leading-relaxed ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
          Convert photos, screenshots, and scans (PNG, JPG, WebP) into a consolidated, clean, printable PDF document.
        </p>
      </div>

      {images.length === 0 ? (
        <label className={`border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer transition-colors ${
          isLight ? 'border-neutral-300 hover:border-black bg-neutral-50/50' : 'border-neutral-800 hover:border-neutral-600 bg-[#0a0a0a]'
        }`}>
          <ImageIcon className={`w-8 h-8 mb-3 ${isLight ? 'text-neutral-400' : 'text-neutral-600'}`} />
          <span className={`text-sm font-medium ${isLight ? 'text-black' : 'text-white'}`}>
            Click to upload photos or images
          </span>
          <span className="text-xs text-neutral-500 mt-1">Supports PNG, JPG, and WebP</span>
          <input type="file" accept="image/png,image/jpeg,image/webp" multiple onChange={handleAddImages} className="hidden" />
        </label>
      ) : (
        <div className="space-y-5">
          {/* Options */}
          <div className={`p-4 border rounded flex flex-wrap items-center justify-between gap-4 text-xs ${
            isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#0a0a0a] border-neutral-800'
          }`}>
            <div className="flex items-center gap-3">
              <span className="text-neutral-500 font-mono text-[11px] uppercase">Orientation:</span>
              <div className="flex items-center gap-1 font-medium">
                <button
                  type="button"
                  onClick={() => { setOrientation('portrait'); setPdfUrl(null); }}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    orientation === 'portrait'
                      ? isLight ? 'bg-black text-white' : 'bg-white text-black'
                      : 'text-neutral-400'
                  }`}
                >
                  Portrait
                </button>
                <button
                  type="button"
                  onClick={() => { setOrientation('landscape'); setPdfUrl(null); }}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    orientation === 'landscape'
                      ? isLight ? 'bg-black text-white' : 'bg-white text-black'
                      : 'text-neutral-400'
                  }`}
                >
                  Landscape
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-neutral-500 font-mono text-[11px] uppercase">Margins:</span>
              <select
                value={margin}
                onChange={(e) => { setMargin(parseInt(e.target.value, 10)); setPdfUrl(null); }}
                className={`border rounded px-2 py-0.5 text-xs focus:outline-none ${
                  isLight ? 'bg-white border-neutral-300 text-black' : 'bg-black border-neutral-800 text-white'
                }`}
              >
                <option value={0}>No margin (Full page)</option>
                <option value={20}>Standard (20pt)</option>
                <option value={40}>Wide (40pt)</option>
              </select>
            </div>
          </div>

          {/* Thumbnails grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {images.map((item, idx) => (
              <div
                key={item.id}
                className={`border rounded overflow-hidden flex flex-col justify-between group relative ${
                  isLight ? 'bg-white border-neutral-200' : 'bg-[#0a0a0a] border-neutral-800'
                }`}
              >
                <div className="h-32 bg-neutral-900/30 flex items-center justify-center overflow-hidden p-2">
                  <img src={item.previewUrl} alt={item.name} className="max-h-full max-w-full object-contain" />
                </div>
                <div className="p-2 border-t border-neutral-800/60 flex items-center justify-between text-xs">
                  <span className="truncate text-neutral-400 font-mono text-[10px]">
                    {idx + 1}. {item.name}
                  </span>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-neutral-400 hover:text-black shrink-0 ml-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Action */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <label className={`cursor-pointer px-3 py-2 text-xs border rounded transition-colors flex items-center justify-center gap-1.5 ${
              isLight ? 'text-neutral-700 bg-neutral-100 hover:bg-neutral-200 border-neutral-300' : 'text-neutral-300 bg-neutral-900 hover:bg-neutral-800 border-neutral-800'
            }`}>
              <Plus className="w-3.5 h-3.5" />
              <span>Add more photos</span>
              <input type="file" accept="image/png,image/jpeg,image/webp" multiple onChange={handleAddImages} className="hidden" />
            </label>

            {!pdfUrl ? (
              <button
                onClick={handleConvert}
                disabled={images.length === 0 || isProcessing}
                className={`px-5 py-2 font-medium text-xs rounded transition-colors flex items-center gap-2 ${
                  isLight ? 'bg-black text-white hover:bg-neutral-800 disabled:opacity-40' : 'bg-white text-black hover:bg-neutral-200 disabled:opacity-40'
                }`}
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Generating PDF...</span>
                  </>
                ) : (
                  <span>Convert Images to PDF</span>
                )}
              </button>
            ) : (
              <a
                href={pdfUrl}
                download="converted_images.pdf"
                className={`px-5 py-2 font-medium text-xs rounded transition-colors flex items-center gap-2 ${
                  isLight ? 'bg-black text-white hover:bg-neutral-800' : 'bg-white text-black hover:bg-neutral-200'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF Document</span>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
