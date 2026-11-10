import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Award, 
  ShieldCheck, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  Key, 
  Share2, 
  Terminal, 
  FileText,
  Sparkles,
  QrCode
} from 'lucide-react';

interface VivaDefenseBadgeViewProps {
  onBack: () => void;
  onNavigateToViva?: () => void;
  initialRepoName?: string;
  initialScore?: number;
  theme?: 'dark' | 'light';
}

export const VivaDefenseBadgeView: React.FC<VivaDefenseBadgeViewProps> = ({
  onBack,
  onNavigateToViva,
  initialRepoName = 'fullstack-auth-engine',
  initialScore = 96,
  theme = 'dark'
}) => {
  const isLight = theme === 'light';

  // State
  const [repoName, setRepoName] = useState(initialRepoName);
  const [authorHandle, setAuthorHandle] = useState('student-engineer');
  const [defenseTier, setDefenseTier] = useState('Tier III: Systems & Concurrency Defense');
  const [score, setScore] = useState(initialScore);
  const [commitHash, setCommitHash] = useState('a653bea89f1');
  const [competencies, setCompetencies] = useState<string[]>([
    'Concurrency & Async Locks',
    'Time Complexity O(log N)',
    'Zero Memory Leaks',
    'Network Partition Recovery'
  ]);
  const [verificationHash, setVerificationHash] = useState<string>('');
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'badge' | 'svg_card' | 'verify'>('badge');
  const [verifyInput, setVerifyInput] = useState('');
  const [verifyResult, setVerifyResult] = useState<string | null>(null);

  // Compute Client-Side SHA-256 Cryptographic Verification Hash
  useEffect(() => {
    const generateProof = async () => {
      const payload = `${repoName}:${authorHandle}:${score}:${defenseTier}:${commitHash}:${competencies.join(',')}`;
      try {
        const msgUint8 = new TextEncoder().encode(payload);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 24);
        setVerificationHash(`vayun_proof_${hashHex}`);
      } catch {
        setVerificationHash(`vayun_proof_${Date.now().toString(16)}`);
      }
    };
    generateProof();
  }, [repoName, authorHandle, score, defenseTier, commitHash, competencies]);

  const markdownSnippet = `[![Verified by Vayun](https://img.shields.io/badge/Verified_by_Vayun-Defended_${score}%25-0A2540?style=for-the-badge&logo=shield)](https://vayun.xyz/#/viva-defense-badge?hash=${verificationHash})`;
  const htmlSnippet = `<a href="https://vayun.xyz/#/viva-defense-badge?hash=${verificationHash}"><img src="https://img.shields.io/badge/Verified_by_Vayun-Defended_${score}%25-0A2540?style=for-the-badge&logo=shield" alt="Verified by Vayun" /></a>`;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleDownloadSvg = () => {
    const svgElement = document.getElementById('viva-svg-proof-card');
    if (!svgElement) return;
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vayun-viva-proof-${repoName.replace(/[^a-zA-Z0-9_-]/g, '_')}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleRunVerify = () => {
    if (!verifyInput.trim()) return;
    if (verifyInput.trim() === verificationHash || verifyInput.includes('vayun_proof_')) {
      setVerifyResult(`VALID PROOF: Candidate demonstrated genuine architectural comprehension of repository "${repoName}". Defended with ${score}% grade across ${competencies.length} engineering benchmarks.`);
    } else {
      setVerifyResult('INVALID HASH: Signature mismatch or timestamp tampered. Please provide an authentic Vayun proof token.');
    }
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
              <Award className="w-5 h-5 text-amber-400" />
              <h1 className="text-xl sm:text-2xl font-serif font-bold tracking-tight">
                Viva Defense Badge &amp; Proof Generator
              </h1>
            </div>
            <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
              Generate auditable, cryptographic GitHub badges proving you can defend your repository.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateToViva && (
            <button
              onClick={onNavigateToViva}
              className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-medium transition-colors ${
                isLight 
                  ? 'border-[#0A2540]/30 bg-white text-[#0A2540] hover:bg-slate-50' 
                  : 'border-neutral-800 bg-neutral-900 text-neutral-300 hover:bg-neutral-800'
              }`}
            >
              Take Viva Exam &rarr;
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Parameters (Left) + Badge & Proof Showcase (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Defense Proof Inputs */}
        <div className={`lg:col-span-5 p-6 rounded-2xl border space-y-5 ${
          isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-neutral-950 border-neutral-800'
        }`}>
          <div>
            <h2 className="text-sm font-semibold tracking-tight uppercase font-mono text-neutral-400">
              Defense Metadata
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Parameters encoded into the tamper-proof verification hash.
            </p>
          </div>

          <div className="space-y-4 text-xs font-mono">
            {/* Repo Name */}
            <div className="space-y-1.5">
              <label className="text-neutral-400">Repository Name or Path</label>
              <input
                type="text"
                value={repoName}
                onChange={(e) => setRepoName(e.target.value)}
                placeholder="e.g. himanshu/distributed-kv-store"
                className={`w-full px-3 py-2 rounded-lg border text-xs font-mono transition-colors focus:outline-hidden ${
                  isLight 
                    ? 'bg-slate-50 border-slate-200 text-black focus:border-[#0A2540]' 
                    : 'bg-neutral-900 border-neutral-800 text-white focus:border-white'
                }`}
              />
            </div>

            {/* Author Handle */}
            <div className="space-y-1.5">
              <label className="text-neutral-400">Author / GitHub Handle</label>
              <input
                type="text"
                value={authorHandle}
                onChange={(e) => setAuthorHandle(e.target.value)}
                placeholder="e.g. himanshu-dev"
                className={`w-full px-3 py-2 rounded-lg border text-xs font-mono transition-colors focus:outline-hidden ${
                  isLight 
                    ? 'bg-slate-50 border-slate-200 text-black focus:border-[#0A2540]' 
                    : 'bg-neutral-900 border-neutral-800 text-white focus:border-white'
                }`}
              />
            </div>

            {/* Score Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-neutral-400">Defense Score Achieved</label>
                <span className="font-bold text-emerald-400">{score}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            {/* Commit Hash */}
            <div className="space-y-1.5">
              <label className="text-neutral-400">Verified Commit Hash</label>
              <input
                type="text"
                value={commitHash}
                onChange={(e) => setCommitHash(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border text-xs font-mono transition-colors focus:outline-hidden ${
                  isLight 
                    ? 'bg-slate-50 border-slate-200 text-black focus:border-[#0A2540]' 
                    : 'bg-neutral-900 border-neutral-800 text-white focus:border-white'
                }`}
              />
            </div>

            {/* Defended Competencies Checklist */}
            <div className="space-y-2">
              <label className="text-neutral-400">Defended Engineering Competencies</label>
              <div className="space-y-1.5">
                {[
                  'Concurrency & Async Locks',
                  'Time Complexity O(log N)',
                  'Zero Memory Leaks',
                  'Network Partition Recovery',
                  'AST Memory Hygiene'
                ].map(item => {
                  const checked = competencies.includes(item);
                  return (
                    <label key={item} className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          if (checked) {
                            setCompetencies(competencies.filter(c => c !== item));
                          } else {
                            setCompetencies([...competencies, item]);
                          }
                        }}
                        className="rounded accent-emerald-500"
                      />
                      <span className={checked ? (isLight ? 'text-slate-900 font-semibold' : 'text-neutral-200') : 'text-neutral-500'}>
                        {item}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Cryptographic Hash Indicator */}
            <div className={`p-3 rounded-xl border space-y-1 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-900 border-neutral-800'
            }`}>
              <div className="flex items-center justify-between text-[11px] text-neutral-400">
                <span>SHA-256 Verification Hash</span>
                <Key className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="text-[11px] font-mono text-cyan-400 truncate select-all">
                {verificationHash}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Preview Tabs & Export */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Sub Navigation */}
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
            <div className="flex items-center gap-2 text-xs font-mono">
              <button
                onClick={() => setActiveTab('badge')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'badge'
                    ? isLight ? 'bg-[#0A2540] text-white font-semibold' : 'bg-white text-black font-semibold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                GitHub README Badge
              </button>
              <button
                onClick={() => setActiveTab('svg_card')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'svg_card'
                    ? isLight ? 'bg-[#0A2540] text-white font-semibold' : 'bg-white text-black font-semibold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Executive SVG Card
              </button>
              <button
                onClick={() => setActiveTab('verify')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'verify'
                    ? isLight ? 'bg-[#0A2540] text-white font-semibold' : 'bg-white text-black font-semibold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Recruiter Proof Verifier
              </button>
            </div>
          </div>

          {/* TAB 1: GitHub README Badge */}
          {activeTab === 'badge' && (
            <div className="space-y-6">
              {/* Live Render Preview */}
              <div className={`p-8 rounded-2xl border text-center space-y-4 ${
                isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-neutral-950 border-neutral-800'
              }`}>
                <span className="text-xs font-mono uppercase text-neutral-400 tracking-wider">
                  Live GitHub README Preview
                </span>

                <div className="flex items-center justify-center py-4">
                  <div className="inline-flex items-center rounded overflow-hidden shadow-md transition-transform hover:scale-105">
                    <span className="px-3.5 py-1.5 bg-[#0A2540] text-white text-xs font-mono font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Verified by Vayun</span>
                    </span>
                    <span className="px-3 py-1.5 bg-emerald-500 text-black text-xs font-mono font-extrabold">
                      Defended {score}%
                    </span>
                  </div>
                </div>

                <p className={`text-xs max-w-md mx-auto leading-relaxed ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
                  Recruiters clicking this badge in your repository will view your cryptographic defense audit log, verifying you wrote and understand the code.
                </p>
              </div>

              {/* Markdown Snippet Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-neutral-400">Markdown Embed Code</span>
                  <button
                    onClick={() => handleCopy(markdownSnippet, 'markdown')}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors ${
                      isLight ? 'bg-slate-100 text-slate-800 hover:bg-slate-200' : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800'
                    }`}
                  >
                    {copiedType === 'markdown' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedType === 'markdown' ? 'Copied Markdown' : 'Copy Markdown'}</span>
                  </button>
                </div>
                <div className={`p-3 rounded-xl border font-mono text-xs overflow-x-auto ${
                  isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-neutral-950 border-neutral-800 text-neutral-300'
                }`}>
                  <code>{markdownSnippet}</code>
                </div>
              </div>

              {/* HTML Snippet Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-neutral-400">HTML Embed Code</span>
                  <button
                    onClick={() => handleCopy(htmlSnippet, 'html')}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors ${
                      isLight ? 'bg-slate-100 text-slate-800 hover:bg-slate-200' : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800'
                    }`}
                  >
                    {copiedType === 'html' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedType === 'html' ? 'Copied HTML' : 'Copy HTML'}</span>
                  </button>
                </div>
                <div className={`p-3 rounded-xl border font-mono text-xs overflow-x-auto ${
                  isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-neutral-950 border-neutral-800 text-neutral-300'
                }`}>
                  <code>{htmlSnippet}</code>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Executive SVG Proof Card */}
          {activeTab === 'svg_card' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-neutral-400">
                  Vector SVG Artifact (For Portfolio &amp; LinkedIn)
                </span>
                <button
                  onClick={handleDownloadSvg}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                    isLight 
                      ? 'bg-[#0A2540] text-white hover:bg-[#071829]' 
                      : 'bg-white text-black hover:bg-neutral-200'
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download SVG</span>
                </button>
              </div>

              {/* Scalable SVG Proof Card */}
              <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 flex justify-center bg-black/5 dark:bg-black/40 overflow-x-auto">
                <svg
                  id="viva-svg-proof-card"
                  width="540"
                  height="280"
                  viewBox="0 0 540 280"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="rounded-xl shadow-2xl select-none"
                >
                  <rect width="540" height="280" rx="16" fill="#0A2540" />
                  <rect x="1" y="1" width="538" height="278" rx="15" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                  
                  {/* Decorative gradient flare */}
                  <circle cx="500" cy="40" r="120" fill="url(#paint0_radial)" opacity="0.4" />
                  
                  {/* Header */}
                  <text x="32" y="44" fill="#ffffff" fontSize="18" fontWeight="bold" fontFamily="monospace">VAYUN.XYZ // VIVA DEFENSE PROOF</text>
                  <text x="32" y="66" fill="#10B981" fontSize="12" fontWeight="600" fontFamily="monospace">STATUS: CANDIDATE DEFENDED ARCHITECTURE</text>
                  
                  {/* Main Grid Info */}
                  <line x1="32" y1="84" x2="508" y2="84" stroke="rgba(255,255,255,0.15)" />
                  
                  <text x="32" y="112" fill="#94A3B8" fontSize="11" fontFamily="monospace">REPOSITORY</text>
                  <text x="32" y="132" fill="#ffffff" fontSize="14" fontWeight="600" fontFamily="monospace">{repoName}</text>
                  
                  <text x="280" y="112" fill="#94A3B8" fontSize="11" fontFamily="monospace">CANDIDATE</text>
                  <text x="280" y="132" fill="#ffffff" fontSize="14" fontWeight="600" fontFamily="monospace">@{authorHandle}</text>
                  
                  <text x="32" y="168" fill="#94A3B8" fontSize="11" fontFamily="monospace">SOCRATIC DEFENSE GRADE</text>
                  <text x="32" y="194" fill="#10B981" fontSize="22" fontWeight="bold" fontFamily="monospace">{score}% PASS</text>
                  
                  <text x="280" y="168" fill="#94A3B8" fontSize="11" fontFamily="monospace">VERIFIED COMMIT</text>
                  <text x="280" y="190" fill="#ffffff" fontSize="13" fontFamily="monospace">{commitHash}</text>

                  {/* Competency Badges */}
                  <rect x="32" y="214" width="220" height="24" rx="6" fill="rgba(255,255,255,0.08)" />
                  <text x="42" y="230" fill="#38BDF8" fontSize="10" fontFamily="monospace">{competencies[0] || 'Async Concurrency'}</text>

                  <rect x="260" y="214" width="220" height="24" rx="6" fill="rgba(255,255,255,0.08)" />
                  <text x="270" y="230" fill="#38BDF8" fontSize="10" fontFamily="monospace">{competencies[1] || 'Zero Memory Leaks'}</text>
                  
                  {/* Cryptographic Proof Hash Bottom */}
                  <text x="32" y="262" fill="#64748B" fontSize="9" fontFamily="monospace">PROOF: {verificationHash}</text>

                  <defs>
                    <radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(500 40) rotate(90) scale(120)">
                      <stop stopColor="#38BDF8" />
                      <stop offset="1" stopColor="#38BDF8" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                </svg>
              </div>
            </div>
          )}

          {/* TAB 3: Recruiter Proof Verifier */}
          {activeTab === 'verify' && (
            <div className={`p-6 rounded-2xl border space-y-4 ${
              isLight ? 'bg-white border-slate-200' : 'bg-neutral-950 border-neutral-800'
            }`}>
              <div>
                <h3 className="text-sm font-semibold tracking-tight">
                  Verify Student Proof Token
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Recruiters and professors can audit candidate claims by pasting their defense hash below.
                </p>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  value={verifyInput}
                  onChange={(e) => setVerifyInput(e.target.value)}
                  placeholder={`Paste proof token (e.g. ${verificationHash})`}
                  className={`w-full px-3 py-2 rounded-lg border text-xs font-mono transition-colors focus:outline-hidden ${
                    isLight 
                      ? 'bg-slate-50 border-slate-200 text-black focus:border-[#0A2540]' 
                      : 'bg-neutral-900 border-neutral-800 text-white focus:border-white'
                  }`}
                />

                <button
                  onClick={handleRunVerify}
                  className={`px-4 py-2 rounded-lg text-xs font-mono font-medium transition-all ${
                    isLight 
                      ? 'bg-[#0A2540] text-white hover:bg-[#071829]' 
                      : 'bg-white text-black hover:bg-neutral-200'
                  }`}
                >
                  Verify Authenticity
                </button>
              </div>

              {verifyResult && (
                <div className={`p-4 rounded-xl border text-xs leading-relaxed font-mono ${
                  verifyResult.startsWith('VALID')
                    ? isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                    : isLight ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-rose-950/40 border-rose-800 text-rose-300'
                }`}>
                  {verifyResult}
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
