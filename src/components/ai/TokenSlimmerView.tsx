import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Upload, 
  Copy, 
  Check, 
  Download
} from 'lucide-react';
import { slimDocument, SlimmerResult, TokenSlimmerOptions } from '../../utils/tokenSlimmerEngine';
import { formatTokenCount } from '../../utils/tokenEstimator';

interface TokenSlimmerViewProps {
  onBack: () => void;
  onRecordTokensSaved: (tokens: number) => void;
  theme?: 'dark' | 'light';
}

const SAMPLE_DOC = `/*
 * Copyright (C) 2021-2026 Acme Corp. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0.
 * Proprietary and confidential.
 */

// Header: Internal Architecture Specifications
// Page 1 of 12

# System Authentication & Token Broker

// This section describes the token exchange protocol.
The architecture comprises three core services:

* Gateway Service: Terminates TLS and verifies client API credentials.
* Token Broker: Generates ephemeral RS256 JWT tokens with a 15-minute TTL.
* Audit Collector: Persists access logs for compliance.

// Data model definition:
interface TokenPayload {
  sub: string;
  role: 'admin' | 'developer' | 'guest';
  exp: number;
}
`;

export const TokenSlimmerView: React.FC<TokenSlimmerViewProps> = ({
  onBack,
  onRecordTokensSaved,
  theme = 'dark'
}) => {
  const [inputText, setInputText] = useState('');
  const [options, setOptions] = useState<TokenSlimmerOptions>({
    stripComments: true,
    stripCopyrights: true,
    compressWhitespace: true,
    removeHtmlTags: false,
    convertToDenseMarkdown: true,
  });
  const [result, setResult] = useState<SlimmerResult | null>(null);
  const [copied, setCopied] = useState(false);
  const isLight = theme === 'light';

  const handleProcess = (text = inputText, currentOpts = options) => {
    if (!text.trim()) return;
    const res = slimDocument(text, currentOpts);
    setResult(res);
    onRecordTokensSaved(res.savedTokens);
  };

  const handleLoadSample = () => {
    setInputText(SAMPLE_DOC);
    handleProcess(SAMPLE_DOC, options);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = String(event.target?.result || '');
      setInputText(content);
      handleProcess(content, options);
    };
    reader.readAsText(file);
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.optimizedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!result) return;
    const blob = new Blob([result.optimizedText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'compressed_document.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
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

        <div className="flex items-center gap-2">
          <label className={`cursor-pointer px-2.5 py-1 text-xs rounded border transition-colors flex items-center gap-1.5 ${
            isLight ? 'text-neutral-700 bg-neutral-100 hover:bg-neutral-200 border-neutral-300' : 'text-neutral-300 bg-neutral-900 hover:bg-neutral-800 border-neutral-800'
          }`}>
            <Upload className="w-3.5 h-3.5" />
            <span>Upload file</span>
            <input type="file" accept=".txt,.md,.json,.ts,.js,.py" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            onClick={handleLoadSample}
            className={`px-2.5 py-1 text-xs rounded border transition-colors ${
              isLight ? 'text-neutral-700 bg-neutral-100 hover:bg-neutral-200 border-neutral-300' : 'text-neutral-300 bg-neutral-900 hover:bg-neutral-800 border-neutral-800'
            }`}
          >
            Load sample
          </button>
        </div>
      </div>

      <div className={`space-y-1.5 pb-4 border-b ${isLight ? 'border-neutral-200' : 'border-neutral-900'}`}>
        <h1 className={`text-2xl font-serif tracking-tight ${isLight ? 'text-black' : 'text-white'}`}>
          Token Slimmer
        </h1>
        <p className={`text-xs max-w-xl leading-relaxed ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
          Removes legal boilerplate, comments, disclaimers, and empty lines from code or documents to reduce token footprint for LLM prompts.
        </p>
      </div>

      {/* Rules */}
      <div className={`p-3 rounded border flex flex-wrap items-center gap-5 text-xs ${
        isLight ? 'bg-neutral-50 border-neutral-200 text-neutral-700' : 'bg-[#0a0a0a] border-neutral-800 text-neutral-300'
      }`}>
        <span className="font-mono text-[11px] uppercase text-neutral-500">Rules:</span>

        <label className="flex items-center gap-1.5 cursor-pointer">
          <input 
            type="checkbox"
            checked={options.stripCopyrights}
            onChange={(e) => {
              const updated = { ...options, stripCopyrights: e.target.checked };
              setOptions(updated);
              handleProcess(inputText, updated);
            }}
            className="rounded border-neutral-700 bg-neutral-900"
          />
          <span>Strip licenses and copyrights</span>
        </label>

        <label className="flex items-center gap-1.5 cursor-pointer">
          <input 
            type="checkbox"
            checked={options.stripComments}
            onChange={(e) => {
              const updated = { ...options, stripComments: e.target.checked };
              setOptions(updated);
              handleProcess(inputText, updated);
            }}
            className="rounded border-neutral-700 bg-neutral-900"
          />
          <span>Strip code comments</span>
        </label>

        <label className="flex items-center gap-1.5 cursor-pointer">
          <input 
            type="checkbox"
            checked={options.compressWhitespace}
            onChange={(e) => {
              const updated = { ...options, compressWhitespace: e.target.checked };
              setOptions(updated);
              handleProcess(inputText, updated);
            }}
            className="rounded border-neutral-700 bg-neutral-900"
          />
          <span>Compress whitespace</span>
        </label>
      </div>

      {/* Readout bar */}
      {result && (
        <div className={`p-3 border rounded flex items-center justify-between text-xs font-mono ${
          isLight ? 'bg-neutral-50 border-neutral-200 text-neutral-700' : 'bg-[#0a0a0a] border-neutral-800 text-neutral-300'
        }`}>
          <div className="flex items-center gap-3">
            <span className={isLight ? 'text-neutral-500' : 'text-neutral-400'}>
              Original: {formatTokenCount(result.originalTokens)} tokens
            </span>
            <span>→</span>
            <span className={`font-semibold ${isLight ? 'text-black' : 'text-white'}`}>
              Compressed: {formatTokenCount(result.optimizedTokens)} tokens
            </span>
          </div>
          <div>
            {result.savedPercent}% saved ({formatTokenCount(result.savedTokens)} tokens removed)
          </div>
        </div>
      )}

      {/* Side by side editors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className={`font-mono text-[11px] uppercase tracking-wider ${isLight ? 'text-neutral-500' : 'text-neutral-500'}`}>
              Source Document
            </span>
            {inputText && (
              <button
                onClick={() => {
                  setInputText('');
                  setResult(null);
                }}
                className={`transition-colors ${isLight ? 'text-neutral-400 hover:text-black' : 'text-neutral-500 hover:text-white'}`}
              >
                Clear
              </button>
            )}
          </div>
          <textarea
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              handleProcess(e.target.value, options);
            }}
            placeholder="Paste text, code, or documentation here..."
            rows={18}
            className={`w-full p-3.5 border rounded text-xs font-mono transition-colors resize-y leading-relaxed focus:outline-none ${
              isLight 
                ? 'bg-neutral-50 border-neutral-200 text-black placeholder-neutral-400 focus:border-black' 
                : 'bg-[#0a0a0a] border-neutral-800 text-neutral-100 placeholder-neutral-600 focus:border-neutral-500'
            }`}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className={`font-mono text-[11px] uppercase tracking-wider ${isLight ? 'text-neutral-500' : 'text-neutral-500'}`}>
              Compressed Output
            </span>
            {result && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleCopy}
                  className={`px-2 py-0.5 rounded border transition-colors ${
                    isLight ? 'bg-neutral-100 hover:bg-neutral-200 text-black border-neutral-300' : 'bg-neutral-900 hover:bg-neutral-800 text-white border-neutral-800'
                  }`}
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  onClick={handleDownload}
                  className={`px-2 py-0.5 rounded font-medium transition-colors ${
                    isLight ? 'bg-black text-white hover:bg-neutral-800' : 'bg-white text-black hover:bg-neutral-200'
                  }`}
                >
                  Download .md
                </button>
              </div>
            )}
          </div>

          <textarea
            readOnly
            value={result?.optimizedText || ''}
            placeholder="Compressed markdown will appear here..."
            rows={18}
            className={`w-full p-3.5 border rounded text-xs font-mono resize-y leading-relaxed focus:outline-none ${
              isLight ? 'bg-neutral-50 border-neutral-200 text-neutral-800' : 'bg-[#070707] border-neutral-900 text-neutral-300'
            }`}
          />
        </div>
      </div>
    </div>
  );
};
