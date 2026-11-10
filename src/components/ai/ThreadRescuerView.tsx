import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  RefreshCw
} from 'lucide-react';
import { parseChatContinuity } from '../../utils/threadRescuerEngine';
import { ContinuityCapsule } from '../../types';
import { formatTokenCount } from '../../utils/tokenEstimator';

interface ThreadRescuerViewProps {
  onBack: () => void;
  onRecordTokensSaved: (tokens: number) => void;
  theme?: 'dark' | 'light';
}

const SAMPLE_CHAT = `Human: I want to build a real-time analytics dashboard for our application using React, TypeScript, and Tailwind CSS. We will connect to PostgreSQL via Supabase.

Assistant: Here is an initial schema for event logs:

\`\`\`prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model EventLog {
  id        String   @id @default(uuid())
  eventName String
  userId    String
  createdAt DateTime @default(now())
}
\`\`\`

Human: Great. Now I need a subscription hook to listen to new incoming events.

Assistant: Here is the client hook:

\`\`\`typescript
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

export function useRealtimeEvents() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const channel = supabase
      .channel('events')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'EventLog' }, (payload) => {
        setEvents((prev) => [payload.new, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { events };
}
\`\`\`

Human: The hook works. Next step: implement date-range filtering (24h, 7d, 30d) and an export button to download events as CSV.`;

