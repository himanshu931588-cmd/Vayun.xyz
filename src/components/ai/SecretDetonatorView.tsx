import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  KeyRound, 
  ShieldCheck, 
  Copy, 
  Check, 
  RefreshCw, 
  Sparkles, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeftRight, 
  FileCode, 
  FileText,
  AlertTriangle,
  Zap,
  RotateCcw
} from 'lucide-react';

interface SecretDetonatorViewProps {
  onBack: () => void;
  theme?: 'dark' | 'light';
}

interface SecretMapping {
  id: string;
  type: string;
  realValue: string;
  mockToken: string;
  category: 'api_key' | 'database' | 'jwt' | 'pii' | 'private_key';
}

const PRESET_SNIPPETS = [
  {
    id: 'nextjs-stripe-db',
    name: 'Stripe API & Postgres .env Code',
    text: `// Next.js API Route for Billing
import { Pool } from 'pg';
import Stripe from 'stripe';

const dbPool = new Pool({
  connectionString: "postgres://postgres_admin:SuperSecretPassword2026!@db.internal.production.aws:5432/finance_db"
});

const stripe = new Stripe("sk-proj-a1B2c3D4e5F6g7H8i9J0k1L2m3N4o5P6q7R8s9T0u1V2w3X4y5Z6_live", {
  apiVersion: '2023-10-16'
});

export async function POST(req) {
  const adminEmail = "himanshu.internal@enterprise-corp.com";
  const userJwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
  
  // Connect to DB and charge
  return { status: "processed", admin: adminEmail, token: userJwt };
}`
  },
  {
    id: 'python-aws-claude',
    name: 'Python AWS S3 & Claude Integration',
    text: `import boto3
import anthropic

AWS_ACCESS_KEY = "AKIAIOSFODNN7EXAMPLE"
AWS_SECRET_KEY = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
ANTHROPIC_KEY = "sk-ant-api03-abcdef1234567890abcdef1234567890abcdef12-AA"

client = anthropic.Anthropic(api_key=ANTHROPIC_KEY)
s3 = boto3.client('s3', aws_access_key_id=AWS_ACCESS_KEY, aws_secret_access_key=AWS_SECRET_KEY)
`
  }
];

