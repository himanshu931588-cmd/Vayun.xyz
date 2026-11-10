import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Upload, 
  Download, 
  Copy, 
  RefreshCw, 
  Sliders, 
  Sparkles, 
  Layers, 
  Sun, 
  Activity, 
  FileText, 
  Check, 
  Camera,
  RotateCcw,
  Maximize2
} from 'lucide-react';
import { AsciiConfig, AsciiRenderMode, AsciiAnimStyle } from '../../types';
import { 
  DEFAULT_ASCII_CONFIG, 
  createInkGardenDemoCanvas, 
  renderAsciiFrame, 
  generatePlainTextAscii,
  CHAR_RAMPS 
} from '../../utils/asciiRenderEngine';

interface InkGardenAsciiViewProps {
  onBack: () => void;
  theme?: 'dark' | 'light';
}

const ALL_RENDER_MODES: { id: AsciiRenderMode; label: string }[] = [
  { id: 'dither', label: 'Dither (Bayer 4x4)' },
  { id: 'characters', label: 'Characters (ASCII Glyphs)' },
  { id: 'matrix', label: 'Matrix (Digital Rain)' },
  { id: 'contour', label: 'Contour (Topographic Iso)' },
  { id: 'braille', label: 'Braille (U+2800 Mosaic)' },
  { id: 'hatch', label: 'Hatch (Cross-Hatch Ink)' },
  { id: 'dots', label: 'Dots (Radial Halftone)' },
  { id: 'pixel', label: 'Pixel (Sub-grid Blocks)' },
  { id: 'mosaic', label: 'Mosaic (Beveled Tiles)' },
  { id: 'cross', label: 'Cross (Precision Reticles)' },
  { id: 'diamond', label: 'Diamond (Rhombus Grid)' },
  { id: 'voxel', label: 'Voxel (3D Isometric Cube)' },
  { id: 'lego', label: 'Lego (Studded Bricks)' },
  { id: 'mixed', label: 'Mixed (Dual-State Matrix)' },
  { id: 'lines', label: 'Lines (Horizontal Scan)' },
  { id: 'diagonal', label: 'Diagonal (Geometric 45°)' },
  { id: 'disco', label: 'Disco (Radial Prism)' },
  { id: 'hexdump', label: 'Hexdump (Hex Machine Code)' },
  { id: 'rings', label: 'Rings (Concentric Zen)' },
  { id: 'hearts', label: 'Hearts (Glyphic Vector)' },
  { id: 'stars', label: 'Stars (4-Point Astral)' },
  { id: 'hexagons', label: 'Hexagons (Honeycomb)' },
  { id: 'triangles', label: 'Triangles (Low-Poly Mesh)' },
  { id: 'bubbles', label: 'Bubbles (Organic Spheres)' },
  { id: 'halfblocks', label: 'Halfblocks (Dual Vertical)' },
];

