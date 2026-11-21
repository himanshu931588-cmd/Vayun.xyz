import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  ArrowLeftRight, 
  Copy, 
  Check, 
  Download, 
  Share2, 
  Sparkles, 
  RotateCcw, 
  AlertCircle, 
  Lock, 
  HelpCircle, 
  BookOpen, 
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Cpu,
  Clock,
  Terminal,
  ShieldCheck,
  Eye,
  Sliders
} from 'lucide-react';
import { ToolId } from '../../types';
import { CONVERTERS_REGISTRY, ConverterMetaItem } from '../../utils/converters/converterMetadata';
import {
  convertJsonToCsv,
  convertCsvToJson,
  convertJsonToYaml,
  convertYamlToJson,
  convertJsonToXml,
  convertBase64,
  convertUrl,
  decodeJwt,
  convertUnixTimestamp,
  convertNumberToWordsInr,
  convertHexToRgbHsl,
  convertPxToRem,
  JwtDecodedData,
  TimestampData,
  ColorData,
  PxRemData
} from '../../utils/converters';

interface ConverterTemplateProps {
  toolId: ToolId;
  theme: 'dark' | 'light';
  onBack: () => void;
  onNavigateToTool: (id: ToolId) => void;
}

export const ConverterTemplate: React.FC<ConverterTemplateProps> = ({
  toolId,
  theme,
  onBack,
  onNavigateToTool
}) => {
  const isLight = theme === 'light';
  const meta: ConverterMetaItem = CONVERTERS_REGISTRY[toolId] || CONVERTERS_REGISTRY['json-to-csv'];

  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Tool specific options
  const [baseSize, setBaseSize] = useState<number>(16);
  const [pxDirection, setPxDirection] = useState<'px-to-rem' | 'rem-to-px'>('px-to-rem');
  const [base64Mode, setBase64Mode] = useState<'encode' | 'decode'>('encode');
  const [urlMode, setUrlMode] = useState<'encode' | 'decode'>('encode');
  const [urlComponentOnly, setUrlComponentOnly] = useState<boolean>(true);
  const [base64UrlSafe, setBase64UrlSafe] = useState<boolean>(false);
  const [xmlRootTag, setXmlRootTag] = useState<string>('root');

  // Rich metadata outputs
  const [jwtData, setJwtData] = useState<JwtDecodedData | null>(null);
  const [colorData, setColorData] = useState<ColorData | null>(null);
  const [timestampData, setTimestampData] = useState<TimestampData | null>(null);
  const [formattedInr, setFormattedInr] = useState<string>('');
  const [pxRemData, setPxRemData] = useState<PxRemData | null>(null);

  // Maximum input size: 5MB
  const MAX_INPUT_BYTES = 5 * 1024 * 1024;
  const inputBytes = new Blob([input]).size;
  const isSizeExceeded = inputBytes > MAX_INPUT_BYTES;

  // Restore input from URL hash fragment if present (small inputs only, never sent to server)
  useEffect(() => {
    try {
      const hash = window.location.hash;
      const searchIndex = hash.indexOf('?');
      if (searchIndex !== -1) {
        const queryParams = new URLSearchParams(hash.slice(searchIndex));
        const encodedData = queryParams.get('data');
        if (encodedData) {
          const decoded = decodeURIComponent(atob(encodedData));
          if (decoded) {
            setInput(decoded);
            return;
          }
        }
      }
    } catch {
      // Ignore URL decode errors
    }
    // Default to sample input if input is empty on mount
    setInput(meta.defaultSample);
  }, [toolId, meta.defaultSample]);

  // Execute conversion
  const executeConversion = useCallback((val: string) => {
    if (!val.trim()) {
      setOutput('');
      setError(null);
      setJwtData(null);
      setColorData(null);
      setTimestampData(null);
      setFormattedInr('');
      setPxRemData(null);
      return;
    }

    if (new Blob([val]).size > MAX_INPUT_BYTES) {
      setError('Input exceeds 5 MB limit. Please trim your data to prevent browser memory issues.');
      setOutput('');
      return;
    }

    setError(null);

    switch (toolId) {
      case 'json-to-csv': {
        const res = convertJsonToCsv(val);
        if (res.error) setError(res.error);
        setOutput(res.output);
        break;
      }
      case 'csv-to-json': {
        const res = convertCsvToJson(val);
        if (res.error) setError(res.error);
        setOutput(res.output);
        break;
      }
      case 'json-to-yaml': {
        const res = convertJsonToYaml(val);
        if (res.error) setError(res.error);
        setOutput(res.output);
        break;
      }
      case 'yaml-to-json': {
        const res = convertYamlToJson(val);
        if (res.error) setError(res.error);
        setOutput(res.output);
        break;
      }
      case 'json-to-xml': {
        const res = convertJsonToXml(val, xmlRootTag);
        if (res.error) setError(res.error);
        setOutput(res.output);
        break;
      }
      case 'base64-converter': {
        const res = convertBase64(val, base64Mode, base64UrlSafe);
        if (res.error) setError(res.error);
        setOutput(res.output);
        break;
      }
      case 'url-converter': {
        const res = convertUrl(val, urlMode, urlComponentOnly);
        if (res.error) setError(res.error);
        setOutput(res.output);
        break;
      }
      case 'jwt-decoder': {
        const res = decodeJwt(val);
        if (res.error) setError(res.error);
        setOutput(res.output);
        setJwtData(res.data || null);
        break;
      }
      case 'unix-timestamp': {
        const res = convertUnixTimestamp(val);
        if (res.error) setError(res.error);
        setOutput(res.output);
        setTimestampData(res.data || null);
        break;
      }
      case 'number-to-words-inr': {
        const res = convertNumberToWordsInr(val);
        if (res.error) setError(res.error);
        setOutput(res.output);
        setFormattedInr(res.formattedInr);
        break;
      }
      case 'hex-to-rgb': {
        const res = convertHexToRgbHsl(val);
        if (res.error) setError(res.error);
        setOutput(res.output);
        setColorData(res.data || null);
        break;
      }
      case 'px-to-rem': {
        const res = convertPxToRem(val, baseSize, pxDirection);
        if (res.error) setError(res.error);
        setOutput(res.output);
        setPxRemData(res.data || null);
        break;
      }
      default:
        setOutput(val);
    }
  }, [
    toolId, 
    baseSize, 
    pxDirection, 
    base64Mode, 
    base64UrlSafe, 
    urlMode, 
    urlComponentOnly, 
    xmlRootTag, 
    MAX_INPUT_BYTES
  ]);

  // Convert on input change
  useEffect(() => {
    executeConversion(input);
  }, [input, executeConversion]);

  // Keyboard shortcut listener: Ctrl+Enter (convert), Ctrl+Shift+C (copy)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        executeConversion(input);
      } else if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'C' || e.key === 'c')) {
        e.preventDefault();
        handleCopy();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [input, executeConversion]);

  // Copy handler
  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Download handler
  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: meta.downloadMimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = meta.downloadFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Share URL handler (restores input via URL hash fragment, safe for small inputs)
  const handleShare = () => {
    if (!input) return;
    if (input.length > 2000) {
      alert('Input is too large for URL sharing (max 2,000 characters). Use copy or download instead.');
      return;
    }
    const b64 = btoa(encodeURIComponent(input));
    const shareUrl = `${window.location.origin}${window.location.pathname}#${toolId}?data=${b64}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setShared(true);
      setTimeout(() => setShared(false), 2500);
    });
  };

  // Swap handler (where reversible)
  const handleSwap = () => {
    if (meta.swapToolId) {
      onNavigateToTool(meta.swapToolId);
    } else if (toolId === 'base64-converter') {
      const newMode = base64Mode === 'encode' ? 'decode' : 'encode';
      setBase64Mode(newMode);
      setInput(output);
    } else if (toolId === 'url-converter') {
      const newMode = urlMode === 'encode' ? 'decode' : 'encode';
      setUrlMode(newMode);
      setInput(output);
    } else if (toolId === 'px-to-rem') {
      const newDir = pxDirection === 'px-to-rem' ? 'rem-to-px' : 'px-to-rem';
      setPxDirection(newDir);
      setInput(output.replace(/[^\d.]/g, ''));
    } else if (output && !error) {
      setInput(output);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
      
      {/* Navigation & Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b ${
        isLight ? 'border-[#E8E1D3]' : 'border-[#123826]'
      }`}>
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className={`p-2.5 rounded-xl border transition-all active:scale-95 ${
              isLight ? 'border-[#E8E1D3] bg-[#FFFDF9] hover:bg-[#F5F0E6] text-[#0A2618]' : 'border-[#123826] bg-[#0A2419] hover:bg-[#0E3223] text-[#FAF7F2]'
            }`}
            title="Back to Vayun Convert Hub"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
          </button>

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-semibold uppercase tracking-wider border ${
                isLight ? 'border-[#DDD3C1] bg-[#EFE9DC] text-[#0A2618]' : 'border-[#194E36] bg-[#0D2E20] text-[#6EE7B7]'
              }`}>
                {meta.group}
              </span>
              <h1 className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-[#0A2618] dark:text-[#FAF7F2]">
                {meta.name}
              </h1>
            </div>
            <p className={`text-xs mt-1 font-mono ${isLight ? 'text-[#3B5445]' : 'text-[#8AA898]'}`}>
              {meta.tagline}
            </p>
          </div>
        </div>

        {/* Security & Client-side guarantee badge */}
        <div className="flex items-center gap-2">
          <div className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-2 ${
            isLight ? 'border-[#DDD3C1] bg-[#EFE9DC] text-[#0A2618]' : 'border-[#194E36] bg-[#0D2E20] text-[#A3C7B5]'
          }`}>
            <Lock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>100% Client-Side RAM • Zero Server Uploads</span>
          </div>
        </div>
      </div>

      {/* Main Two-Pane Converter Area */}
      <div className="space-y-4">
        
        {/* Top Control Bar: Mode Toggles, Base Sizes, Shortcuts Notice */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Base64 options */}
            {toolId === 'base64-converter' && (
              <div className={`p-1 rounded-xl border flex items-center gap-1 ${
                isLight ? 'bg-[#EFE9DC] border-[#DDD3C1]' : 'bg-[#04120C] border-[#123826]'
              }`}>
                <button
                  onClick={() => setBase64Mode('encode')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    base64Mode === 'encode'
                      ? isLight ? 'bg-[#FFFDF9] text-[#0A2618] font-semibold shadow-xs' : 'bg-[#0D2E20] text-[#FAF7F2] font-semibold border border-[#194E36]'
                      : isLight ? 'text-[#3B5445] hover:text-[#0A2618]' : 'text-[#8AA898] hover:text-white'
                  }`}
                >
                  Encode to Base64
                </button>
                <button
                  onClick={() => setBase64Mode('decode')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    base64Mode === 'decode'
                      ? isLight ? 'bg-[#FFFDF9] text-[#0A2618] font-semibold shadow-xs' : 'bg-[#0D2E20] text-[#FAF7F2] font-semibold border border-[#194E36]'
                      : isLight ? 'text-[#3B5445] hover:text-[#0A2618]' : 'text-[#8AA898] hover:text-white'
                  }`}
                >
                  Decode to Text
                </button>
                <label className={`flex items-center gap-1.5 px-2 text-[11px] cursor-pointer ${
                  isLight ? 'text-[#3B5445]' : 'text-[#8AA898]'
                }`}>
                  <input
                    type="checkbox"
                    checked={base64UrlSafe}
                    onChange={(e) => setBase64UrlSafe(e.target.checked)}
                    className="rounded text-emerald-600"
                  />
                  <span>URL-safe (-/_)</span>
                </label>
              </div>
            )}

            {/* URL options */}
            {toolId === 'url-converter' && (
              <div className={`p-1 rounded-xl border flex items-center gap-1 ${
                isLight ? 'bg-[#EFE9DC] border-[#DDD3C1]' : 'bg-[#04120C] border-[#123826]'
              }`}>
                <button
                  onClick={() => setUrlMode('encode')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    urlMode === 'encode'
                      ? isLight ? 'bg-[#FFFDF9] text-[#0A2618] font-semibold shadow-xs' : 'bg-[#0D2E20] text-[#FAF7F2] font-semibold border border-[#194E36]'
                      : isLight ? 'text-[#3B5445] hover:text-[#0A2618]' : 'text-[#8AA898] hover:text-white'
                  }`}
                >
                  URL Encode
                </button>
                <button
                  onClick={() => setUrlMode('decode')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    urlMode === 'decode'
                      ? isLight ? 'bg-[#FFFDF9] text-[#0A2618] font-semibold shadow-xs' : 'bg-[#0D2E20] text-[#FAF7F2] font-semibold border border-[#194E36]'
                      : isLight ? 'text-[#3B5445] hover:text-[#0A2618]' : 'text-[#8AA898] hover:text-white'
                  }`}
                >
                  URL Decode
                </button>
                <label className={`flex items-center gap-1.5 px-2 text-[11px] cursor-pointer ${
                  isLight ? 'text-[#3B5445]' : 'text-[#8AA898]'
                }`}>
                  <input
                    type="checkbox"
                    checked={urlComponentOnly}
                    onChange={(e) => setUrlComponentOnly(e.target.checked)}
                    className="rounded text-emerald-600"
                  />
                  <span>Component Only</span>
                </label>
              </div>
            )}

            {/* px to rem options */}
            {toolId === 'px-to-rem' && (
              <div className="flex items-center gap-2">
                <div className={`p-1 rounded-xl border flex items-center gap-1 ${
                  isLight ? 'bg-[#EFE9DC] border-[#DDD3C1]' : 'bg-[#04120C] border-[#123826]'
                }`}>
                  <button
                    onClick={() => setPxDirection('px-to-rem')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      pxDirection === 'px-to-rem'
                        ? isLight ? 'bg-[#FFFDF9] text-[#0A2618] font-semibold shadow-xs' : 'bg-[#0D2E20] text-[#FAF7F2] font-semibold border border-[#194E36]'
                        : isLight ? 'text-[#3B5445] hover:text-[#0A2618]' : 'text-[#8AA898] hover:text-white'
                    }`}
                  >
                    px → rem
                  </button>
                  <button
                    onClick={() => setPxDirection('rem-to-px')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      pxDirection === 'rem-to-px'
                        ? isLight ? 'bg-[#FFFDF9] text-[#0A2618] font-semibold shadow-xs' : 'bg-[#0D2E20] text-[#FAF7F2] font-semibold border border-[#194E36]'
                        : isLight ? 'text-[#3B5445] hover:text-[#0A2618]' : 'text-[#8AA898] hover:text-white'
                    }`}
                  >
                    rem → px
                  </button>
                </div>

                <div className={`px-2.5 py-1 rounded-xl border flex items-center gap-1.5 ${
                  isLight ? 'border-[#E8E1D3] bg-[#FFFDF9]' : 'border-[#123826] bg-[#0A2419]'
                }`}>
                  <span className={isLight ? 'text-[#3B5445]' : 'text-[#8AA898]'}>Base Font:</span>
                  <input
                    type="number"
                    min="1"
                    max="64"
                    value={baseSize}
                    onChange={(e) => setBaseSize(Math.max(1, parseInt(e.target.value, 10) || 16))}
                    className="w-12 bg-transparent text-center font-bold focus:outline-hidden"
                  />
                  <span className={isLight ? 'text-[#3B5445]' : 'text-[#8AA898]'}>px</span>
                </div>
              </div>
            )}

            {/* XML Root Tag option */}
            {toolId === 'json-to-xml' && (
              <div className={`px-2.5 py-1 rounded-xl border flex items-center gap-2 ${
                isLight ? 'border-[#E8E1D3] bg-[#FFFDF9]' : 'border-[#123826] bg-[#0A2419]'
              }`}>
                <span className={isLight ? 'text-[#3B5445]' : 'text-[#8AA898]'}>Root Tag:</span>
                <input
                  type="text"
                  value={xmlRootTag}
                  onChange={(e) => setXmlRootTag(e.target.value.trim() || 'root')}
                  className="w-20 bg-transparent font-bold focus:outline-hidden"
                />
              </div>
            )}
          </div>

          {/* Quick Action Helpers */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setInput(meta.defaultSample)}
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all select-none active:scale-95 ${
                isLight ? 'border-[#E8E1D3] bg-[#FFFDF9] hover:bg-[#F5F0E6] text-[#0A2618] shadow-xs' : 'border-[#123826] bg-[#0A2419] hover:bg-[#0E3223] text-[#FAF7F2]'
              }`}
              title="Fill with worked sample data"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>Load Sample</span>
            </button>

            <button
              onClick={() => {
                setInput('');
                setOutput('');
                setError(null);
              }}
              className={`px-2.5 py-1.5 rounded-xl border transition-all ${
                isLight ? 'border-[#E8E1D3] bg-[#FFFDF9] hover:bg-[#F5F0E6] text-[#3B5445]' : 'border-[#123826] bg-[#0A2419] hover:bg-[#0E3223] text-[#8AA898]'
              }`}
              title="Clear all fields"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Two-Pane Editor Grid (Left Input, Right Output on Desktop; Stacked on Mobile) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* Left Pane: Input */}
          <div className={`p-4 sm:p-5 rounded-2xl border flex flex-col justify-between space-y-3 ${
            isLight ? 'bg-[#FFFDF9] border-[#E8E1D3] shadow-sm' : 'bg-[#0A2419] border-[#123826]'
          }`}>
            <div className={`flex items-center justify-between pb-2 border-b text-xs font-mono ${
              isLight ? 'border-[#EFE9DC]' : 'border-[#123826]'
            }`}>
              <span className={`font-semibold ${isLight ? 'text-[#0A2618]' : 'text-[#FAF7F2]'}`}>
                {meta.inputLabel}
              </span>
              <div className={`flex items-center gap-3 text-[11px] ${isLight ? 'text-[#3B5445]' : 'text-[#8AA898]'}`}>
                <span>{input.length} chars</span>
                <span>{(inputBytes / 1024).toFixed(1)} KB / 5 MB</span>
              </div>
            </div>

            <div className="relative flex-1">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={meta.inputPlaceholder}
                rows={14}
                spellCheck={false}
                className={`w-full h-full min-h-[320px] p-3 rounded-xl font-mono text-xs leading-relaxed resize-y focus:outline-hidden ${
                  isLight 
                    ? 'bg-[#FAF7F2] border border-[#E8E1D3] text-[#0A2618] focus:border-[#1E5638]' 
                    : 'bg-[#061A12]/80 border border-[#123826] text-[#E8F3ED] focus:border-[#226343]'
                }`}
              />
            </div>

            {/* Input Action Controls: Keyboard hint & Convert button */}
            <div className="flex items-center justify-between pt-1 text-xs font-mono">
              <div className={`text-[11px] hidden sm:flex items-center gap-1.5 ${isLight ? 'text-[#3B5445]' : 'text-[#8AA898]'}`}>
                <kbd className={`px-1.5 py-0.5 rounded border text-[10px] ${
                  isLight ? 'border-[#DDD3C1] bg-[#EFE9DC] text-[#0A2618]' : 'border-[#194E36] bg-[#061A12] text-[#A3C7B5]'
                }`}>
                  Ctrl+Enter
                </kbd>
                <span>to convert</span>
              </div>

              <div className="flex items-center gap-2 ml-auto">
                {/* Swap Button (where reversible) */}
                {(meta.isReversible || meta.swapToolId) && (
                  <button
                    onClick={handleSwap}
                    className={`px-3 py-2 rounded-xl border flex items-center gap-1.5 transition-all text-xs active:scale-95 ${
                      isLight 
                        ? 'border-[#E8E1D3] bg-[#FFFDF9] hover:bg-[#F5F0E6] text-[#0A2618] shadow-xs' 
                        : 'border-[#123826] bg-[#0A2419] hover:bg-[#0E3223] text-[#FAF7F2]'
                    }`}
                    title="Swap input and output direction"
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Swap</span>
                  </button>
                )}

                <button
                  onClick={() => executeConversion(input)}
                  className={`px-4 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition-all shadow-md active:scale-95 ${
                    isLight 
                      ? 'bg-[#0A2618] hover:bg-[#12432B] text-[#FAF7F2] shadow-[#0A2618]/20' 
                      : 'bg-[#FAF7F2] hover:bg-[#EAE4D8] text-[#061A12] font-bold'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Convert</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Pane: Output */}
          <div className={`p-4 sm:p-5 rounded-2xl border flex flex-col justify-between space-y-3 ${
            isLight ? 'bg-[#FFFDF9] border-[#E8E1D3] shadow-sm' : 'bg-[#0A2419] border-[#123826]'
          }`}>
            <div className={`flex items-center justify-between pb-2 border-b text-xs font-mono ${
              isLight ? 'border-[#EFE9DC]' : 'border-[#123826]'
            }`}>
              <span className={`font-semibold ${isLight ? 'text-[#0A2618]' : 'text-[#FAF7F2]'}`}>
                {meta.outputLabel}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className={`px-2.5 py-1 rounded-lg border flex items-center gap-1 transition-all text-[11px] ${
                    shared 
                      ? 'bg-emerald-600 text-white border-emerald-600' 
                      : isLight 
                      ? 'border-[#E8E1D3] hover:bg-[#F5F0E6] text-[#0A2618]' 
                      : 'border-[#123826] hover:bg-[#0E3223] text-[#A3C7B5]'
                  }`}
                  title="Copy shareable URL (encodes input in URL fragment, 100% private)"
                >
                  <Share2 className="w-3 h-3" />
                  <span>{shared ? 'Link Copied!' : 'Share URL'}</span>
                </button>

                <button
                  onClick={handleDownload}
                  disabled={!output}
                  className={`px-2.5 py-1 rounded-lg border flex items-center gap-1 transition-all text-[11px] ${
                    !output 
                      ? 'opacity-40 cursor-not-allowed border-transparent text-[#7C9C8C]' 
                      : isLight 
                      ? 'border-[#E8E1D3] hover:bg-[#F5F0E6] text-[#0A2618]' 
                      : 'border-[#123826] hover:bg-[#0E3223] text-[#FAF7F2]'
                  }`}
                  title={`Download as ${meta.downloadFilename}`}
                >
                  <Download className="w-3 h-3" />
                  <span>Download</span>
                </button>

                <button
                  onClick={handleCopy}
                  disabled={!output}
                  className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all text-[11px] shadow-xs active:scale-95 ${
                    copied
                      ? 'bg-emerald-600 text-white border border-emerald-600'
                      : !output
                      ? 'opacity-40 cursor-not-allowed bg-[#EFE9DC] dark:bg-[#061A12] text-[#8AA898]'
                      : isLight
                      ? 'bg-[#0A2618] text-[#FAF7F2] hover:bg-[#12432B]'
                      : 'bg-[#FAF7F2] text-[#061A12] hover:bg-[#EAE4D8]'
                  }`}
                  title="Copy to clipboard (Ctrl+Shift+C)"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Error Message Box (never blank output on error) */}
            {error && (
              <div className="p-3.5 rounded-xl border border-red-300 dark:border-red-900/60 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 text-xs font-mono flex items-start gap-2.5 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                <div className="space-y-0.5">
                  <div className="font-bold">Conversion Error:</div>
                  <div className="leading-relaxed">{error}</div>
                </div>
              </div>
            )}

            {/* Output Display */}
            <div className="relative flex-1">
              <textarea
                readOnly
                value={output}
                placeholder={meta.outputPlaceholder}
                rows={14}
                spellCheck={false}
                className={`w-full h-full min-h-[320px] p-3 rounded-xl font-mono text-xs leading-relaxed resize-y focus:outline-hidden ${
                  isLight 
                    ? 'bg-[#FAF7F2] border border-[#E8E1D3] text-[#0A2618]' 
                    : 'bg-[#061A12]/80 border border-[#123826] text-[#E8F3ED]'
                }`}
              />
            </div>

            {/* Tool-Specific Visual Widget Preview Card */}
            {/* 1. Color Preview Swatch for HEX to RGB */}
            {toolId === 'hex-to-rgb' && colorData && (
              <div className={`p-3 rounded-xl border flex items-center gap-3 ${
                isLight ? 'border-[#E8E1D3] bg-[#FAF7F2]' : 'border-[#123826] bg-[#061A12]'
              }`}>
                <div 
                  className="w-12 h-12 rounded-lg border shadow-xs shrink-0" 
                  style={{ backgroundColor: colorData.hex }}
                />
                <div className="text-xs font-mono space-y-1">
                  <div className="font-bold">{colorData.hex}</div>
                  <div className={`text-[11px] ${isLight ? 'text-[#3B5445]' : 'text-[#8AA898]'}`}>{colorData.rgb} • {colorData.hsl}</div>
                </div>
                <input
                  type="color"
                  value={colorData.hex}
                  onChange={(e) => setInput(e.target.value)}
                  className="ml-auto w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                  title="Pick color"
                />
              </div>
            )}

            {/* 2. JWT Claims Telemetry Card */}
            {toolId === 'jwt-decoder' && jwtData && (
              <div className={`p-3.5 rounded-xl border text-xs font-mono space-y-2 ${
                jwtData.isExpired 
                  ? 'border-amber-300 bg-amber-50/70 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-400' 
                  : 'border-emerald-300 bg-emerald-50/70 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-400'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Status: {jwtData.isExpired ? 'EXPIRED TOKEN' : 'ACTIVE TOKEN'}</span>
                  </span>
                  <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 font-bold">
                    Algorithm: {jwtData.algorithm || 'HS256'}
                  </span>
                </div>
                {jwtData.expiresAtFormatted && (
                  <div className="text-[11px]">
                    Expires: {jwtData.expiresAtFormatted} ({jwtData.timeRemaining})
                  </div>
                )}
              </div>
            )}

            {/* 3. INR Cheque Format Card */}
            {toolId === 'number-to-words-inr' && formattedInr && (
              <div className={`p-3 rounded-xl border flex items-center justify-between text-xs font-mono ${
                isLight ? 'border-[#DDD3C1] bg-[#EFE9DC] text-[#0A2618]' : 'border-[#194E36] bg-[#0D2E20] text-[#E8F3ED]'
              }`}>
                <span>Formatted Currency:</span>
                <span className="text-sm font-bold">{formattedInr}</span>
              </div>
            )}

            {/* Bottom Status bar */}
            <div className={`flex items-center justify-between pt-1 text-[11px] font-mono ${
              isLight ? 'text-[#3B5445]' : 'text-[#8AA898]'
            }`}>
              <span>{output ? `${output.split('\n').length} lines rendered` : 'Awaiting input...'}</span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <Check className="w-3 h-3" />
                <span>Zero server logs</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Section: Explanation, Worked Example & FAQs */}
      <div className={`p-6 sm:p-8 rounded-3xl border space-y-8 ${
        isLight ? 'bg-[#FFFDF9] border-[#E8E1D3] shadow-sm' : 'bg-[#0A2419] border-[#123826]'
      }`}>
        
        {/* Format Explanation */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4.5 h-4.5 text-emerald-500" />
            <h2 className="text-base sm:text-lg font-serif font-bold tracking-tight text-[#0A2618] dark:text-[#FAF7F2]">
              About {meta.name}
            </h2>
          </div>
          <p className={`text-xs sm:text-sm leading-relaxed max-w-4xl ${
            isLight ? 'text-[#3B5445]' : 'text-[#8AA898]'
          }`}>
            {meta.explanation}
          </p>
        </div>

        {/* Worked Example */}
        <div className={`space-y-3 pt-2 border-t ${
          isLight ? 'border-[#EFE9DC]' : 'border-[#123826]'
        }`}>
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-serif font-bold tracking-tight text-[#0A2618] dark:text-[#FAF7F2]">
              Worked Example: {meta.workedExample.title}
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
            <div className={`p-3.5 rounded-xl border space-y-1.5 ${
              isLight ? 'bg-[#FAF7F2] border-[#E8E1D3]' : 'bg-[#061A12]/80 border-[#123826]'
            }`}>
              <div className={`text-[11px] uppercase font-semibold ${isLight ? 'text-[#3B5445]' : 'text-[#8AA898]'}`}>Input:</div>
              <pre className="overflow-x-auto whitespace-pre-wrap">{meta.workedExample.input}</pre>
            </div>
            <div className={`p-3.5 rounded-xl border space-y-1.5 ${
              isLight ? 'bg-[#FAF7F2] border-[#E8E1D3]' : 'bg-[#061A12]/80 border-[#123826]'
            }`}>
              <div className={`text-[11px] uppercase font-semibold ${isLight ? 'text-[#3B5445]' : 'text-[#8AA898]'}`}>Output:</div>
              <pre className="overflow-x-auto whitespace-pre-wrap">{meta.workedExample.output}</pre>
            </div>
          </div>
          {meta.workedExample.notes && (
            <p className={`text-[11px] font-mono italic ${isLight ? 'text-[#3B5445]' : 'text-[#8AA898]'}`}>
              Note: {meta.workedExample.notes}
            </p>
          )}
        </div>

        {/* FAQs Accordion */}
        <div className={`space-y-4 pt-2 border-t ${
          isLight ? 'border-[#EFE9DC]' : 'border-[#123826]'
        }`}>
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4.5 h-4.5 text-emerald-500" />
            <h3 className="text-base font-serif font-bold tracking-tight text-[#0A2618] dark:text-[#FAF7F2]">
              Frequently Asked Questions (FAQs)
            </h3>
          </div>

          <div className="space-y-2.5">
            {meta.faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-xl border transition-colors ${
                    isLight ? 'border-[#E8E1D3] bg-[#FAF7F2]/60' : 'border-[#123826] bg-[#061A12]/50'
                  }`}
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full px-4 py-3 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold select-none text-[#0A2618] dark:text-[#FAF7F2]"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0 opacity-60" />}
                  </button>
                  {isOpen && (
                    <div className={`px-4 pb-3.5 pt-1 text-xs sm:text-[13px] leading-relaxed border-t ${
                      isLight ? 'text-[#3B5445] border-[#E8E1D3]/50' : 'text-[#8AA898] border-[#123826]/50'
                    }`}>
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Related Converters in Same Group */}
        {meta.relatedToolIds.length > 0 && (
          <div className={`space-y-3 pt-2 border-t ${
            isLight ? 'border-[#EFE9DC]' : 'border-[#123826]'
          }`}>
            <h3 className={`text-xs font-mono uppercase tracking-wider font-bold ${
              isLight ? 'text-[#3B5445]' : 'text-[#8AA898]'
            }`}>
              Related {meta.group} Converters
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              {meta.relatedToolIds.map((relId) => {
                const relMeta = CONVERTERS_REGISTRY[relId];
                if (!relMeta) return null;
                return (
                  <button
                    key={relId}
                    onClick={() => onNavigateToTool(relId)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-all active:scale-95 ${
                      isLight 
                        ? 'border-[#E8E1D3] bg-[#FFFDF9] hover:bg-[#F5F0E6] text-[#0A2618] shadow-xs' 
                        : 'border-[#123826] bg-[#061A12] hover:bg-[#0E3223] text-[#FAF7F2]'
                    }`}
                  >
                    <ArrowLeftRight className="w-3 h-3 text-emerald-500" />
                    <span>{relMeta.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
