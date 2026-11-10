import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  Plus, 
  Trash2
} from 'lucide-react';
import { maskSecrets, rehydrateSecrets } from '../../utils/secretMaskerEngine';
import { SecretMaskResult } from '../../types';

interface PromptSanitizerViewProps {
  onBack: () => void;
  theme?: 'dark' | 'light';
}

const SAMPLE_PROMPT_WITH_SECRETS = `Please debug the webhook handler. 
Customer contact is sarah.jenkins@acmecorp.com on host 198.51.100.42.
Authorization token: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozGz6eP
API key: sk-ant-api03-abcdef12345678901234567890123456
AWS key: AKIAIOSFODNN7EXAMPLE`;

export const PromptSanitizerView: React.FC<PromptSanitizerViewProps> = ({ onBack, theme = 'dark' }) => {
  const [activeTab, setActiveTab] = useState<'mask' | 'rehydrate'>('mask');
  const [inputPrompt, setInputPrompt] = useState('');
  const [customEntities, setCustomEntities] = useState<string[]>(['Acme Corp', 'Sarah Jenkins']);
  const [newEntity, setNewEntity] = useState('');
  const [maskResult, setMaskResult] = useState<SecretMaskResult | null>(null);
  
  const [aiResponseInput, setAiResponseInput] = useState('');
  const [rehydratedOutput, setRehydratedOutput] = useState('');
  const [copiedMasked, setCopiedMasked] = useState(false);
  const [copiedRehydrated, setCopiedRehydrated] = useState(false);
  const isLight = theme === 'light';

  const handleMask = (text = inputPrompt, entities = customEntities) => {
    if (!text.trim()) return;
    const result = maskSecrets(text, entities);
    setMaskResult(result);
  };

  const handleLoadSample = () => {
    setInputPrompt(SAMPLE_PROMPT_WITH_SECRETS);
    handleMask(SAMPLE_PROMPT_WITH_SECRETS, customEntities);
  };

  const handleAddCustomEntity = () => {
    if (!newEntity.trim() || customEntities.includes(newEntity.trim())) return;
    const updated = [...customEntities, newEntity.trim()];
    setCustomEntities(updated);
    setNewEntity('');
    handleMask(inputPrompt, updated);
  };

  const handleRemoveCustomEntity = (item: string) => {
    const updated = customEntities.filter(e => e !== item);
    setCustomEntities(updated);
    handleMask(inputPrompt, updated);
  };

  const handleRehydrate = () => {
    if (!aiResponseInput || !maskResult) return;
    const restored = rehydrateSecrets(aiResponseInput, maskResult.replacements);
    setRehydratedOutput(restored);
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

        <button
          onClick={handleLoadSample}
          className={`px-2.5 py-1 text-xs border rounded transition-colors ${
            isLight ? 'text-neutral-700 bg-neutral-100 hover:bg-neutral-200 border-neutral-300' : 'text-neutral-300 bg-neutral-900 hover:bg-neutral-800 border-neutral-800'
          }`}
        >
          Load sample credentials
        </button>
      </div>

      <div className={`space-y-1.5 pb-4 border-b ${isLight ? 'border-neutral-200' : 'border-neutral-900'}`}>
        <h1 className={`text-2xl font-serif tracking-tight ${isLight ? 'text-black' : 'text-white'}`}>
          Secret Masker
        </h1>
        <p className={`text-xs max-w-xl leading-relaxed ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
          Protects sensitive credentials by replacing API keys, email addresses, and server IPs with reversible tags before pasting to AI.
        </p>
      </div>

      {/* Tabs */}
      <div className={`flex items-center gap-1 border-b pb-2 text-xs ${isLight ? 'border-neutral-200' : 'border-neutral-900'}`}>
        <button
          onClick={() => setActiveTab('mask')}
          className={`px-3 py-1.5 rounded transition-colors ${
            activeTab === 'mask'
              ? isLight ? 'bg-black text-white font-medium' : 'bg-white text-black font-medium'
              : isLight ? 'text-neutral-500 hover:text-black' : 'text-neutral-400 hover:text-white'
          }`}
        >
          1. Mask Prompt Secrets
        </button>
        <button
          onClick={() => setActiveTab('rehydrate')}
          className={`px-3 py-1.5 rounded transition-colors ${
            activeTab === 'rehydrate'
              ? isLight ? 'bg-black text-white font-medium' : 'bg-white text-black font-medium'
              : isLight ? 'text-neutral-500 hover:text-black' : 'text-neutral-400 hover:text-white'
          }`}
        >
          2. Restore AI Response
        </button>
      </div>

      {activeTab === 'mask' && (
        <div className="space-y-5">
          {/* Custom entities */}
          <div className={`p-3 border rounded flex flex-wrap items-center gap-2 text-xs ${
            isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#0a0a0a] border-neutral-800'
          }`}>
            <span className="font-mono text-[11px] uppercase text-neutral-500 mr-2">Custom Terms:</span>
            {customEntities.map(item => (
              <span key={item} className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-xs ${
                isLight ? 'bg-white text-black border-neutral-300' : 'bg-neutral-900 text-neutral-200 border-neutral-800'
              }`}>
                <span>{item}</span>
                <button onClick={() => handleRemoveCustomEntity(item)} className="hover:text-neutral-400">
                  <Trash2 className="w-3 h-3" />
                </button>
              </span>
            ))}
            <div className="inline-flex items-center gap-1">
              <input
                type="text"
                value={newEntity}
                onChange={e => setNewEntity(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddCustomEntity()}
                placeholder="Add keyword..."
                className={`px-2 py-0.5 border rounded text-xs focus:outline-none ${
                  isLight ? 'bg-white border-neutral-300 text-black placeholder-neutral-400' : 'bg-black border-neutral-800 text-white placeholder-neutral-600'
                }`}
              />
              <button onClick={handleAddCustomEntity} className={`p-1 rounded ${isLight ? 'bg-neutral-200 hover:bg-neutral-300 text-black' : 'bg-neutral-800 hover:bg-neutral-700 text-white'}`}>
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className={`font-mono text-[11px] uppercase tracking-wider ${isLight ? 'text-neutral-500' : 'text-neutral-500'}`}>
                  Input Prompt
                </span>
                {inputPrompt && (
                  <button onClick={() => { setInputPrompt(''); setMaskResult(null); }} className={`transition-colors ${isLight ? 'text-neutral-400 hover:text-black' : 'text-neutral-500 hover:text-white'}`}>
                    Clear
                  </button>
                )}
              </div>
              <textarea
                value={inputPrompt}
                onChange={e => {
                  setInputPrompt(e.target.value);
                  handleMask(e.target.value, customEntities);
                }}
                placeholder="Paste prompt with API keys, tokens, or emails..."
                rows={16}
                className={`w-full p-3.5 border rounded text-xs font-mono transition-colors resize-y leading-relaxed focus:outline-none ${
                  isLight ? 'bg-neutral-50 border-neutral-200 text-black placeholder-neutral-400 focus:border-black' : 'bg-[#0a0a0a] border-neutral-800 text-neutral-100 placeholder-neutral-600 focus:border-neutral-500'
                }`}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className={`font-mono text-[11px] uppercase tracking-wider ${isLight ? 'text-neutral-500' : 'text-neutral-500'}`}>
                  Masked Prompt
                </span>
                {maskResult && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(maskResult.maskedText);
                      setCopiedMasked(true);
                      setTimeout(() => setCopiedMasked(false), 2000);
                    }}
                    className={`px-2 py-0.5 rounded border text-xs transition-colors ${
                      isLight ? 'bg-neutral-100 hover:bg-neutral-200 text-black border-neutral-300' : 'bg-neutral-900 hover:bg-neutral-800 text-white border-neutral-800'
                    }`}
                  >
                    {copiedMasked ? 'Copied' : 'Copy'}
                  </button>
                )}
              </div>
              <textarea
                readOnly
                value={maskResult?.maskedText || ''}
                placeholder="Sanitized prompt will appear here..."
                rows={16}
                className={`w-full p-3.5 border rounded text-xs font-mono resize-y leading-relaxed focus:outline-none ${
                  isLight ? 'bg-neutral-50 border-neutral-200 text-neutral-800' : 'bg-[#070707] border-neutral-900 text-neutral-300'
                }`}
              />
            </div>
          </div>

          {maskResult && maskResult.replacements.length > 0 && (
            <div className={`border rounded p-3 text-xs space-y-2 ${
              isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#0a0a0a] border-neutral-800'
            }`}>
              <span className={`font-mono text-[11px] uppercase ${isLight ? 'text-neutral-500' : 'text-neutral-500'}`}>
                Detected Credentials ({maskResult.replacements.length})
              </span>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left font-mono text-xs">
                  <thead>
                    <tr className={`border-b text-[11px] ${isLight ? 'border-neutral-200 text-neutral-500' : 'border-neutral-800 text-neutral-500'}`}>
                      <th className="py-1 px-2">Placeholder</th>
                      <th className="py-1 px-2">Type</th>
                      <th className="py-1 px-2">Original</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isLight ? 'divide-neutral-200' : 'divide-neutral-900'}`}>
                    {maskResult.replacements.map((r, i) => (
                      <tr key={i}>
                        <td className={`py-1 px-2 font-semibold ${isLight ? 'text-black' : 'text-white'}`}>{r.placeholder}</td>
                        <td className="py-1 px-2 text-neutral-500 uppercase text-[10px]">{r.type}</td>
                        <td className={`py-1 px-2 truncate max-w-xs ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>{r.original}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'rehydrate' && (
        <div className="space-y-4">
          <p className={`text-xs ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
            Paste the response received from the language model below to replace placeholders with their original credentials in memory.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <span className={`font-mono text-[11px] uppercase tracking-wider block ${isLight ? 'text-neutral-500' : 'text-neutral-500'}`}>
                Model Response
              </span>
              <textarea
                value={aiResponseInput}
                onChange={e => setAiResponseInput(e.target.value)}
                placeholder="Paste response containing {{API_KEY_1}}..."
                rows={16}
                className={`w-full p-3.5 border rounded text-xs font-mono resize-y leading-relaxed focus:outline-none ${
                  isLight ? 'bg-neutral-50 border-neutral-200 text-black placeholder-neutral-400 focus:border-black' : 'bg-[#0a0a0a] border-neutral-800 text-neutral-100 placeholder-neutral-600 focus:border-neutral-500'
                }`}
              />
              <button
                onClick={handleRehydrate}
                disabled={!aiResponseInput.trim() || !maskResult}
                className={`w-full py-2 disabled:opacity-40 font-medium text-xs rounded transition-colors ${
                  isLight ? 'bg-black hover:bg-neutral-800 text-white' : 'bg-white hover:bg-neutral-200 text-black'
                }`}
              >
                Restore Original Credentials
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className={`font-mono text-[11px] uppercase tracking-wider ${isLight ? 'text-neutral-500' : 'text-neutral-500'}`}>
                  Restored Response
                </span>
                {rehydratedOutput && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(rehydratedOutput);
                      setCopiedRehydrated(true);
                      setTimeout(() => setCopiedRehydrated(false), 2000);
                    }}
                    className={`px-2 py-0.5 rounded border text-xs transition-colors ${
                      isLight ? 'bg-neutral-100 hover:bg-neutral-200 text-black border-neutral-300' : 'bg-neutral-900 hover:bg-neutral-800 text-white border-neutral-800'
                    }`}
                  >
                    {copiedRehydrated ? 'Copied' : 'Copy'}
                  </button>
                )}
              </div>
              <textarea
                readOnly
                value={rehydratedOutput}
                placeholder="Restored text will render here..."
                rows={16}
                className={`w-full p-3.5 border rounded text-xs font-mono resize-y leading-relaxed focus:outline-none ${
                  isLight ? 'bg-neutral-50 border-neutral-200 text-neutral-800' : 'bg-[#070707] border-neutral-900 text-neutral-300'
                }`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
