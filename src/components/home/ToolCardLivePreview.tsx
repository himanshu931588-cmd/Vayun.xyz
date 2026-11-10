import React from 'react';
import { ToolId } from '../../types';

interface ToolCardLivePreviewProps {
  toolId: ToolId;
  isLight: boolean;
}

interface ToolSpec {
  specBadge: string;
  telemetry: string;
  metric: string;
}

const TOOL_SPECS: Record<string, ToolSpec> = {
  'vayun-flow': {
    specBadge: 'AST CALL-GRAPH',
    telemetry: 'Multi-file runtime trace scrubber',
    metric: '100% In-RAM'
  },
  'ai-smells-radar': {
    specBadge: 'AST FRAGILITY RADAR',
    telemetry: 'Detects unhandled promises & memory leaks',
    metric: 'Zero Uploads'
  },
  'chaos-wind-tunnel': {
    specBadge: 'TURBULENCE TESTBED',
    telemetry: 'Simulates race conditions & 3G timeouts',
    metric: 'Client WASM'
  },
  'viva-defense-badge': {
    specBadge: 'GITHUB PROOF BADGE',
    telemetry: 'Cryptographic SHA-256 verification hash',
    metric: 'Auditable'
  },
  'secret-detonator': {
    specBadge: 'TWO-WAY SCRUBBER',
    telemetry: 'Strips API keys & PII with local rehydrate',
    metric: 'RAM Mapping'
  },
  'webgpu-brain': {
    specBadge: 'WEBGPU SHADER ENGINE',
    telemetry: 'Runs Llama & DeepSeek on user GPU',
    metric: '28 tok/s'
  },
  'vayun-viva': {
    specBadge: 'SOCRATIC DEFENSE',
    telemetry: '3-tier architectural examination',
    metric: 'Anti-Black-Box'
  },
  'vayun-break': {
    specBadge: 'FAULT INJECTION',
    telemetry: 'Stack trace diagnostics with hints',
    metric: 'Browser Sandbox'
  },
  'vayun-spec': {
    specBadge: 'API & BIG-O SPEC',
    telemetry: 'Pre-code database & endpoint contracts',
    metric: 'Client-Side'
  },
  'resume-builder': {
    specBadge: 'ATS VECTOR PDF',
    telemetry: '6 executive formats with live A4 preview',
    metric: 'ATS 98/100'
  },
  'split-pdf': {
    specBadge: 'HIGH-CAPACITY RANGE',
    telemetry: 'Multi-hundred page ranges & batch chunking',
    metric: '1-500+ Pages'
  },
  'merge-pdf': {
    specBadge: 'LOSSLESS COMBINER',
    telemetry: 'Consolidate multiple documents in order',
    metric: 'RAM Only'
  },
  'compress-pdf': {
    specBadge: 'STREAM REDUCER',
    telemetry: 'Optimizes dictionaries & object streams',
    metric: '-85% Size'
  },
  'image-to-pdf': {
    specBadge: 'GALLERY CONVERTER',
    telemetry: 'PNG, JPEG & WebP to formatted vector PDF',
    metric: 'Lossless'
  },
  'token-slimmer': {
    specBadge: 'PROMPT COMPRESSOR',
    telemetry: 'Strips comments, console logs & whitespace',
    metric: '-60% Tokens'
  },
  'prompt-sanitizer': {
    specBadge: 'CREDENTIAL MASK',
    telemetry: 'Redacts secrets, keys, and IP addresses',
    metric: 'Client Regex'
  },
  'thread-rescuer': {
    specBadge: 'CONTEXT CAPSULE',
    telemetry: 'Condenses long LLM threads into cards',
    metric: 'Re-Indexed'
  },
  'invoice-maker': {
    specBadge: 'CLIENT-SIDE PDF',
    telemetry: 'Printable invoice generator with QR PayLink',
    metric: 'Zero Account'
  },
  'paylink-view': {
    specBadge: 'URL HASH VIEWER',
    telemetry: 'Decodes zero-backend cryptographic invoices',
    metric: 'Hash Fragment'
  },
  'receipt-matcher': {
    specBadge: 'OCR EXPENSE PARSER',
    telemetry: 'Extracts line items from expense photos',
    metric: 'In-Memory'
  },
  'clean-csv': {
    specBadge: 'TABULAR SANITIZER',
    telemetry: 'Trims whitespace & prunes blank rows',
    metric: 'Delimited'
  },
  'data-analytics': {
    specBadge: '10S PPT SYNTHESIS',
    telemetry: 'Turns PDF & CSV into 5-slide executive decks',
    metric: '< 10s Speed'
  },
  'preserve-zeros': {
    specBadge: 'ID PRESERVER',
    telemetry: 'Prevents Excel truncation of leading zeros',
    metric: 'Numeric String'
  },
  'table-converter': {
    specBadge: 'FORMAT SWITCHER',
    telemetry: 'Convert CSV to JSON, Markdown, HTML & SQL',
    metric: 'Multi-Format'
  },
  'ascii-art': {
    specBadge: 'CANVAS2D SHADER',
    telemetry: 'Bayer dithering, matrix rain & optical PFX',
    metric: '60 FPS'
  }
};

export const ToolCardLivePreview: React.FC<ToolCardLivePreviewProps> = ({ toolId, isLight }) => {
  const spec = TOOL_SPECS[toolId] || {
    specBadge: 'CLIENT APPLIANCE',
    telemetry: 'Executes strictly in browser memory',
    metric: '100% RAM'
  };

  return (
    <div className={`p-2.5 rounded-lg border font-mono text-[11px] select-none transition-colors ${
      isLight 
        ? 'bg-blue-50/60 border-blue-200/50 text-slate-700' 
        : 'bg-neutral-900/60 border-neutral-800 text-neutral-300'
    }`}>
      <div className={`flex items-center justify-between text-[10px] pb-1.5 mb-1.5 border-b ${
        isLight ? 'border-blue-100' : 'border-neutral-800'
      }`}>
        <span className={`font-bold tracking-wider uppercase text-[10px] ${
          isLight ? 'text-blue-900' : 'text-neutral-400'
        }`}>
          {spec.specBadge}
        </span>
        <span className={`font-semibold ${isLight ? 'text-blue-700' : 'text-emerald-400'}`}>
          {spec.metric}
        </span>
      </div>

      <div className={`text-[11px] font-normal leading-tight truncate ${
        isLight ? 'text-slate-600' : 'opacity-90'
      }`}>
        {spec.telemetry}
      </div>
    </div>
  );
};