const PRESET_STYLES: { id: string; name: string; description: string; patch: Partial<AsciiConfig> }[] = [
  {
    id: 'default-dither',
    name: 'Ink Garden (Official 21st.dev)',
    description: 'Bayer dither matrix with pulse motion & high contrast',
    patch: { ...DEFAULT_ASCII_CONFIG }
  },
  {
    id: 'zen-botanical',
    name: 'Zen Botanical Wash',
    description: 'Soft dots with gentle ripple & warm charcoal wash',
    patch: {
      renderMode: 'dots',
      contrast: 140,
      cellSize: 8,
      animStyle: 'ripple',
      animIntensity: { enabled: true, intensity: 45 },
      tint: '#2d3748',
      tintOpacity: 25,
      bgMode: 'blurred',
      bgBlur: 14,
      bgOpacity: 75
    }
  },
  {
    id: 'matrix-rain',
    name: 'Cyberpunk Matrix',
    description: 'Dynamic green code rain with scanlines & bloom',
    patch: {
      renderMode: 'matrix',
      contrast: 180,
      cellSize: 10,
      invert: false,
      tint: '#10b981',
      tintOpacity: 40,
      pfx: {
        ...DEFAULT_ASCII_CONFIG.pfx,
        scanLines: { enabled: true, intensity: 55 },
        bloom: { enabled: true, intensity: 30 }
      }
    }
  },
  {
    id: 'topographic-contour',
    name: 'Topographic Contour',
    description: 'Organic iso-lines with subtle wave drift',
    patch: {
      renderMode: 'contour',
      contrast: 165,
      cellSize: 11,
      animStyle: 'wave',
      animIntensity: { enabled: true, intensity: 50 },
      edgeEmphasis: 35
    }
  },
  {
    id: 'retro-terminal',
    name: 'Classic ASCII Terminal',
    description: 'Monospaced glyph density mapping with CRT flicker',
    patch: {
      renderMode: 'characters',
      charSet: 'standard',
      cellSize: 8,
      contrast: 170,
      animStyle: 'flicker',
      animIntensity: { enabled: true, intensity: 20 },
      pfx: {
        ...DEFAULT_ASCII_CONFIG.pfx,
        scanLines: { enabled: true, intensity: 35 },
        filmGrain: { enabled: true, intensity: 25 }
      }
    }
  },
  {
    id: 'braille-blueprint',
    name: 'Minimal Braille Blueprint',
    description: 'High-density unicode pinpoints with subtle cyan tint',
    patch: {
      renderMode: 'braille',
      cellSize: 7,
      contrast: 160,
      tint: '#38bdf8',
      tintOpacity: 20,
      animStyle: 'shimmer',
      animIntensity: { enabled: true, intensity: 40 }
    }
  }
];