export const ThreadRescuerView: React.FC<ThreadRescuerViewProps> = ({
  onBack,
  onRecordTokensSaved,
  theme = 'dark'
}) => {
  const [inputText, setInputText] = useState('');
  const [capsule, setCapsule] = useState<ContinuityCapsule | null>(null);
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const isLight = theme === 'light';

  const handleRescue = (textToProcess?: string) => {
    const text = textToProcess || inputText;
    if (!text.trim()) return;

    setIsProcessing(true);
    setTimeout(() => {
      const result = parseChatContinuity(text);
      setCapsule(result);
      onRecordTokensSaved(result.metrics.savedTokens);
      setIsProcessing(false);
    }, 150);
  };

  const handleLoadSample = () => {
    setInputText(SAMPLE_CHAT);
    handleRescue(SAMPLE_CHAT);
  };

  const handleCopyCapsule = () => {
    if (!capsule) return;
    navigator.clipboard.writeText(capsule.markdownCapsule);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Navigation */}
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

        <button
          onClick={handleLoadSample}
          className={`px-2.5 py-1 text-xs border rounded transition-colors ${
            isLight ? 'text-neutral-700 bg-neutral-100 hover:bg-neutral-200 border-neutral-300' : 'text-neutral-300 bg-neutral-900 hover:bg-neutral-800 border-neutral-800'
          }`}
        >
          Load sample conversation
        </button>
      </div>

      {/* Header */}
      <div className={`space-y-1.5 pb-4 border-b ${isLight ? 'border-neutral-200' : 'border-neutral-900'}`}>
        <h1 className={`text-2xl font-serif tracking-tight ${isLight ? 'text-black' : 'text-white'}`}>
          Thread Rescuer
        </h1>
        <p className={`text-xs max-w-xl leading-relaxed ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
          Distills lengthy conversation logs into a concise continuity brief. Keeps established decisions and latest code while stripping dead-ends and conversational fluff.
        </p>
      </div>

      {/* Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className={`font-mono text-[11px] uppercase tracking-wider ${isLight ? 'text-neutral-500' : 'text-neutral-500'}`}>
              Raw Conversation
            </span>
            {inputText && (
              <button
                onClick={() => {
                  setInputText('');
                  setCapsule(null);
                }}
                className={`transition-colors ${isLight ? 'text-neutral-400 hover:text-black' : 'text-neutral-500 hover:text-white'}`}
              >
                Clear
              </button>
            )}
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your conversation text from Claude, ChatGPT, or Cursor here..."
            rows={18}
            className={`w-full p-3.5 border rounded text-xs font-mono transition-colors resize-y leading-relaxed focus:outline-none ${
              isLight 
                ? 'bg-neutral-50 border-neutral-200 text-black placeholder-neutral-400 focus:border-black' 
                : 'bg-[#0a0a0a] border-neutral-800 text-neutral-100 placeholder-neutral-600 focus:border-neutral-500'
            }`}
          />

          <button
            onClick={() => handleRescue()}
            disabled={!inputText.trim() || isProcessing}
            className={`w-full py-2.5 disabled:opacity-40 font-medium text-xs rounded transition-colors flex items-center justify-center gap-2 ${
              isLight ? 'bg-black hover:bg-neutral-800 text-white' : 'bg-white hover:bg-neutral-200 text-black'
            }`}
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Processing brief...</span>
              </>
            ) : (
              <span>Generate Continuity Brief</span>
            )}
          </button>
        </div>

        {/* Output */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className={`font-mono text-[11px] uppercase tracking-wider ${isLight ? 'text-neutral-500' : 'text-neutral-500'}`}>
              Distilled Continuity Brief
            </span>
            {capsule && (
              <button
                onClick={handleCopyCapsule}
                className={`flex items-center gap-1 px-2.5 py-1 rounded border text-xs transition-colors ${
                  isLight ? 'bg-neutral-100 hover:bg-neutral-200 text-black border-neutral-300' : 'bg-neutral-900 hover:bg-neutral-800 text-white border-neutral-800'
                }`}
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            )}
          </div>

          {capsule ? (
            <div className="space-y-4">
              <div className={`p-3 border rounded flex items-center justify-between text-xs font-mono ${
                isLight ? 'bg-neutral-50 border-neutral-200 text-neutral-700' : 'bg-[#0a0a0a] border-neutral-800 text-neutral-300'
              }`}>
                <div className="flex items-center gap-3">
                  <span className={isLight ? 'text-neutral-500' : 'text-neutral-400'}>
                    Input: {formatTokenCount(capsule.metrics.rawTokens)}
                  </span>
                  <span>→</span>
                  <span className={`font-semibold ${isLight ? 'text-black' : 'text-white'}`}>
                    Brief: {formatTokenCount(capsule.metrics.capsuleTokens)} tokens
                  </span>
                </div>
                <div>
                  {capsule.metrics.savedPercent}% reduction
                </div>
              </div>

              {/* Brief Sections */}
              <div className={`border rounded p-4 space-y-4 max-h-[460px] overflow-y-auto text-xs ${
                isLight ? 'bg-white border-neutral-200' : 'bg-[#0a0a0a] border-neutral-800'
              }`}>
                <div className="space-y-1">
                  <span className={`font-mono text-[11px] uppercase tracking-wider block ${
                    isLight ? 'text-neutral-500' : 'text-neutral-500'
                  }`}>
                    Objective
                  </span>
                  <p className={`leading-relaxed p-2.5 rounded border ${
                    isLight ? 'bg-neutral-50 border-neutral-200 text-black' : 'bg-black border-neutral-900 text-neutral-200'
                  }`}>
                    {capsule.goal}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className={`font-mono text-[11px] uppercase tracking-wider block ${
                    isLight ? 'text-neutral-500' : 'text-neutral-500'
                  }`}>
                    Tech Stack Decisions
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {capsule.techStack.map(t => (
                      <span key={t} className={`px-2 py-0.5 rounded font-mono text-[11px] border ${
                        isLight ? 'bg-neutral-100 border-neutral-200 text-black' : 'bg-neutral-900 border-neutral-800 text-neutral-300'
                      }`}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className={`font-mono text-[11px] uppercase tracking-wider block ${
                    isLight ? 'text-neutral-500' : 'text-neutral-500'
                  }`}>
                    Latest Working Code
                  </span>
                  <div className="space-y-2">
                    {capsule.keySnippets.map((s, idx) => (
                      <div key={idx} className={`rounded border overflow-hidden ${
                        isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-black border-neutral-900'
                      }`}>
                        {s.filename && (
                          <div className={`px-2.5 py-1 font-mono text-[11px] border-b ${
                            isLight ? 'bg-neutral-100 border-neutral-200 text-neutral-600' : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                          }`}>
                            {s.filename}
                          </div>
                        )}
                        <pre className={`p-2.5 text-[11px] font-mono overflow-x-auto max-h-32 ${
                          isLight ? 'text-neutral-800' : 'text-neutral-300'
                        }`}>
                          <code>{s.code.substring(0, 300)}{s.code.length > 300 ? '...' : ''}</code>
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className={`font-mono text-[11px] uppercase tracking-wider block ${
                    isLight ? 'text-neutral-500' : 'text-neutral-500'
                  }`}>
                    Next Action Item
                  </span>
                  <div className={`p-2.5 rounded border space-y-1.5 ${
                    isLight ? 'bg-neutral-50 border-neutral-200 text-black' : 'bg-black border-neutral-900 text-neutral-200'
                  }`}>
                    <p className="font-medium">{capsule.currentTask}</p>
                    <ul className={`list-disc list-inside text-[11px] space-y-0.5 ${
                      isLight ? 'text-neutral-600' : 'text-neutral-400'
                    }`}>
                      {capsule.nextSteps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={`h-[460px] border border-dashed rounded flex flex-col items-center justify-center p-6 text-center text-xs ${
              isLight ? 'border-neutral-200 text-neutral-400' : 'border-neutral-900 text-neutral-600'
            }`}>
              <p>Paste a conversation on the left to extract a structured brief.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
