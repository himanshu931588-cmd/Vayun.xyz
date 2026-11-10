import React, { useState, useEffect } from 'react';
import { 
  Key, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  ShieldCheck, 
  Cpu, 
  Trash2,
  Sparkles,
  Zap
} from 'lucide-react';
import { 
  getStoredApiKey, 
  saveStoredApiKey, 
  getStoredModel, 
  saveStoredModel, 
  testGeminiApiKey,
  GeminiModelId 
} from '../../utils/geminiApi';

interface ApiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApiKeyUpdated?: (hasKey: boolean) => void;
  theme?: 'dark' | 'light';
}

export const ApiSettingsModal: React.FC<ApiSettingsModalProps> = ({
  isOpen,
  onClose,
  onApiKeyUpdated,
  theme = 'dark'
}) => {
  const isLight = theme === 'light';

  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState<GeminiModelId>('gemini-1.5-flash');
  const [testing, setTesting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ success: boolean; text: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setApiKey(getStoredApiKey());
      setModel(getStoredModel());
      setStatusMessage(null);
    }
  }, [isOpen]);

  const handleTestAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      setStatusMessage({ success: false, text: 'Please enter a Gemini API key or click "Use Offline Mode".' });
      return;
    }

    setTesting(true);
    setStatusMessage(null);

    const result = await testGeminiApiKey(apiKey.trim(), model);
    setTesting(false);

    if (result.success) {
      saveStoredApiKey(apiKey.trim());
      saveStoredModel(model);
      setStatusMessage({ success: true, text: result.message });
      onApiKeyUpdated?.(true);
      setTimeout(() => {
        onClose();
      }, 1400);
    } else {
      setStatusMessage({ success: false, text: result.message });
    }
  };

  const handleClearKey = () => {
    saveStoredApiKey('');
    setApiKey('');
    setStatusMessage({ success: true, text: 'API key removed. Running in 100% offline Socratic simulation mode.' });
    onApiKeyUpdated?.(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className={`relative w-full max-w-lg rounded-xl border shadow-2xl p-6 z-10 transition-all ${
        isLight ? 'bg-white border-neutral-300 text-black' : 'bg-neutral-950 border-neutral-800 text-white'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-md border ${
              isLight ? 'border-neutral-200 bg-neutral-100' : 'border-neutral-800 bg-neutral-900'
            }`}>
              <Key className="w-4 h-4 text-emerald-500" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold tracking-tight">
                AI Engine & API Configuration
              </h3>
              <p className={`text-xs ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
                Connect Google Gemini API for live Socratic viva defense & code AST analysis
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className={`p-1.5 rounded transition-colors ${
              isLight ? 'text-neutral-400 hover:text-black hover:bg-neutral-100' : 'text-neutral-500 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleTestAndSave} className="space-y-4 pt-4">
          {/* Key Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <label className="font-medium">Google Gemini API Key</label>
              <a 
                href="https://aistudio.google.com/apikey" 
                target="_blank" 
                rel="noreferrer"
                className="text-[11px] text-emerald-500 hover:underline flex items-center gap-1"
              >
                <span>Get Free Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <input
              type="password"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className={`w-full p-2.5 text-xs rounded-md border font-mono focus:outline-hidden transition-colors ${
                isLight 
                  ? 'bg-neutral-50 border-neutral-300 text-black focus:border-black' 
                  : 'bg-neutral-900 border-neutral-700 text-white focus:border-white'
              }`}
            />
          </div>

          {/* Model Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium block">
              Active Gemini Model (Instant Inference)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'gemini-2.0-flash', label: '2.0 Flash', tag: 'Fastest (Default)' },
                { id: 'gemini-2.0-flash-lite', label: '2.0 Flash Lite', tag: 'Instant Speed' },
                { id: 'gemini-1.5-flash', label: '1.5 Flash', tag: 'Reliable & Free' },
                { id: 'gemini-1.5-flash-8b', label: '1.5 Flash-8B', tag: 'Low Latency' },
                { id: 'gemini-1.5-pro', label: '1.5 Pro', tag: 'Deep Reasoning' }
              ].map(m => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => setModel(m.id as GeminiModelId)}
                  className={`p-2.5 rounded-md border text-left font-mono transition-all ${
                    model === m.id
                      ? isLight ? 'border-black bg-neutral-100 shadow-xs' : 'border-white bg-neutral-900 shadow-xs'
                      : isLight ? 'border-neutral-200 hover:border-neutral-400' : 'border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="text-xs font-bold">{m.label}</div>
                  <div className="text-[10px] text-neutral-500">{m.tag}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div className={`p-3 rounded-md text-xs font-mono border flex items-start gap-2 ${
              statusMessage.success
                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                : 'bg-red-500/10 text-red-500 border-red-500/20'
            }`}>
              {statusMessage.success ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              )}
              <div className="leading-relaxed">{statusMessage.text}</div>
            </div>
          )}

          {/* Privacy & Zero-Knowledge Guarantee Note */}
          <div className={`p-3 rounded-md text-[11px] font-mono border space-y-1 ${
            isLight ? 'bg-neutral-50 border-neutral-200 text-neutral-600' : 'bg-neutral-900/60 border-neutral-800 text-neutral-400'
          }`}>
            <div className="flex items-center gap-1.5 font-semibold text-black dark:text-white">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Zero-Backend RAM Guarantee</span>
            </div>
            <p>
              Your API key is stored locally in your browser's private storage (`localStorage`). Requests go directly from your device to Google AI APIs without any intermediary server.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            {getStoredApiKey() ? (
              <button
                type="button"
                onClick={handleClearKey}
                className="text-xs font-mono text-red-500 hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Remove Key (Offline Mode)</span>
              </button>
            ) : (
              <div className="text-[11px] font-mono text-neutral-500">
                Running in built-in offline simulation mode
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className={`px-3 py-1.5 rounded text-xs font-mono border ${
                  isLight ? 'border-neutral-200 hover:bg-neutral-100' : 'border-neutral-800 hover:bg-neutral-900'
                }`}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={testing}
                className={`px-4 py-1.5 rounded text-xs font-mono font-medium flex items-center gap-1.5 transition-colors ${
                  isLight ? 'bg-black text-white hover:bg-neutral-800' : 'bg-white text-black hover:bg-neutral-200'
                }`}
              >
                <Zap className="w-3 h-3 fill-current" />
                <span>{testing ? 'Testing Key...' : 'Test & Save'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