export const SecretDetonatorView: React.FC<SecretDetonatorViewProps> = ({
  onBack,
  theme = 'dark'
}) => {
  const isLight = theme === 'light';

  const [activeTab, setActiveTab] = useState<'detonate' | 'rehydrate'>('detonate');
  const [inputText, setInputText] = useState(PRESET_SNIPPETS[0].text);
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Rehydrate state
  const [aiResponseInput, setAiResponseInput] = useState('');
  const [rehydratedOutput, setRehydratedOutput] = useState('');

  // Detonation Engine: Detects high-entropy strings and builds RAM mapping
  const { sanitizedText, mappings } = useMemo(() => {
    let result = inputText;
    const detected: SecretMapping[] = [];
    let counter = 1;

    // 1. OpenAI Keys (sk-proj-... or sk-...)
    const openaiRegex = /sk-(?:proj-)?[A-Za-z0-9_-]{24,}/g;
    let match;
    while ((match = openaiRegex.exec(inputText)) !== null) {
      const real = match[0];
      if (!detected.some(d => d.realValue === real)) {
        const mock = `sk-proj-MOCK_KEY_${counter++}`;
        detected.push({
          id: `openai-${detected.length}`,
          type: 'OpenAI Secret Key',
          realValue: real,
          mockToken: mock,
          category: 'api_key'
        });
      }
    }

    // 2. Anthropic Keys (sk-ant-...)
    const anthropicRegex = /sk-ant-[A-Za-z0-9_-]{20,}/g;
    while ((match = anthropicRegex.exec(inputText)) !== null) {
      const real = match[0];
      if (!detected.some(d => d.realValue === real)) {
        const mock = `sk-ant-MOCK_KEY_${counter++}`;
        detected.push({
          id: `anthropic-${detected.length}`,
          type: 'Anthropic Claude Key',
          realValue: real,
          mockToken: mock,
          category: 'api_key'
        });
      }
    }

    // 3. AWS Access Keys (AKIA...)
    const awsRegex = /AKIA[0-9A-Z]{16}/g;
    while ((match = awsRegex.exec(inputText)) !== null) {
      const real = match[0];
      if (!detected.some(d => d.realValue === real)) {
        const mock = `AKIA_MOCK_ACCESS_KEY_${counter++}`;
        detected.push({
          id: `aws-${detected.length}`,
          type: 'AWS Access Key ID',
          realValue: real,
          mockToken: mock,
          category: 'api_key'
        });
      }
    }

    // 4. Database Connection Strings (postgres://, mysql://, mongodb+srv://)
    const dbRegex = /(?:postgres|postgresql|mysql|mongodb\+srv|redis):\/\/[a-zA-Z0-9_-]+:[^@\s]+@[a-zA-Z0-9.-]+(?::[0-9]+)?\/[a-zA-Z0-9_.-]+/g;
    while ((match = dbRegex.exec(inputText)) !== null) {
      const real = match[0];
      if (!detected.some(d => d.realValue === real)) {
        const mock = `postgres://mock_user:REDACTED_PASSWORD@localhost:5432/mock_db_${counter++}`;
        detected.push({
          id: `db-${detected.length}`,
          type: 'Database Connection String',
          realValue: real,
          mockToken: mock,
          category: 'database'
        });
      }
    }

    // 5. JWT Tokens
    const jwtRegex = /eyJ[a-zA-Z0-9_-]+\.eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g;
    while ((match = jwtRegex.exec(inputText)) !== null) {
      const real = match[0];
      if (!detected.some(d => d.realValue === real)) {
        const mock = `eyJ_MOCK_JWT_TOKEN_${counter++}`;
        detected.push({
          id: `jwt-${detected.length}`,
          type: 'JWT Auth Bearer Token',
          realValue: real,
          mockToken: mock,
          category: 'jwt'
        });
      }
    }

    // 6. Emails
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    while ((match = emailRegex.exec(inputText)) !== null) {
      const real = match[0];
      if (!detected.some(d => d.realValue === real)) {
        const mock = `developer_mock_${counter++}@example.com`;
        detected.push({
          id: `email-${detected.length}`,
          type: 'PII Email Address',
          realValue: real,
          mockToken: mock,
          category: 'pii'
        });
      }
    }

    // Replace real values with mocks in result
    detected.forEach(item => {
      result = result.split(item.realValue).join(item.mockToken);
    });

    return { sanitizedText: result, mappings: detected };
  }, [inputText]);

  // Rehydrate Function
  const handleRehydrate = () => {
    if (!aiResponseInput.trim()) return;
    let restored = aiResponseInput;
    mappings.forEach(item => {
      restored = restored.split(item.mockToken).join(item.realValue);
    });
    setRehydratedOutput(restored);
  };

  const toggleReveal = (id: string) => {
    setRevealedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Header */}
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
              <KeyRound className="w-5 h-5 text-amber-400" />
              <h1 className="text-xl sm:text-2xl font-serif font-bold tracking-tight">
                Secret Detonator &amp; Rehydrator
              </h1>
            </div>
            <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
              Strip API keys, JWTs, and PII before prompting LLMs, then rehydrate real secrets locally when the AI replies.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className={`px-3 py-1 rounded-full border text-[11px] font-mono flex items-center gap-1.5 ${
            isLight ? 'bg-[#0A2540] text-white border-[#0A2540]' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
          }`}>
            <Lock className="w-3.5 h-3.5" />
            <span>Two-Way Client RAM • Zero Storage</span>
          </div>
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2">
        <div className="flex items-center gap-2 text-xs font-mono">
          <button
            onClick={() => setActiveTab('detonate')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'detonate'
                ? isLight ? 'bg-[#0A2540] text-white font-semibold' : 'bg-white text-black font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <span>1. Detonate &amp; Mask Secrets</span>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-400/20 text-amber-400 text-[10px]">
              {mappings.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('rehydrate')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'rehydrate'
                ? isLight ? 'bg-[#0A2540] text-white font-semibold' : 'bg-white text-black font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>2. Rehydrate AI Response</span>
          </button>
        </div>

        {activeTab === 'detonate' && (
          <div className="flex items-center gap-1.5 text-xs font-mono">
            {PRESET_SNIPPETS.map(p => (
              <button
                key={p.id}
                onClick={() => setInputText(p.text)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300'
                }`}
              >
                {p.name.split(' (')[0]}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* TAB 1: DETONATOR (INPUT -> SANITIZED MOCK OUTPUT) */}
      {activeTab === 'detonate' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Raw Input Box */}
            <div className="lg:col-span-6 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-400 flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5" />
                  Raw Sensitive Code or Prompt
                </span>
                <span className="text-[11px] text-rose-400">
                  {mappings.length} live secrets detected
                </span>
              </div>

              <div className={`rounded-xl border overflow-hidden font-mono text-xs ${
                isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-neutral-950 border-neutral-800 text-neutral-200'
              }`}>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  rows={14}
                  className="w-full p-4 bg-transparent resize-none focus:outline-hidden leading-relaxed font-mono"
                  spellCheck={false}
                  placeholder="Paste sensitive code, .env files, database strings, or OpenAI keys here..."
                />
              </div>
            </div>

            {/* Sanitized Output Box */}
            <div className="lg:col-span-6 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Sanitized Safe Prompt (Safe for ChatGPT / Claude)
                </span>
                <button
                  onClick={() => handleCopy(sanitizedText, 'safe_prompt')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded transition-all ${
                    isLight 
                      ? 'bg-[#0A2540] text-white hover:bg-[#071829]' 
                      : 'bg-emerald-500 text-black hover:bg-emerald-400'
                  }`}
                >
                  {copiedType === 'safe_prompt' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedType === 'safe_prompt' ? 'Copied' : 'Copy Safe Prompt'}</span>
                </button>
              </div>

              <div className={`rounded-xl border overflow-hidden font-mono text-xs ${
                isLight ? 'bg-white border-[#0A2540]/30 text-slate-900 shadow-sm' : 'bg-neutral-900/60 border-neutral-800 text-emerald-300'
              }`}>
                <textarea
                  readOnly
                  value={sanitizedText}
                  rows={14}
                  className="w-full p-4 bg-transparent resize-none focus:outline-hidden leading-relaxed font-mono select-all"
                  spellCheck={false}
                />
              </div>
            </div>

          </div>

          {/* Interactive Secrets Detonation Inventory */}
          <div className={`p-5 rounded-2xl border space-y-4 ${
            isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-neutral-950 border-neutral-800'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
                  Client-Side Detonation Vault ({mappings.length} items)
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  These real secrets are mapped to deterministic mock tokens strictly in your browser RAM.
                </p>
              </div>
            </div>

            {mappings.length === 0 ? (
              <p className="text-xs font-mono text-neutral-500 py-4 text-center">
                No high-entropy secrets or PII detected in the input above.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-mono text-left">
                  <thead>
                    <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400">
                      <th className="py-2 px-3">Secret Type</th>
                      <th className="py-2 px-3">Real Secret (Confidential)</th>
                      <th className="py-2 px-3">Mock Replacement Token</th>
                      <th className="py-2 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-900">
                    {mappings.map(item => {
                      const isRevealed = revealedIds.has(item.id);
                      return (
                        <tr key={item.id} className="hover:bg-black/5 dark:hover:bg-white/5">
                          <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                            {item.type}
                          </td>
                          <td className="py-2.5 px-3 text-neutral-400">
                            <div className="flex items-center gap-2">
                              <span>
                                {isRevealed ? item.realValue : `${item.realValue.slice(0, 6)}••••••••••••`}
                              </span>
                              <button
                                onClick={() => toggleReveal(item.id)}
                                className="text-neutral-500 hover:text-white"
                              >
                                {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-emerald-400 font-semibold">
                            {item.mockToken}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              Detonated in RAM
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: REHYDRATOR (LLM RESPONSE -> REAL SECRETS RESTORED) */}
      {activeTab === 'rehydrate' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-blue-500/5 text-xs font-mono flex items-center justify-between">
            <div>
              <span className="font-bold text-cyan-400">HOW IT WORKS: </span>
              Paste the code response you received back from ChatGPT or Claude (containing mock tokens like <code>sk-proj-MOCK_KEY_1</code>). Vayun will swap your original secrets back in place without ever letting the AI see them.
            </div>
            <span className="text-[11px] text-neutral-400 whitespace-nowrap">
              {mappings.length} mapping rules active
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* AI Response Input */}
            <div className="lg:col-span-6 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-400">
                  Paste AI Response (with mock tokens)
                </span>
                <button
                  onClick={() => {
                    setAiResponseInput(`// Refactored by Claude/ChatGPT\nconst stripe = new Stripe("${mappings[0]?.mockToken || 'sk-proj-MOCK_KEY_1'}", {\n  apiVersion: '2023-10-16'\n});\nconsole.log("Ready to charge customer");`);
                  }}
                  className="text-cyan-400 hover:underline"
                >
                  Load Mock Example
                </button>
              </div>

              <div className={`rounded-xl border overflow-hidden font-mono text-xs ${
                isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-neutral-950 border-neutral-800 text-neutral-200'
              }`}>
                <textarea
                  value={aiResponseInput}
                  onChange={(e) => setAiResponseInput(e.target.value)}
                  rows={14}
                  className="w-full p-4 bg-transparent resize-none focus:outline-hidden leading-relaxed font-mono"
                  placeholder="Paste the code response from your AI model here..."
                />
              </div>

              <button
                onClick={handleRehydrate}
                className={`w-full py-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  isLight 
                    ? 'bg-[#0A2540] text-white hover:bg-[#071829] shadow-md' 
                    : 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-md shadow-emerald-500/10'
                }`}
              >
                <ArrowLeftRight className="w-4 h-4" />
                <span>Rehydrate Real Secrets</span>
              </button>
            </div>

            {/* Rehydrated Production Output */}
            <div className="lg:col-span-6 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-400 font-semibold">
                  De-Anonymized Ready-to-Deploy Code
                </span>
                {rehydratedOutput && (
                  <button
                    onClick={() => handleCopy(rehydratedOutput, 'rehydrated')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded transition-all ${
                      isLight ? 'bg-[#0A2540] text-white' : 'bg-white text-black'
                    }`}
                  >
                    {copiedType === 'rehydrated' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedType === 'rehydrated' ? 'Copied' : 'Copy Rehydrated Code'}</span>
                  </button>
                )}
              </div>

              <div className={`rounded-xl border overflow-hidden font-mono text-xs ${
                isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-neutral-950 border-neutral-800 text-neutral-200'
              }`}>
                <textarea
                  readOnly
                  value={rehydratedOutput || '// Click "Rehydrate Real Secrets" to restore original keys and credentials.'}
                  rows={14}
                  className="w-full p-4 bg-transparent resize-none focus:outline-hidden leading-relaxed font-mono select-all"
                />
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
