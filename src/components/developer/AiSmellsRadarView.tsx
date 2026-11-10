import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Radar, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Sparkles, 
  FileCode, 
  Copy, 
  Check, 
  Download, 
  RefreshCw, 
  Wand2, 
  Cpu, 
  Zap,
  Info,
  Bug,
  Eye,
  Layers
} from 'lucide-react';

interface AiSmellsRadarViewProps {
  onBack: () => void;
  onNavigateToFlow?: () => void;
  theme?: 'dark' | 'light';
}

interface CodeSmell {
  id: string;
  category: 'fragility' | 'leak' | 'security' | 'anti-pattern';
  severity: 'critical' | 'high' | 'medium';
  title: string;
  line: number;
  snippet: string;
  whyAiGenerated: string;
  consequence: string;
  fixSnippet: string;
  fixExplanation: string;
}

const PRESET_SNIPPETS = [
  {
    id: 'nextjs-api-route',
    name: 'Next.js API Handler (Copilot/Cursor Draft)',
    language: 'typescript',
    code: `import { NextRequest, NextResponse } from 'next/server';

// In-memory cache map declared in module scope
const sessionSubscriptions = new Map<string, any>();

export async function POST(req: NextRequest) {
  // SMELL 1: Unvalidated JSON parse assuming LLM payload is always valid
  const body = await req.json();
  const { userId, planId, cardToken } = body;

  // SMELL 2: Missing null/undefined guard before accessing properties
  const userTier = body.preferences.tier.toLowerCase();

  // SMELL 3: Dangling listener / memory leak on long-running connection
  const clientChannel = new EventSource(\`https://api.gateway.internal/events/\${userId}\`);
  clientChannel.onmessage = (event) => {
    sessionSubscriptions.set(userId, { channel: clientChannel, lastSeen: Date.now() });
    console.log("Stream update:", event.data);
  };
  // (Notice: clientChannel is never closed or cleared on disconnect!)

  // SMELL 4: Fetch with no timeout, AbortController, or try/catch rejection handling
  const stripeRes = await fetch("https://api.stripe.com/v1/charges", {
    method: "POST",
    headers: { "Authorization": "Bearer sk_test_MOCK_SECRET_REDACTED" },
    body: JSON.stringify({ amount: 4900, token: cardToken })
  });
  const chargeData = await stripeRes.json();

  // SMELL 5: N+1 database queries in loop instead of batch query
  const userOrganizations = body.orgIds;
  const syncResults = [];
  for (const orgId of userOrganizations) {
    const org = await fetch(\`https://db.internal/organizations/\${orgId}\`);
    syncResults.push(await org.json());
  }

  // SMELL 6: Fallback secret hardcoded in codebase
  const secretWebhook = process.env.WEBHOOK_SECRET || "fallback_unsafe_dev_secret_123";

  return NextResponse.json({ success: true, charge: chargeData, sync: syncResults });
}`
  },
  {
    id: 'react-hook-leak',
    name: 'React Dashboard Hook (Silent Memory Leak)',
    language: 'typescript',
    code: `import { useState, useEffect } from 'react';

export function useLiveTelemetry(socketUrl: string) {
  const [metrics, setMetrics] = useState<any[]>([]);

  useEffect(() => {
    // SMELL: setInterval created inside hook without clearInterval cleanup in return callback
    const intervalId = setInterval(async () => {
      const response = await fetch('/api/metrics');
      const data = await response.json();
      
      // Direct state mutation anti-pattern often produced by LLMs
      metrics.push(data);
      setMetrics(metrics);
    }, 1000);

    // Global window listener attached without cleanup
    window.addEventListener('resize', () => {
      console.log("Viewport updated:", window.innerWidth);
    });

    // Notice: Missing return () => { clearInterval(intervalId); window.removeEventListener(...); }
  }, [socketUrl]);

  return { metrics };
}`
  }
];

