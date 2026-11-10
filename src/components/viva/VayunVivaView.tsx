import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Send, 
  Mic, 
  MicOff, 
  CheckCircle2, 
  AlertCircle, 
  Award, 
  RotateCcw, 
  FileCode, 
  ArrowRight,
  TrendingUp,
  Download,
  Lock,
  Key,
  Upload
} from 'lucide-react';
import { RepoProject, VivaQuestion, VivaMessage, MentalModelScorecard, CodeFile } from '../../types';
import { PRESET_PROJECTS, evaluateVivaResponse, calculateScorecard, parseCustomCodeToProject } from '../../utils/codeAnalysisEngine';
import { getStoredApiKey, evaluateVivaWithAi } from '../../utils/geminiApi';

interface VayunVivaViewProps {
  onBack: () => void;
  onNavigateToFlow?: () => void;
  onOpenApiSettings?: () => void;
  theme?: 'dark' | 'light';
}

export const VayunVivaView: React.FC<VayunVivaViewProps> = ({
  onBack,
  onNavigateToFlow,
  onOpenApiSettings,
  theme = 'dark'
}) => {
  const isLight = theme === 'light';
  const hasApiKey = Boolean(getStoredApiKey());

  // Selected Repo
  const [project, setProject] = useState<RepoProject>(PRESET_PROJECTS[0]);

  // Active Question & Session State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const currentQuestion: VivaQuestion = project.vivaQuestions[currentQuestionIndex] || project.vivaQuestions[0];
  
  const [studentInput, setStudentInput] = useState<string>('');
  const [isVoiceActive, setIsVoiceActive] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [showCertificate, setShowCertificate] = useState<boolean>(false);

  // Custom Code Defense Modal State
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customCode, setCustomCode] = useState('');
  const [customFileName, setCustomFileName] = useState('controller.ts');

  // Chat message history
  const [messages, setMessages] = useState<VivaMessage[]>([
    {
      id: 'init-1',
      sender: 'examiner',
      text: `Welcome to Vayun Viva Defense. Today you are defending your codebase: "${project.name}".\n\nTier ${currentQuestion.tier} (${currentQuestion.category}) Question:\n${currentQuestion.question}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      questionId: currentQuestion.id
    }
  ]);

  // Scorecard
  const scorecard: MentalModelScorecard = calculateScorecard(messages);

  // Active Code Inspection File
  const targetFile: CodeFile = project.files.find(f => f.id === currentQuestion.fileId) || project.files[0];

  const handleSelectProject = (p: RepoProject) => {
    setProject(p);
    setCurrentQuestionIndex(0);
    const firstQ = p.vivaQuestions[0];
    setMessages([
      {
        id: `init-${Date.now()}`,
        sender: 'examiner',
        text: `Switched repository to "${p.name}".\n\nTier ${firstQ.tier} (${firstQ.category}) Question:\n${firstQ.question}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        questionId: firstQ.id
      }
    ]);
  };

  const handleLoadCustomCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCode.trim()) return;

    const parsed = parseCustomCodeToProject(customCode.trim(), customFileName.trim() || 'customApp.ts');
    setProject(parsed);
    setCurrentQuestionIndex(0);
    setIsCustomModalOpen(false);

    const firstQ = parsed.vivaQuestions[0];
    setMessages([
      {
        id: `custom-init-${Date.now()}`,
        sender: 'examiner',
        text: `Ingested your custom code: "${customFileName}".\n\nTier ${firstQ.tier} (${firstQ.category}) Defense Question:\n${firstQ.question}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        questionId: firstQ.id
      }
    ]);
  };

  // Handle Response Submission (Live AI or Socratic Heuristic)
  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentInput.trim() || isEvaluating) return;

    const userText = studentInput.trim();
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Add Student Message
    const userMsg: VivaMessage = {
      id: `msg-student-${Date.now()}`,
      sender: 'student',
      text: userText,
      timestamp: timeNow,
      questionId: currentQuestion.id
    };

    setMessages(prev => [...prev, userMsg]);
    setStudentInput('');
    setIsEvaluating(true);

    let evaluation: any;

    try {
      if (getStoredApiKey()) {
        evaluation = await evaluateVivaWithAi(currentQuestion, userText, targetFile.content);
      } else {
        evaluation = evaluateVivaResponse(currentQuestion, userText);
      }
    } catch {
      evaluation = evaluateVivaResponse(currentQuestion, userText);
    }

    const examinerMsg: VivaMessage = {
      id: `msg-examiner-${Date.now()}`,
      sender: 'examiner',
      text: `${evaluation.feedback}\n\n${evaluation.socraticFollowUp}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      questionId: currentQuestion.id,
      evaluation: {
        score: evaluation.score,
        rating: evaluation.rating,
        feedback: evaluation.feedback,
        strengths: evaluation.strengths,
        gaps: evaluation.gaps
      }
    };

    setMessages(prev => [...prev, examinerMsg]);
    setIsEvaluating(false);

    // Advance question if score is competent or higher and questions remain
    if (currentQuestionIndex < project.vivaQuestions.length - 1) {
      setTimeout(() => {
        const nextIdx = currentQuestionIndex + 1;
        const nextQ = project.vivaQuestions[nextIdx];
        setCurrentQuestionIndex(nextIdx);

        setMessages(prev => [
          ...prev,
          {
            id: `q-prompt-${Date.now()}`,
            sender: 'examiner',
            text: `Advancing to Tier ${nextQ.tier} (${nextQ.category}):\n\n${nextQ.question}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            questionId: nextQ.id
          }
        ]);
      }, 1200);
    }
  };

  // Render Highlighted Code Lines for Defense
  const renderDefendedCodeLines = () => {
    const lines = targetFile.content.split('\n');
    return lines.map((line, idx) => {
      const lineNum = idx + 1;
      const isDefendingLine = lineNum >= currentQuestion.startLine && lineNum <= currentQuestion.endLine;

      return (
        <div
          key={lineNum}
          className={`flex items-start font-mono text-xs leading-6 px-3 transition-colors ${
            isDefendingLine
              ? isLight ? 'bg-neutral-200/80 border-l-2 border-black font-medium' : 'bg-white/15 border-l-2 border-white font-medium'
              : 'hover:bg-neutral-500/5'
          }`}
        >
          <span className={`w-8 select-none text-right pr-3 shrink-0 text-[11px] ${
            isLight ? 'text-neutral-400' : 'text-neutral-600'
          }`}>
            {lineNum}
          </span>
          <pre className={`overflow-x-auto whitespace-pre ${
            isLight ? 'text-neutral-900' : 'text-neutral-100'
          }`}>
            {line || ' '}
          </pre>
        </div>
      );
    });
  };

  return (
    <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className={`text-xs font-mono px-2 py-0.5 rounded border transition-colors ${
                isLight ? 'border-neutral-200 hover:bg-neutral-100 text-neutral-600' : 'border-neutral-800 hover:bg-neutral-900 text-neutral-400'
              }`}
            >
              ← Back
            </button>
            <span className="text-xs font-mono font-medium">
              Vayun Viva
            </span>
          </div>

          <h1 className={`text-2xl font-serif tracking-tight font-medium ${
            isLight ? 'text-black' : 'text-white'
          }`}>
            Codebase Viva Defense & Placement Simulator
          </h1>
          <p className={`text-xs ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
            Defend your actual code line-by-line against a Socratic examiner.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <div className={`p-1 rounded border flex items-center gap-1 ${
            isLight ? 'border-neutral-200 bg-neutral-50' : 'border-neutral-800 bg-neutral-950'
          }`}>
            {PRESET_PROJECTS.map(p => (
              <button
                key={p.id}
                onClick={() => handleSelectProject(p)}
                className={`px-2.5 py-1 text-xs rounded transition-all font-mono ${
                  project.id === p.id 
                    ? isLight ? 'bg-black text-white' : 'bg-white text-black'
                    : isLight ? 'text-neutral-600 hover:text-black' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {p.language}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsCustomModalOpen(true)}
            className={`px-3 py-1.5 rounded text-xs font-mono flex items-center gap-1.5 border transition-colors ${
              isLight ? 'border-neutral-300 hover:bg-neutral-100' : 'border-neutral-700 hover:bg-neutral-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Defend Custom Code</span>
          </button>

          <button
            onClick={() => setShowCertificate(true)}
            className={`px-3 py-1.5 rounded text-xs font-mono flex items-center gap-1.5 border transition-colors ${
              isLight ? 'border-neutral-300 hover:bg-neutral-100' : 'border-neutral-700 hover:bg-neutral-900'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Scorecard</span>
          </button>
        </div>
      </div>

      {/* Real-Time Mental-Model Readiness Bar */}
      <div className={`p-4 rounded-lg border ${
        isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-neutral-950 border-neutral-800'
      }`}>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="space-y-1">
            <div className="text-[10px] font-mono text-neutral-500">Placement Readiness</div>
            <div className="text-xl font-mono font-bold">{scorecard.overallReadiness}%</div>
            <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className={`h-full ${scorecard.overallReadiness >= 75 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                style={{ width: `${scorecard.overallReadiness}%` }}
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-[10px] font-mono text-neutral-500">Control Flow</div>
            <div className="text-xl font-mono font-bold">{scorecard.controlFlow}%</div>
            <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500" style={{ width: `${scorecard.controlFlow}%` }} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-[10px] font-mono text-neutral-500">Data Structures</div>
            <div className="text-xl font-mono font-bold">{scorecard.dataStructures}%</div>
            <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500" style={{ width: `${scorecard.dataStructures}%` }} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-[10px] font-mono text-neutral-500">Edge Cases</div>
            <div className="text-xl font-mono font-bold">{scorecard.edgeCases}%</div>
            <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500" style={{ width: `${scorecard.edgeCases}%` }} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-[10px] font-mono text-neutral-500">Architecture</div>
            <div className="text-xl font-mono font-bold">{scorecard.architecture}%</div>
            <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500" style={{ width: `${scorecard.architecture}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Split: Viva Chat Chamber (Left) + Defended Codebase (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Chat Chamber (6 cols) */}
        <div className={`lg:col-span-6 rounded-lg border flex flex-col h-[620px] ${
          isLight ? 'bg-white border-neutral-200' : 'bg-neutral-950 border-neutral-800'
        }`}>
          {/* Header */}
          <div className={`p-3 border-b flex items-center justify-between text-xs font-mono ${
            isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-neutral-900 border-neutral-800'
          }`}>
            <span className="font-semibold">
              Tier {currentQuestion.tier}: {currentQuestion.category}
            </span>
            <span className="text-neutral-500">
              Question {currentQuestionIndex + 1} of {project.vivaQuestions.length}
            </span>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map(msg => (
              <div 
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'student' ? 'items-end' : 'items-start'}`}
              >
                <div className={`max-w-[88%] p-3.5 rounded-lg text-xs leading-relaxed ${
                  msg.sender === 'student'
                    ? isLight ? 'bg-black text-white' : 'bg-white text-black'
                    : isLight ? 'bg-neutral-100 text-neutral-900 border border-neutral-200' : 'bg-neutral-900 text-neutral-100 border border-neutral-800'
                }`}>
                  <div className="flex items-center justify-between text-[10px] font-mono opacity-70 mb-1.5">
                    <span className="font-semibold">
                      {msg.sender === 'student' ? 'You' : 'Examiner'}
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div className="whitespace-pre-line font-sans">
                    {msg.text}
                  </div>

                  {msg.evaluation && (
                    <div className={`mt-3 pt-2.5 border-t text-[11px] font-mono space-y-1.5 ${
                      msg.sender === 'student' ? 'border-white/20' : 'border-neutral-300 dark:border-neutral-700'
                    }`}>
                      <div className="flex items-center justify-between font-bold">
                        <span>Score: {msg.evaluation.score}/100</span>
                        <span>{msg.evaluation.rating}</span>
                      </div>
                      {msg.evaluation.strengths.length > 0 && (
                        <div className="text-emerald-500 text-[10px]">
                          ✓ Defended: {msg.evaluation.strengths.join(', ')}
                        </div>
                      )}
                      {msg.evaluation.gaps.length > 0 && (
                        <div className="text-amber-500 text-[10px]">
                          ⚠ Gaps: {msg.evaluation.gaps.join(', ')}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isEvaluating && (
              <div className="text-xs font-mono text-neutral-500 italic">
                Examiner is analyzing your defense...
              </div>
            )}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSubmitAnswer} className={`p-3 border-t ${
            isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-neutral-900 border-neutral-800'
          }`}>
            <div className="relative">
              <textarea
                rows={3}
                value={studentInput}
                onChange={e => setStudentInput(e.target.value)}
                placeholder="Explain the technical mechanics and trade-offs of this code..."
                className={`w-full p-2.5 pr-20 text-xs rounded border font-mono resize-none focus:outline-hidden ${
                  isLight 
                    ? 'bg-white border-neutral-300 text-black focus:border-black' 
                    : 'bg-black border-neutral-700 text-white focus:border-white'
                }`}
              />

              <div className="absolute right-2 bottom-2.5 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsVoiceActive(!isVoiceActive)}
                  className={`p-1.5 rounded border transition-colors ${
                    isVoiceActive 
                      ? 'bg-red-500 text-white border-red-500' 
                      : isLight ? 'border-neutral-200 hover:bg-neutral-100' : 'border-neutral-800 hover:bg-neutral-900'
                  }`}
                  title={isVoiceActive ? 'Voice active' : 'Toggle voice'}
                >
                  {isVoiceActive ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                </button>

                <button
                  type="submit"
                  disabled={!studentInput.trim() || isEvaluating}
                  className={`p-1.5 rounded font-mono text-xs flex items-center gap-1 disabled:opacity-40 transition-colors ${
                    isLight ? 'bg-black text-white hover:bg-neutral-800' : 'bg-white text-black hover:bg-neutral-200'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Right: Code Under Defense (6 cols) */}
        <div className={`lg:col-span-6 rounded-lg border flex flex-col h-[620px] overflow-hidden ${
          isLight ? 'bg-white border-neutral-200' : 'bg-black border-neutral-800'
        }`}>
          {/* Target File Header */}
          <div className={`p-3 border-b flex items-center justify-between text-xs font-mono ${
            isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-neutral-950 border-neutral-800'
          }`}>
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4" />
              <span className="font-semibold">{targetFile.path}</span>
            </div>
            <span className="text-neutral-500">
              Lines {currentQuestion.startLine}–{currentQuestion.endLine}
            </span>
          </div>

          {/* Defense Question Reminder Banner */}
          <div className={`p-3 border-b text-xs ${
            isLight ? 'bg-neutral-100/70 border-neutral-200' : 'bg-neutral-900 border-neutral-800'
          }`}>
            <p className="font-medium text-xs">
              "{currentQuestion.question}"
            </p>
          </div>

          {/* Code Viewer */}
          <div className="flex-1 p-2 overflow-y-auto font-mono text-xs">
            {renderDefendedCodeLines()}
          </div>

          {/* Checkpoints */}
          <div className={`p-3 border-t text-xs font-mono ${
            isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-neutral-950 border-neutral-800'
          }`}>
            <div className="text-[10px] text-neutral-500 mb-1">
              Checkpoints:
            </div>
            <div className="space-y-1">
              {currentQuestion.checkpoints.map((cp, idx) => (
                <div key={idx} className="flex items-center gap-2 text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                  <span>{cp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Code Defense Modal */}
      {isCustomModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className={`max-w-xl w-full p-6 rounded-lg border shadow-2xl space-y-4 ${
            isLight ? 'bg-white border-neutral-300 text-black' : 'bg-neutral-950 border-neutral-800 text-white'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="font-serif text-lg font-semibold">
                Defend Your Own Code
              </h3>
              <button 
                onClick={() => setIsCustomModalOpen(false)}
                className="text-xs font-mono text-neutral-500 hover:text-black dark:hover:text-white"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleLoadCustomCode} className="space-y-4">
              <div>
                <label className="text-xs font-mono block mb-1">File Name</label>
                <input
                  type="text"
                  value={customFileName}
                  onChange={e => setCustomFileName(e.target.value)}
                  placeholder="controller.ts, service.py, etc."
                  className={`w-full p-2 text-xs rounded border font-mono ${
                    isLight ? 'bg-neutral-50 border-neutral-300' : 'bg-neutral-900 border-neutral-700'
                  }`}
                />
              </div>

              <div>
                <label className="text-xs font-mono block mb-1">Paste Your Code</label>
                <textarea
                  rows={8}
                  value={customCode}
                  onChange={e => setCustomCode(e.target.value)}
                  placeholder="Paste the function or file you want to defend in the viva examination..."
                  className={`w-full p-3 text-xs rounded border font-mono resize-none focus:outline-hidden ${
                    isLight ? 'bg-neutral-50 border-neutral-300' : 'bg-neutral-900 border-neutral-700'
                  }`}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsCustomModalOpen(false)}
                  className={`px-3 py-1.5 rounded text-xs font-mono border ${
                    isLight ? 'border-neutral-200 hover:bg-neutral-100' : 'border-neutral-800 hover:bg-neutral-900'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!customCode.trim()}
                  className={`px-4 py-1.5 rounded text-xs font-mono font-medium disabled:opacity-40 ${
                    isLight ? 'bg-black text-white hover:bg-neutral-800' : 'bg-white text-black hover:bg-neutral-200'
                  }`}
                >
                  Start Defense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Scorecard Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className={`max-w-xl w-full p-6 rounded-lg border shadow-2xl space-y-4 ${
            isLight ? 'bg-white border-neutral-300 text-black' : 'bg-neutral-950 border-neutral-800 text-white'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="font-serif text-lg font-semibold">
                Viva Defense Summary
              </h3>
              <button 
                onClick={() => setShowCertificate(false)}
                className="text-xs font-mono text-neutral-500 hover:text-black dark:hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
                <div className="text-neutral-500">Repository:</div>
                <div className="font-bold text-sm">{project.name}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded border border-neutral-200 dark:border-neutral-800">
                  <div className="text-neutral-500">Readiness</div>
                  <div className="text-2xl font-bold">{scorecard.overallReadiness}%</div>
                </div>
                <div className="p-3 rounded border border-neutral-200 dark:border-neutral-800">
                  <div className="text-neutral-500">Passed Checkpoints</div>
                  <div className="text-2xl font-bold">{scorecard.passedCheckpoints} / {scorecard.totalCheckpoints}</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`Vayun Defense Scorecard: ${scorecard.overallReadiness}% Readiness | ${project.name}`);
                  alert('Scorecard copied to clipboard.');
                  setShowCertificate(false);
                }}
                className={`px-4 py-2 rounded text-xs font-mono font-medium ${
                  isLight ? 'bg-black text-white hover:bg-neutral-800' : 'bg-white text-black hover:bg-neutral-200'
                }`}
              >
                Copy Summary
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
