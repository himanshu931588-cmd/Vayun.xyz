import React, { useState } from 'react';
import { 
  Bug, 
  Terminal, 
  Play, 
  CheckCircle2, 
  HelpCircle, 
  FileCode, 
  ArrowRight
} from 'lucide-react';
import { RepoProject, InjectedBug } from '../../types';
import { PRESET_PROJECTS } from '../../utils/codeAnalysisEngine';

interface VayunBreakViewProps {
  onBack: () => void;
  onNavigateToFlow?: () => void;
  theme?: 'dark' | 'light';
}

export const VayunBreakView: React.FC<VayunBreakViewProps> = ({
  onBack,
  onNavigateToFlow,
  theme = 'dark'
}) => {
  const isLight = theme === 'light';

  // State
  const [selectedProjectId, setSelectedProjectId] = useState<string>('fullstack-auth');
  const project: RepoProject = PRESET_PROJECTS.find(p => p.id === selectedProjectId) || PRESET_PROJECTS[0];

  const [selectedBugId, setSelectedBugId] = useState<string>(project.breakBugs[0]?.id || 'bug-1');
  const currentBug: InjectedBug = project.breakBugs.find(b => b.id === selectedBugId) || project.breakBugs[0];

  const [testStatus, setTestStatus] = useState<'idle' | 'running' | 'failed' | 'resolved'>('idle');
  const [unlockedHintLevel, setUnlockedHintLevel] = useState<number>(0);
  const [studentHypothesis, setStudentHypothesis] = useState<string>('');
  const [hypothesisFeedback, setHypothesisFeedback] = useState<string | null>(null);

  const handleRunFailingTest = () => {
    setTestStatus('running');
    setHypothesisFeedback(null);
    setTimeout(() => {
      setTestStatus('failed');
    }, 700);
  };

  const handleVerifyHypothesis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentHypothesis.trim()) return;

    const lower = studentHypothesis.toLowerCase();
    const isClose = lower.includes('null') || lower.includes('undefined') || lower.includes('decode') || lower.includes('lock') || lower.includes('race') || lower.includes('erase') || lower.includes('iterator');

    if (isClose) {
      setHypothesisFeedback(`Root cause diagnosed correctly. ${currentBug.rootCauseAnalysis}`);
      setTestStatus('resolved');
    } else {
      setHypothesisFeedback(`Analysis incomplete: Your hypothesis missed the failure mechanism. Inspect the stack trace frame.`);
    }
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
              Vayun Break
            </span>
          </div>

          <h1 className={`text-2xl font-serif tracking-tight font-medium ${
            isLight ? 'text-black' : 'text-white'
          }`}>
            Bug Injection & Diagnostic Sandbox
          </h1>
          <p className={`text-xs ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
            Analyze raw stack traces and diagnose root causes without copy-pasting code.
          </p>
        </div>

        {/* Project Selector */}
        <div className="flex items-center gap-2 shrink-0">
          <div className={`p-1 rounded border flex items-center gap-1 ${
            isLight ? 'border-neutral-200 bg-neutral-50' : 'border-neutral-800 bg-neutral-950'
          }`}>
            {PRESET_PROJECTS.map(p => (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedProjectId(p.id);
                  setSelectedBugId(p.breakBugs[0]?.id || '');
                  setTestStatus('idle');
                  setUnlockedHintLevel(0);
                  setStudentHypothesis('');
                  setHypothesisFeedback(null);
                }}
                className={`px-2.5 py-1 text-xs rounded transition-all font-mono ${
                  selectedProjectId === p.id 
                    ? isLight ? 'bg-black text-white shadow-xs' : 'bg-white text-black shadow-xs'
                    : isLight ? 'text-neutral-600 hover:text-black' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {p.language}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bug Selector Bar */}
      <div className={`p-4 rounded-lg border ${
        isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-neutral-950 border-neutral-800'
      }`}>
        <div className="text-xs font-mono text-neutral-500 mb-2">
          Scenario:
        </div>
        <div className="flex flex-wrap gap-2">
          {project.breakBugs.map(bug => (
            <button
              key={bug.id}
              onClick={() => {
                setSelectedBugId(bug.id);
                setTestStatus('idle');
                setUnlockedHintLevel(0);
                setStudentHypothesis('');
                setHypothesisFeedback(null);
              }}
              className={`px-3 py-2 rounded border text-xs font-mono text-left transition-all ${
                selectedBugId === bug.id
                  ? isLight ? 'bg-black text-white border-black font-semibold' : 'bg-white text-black border-white font-semibold'
                  : isLight ? 'bg-white hover:bg-neutral-100 border-neutral-200 text-neutral-700' : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Bug className="w-3.5 h-3.5" />
                <span>{bug.title}</span>
              </div>
              <div className="text-[10px] opacity-70 mt-1">
                {bug.difficulty} • {bug.category}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Split: Code & Terminal (Left) + Diagnostic (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Code & Terminal (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Code Snippet */}
          <div className={`p-4 rounded-lg border ${
            isLight ? 'bg-white border-neutral-200' : 'bg-neutral-950 border-neutral-800'
          }`}>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-200 dark:border-neutral-800 text-xs font-mono font-semibold">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4" />
                <span>Target File: {currentBug.targetFileName}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-[10px] font-mono text-neutral-500 mb-1">
                  Active Code:
                </div>
                <pre className={`p-3 rounded text-xs font-mono overflow-x-auto border ${
                  isLight ? 'bg-neutral-50 border-neutral-200 text-neutral-900' : 'bg-neutral-900 border-neutral-800 text-neutral-200'
                }`}>
                  {currentBug.buggySnippet}
                </pre>
              </div>

              <div>
                <div className="text-[10px] font-mono text-neutral-500 mb-1">
                  Trigger Input:
                </div>
                <div className={`p-2 rounded text-xs font-mono ${
                  isLight ? 'bg-neutral-100 text-neutral-800' : 'bg-neutral-900 text-neutral-200'
                }`}>
                  {currentBug.triggerInput}
                </div>
              </div>
            </div>
          </div>

          {/* Test Terminal */}
          <div className="rounded-lg border overflow-hidden bg-black text-neutral-200 border-neutral-800">
            <div className="p-3 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between">
              <span className="text-xs font-mono text-neutral-300">
                test_runner --env=sandbox
              </span>

              <button
                onClick={handleRunFailingTest}
                disabled={testStatus === 'running'}
                className="px-3 py-1 rounded text-xs font-mono bg-white text-black hover:bg-neutral-200 flex items-center gap-1.5 transition-colors"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>{testStatus === 'running' ? 'Running...' : 'Run Test Suite'}</span>
              </button>
            </div>

            <div className="p-4 font-mono text-xs leading-relaxed min-h-[200px] max-h-[280px] overflow-y-auto">
              {testStatus === 'idle' && (
                <div className="text-neutral-500">
                  Click [Run Test Suite] to execute the tests and trigger the stack trace.
                </div>
              )}

              {testStatus === 'running' && (
                <div className="text-neutral-400">
                  Running integration test suites...
                </div>
              )}

              {testStatus === 'failed' && (
                <div className="space-y-2">
                  <div className="text-neutral-100 font-bold">
                    FAIL: {currentBug.failingTestName}
                  </div>
                  <pre className="text-neutral-300 whitespace-pre-wrap">
                    {currentBug.stackTrace}
                  </pre>
                </div>
              )}

              {testStatus === 'resolved' && (
                <div className="text-neutral-100 space-y-1">
                  <div className="font-bold">PASS: All tests passing.</div>
                  <div className="text-xs text-neutral-400">Root cause verified.</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Socratic Rubber-Duck Diagnostic (5 cols) */}
        <div className={`lg:col-span-5 p-5 rounded-lg border space-y-5 ${
          isLight ? 'bg-white border-neutral-200' : 'bg-neutral-950 border-neutral-800'
        }`}>
          <div className="flex items-center gap-2 pb-3 border-b border-neutral-200 dark:border-neutral-800">
            <HelpCircle className="w-4 h-4" />
            <h2 className="text-xs font-mono font-semibold">
              Root-Cause Diagnostic
            </h2>
          </div>

          <p className={`text-xs ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
            Inspect the stack trace frame and identify the defect in the execution flow.
          </p>

          {/* Progressive Hints */}
          <div className="space-y-2">
            <div className="text-[11px] font-mono text-neutral-500">
              Diagnostic Hints:
            </div>

            {unlockedHintLevel >= 1 ? (
              <div className={`p-3 rounded border text-xs font-mono ${
                isLight ? 'bg-neutral-100 border-neutral-200' : 'bg-neutral-900 border-neutral-800'
              }`}>
                <span className="font-bold">Hint 1:</span> {currentBug.hintLevel1}
              </div>
            ) : (
              <button
                onClick={() => setUnlockedHintLevel(1)}
                className={`w-full py-2 px-3 rounded border text-xs font-mono text-left transition-colors ${
                  isLight ? 'border-neutral-200 hover:bg-neutral-50' : 'border-neutral-800 hover:bg-neutral-900'
                }`}
              >
                Reveal Hint 1
              </button>
            )}

            {unlockedHintLevel >= 2 ? (
              <div className={`p-3 rounded border text-xs font-mono ${
                isLight ? 'bg-neutral-100 border-neutral-200' : 'bg-neutral-900 border-neutral-800'
              }`}>
                <span className="font-bold">Hint 2:</span> {currentBug.hintLevel2}
              </div>
            ) : unlockedHintLevel >= 1 ? (
              <button
                onClick={() => setUnlockedHintLevel(2)}
                className={`w-full py-2 px-3 rounded border text-xs font-mono text-left transition-colors ${
                  isLight ? 'border-neutral-200 hover:bg-neutral-50' : 'border-neutral-800 hover:bg-neutral-900'
                }`}
              >
                Reveal Hint 2
              </button>
            ) : null}
          </div>

          {/* Root-Cause Hypothesis Form */}
          <form onSubmit={handleVerifyHypothesis} className="space-y-3 pt-2 border-t border-neutral-200 dark:border-neutral-800">
            <div className="text-[11px] font-mono text-neutral-500">
              Submit Diagnosis:
            </div>
            <textarea
              rows={3}
              value={studentHypothesis}
              onChange={e => setStudentHypothesis(e.target.value)}
              placeholder="State what caused the failure..."
              className={`w-full p-2.5 text-xs rounded border font-mono resize-none focus:outline-hidden ${
                isLight 
                  ? 'bg-neutral-50 border-neutral-300 text-black focus:border-black' 
                  : 'bg-neutral-900 border-neutral-700 text-white focus:border-white'
              }`}
            />

            <button
              type="submit"
              disabled={!studentHypothesis.trim()}
              className={`w-full py-2 rounded text-xs font-mono font-medium transition-colors ${
                isLight ? 'bg-black text-white hover:bg-neutral-800' : 'bg-white text-black hover:bg-neutral-200'
              }`}
            >
              Verify Diagnosis
            </button>

            {hypothesisFeedback && (
              <div className={`p-3 rounded text-xs font-mono border ${
                testStatus === 'resolved'
                  ? isLight ? 'bg-neutral-100 border-neutral-300 text-black' : 'bg-neutral-900 border-neutral-700 text-white'
                  : isLight ? 'bg-neutral-100 border-neutral-300 text-neutral-700' : 'bg-neutral-900 border-neutral-700 text-neutral-300'
              }`}>
                {hypothesisFeedback}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