export const InkGardenAsciiView: React.FC<InkGardenAsciiViewProps> = ({
  onBack,
  theme = 'dark'
}) => {
  const [config, setConfig] = useState<AsciiConfig>({ ...DEFAULT_ASCII_CONFIG });
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'render' | 'color' | 'motion' | 'pfx' | 'lights'>('render');
  const [sourceImageSource, setSourceImageSource] = useState<'procedural' | 'upload'>('procedural');
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);
  const [fps, setFps] = useState<number>(60);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sourceCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const uploadedImageRef = useRef<HTMLImageElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const frameCountRef = useRef<number>(0);
  const fpsTimerRef = useRef<number>(performance.now());

  // Initialize demo canvas on mount
  useEffect(() => {
    sourceCanvasRef.current = createInkGardenDemoCanvas(800, 600);
  }, []);

  // Continuous animation loop
  const animate = useCallback((timestamp: number) => {
    // FPS counting
    frameCountRef.current++;
    if (timestamp - fpsTimerRef.current >= 1000) {
      setFps(Math.round((frameCountRef.current * 1000) / (timestamp - fpsTimerRef.current)));
      frameCountRef.current = 0;
      fpsTimerRef.current = timestamp;
    }

    const targetCanvas = canvasRef.current;
    if (targetCanvas) {
      const source = sourceImageSource === 'upload' && uploadedImageRef.current 
        ? uploadedImageRef.current 
        : sourceCanvasRef.current;

      if (source) {
        const timeSec = timestamp / 1000;
        renderAsciiFrame(source, targetCanvas, config, timeSec);
      }
    }

    if (isPlaying && config.animated) {
      animationFrameId.current = requestAnimationFrame(animate);
    }
  }, [config, isPlaying, sourceImageSource]);

  useEffect(() => {
    if (isPlaying && config.animated) {
      animationFrameId.current = requestAnimationFrame(animate);
    } else {
      // Single static render when paused
      const targetCanvas = canvasRef.current;
      const source = sourceImageSource === 'upload' && uploadedImageRef.current 
        ? uploadedImageRef.current 
        : sourceCanvasRef.current;
      if (targetCanvas && source) {
        renderAsciiFrame(source, targetCanvas, config, 0);
      }
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [animate, isPlaying, config.animated]);

  // Handle image upload
  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        uploadedImageRef.current = img;
        setSourceImageSource('upload');
        // adjust canvas aspect ratio to match source image
        if (canvasRef.current) {
          const maxDim = 800;
          let w = img.naturalWidth || 800;
          let h = img.naturalHeight || 600;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          canvasRef.current.width = w;
          canvasRef.current.height = h;
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Reset to default procedural ink garden
  const handleResetToDemo = () => {
    sourceCanvasRef.current = createInkGardenDemoCanvas(800, 600);
    setSourceImageSource('procedural');
    if (canvasRef.current) {
      canvasRef.current.width = 800;
      canvasRef.current.height = 600;
    }
    setConfig({ ...DEFAULT_ASCII_CONFIG });
  };

  // Plain ASCII text copy
  const handleCopyAscii = () => {
    const target = canvasRef.current;
    if (!target) return;
    const ascii = generatePlainTextAscii(
      target, 
      Math.min(100, Math.round(target.width / config.cellSize)), 
      config.charSet, 
      config.invert
    );
    navigator.clipboard.writeText(ascii);
    setCopiedNotification('Plain ASCII text copied to clipboard!');
    setTimeout(() => setCopiedNotification(null), 3000);
  };

  // Download high-res PNG
  const handleDownloadPng = () => {
    const target = canvasRef.current;
    if (!target) return;
    const dataUrl = target.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `ink-garden-ascii-${config.renderMode}-${Date.now()}.png`;
    a.click();
    setCopiedNotification('PNG image downloaded!');
    setTimeout(() => setCopiedNotification(null), 3000);
  };

  // Export JSON preset
  const handleExportJson = () => {
    const jsonStr = JSON.stringify(config, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ascii-preset-${config.renderMode}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setCopiedNotification('JSON preset exported!');
    setTimeout(() => setCopiedNotification(null), 3000);
  };

  // Import JSON preset
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        setConfig({ ...DEFAULT_ASCII_CONFIG, ...parsed });
        setCopiedNotification('Preset successfully imported!');
        setTimeout(() => setCopiedNotification(null), 3000);
      } catch (err) {
        alert('Invalid JSON preset format');
      }
    };
    reader.readAsText(file);
  };

  // Helper for applying preset
  const handleSelectPreset = (presetId: string) => {
    const p = PRESET_STYLES.find(x => x.id === presetId);
    if (p) {
      setConfig(prev => ({ ...prev, ...p.patch }));
    }
  };

  // Total cell count calculation
  const totalCells = canvasRef.current 
    ? Math.round((canvasRef.current.width / config.cellSize) * (canvasRef.current.height / config.cellSize))
    : 5333;

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#090a0f] text-gray-100' : 'bg-gray-50 text-gray-900'} flex flex-col font-sans transition-colors duration-200`}>
      {/* Top Studio Navbar */}
      <header className={`border-b ${theme === 'dark' ? 'border-gray-800 bg-[#0d0f17]/95' : 'border-gray-200 bg-white/95'} backdrop-blur-md sticky top-0 z-30 px-4 py-3`}>
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className={`p-2 rounded-lg border transition-all ${
                theme === 'dark' 
                  ? 'border-gray-800 hover:bg-gray-800 text-gray-300' 
                  : 'border-gray-200 hover:bg-gray-100 text-gray-700'
              }`}
              title="Return to Tools"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-base tracking-tight text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  INK GARDEN
                </span>
                <span className="text-xs px-2 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-mono">
                  21st.dev Canvas2D
                </span>
              </div>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Procedural raster visualizer & real-time ASCII engine (60 FPS)
              </p>
            </div>
          </div>

          {/* Quick Presets & Controls */}
          <div className="flex items-center flex-wrap gap-2">
            <select
              onChange={(e) => handleSelectPreset(e.target.value)}
              className={`text-xs px-2.5 py-1.5 rounded-lg border font-mono ${
                theme === 'dark'
                  ? 'bg-gray-900 border-gray-700 text-gray-200'
                  : 'bg-white border-gray-300 text-gray-800'
              }`}
              defaultValue="default-dither"
            >
              {PRESET_STYLES.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            <button
              onClick={handleCopyAscii}
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
                theme === 'dark'
                  ? 'border-gray-700 hover:bg-gray-800 text-gray-200'
                  : 'border-gray-300 hover:bg-gray-100 text-gray-800'
              }`}
              title="Copy Plain Text ASCII"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Text</span>
            </button>

            <button
              onClick={handleDownloadPng}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-sm transition-all"
              title="Download PNG"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export PNG</span>
            </button>

            <button
              onClick={handleExportJson}
              className={`flex items-center gap-1 text-xs px-2 py-1.5 rounded-lg border transition-all ${
                theme === 'dark' ? 'border-gray-800 hover:bg-gray-800 text-gray-400' : 'border-gray-200 hover:bg-gray-100 text-gray-600'
              }`}
              title="Export Parameter JSON"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>JSON</span>
            </button>

            <label className={`cursor-pointer flex items-center gap-1 text-xs px-2 py-1.5 rounded-lg border transition-all ${
              theme === 'dark' ? 'border-gray-800 hover:bg-gray-800 text-gray-400' : 'border-gray-200 hover:bg-gray-100 text-gray-600'
            }`}>
              <Upload className="w-3.5 h-3.5" />
              <span>Import</span>
              <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
            </label>

            <button
              onClick={handleResetToDemo}
              className={`p-1.5 rounded-lg border transition-all ${
                theme === 'dark' ? 'border-gray-800 hover:bg-gray-800 text-gray-400' : 'border-gray-200 hover:bg-gray-100 text-gray-600'
              }`}
              title="Reset to Zen Ink Garden Demo"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Copied Notification Toast */}
      {copiedNotification && (
        <div className="fixed top-16 right-6 z-50 flex items-center gap-2 px-4 py-2 bg-emerald-500/90 text-white text-xs rounded-lg shadow-lg backdrop-blur-md border border-emerald-400/40 animate-fade-in">
          <Check className="w-4 h-4" />
          <span>{copiedNotification}</span>
        </div>
      )}

      {/* Main Studio Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Canvas Viewport & Stage */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-4">
          <div 
            className={`relative rounded-xl overflow-hidden border transition-all flex items-center justify-center min-h-[460px] ${
              theme === 'dark' 
                ? 'bg-black/90 border-gray-800 shadow-2xl' 
                : 'bg-gray-900 border-gray-300 shadow-lg'
            } ${isDragOver ? 'ring-2 ring-emerald-400' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
          >
            {/* The Main Render Canvas */}
            <canvas 
              ref={canvasRef} 
              width={800} 
              height={600}
              className="max-w-full max-h-[640px] object-contain rounded-lg shadow-inner"
            />

            {/* Drop Overlay */}
            {isDragOver && (
              <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center text-emerald-400 font-mono text-sm">
                <Upload className="w-10 h-10 mb-2 animate-bounce" />
                <span>Drop any image (PNG, JPEG, WebP) to render</span>
              </div>
            )}

            {/* Live Telemetry & Playback Bar */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-2 pointer-events-auto bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-lg border border-gray-800 text-xs font-mono text-gray-300">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex items-center gap-1.5 hover:text-white transition-colors text-emerald-400 font-bold"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
                </button>
                <span className="text-gray-600">|</span>
                <span className="text-gray-400">{fps} FPS</span>
                <span className="text-gray-600">|</span>
                <span className="text-gray-400">{totalCells.toLocaleString()} cells</span>
                <span className="text-gray-600">|</span>
                <span className="text-gray-400 capitalize">{config.renderMode}</span>
              </div>

              <div className="flex items-center gap-2 pointer-events-auto">
                <label className="cursor-pointer bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-lg border border-gray-800 text-xs font-mono text-gray-300 hover:text-white hover:border-gray-700 flex items-center gap-1.5 transition-all">
                  <Camera className="w-3.5 h-3.5 text-blue-400" />
                  <span>Custom Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Quick Info & Zen Attribution */}
          <div className={`p-4 rounded-xl border text-xs font-mono flex items-center justify-between ${
            theme === 'dark' ? 'bg-[#0f111a] border-gray-800 text-gray-400' : 'bg-white border-gray-200 text-gray-600'
          }`}>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Source: {sourceImageSource === 'procedural' ? 'Zen Botanical Garden (Procedural Canvas)' : 'User Custom Photo'}</span>
            </div>
            <div className="flex items-center gap-3">
              <span>Grid: {config.cellSize}px</span>
              <span>Blend: {config.styleBlend}</span>
              <span>100% In-RAM</span>
            </div>
          </div>
        </div>

        {/* Right Column: Tabbed Control Panel */}
        <div className={`lg:col-span-5 xl:col-span-4 rounded-xl border overflow-hidden flex flex-col ${
          theme === 'dark' ? 'bg-[#0d0f17] border-gray-800' : 'bg-white border-gray-200'
        }`}>
          {/* Tabs Navigation */}
          <div className={`flex border-b text-xs font-mono overflow-x-auto ${
            theme === 'dark' ? 'border-gray-800 bg-[#090a0f]' : 'border-gray-200 bg-gray-50'
          }`}>
            <button
              onClick={() => setActiveTab('render')}
              className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-1.5 border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'render'
                  ? 'border-emerald-500 text-emerald-400 font-bold bg-emerald-500/5'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Grid & Mode</span>
            </button>
            <button
              onClick={() => setActiveTab('color')}
              className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-1.5 border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'color'
                  ? 'border-emerald-500 text-emerald-400 font-bold bg-emerald-500/5'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Color & Tone</span>
            </button>
            <button
              onClick={() => setActiveTab('motion')}
              className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-1.5 border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'motion'
                  ? 'border-emerald-500 text-emerald-400 font-bold bg-emerald-500/5'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Motion</span>
            </button>
            <button
              onClick={() => setActiveTab('pfx')}
              className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-1.5 border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'pfx'
                  ? 'border-emerald-500 text-emerald-400 font-bold bg-emerald-500/5'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Post-FX</span>
            </button>
          </div>

          {/* Tab Content Body */}
          <div className="p-4 flex flex-col gap-5 max-h-[640px] overflow-y-auto">
            {/* TAB 1: RENDER & GRID */}
            {activeTab === 'render' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5 font-bold">
                    Render Mode ({ALL_RENDER_MODES.length} Available)
                  </label>
                  <select
                    value={config.renderMode}
                    onChange={(e) => setConfig({ ...config, renderMode: e.target.value as AsciiRenderMode })}
                    className={`w-full text-xs font-mono px-3 py-2 rounded-lg border ${
                      theme === 'dark' ? 'bg-gray-900 border-gray-700 text-gray-200' : 'bg-gray-50 border-gray-300 text-gray-900'
                    }`}
                  >
                    {ALL_RENDER_MODES.map((mode) => (
                      <option key={mode.id} value={mode.id}>
                        {mode.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Cell Size Slider */}
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-gray-400">Cell Grid Size:</span>
                    <span className="text-emerald-400 font-bold">{config.cellSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="28"
                    step="1"
                    value={config.cellSize}
                    onChange={(e) => setConfig({ ...config, cellSize: parseInt(e.target.value, 10) })}
                    className="w-full accent-emerald-500"
                  />
                  <div className="flex justify-between text-[10px] text-gray-500 font-mono mt-0.5">
                    <span>Fine (3px)</span>
                    <span>Coarse (28px)</span>
                  </div>
                </div>

                {/* Coverage Slider */}
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-gray-400">Coverage:</span>
                    <span className="text-emerald-400 font-bold">{config.coverage}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="1"
                    value={config.coverage}
                    onChange={(e) => setConfig({ ...config, coverage: parseInt(e.target.value, 10) })}
                    className="w-full accent-emerald-500"
                  />
                </div>

                {/* Density Slider */}
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-gray-400">Pattern Density:</span>
                    <span className="text-emerald-400 font-bold">{config.density}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    step="1"
                    value={config.density}
                    onChange={(e) => setConfig({ ...config, density: parseInt(e.target.value, 10) })}
                    className="w-full accent-emerald-500"
                  />
                </div>

                {/* Edge Emphasis (Sobel Kernel) */}
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-gray-400">Edge Emphasis (Sobel Kernel):</span>
                    <span className="text-emerald-400 font-bold">{config.edgeEmphasis}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={config.edgeEmphasis}
                    onChange={(e) => setConfig({ ...config, edgeEmphasis: parseInt(e.target.value, 10) })}
                    className="w-full accent-emerald-500"
                  />
                </div>

                {/* Invert Colors Toggle */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-800">
                  <span className="text-xs font-mono text-gray-300">Invert Luminance:</span>
                  <button
                    onClick={() => setConfig({ ...config, invert: !config.invert })}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                      config.invert ? 'bg-emerald-600' : 'bg-gray-700'
                    }`}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      config.invert ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* Character Set Options if renderMode === 'characters' */}
                {config.renderMode === 'characters' && (
                  <div className="p-3 rounded-lg border border-gray-800 bg-gray-900/50 space-y-2 mt-2">
                    <label className="block text-xs font-mono text-gray-300 font-bold">
                      ASCII Glyph Character Set:
                    </label>
                    <select
                      value={config.charSet}
                      onChange={(e) => setConfig({ ...config, charSet: e.target.value as any })}
                      className="w-full text-xs font-mono px-2 py-1.5 rounded bg-gray-800 border border-gray-700 text-gray-200"
                    >
                      <option value="standard">Standard: ` .:-=+*#%@`</option>
                      <option value="detailed">Detailed (70-char ramp)</option>
                      <option value="blocks">Blocks: ` ░▒▓█`</option>
                      <option value="simple">Simple: ` .oO@`</option>
                      <option value="binary">Binary: `01`</option>
                      <option value="hex">Hex: `0123456789ABCDEF`</option>
                      <option value="custom">Custom</option>
                    </select>

                    {config.charSet === 'custom' && (
                      <input
                        type="text"
                        placeholder="Enter ramp from darkest to lightest"
                        value={config.customChars}
                        onChange={(e) => setConfig({ ...config, customChars: e.target.value })}
                        className="w-full text-xs font-mono px-2 py-1 rounded bg-gray-800 border border-gray-700 text-gray-200"
                      />
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: COLOR & TONE */}
            {activeTab === 'color' && (
              <div className="space-y-4">
                {/* Contrast Slider */}
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-gray-400">Contrast:</span>
                    <span className="text-emerald-400 font-bold">{config.contrast}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="250"
                    step="1"
                    value={config.contrast}
                    onChange={(e) => setConfig({ ...config, contrast: parseInt(e.target.value, 10) })}
                    className="w-full accent-emerald-500"
                  />
                </div>

                {/* Brightness Slider */}
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-gray-400">Brightness:</span>
                    <span className="text-emerald-400 font-bold">{config.brightness > 0 ? `+${config.brightness}` : config.brightness}</span>
                  </div>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    step="1"
                    value={config.brightness}
                    onChange={(e) => setConfig({ ...config, brightness: parseInt(e.target.value, 10) })}
                    className="w-full accent-emerald-500"
                  />
                </div>

                {/* Saturation Slider */}
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-gray-400">Saturation:</span>
                    <span className="text-emerald-400 font-bold">{config.saturation}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    step="1"
                    value={config.saturation}
                    onChange={(e) => setConfig({ ...config, saturation: parseInt(e.target.value, 10) })}
                    className="w-full accent-emerald-500"
                  />
                </div>

                {/* Grayscale Slider */}
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-gray-400">Grayscale:</span>
                    <span className="text-emerald-400 font-bold">{config.grayscale}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={config.grayscale}
                    onChange={(e) => setConfig({ ...config, grayscale: parseInt(e.target.value, 10) })}
                    className="w-full accent-emerald-500"
                  />
                </div>

                {/* Tint Color & Opacity */}
                <div className="p-3 rounded-lg border border-gray-800 bg-gray-900/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-gray-300 font-bold">Overlay Tint:</span>
                    <input
                      type="color"
                      value={config.tint}
                      onChange={(e) => setConfig({ ...config, tint: e.target.value })}
                      className="w-8 h-8 rounded border border-gray-700 bg-transparent cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-gray-400">Tint Opacity:</span>
                      <span className="text-emerald-400 font-bold">{config.tintOpacity}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={config.tintOpacity}
                      onChange={(e) => setConfig({ ...config, tintOpacity: parseInt(e.target.value, 10) })}
                      className="w-full accent-emerald-500"
                    />
                  </div>
                </div>

                {/* Background Layering Mode */}
                <div className="p-3 rounded-lg border border-gray-800 bg-gray-900/40 space-y-2">
                  <label className="block text-xs font-mono text-gray-300 font-bold">
                    Background Mode:
                  </label>
                  <select
                    value={config.bgMode}
                    onChange={(e) => setConfig({ ...config, bgMode: e.target.value as any })}
                    className="w-full text-xs font-mono px-2 py-1.5 rounded bg-gray-800 border border-gray-700 text-gray-200"
                  >
                    <option value="none">None (Black canvas)</option>
                    <option value="original">Original Photo Underlay</option>
                    <option value="blurred">Blurred Photo Underlay</option>
                    <option value="solid">Solid Background Color</option>
                  </select>

                  {config.bgMode === 'blurred' && (
                    <div>
                      <div className="flex justify-between text-xs font-mono mb-1">
                        <span className="text-gray-400">Blur Radius:</span>
                        <span className="text-emerald-400 font-bold">{config.bgBlur}px</span>
                      </div>
                      <input
                        type="range"
                        min="2"
                        max="30"
                        step="1"
                        value={config.bgBlur}
                        onChange={(e) => setConfig({ ...config, bgBlur: parseInt(e.target.value, 10) })}
                        className="w-full accent-emerald-500"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: MOTION & ANIMATION */}
            {activeTab === 'motion' && (
              <div className="space-y-4">
                {/* Animation Master Toggle */}
                <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                  <div>
                    <span className="block text-xs font-mono text-gray-200 font-bold">Live Animation</span>
                    <span className="text-[10px] text-gray-400 font-mono">Real-time procedural math displacement</span>
                  </div>
                  <button
                    onClick={() => setConfig({ ...config, animated: !config.animated })}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                      config.animated ? 'bg-emerald-600' : 'bg-gray-700'
                    }`}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      config.animated ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* Animation Style */}
                <div>
                  <label className="block text-xs font-mono uppercase text-gray-400 mb-1.5 font-bold">
                    Motion Trajectory Style
                  </label>
                  <select
                    value={config.animStyle}
                    onChange={(e) => setConfig({ ...config, animStyle: e.target.value as AsciiAnimStyle })}
                    className="w-full text-xs font-mono px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-gray-200"
                  >
                    <option value="pulse">Pulse (Breathing harmonic radius)</option>
                    <option value="wave">Wave (Sine undulation across X/Y)</option>
                    <option value="shimmer">Shimmer (High-frequency twinkle)</option>
                    <option value="ripple">Ripple (Concentric radial ripples)</option>
                    <option value="flicker">Flicker (Cathode Ray Tube jitter)</option>
                  </select>
                </div>

                {/* Speed Slider */}
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-gray-400">Cycle Speed:</span>
                    <span className="text-emerald-400 font-bold">{config.animSpeed.intensity}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="200"
                    step="5"
                    value={config.animSpeed.intensity}
                    onChange={(e) => setConfig({
                      ...config,
                      animSpeed: { ...config.animSpeed, intensity: parseInt(e.target.value, 10) }
                    })}
                    className="w-full accent-emerald-500"
                  />
                </div>

                {/* Amplitude / Intensity Slider */}
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-gray-400">Motion Amplitude:</span>
                    <span className="text-emerald-400 font-bold">{config.animIntensity.intensity}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    step="1"
                    value={config.animIntensity.intensity}
                    onChange={(e) => setConfig({
                      ...config,
                      animIntensity: { ...config.animIntensity, intensity: parseInt(e.target.value, 10) }
                    })}
                    className="w-full accent-emerald-500"
                  />
                </div>
              </div>
            )}

            {/* TAB 4: POST-EFFECTS (PFX) */}
            {activeTab === 'pfx' && (
              <div className="space-y-4">
                <div className="text-xs font-mono text-gray-400 pb-2 border-b border-gray-800">
                  Hardware-accelerated raster shaders & optical aberrations
                </div>

                {/* Vignette */}
                <div className="p-3 rounded-lg border border-gray-800 bg-gray-900/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-gray-200 font-bold">Vignette Shading</span>
                    <input
                      type="checkbox"
                      checked={config.pfx.vignette.enabled}
                      onChange={(e) => setConfig({
                        ...config,
                        pfx: {
                          ...config.pfx,
                          vignette: { ...config.pfx.vignette, enabled: e.target.checked }
                        }
                      })}
                      className="accent-emerald-500 rounded"
                    />
                  </div>
                  {config.pfx.vignette.enabled && (
                    <input
                      type="range"
                      min="5"
                      max="100"
                      value={config.pfx.vignette.intensity}
                      onChange={(e) => setConfig({
                        ...config,
                        pfx: {
                          ...config.pfx,
                          vignette: { ...config.pfx.vignette, intensity: parseInt(e.target.value, 10) }
                        }
                      })}
                      className="w-full accent-emerald-500"
                    />
                  )}
                </div>

                {/* Scan Lines */}
                <div className="p-3 rounded-lg border border-gray-800 bg-gray-900/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-gray-200 font-bold">CRT Scan Lines</span>
                    <input
                      type="checkbox"
                      checked={config.pfx.scanLines.enabled}
                      onChange={(e) => setConfig({
                        ...config,
                        pfx: {
                          ...config.pfx,
                          scanLines: { ...config.pfx.scanLines, enabled: e.target.checked }
                        }
                      })}
                      className="accent-emerald-500 rounded"
                    />
                  </div>
                  {config.pfx.scanLines.enabled && (
                    <input
                      type="range"
                      min="5"
                      max="100"
                      value={config.pfx.scanLines.intensity}
                      onChange={(e) => setConfig({
                        ...config,
                        pfx: {
                          ...config.pfx,
                          scanLines: { ...config.pfx.scanLines, intensity: parseInt(e.target.value, 10) }
                        }
                      })}
                      className="w-full accent-emerald-500"
                    />
                  )}
                </div>

                {/* Chromatic Aberration */}
                <div className="p-3 rounded-lg border border-gray-800 bg-gray-900/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-gray-200 font-bold">Chromatic Aberration (RGB Split)</span>
                    <input
                      type="checkbox"
                      checked={config.pfx.chromatic.enabled}
                      onChange={(e) => setConfig({
                        ...config,
                        pfx: {
                          ...config.pfx,
                          chromatic: { ...config.pfx.chromatic, enabled: e.target.checked }
                        }
                      })}
                      className="accent-emerald-500 rounded"
                    />
                  </div>
                  {config.pfx.chromatic.enabled && (
                    <input
                      type="range"
                      min="1"
                      max="50"
                      value={config.pfx.chromatic.intensity}
                      onChange={(e) => setConfig({
                        ...config,
                        pfx: {
                          ...config.pfx,
                          chromatic: { ...config.pfx.chromatic, intensity: parseInt(e.target.value, 10) }
                        }
                      })}
                      className="w-full accent-emerald-500"
                    />
                  )}
                </div>

                {/* Film Grain */}
                <div className="p-3 rounded-lg border border-gray-800 bg-gray-900/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-gray-200 font-bold">Analog Film Grain</span>
                    <input
                      type="checkbox"
                      checked={config.pfx.filmGrain.enabled}
                      onChange={(e) => setConfig({
                        ...config,
                        pfx: {
                          ...config.pfx,
                          filmGrain: { ...config.pfx.filmGrain, enabled: e.target.checked }
                        }
                      })}
                      className="accent-emerald-500 rounded"
                    />
                  </div>
                  {config.pfx.filmGrain.enabled && (
                    <input
                      type="range"
                      min="5"
                      max="100"
                      value={config.pfx.filmGrain.intensity}
                      onChange={(e) => setConfig({
                        ...config,
                        pfx: {
                          ...config.pfx,
                          filmGrain: { ...config.pfx.filmGrain, intensity: parseInt(e.target.value, 10) }
                        }
                      })}
                      className="w-full accent-emerald-500"
                    />
                  )}
                </div>

                {/* Glitch */}
                <div className="p-3 rounded-lg border border-gray-800 bg-gray-900/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-gray-200 font-bold">Signal Glitch</span>
                    <input
                      type="checkbox"
                      checked={config.pfx.glitch.enabled}
                      onChange={(e) => setConfig({
                        ...config,
                        pfx: {
                          ...config.pfx,
                          glitch: { ...config.pfx.glitch, enabled: e.target.checked }
                        }
                      })}
                      className="accent-emerald-500 rounded"
                    />
                  </div>
                  {config.pfx.glitch.enabled && (
                    <input
                      type="range"
                      min="5"
                      max="100"
                      value={config.pfx.glitch.intensity}
                      onChange={(e) => setConfig({
                        ...config,
                        pfx: {
                          ...config.pfx,
                          glitch: { ...config.pfx.glitch, intensity: parseInt(e.target.value, 10) }
                        }
                      })}
                      className="w-full accent-emerald-500"
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