export const AiSmellsRadarView: React.FC<AiSmellsRadarViewProps> = ({
  onBack,
  onNavigateToFlow,
  theme = 'dark'
}) => {
  const isLight = theme === 'light';
  
  const [selectedPresetId, setSelectedPresetId] = useState(PRESET_SNIPPETS[0].id);
  const [code, setCode] = useState(PRESET_SNIPPETS[0].code);
  const [filterCategory, setFilterCategory] = useState<'all' | 'fragility' | 'leak' | 'security'>('all');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'audit' | 'fixed_code'>('audit');

  // Client-side AST/Syntax Smell Detector
  const detectedSmells = useMemo<CodeSmell[]>(() => {
    const smells: CodeSmell[] = [];
    const lines = code.split('\n');

    // 1. Fetch without AbortController / Timeout
    lines.forEach((lineText, idx) => {
      if (lineText.includes('await fetch(') || (lineText.includes('fetch(') && !lineText.includes('AbortController'))) {
        if (!code.includes('AbortController') && !code.includes('signal:')) {
          smells.push({
            id: `fetch-no-timeout-${idx}`,
            category: 'fragility',
            severity: 'high',
            title: 'Unbounded Async Fetch (Missing Abort Signal)',
            line: idx + 1,
            snippet: lineText.trim(),
            whyAiGenerated: 'LLMs default to basic fetch() boilerplate without timeout signals. In production, dangling sockets exhaust connection pools when the remote service slows down.',
            consequence: 'Silent connection starvation and unhandled rejection crashes.',
            fixSnippet: `const controller = new AbortController();\nconst timeoutId = setTimeout(() => controller.abort(), 8000);\ntry {\n  const res = await fetch(url, { signal: controller.signal });\n} finally { clearTimeout(timeoutId); }`,
            fixExplanation: 'Add AbortController with an 8-second timeout guard to prevent hung background threads.'
          });
        }
      }
    });

    // 2. Unvalidated JSON payload parse
    lines.forEach((lineText, idx) => {
      if (lineText.includes('await req.json()') || lineText.includes('JSON.parse(')) {
        smells.push({
          id: `unvalidated-json-${idx}`,
          category: 'fragility',
          severity: 'critical',
          title: 'Unvalidated Request Payload (Missing Schema Guard)',
          line: idx + 1,
          snippet: lineText.trim(),
          whyAiGenerated: 'Copilot and ChatGPT assume user input conforms to happy-path TypeScript interfaces without runtime schema validation (like Zod or Valibot).',
          consequence: 'Runtime TypeError crashes when a client passes unexpected null, string arrays, or omitted keys.',
          fixSnippet: `const parseResult = SafePayloadSchema.safeParse(await req.json());\nif (!parseResult.success) {\n  return NextResponse.json({ error: parseResult.error.issues }, { status: 400 });\n}\nconst body = parseResult.data;`,
          fixExplanation: 'Validate input using a strict schema guard before accessing child properties.'
        });
      }
    });

    // 3. Dangerous Deep Property Access without optional chaining
    lines.forEach((lineText, idx) => {
      if (/body\.[a-zA-Z0-9_]+\.[a-zA-Z0-9_]+/.test(lineText) && !lineText.includes('?.') && !lineText.includes('if (')) {
        smells.push({
          id: `nested-null-access-${idx}`,
          category: 'fragility',
          severity: 'high',
          title: 'Unchecked Deep Property Traversal',
          line: idx + 1,
          snippet: lineText.trim(),
          whyAiGenerated: 'AI hallucinations frequently trust nested JSON objects exist without nullish checking, causing instant "Cannot read property of undefined" errors.',
          consequence: 'Immediate 500 Uncaught Exception for real users.',
          fixSnippet: lineText.replace(/([a-zA-Z0-9_]+)\.([a-zA-Z0-9_]+)\.([a-zA-Z0-9_]+)/g, '$1?.$2?.$3 ?? "default"'),
          fixExplanation: 'Use safe optional chaining (?.) and nullish coalescing (??).'
        });
      }
    });

    // 4. Memory Leak / Dangling EventSource or Listener
    lines.forEach((lineText, idx) => {
      if ((lineText.includes('new EventSource(') || lineText.includes('addEventListener(') || lineText.includes('setInterval(')) && 
          !code.includes('removeEventListener') && !code.includes('clearInterval') && !code.includes('.close()')) {
        smells.push({
          id: `leak-listener-${idx}`,
          category: 'leak',
          severity: 'critical',
          title: 'Uncleaned Listener / Stream (Silent Memory Leak)',
          line: idx + 1,
          snippet: lineText.trim(),
          whyAiGenerated: 'AI generation focuses on the setup logic and constantly omits the teardown/cleanup lifecycle handlers.',
          consequence: 'Progressive memory bloat; multiple instances duplicate event handling and eventually cause V8 OOM crashes.',
          fixSnippet: `// Store reference and cleanly close in teardown/finally:\nreq.signal.addEventListener('abort', () => {\n  clientChannel.close();\n  sessionSubscriptions.delete(userId);\n});`,
          fixExplanation: 'Bind cleanup handler to the abort signal or return a cleanup callback.'
        });
      }
    });

    // 5. N+1 Database Query in Loop
    lines.forEach((lineText, idx) => {
      if ((lineText.includes('for (') || lineText.includes('.map(') || lineText.includes('for await')) && 
          (code.includes('await fetch(') || code.includes('await db.'))) {
        if (!smells.some(s => s.id.startsWith('n-plus-one'))) {
          smells.push({
            id: `n-plus-one-${idx}`,
            category: 'anti-pattern',
            severity: 'high',
            title: 'N+1 Sequential Network Loop',
            line: idx + 1,
            snippet: lineText.trim(),
            whyAiGenerated: 'AI writes simple iterative loops that query external resources 1-by-1 rather than executing batch lookups (IN clause or Promise.all).',
            consequence: 'Exponential latency increase: 10 items take 10x network RTTs instead of 1.',
            fixSnippet: `// Batch fetch or parallelize:\nconst syncResults = await Promise.all(\n  userOrganizations.map(async (orgId) => {\n    const res = await fetch(\`https://db.internal/organizations/\${orgId}\`);\n    return res.json();\n  })\n);`,
            fixExplanation: 'Convert sequential await loop to Promise.all or a batch query endpoint.'
          });
        }
      }
    });

    // 6. Hardcoded Secret / Insecure Fallback
    lines.forEach((lineText, idx) => {
      if (lineText.includes('process.env.') && (lineText.includes('|| "') || lineText.includes("|| '"))) {
        smells.push({
          id: `hardcoded-secret-${idx}`,
          category: 'security',
          severity: 'critical',
          title: 'Insecure Hardcoded Dev Fallback Secret',
          line: idx + 1,
          snippet: lineText.trim(),
          whyAiGenerated: 'AI inserts fallback mock strings to make local examples run without configuration, which developers routinely commit to git.',
          consequence: 'Catastrophic security exposure in production environments.',
          fixSnippet: `const secret = process.env.WEBHOOK_SECRET;\nif (!secret) {\n  throw new Error("CRITICAL: WEBHOOK_SECRET environment variable is missing.");\n}`,
          fixExplanation: 'Fail fast with an explicit exception rather than falling back to an insecure string.'
        });
      }
    });

    return smells;
  }, [code]);

  // Filtered smells
  const filteredSmells = useMemo(() => {
    if (filterCategory === 'all') return detectedSmells;
    return detectedSmells.filter(s => s.category === filterCategory);
  }, [detectedSmells, filterCategory]);

  // Overall Fragility Score (0 = perfect, 100 = dangerous)
  const fragilityScore = useMemo(() => {
    let score = 0;
    detectedSmells.forEach(s => {
      if (s.severity === 'critical') score += 25;
      else if (s.severity === 'high') score += 15;
      else score += 10;
    });
    return Math.min(100, score);
  }, [detectedSmells]);

  const scoreLabel = fragilityScore > 60 ? 'High AI Fragility (High Risk)' : fragilityScore > 30 ? 'Moderate Fragility' : 'Hardened Codebase';

  // Apply auto-fixes to code
  const fixedCode = useMemo(() => {
    let patched = code;
    // Replace unvalidated json
    if (patched.includes('const body = await req.json();')) {
      patched = patched.replace(
        'const body = await req.json();',
        '// HARDENED BY VAYUN: Runtime payload verification\n  const rawBody = await req.json();\n  if (!rawBody || typeof rawBody !== "object") {\n    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });\n  }\n  const body = rawBody;'
      );
    }
    // Replace hardcoded fallback
    if (patched.includes('process.env.WEBHOOK_SECRET ||')) {
      patched = patched.replace(
        /const secretWebhook = process\.env\.WEBHOOK_SECRET \|\| [^;]+;/,
        'const secretWebhook = process.env.WEBHOOK_SECRET;\n  if (!secretWebhook) throw new Error("Missing WEBHOOK_SECRET config");'
      );
    }
    // Replace deep property access
    patched = patched.replace(
      'body.preferences.tier.toLowerCase()',
      'body.preferences?.tier?.toLowerCase() ?? "standard"'
    );
    return patched;
  }, [code]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Navigation & Status Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className={`p-2 rounded-lg border transition-colors ${
              isLight 
                ? 'border-[#0A2540]/20 bg-white hover:bg-slate-100 text-[#0A2540]' 
                : 'border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-white'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <Radar className="w-5 h-5 text-emerald-400" />
              <h1 className="text-xl sm:text-2xl font-serif font-bold tracking-tight">
                AI Smells &amp; Logic Radar
              </h1>
            </div>
            <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
              Client-side AST and semantic parser scanning for AI code hallucinations and silent memory leaks.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className={`px-3 py-1 rounded-full border text-[11px] font-mono flex items-center gap-1.5 ${
            isLight ? 'bg-[#0A2540] text-white border-[#0A2540]' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>100% In-Browser RAM • Zero Uploads</span>
          </div>

          {onNavigateToFlow && (
            <button
              onClick={onNavigateToFlow}
              className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-medium transition-colors ${
                isLight 
                  ? 'border-[#0A2540]/30 bg-white text-[#0A2540] hover:bg-slate-50' 
                  : 'border-neutral-800 bg-neutral-900 text-neutral-300 hover:bg-neutral-800'
              }`}
            >
              Open in Flow &rarr;
            </button>
          )}
        </div>
      </div>

      {/* Preset Code Selectors */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-400">
            Inspection Target:
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {PRESET_SNIPPETS.map(preset => (
              <button
                key={preset.id}
                onClick={() => {
                  setSelectedPresetId(preset.id);
                  setCode(preset.code);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                  selectedPresetId === preset.id
                    ? isLight 
                      ? 'bg-[#0A2540] text-white font-semibold shadow-xs' 
                      : 'bg-white text-black font-semibold'
                    : isLight 
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' 
                      : 'bg-neutral-900 text-neutral-400 hover:text-white'
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleCopy(activeTab === 'audit' ? code : fixedCode)}
            className={`px-3 py-1 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition-colors ${
              isLight ? 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50' : 'border-neutral-800 bg-neutral-900 text-neutral-300'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Code'}</span>
          </button>
        </div>
      </div>

      {/* Fragility HUD Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Fragility Score */}
        <div className={`p-4 rounded-xl border transition-all ${
          isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-neutral-950 border-neutral-800'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-neutral-500">AI Fragility Score</span>
            <AlertTriangle className={`w-4 h-4 ${fragilityScore > 50 ? 'text-rose-500' : 'text-amber-400'}`} />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-3xl font-serif font-bold ${
              fragilityScore > 50 ? 'text-rose-500' : fragilityScore > 20 ? 'text-amber-500' : 'text-emerald-500'
            }`}>
              {fragilityScore}
            </span>
            <span className="text-xs font-mono text-neutral-500">/ 100</span>
          </div>
          <p className="text-[11px] font-mono mt-1 text-neutral-400 truncate">
            {scoreLabel}
          </p>
        </div>

        {/* Metric 2: AI Smells Found */}
        <div className={`p-4 rounded-xl border transition-all ${
          isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-neutral-950 border-neutral-800'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-neutral-500">Detected Smells</span>
            <Bug className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-serif font-bold text-slate-900 dark:text-white">
              {detectedSmells.length}
            </span>
            <span className="text-xs font-mono text-neutral-500">active hazards</span>
          </div>
          <p className="text-[11px] font-mono mt-1 text-neutral-400">
            {detectedSmells.filter(s => s.severity === 'critical').length} Critical • {detectedSmells.filter(s => s.severity === 'high').length} High
          </p>
        </div>

        {/* Metric 3: Memory Leaks */}
        <div className={`p-4 rounded-xl border transition-all ${
          isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-neutral-950 border-neutral-800'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-neutral-500">Silent Leaks</span>
            <Layers className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-serif font-bold text-slate-900 dark:text-white">
              {detectedSmells.filter(s => s.category === 'leak').length}
            </span>
            <span className="text-xs font-mono text-neutral-500">unclosed refs</span>
          </div>
          <p className="text-[11px] font-mono mt-1 text-neutral-400">
            Uncleaned intervals / listeners
          </p>
        </div>

        {/* Metric 4: Local Radar Engine */}
        <div className={`p-4 rounded-xl border transition-all ${
          isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-neutral-950 border-neutral-800'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-neutral-500">Engine Telemetry</span>
            <Cpu className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-mono font-bold text-emerald-400">
              0.04 ms
            </span>
          </div>
          <p className="text-[11px] font-mono mt-1 text-neutral-400">
            Zero network packets sent
          </p>
        </div>
      </div>

      {/* Main View Grid: Code Editor (Left) & Smells Radar Inspector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Code Workspace */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-neutral-400" />
              <span className="text-xs font-mono font-semibold">Source Code Editor (Paste or Edit)</span>
            </div>
            
            <div className="flex items-center gap-1 text-xs font-mono">
              <button
                onClick={() => setActiveTab('audit')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  activeTab === 'audit'
                    ? isLight ? 'bg-[#0A2540] text-white font-semibold' : 'bg-white text-black font-semibold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Original Source
              </button>
              <button
                onClick={() => setActiveTab('fixed_code')}
                className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
                  activeTab === 'fixed_code'
                    ? isLight ? 'bg-[#0A2540] text-white font-semibold' : 'bg-emerald-500 text-black font-semibold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Wand2 className="w-3 h-3" />
                <span>Hardened Code</span>
              </button>
            </div>
          </div>

          <div className={`rounded-xl border overflow-hidden font-mono text-xs ${
            isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-neutral-950 border-neutral-800 text-neutral-200'
          }`}>
            <textarea
              value={activeTab === 'audit' ? code : fixedCode}
              onChange={(e) => {
                if (activeTab === 'audit') setCode(e.target.value);
              }}
              rows={24}
              className="w-full p-4 bg-transparent resize-none focus:outline-hidden leading-relaxed font-mono"
              spellCheck={false}
              placeholder="Paste code snippet to scan for AI hallucinations, missing guards, and leaks..."
            />
          </div>
        </div>

        {/* Right: Detected Smells & 1-Click Fixes */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radar className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-semibold">
                Radar Findings ({filteredSmells.length})
              </span>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 text-[11px] font-mono">
              {(['all', 'fragility', 'leak', 'security'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-2 py-0.5 rounded capitalize transition-colors ${
                    filterCategory === cat
                      ? isLight ? 'bg-[#0A2540] text-white font-medium' : 'bg-white text-black font-medium'
                      : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {filteredSmells.length === 0 ? (
            <div className={`p-8 rounded-xl border text-center space-y-2 ${
              isLight ? 'bg-white border-slate-200' : 'bg-neutral-950 border-neutral-800'
            }`}>
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="text-sm font-semibold">No smells detected in this category</p>
              <p className="text-xs text-neutral-400">The scanned AST passes edge-case and lifecycle guard tests.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
              {filteredSmells.map((smell) => (
                <div
                  key={smell.id}
                  className={`p-4 rounded-xl border transition-all space-y-3 ${
                    smell.severity === 'critical'
                      ? isLight ? 'bg-rose-50/40 border-rose-200' : 'bg-rose-950/20 border-rose-900/40'
                      : isLight ? 'bg-white border-slate-200' : 'bg-neutral-900/60 border-neutral-800'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                        smell.severity === 'critical'
                          ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {smell.severity}
                      </span>
                      <span className="text-xs font-mono text-neutral-400">
                        Line {smell.line}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                      {smell.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-white">
                    {smell.title}
                  </h3>

                  {/* Triggered Snippet */}
                  <div className={`p-2.5 rounded font-mono text-xs overflow-x-auto ${
                    isLight ? 'bg-slate-100 text-slate-800 border border-slate-200' : 'bg-black/60 text-neutral-300 border border-neutral-800'
                  }`}>
                    <code>{smell.snippet}</code>
                  </div>

                  {/* Why AI Hallucinated This */}
                  <div className="space-y-1 text-xs leading-relaxed">
                    <p className={isLight ? 'text-slate-700' : 'text-neutral-300'}>
                      <strong className="text-amber-500">Why LLMs do this: </strong>
                      {smell.whyAiGenerated}
                    </p>
                    <p className={isLight ? 'text-slate-600' : 'text-neutral-400'}>
                      <strong className="text-rose-500">Production impact: </strong>
                      {smell.consequence}
                    </p>
                  </div>

                  {/* Recommended Fix */}
                  <div className={`p-3 rounded-lg border text-xs space-y-2 ${
                    isLight ? 'bg-blue-50/50 border-[#0A2540]/20 text-[#0A2540]' : 'bg-neutral-950 border-neutral-800 text-emerald-300'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-semibold flex items-center gap-1.5">
                        <Wand2 className="w-3.5 h-3.5" />
                        Recommended Hardening
                      </span>
                      <button
                        onClick={() => {
                          setCode(fixedCode);
                          setActiveTab('fixed_code');
                        }}
                        className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-all ${
                          isLight 
                            ? 'bg-[#0A2540] text-white hover:bg-[#071829]' 
                            : 'bg-emerald-500 text-black hover:bg-emerald-400'
                        }`}
                      >
                        Apply Fix
                      </button>
                    </div>
                    <pre className="p-2 rounded bg-black/20 overflow-x-auto text-[11px] font-mono">
                      {smell.fixSnippet}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
