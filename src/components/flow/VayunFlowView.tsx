import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  FileCode, 
  ArrowRight, 
  Network,
  RotateCcw,
  CheckCircle2,
  Lock,
  Upload,
  Plus
} from 'lucide-react';
import { RepoProject, CodeFile, CallGraphNode, TraceStep, LogicHotspot } from '../../types';
import { PRESET_PROJECTS, parseCustomCodeToProject } from '../../utils/codeAnalysisEngine';

interface VayunFlowViewProps {
  onBack: () => void;
  onNavigateToViva?: () => void;
  onOpenApiSettings?: () => void;
  theme?: 'dark' | 'light';
}

export const VayunFlowView: React.FC<VayunFlowViewProps> = ({
  onBack,
  onNavigateToViva,
  onOpenApiSettings,
  theme = 'dark'
}) => {
  const isLight = theme === 'light';
  
  // Projects state
  const [activeProject, setActiveProject] = useState<RepoProject>(PRESET_PROJECTS[0]);
  const [activeFileId, setActiveFileId] = useState<string>(PRESET_PROJECTS[0].files[0].id);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedHotspot, setSelectedHotspot] = useState<LogicHotspot | null>(null);

  // Custom Code Ingestion Modal State
  const [isCustomModalOpen, setIsCustomModalOpen] = useState<boolean>(false);
  const [customInputText, setCustomInputText] = useState<string>('');
  const [customFileName, setCustomFileName] = useState<string>('server.ts');

  // Active file & step
  const activeFile: CodeFile = activeProject.files.find(f => f.id === activeFileId) || activeProject.files[0];
  const currentStep: TraceStep = activeProject.traceSteps[currentStepIndex] || activeProject.traceSteps[0];

  // Auto-scrubber timer
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= activeProject.traceSteps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          const next = prev + 1;
          const nextStep = activeProject.traceSteps[next];
          if (nextStep && nextStep.fileId) {
            setActiveFileId(nextStep.fileId);
          }
          return next;
        });
      }, 2200);
    }
    return () => clearInterval(timer);
  }, [isPlaying, activeProject.traceSteps]);

  const handleSelectPreset = (p: RepoProject) => {
    setActiveProject(p);
    setActiveFileId(p.files[0].id);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setSelectedHotspot(null);
  };

  const handleSelectStep = (idx: number) => {
    setCurrentStepIndex(idx);
    const step = activeProject.traceSteps[idx];
    if (step && step.fileId) {
      setActiveFileId(step.fileId);
    }
  };

  const handleNodeClick = (node: CallGraphNode) => {
    setActiveFileId(node.fileId);
    const stepIdx = activeProject.traceSteps.findIndex(s => s.activeNodeId === node.id);
    if (stepIdx !== -1) {
      setCurrentStepIndex(stepIdx);
    }
  };

  const handleHotspotClick = (hotspot: LogicHotspot) => {
    setSelectedHotspot(hotspot);
    setActiveFileId(hotspot.fileId);
  };

  // Analyze Custom Code
  const handleAnalyzeCustomCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInputText.trim()) return;

    const parsed = parseCustomCodeToProject(customInputText.trim(), customFileName.trim() || 'customApp.ts');
    setActiveProject(parsed);
    setActiveFileId(parsed.files[0].id);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setSelectedHotspot(null);
    setIsCustomModalOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setCustomInputText(text);
        setCustomFileName(file.name);
      }
    };
    reader.readAsText(file);
  };

  // Render Highlighted Code Lines
  const renderCodeLines = () => {
    const lines = activeFile.content.split('\n');
    const isStepFile = activeFile.id === currentStep.fileId;
    const isHotspotFile = selectedHotspot && activeFile.id === selectedHotspot.fileId;

    return lines.map((line, idx) => {
      const lineNum = idx + 1;
      const isStepHighlighted = isStepFile && lineNum >= currentStep.startLine && lineNum <= currentStep.endLine;
      const isHotspotHighlighted = isHotspotFile && lineNum === selectedHotspot?.line;

      return (
        <div 
          key={lineNum}
          className={`flex items-start font-mono text-xs leading-6 px-3 transition-colors ${
            isStepHighlighted 
              ? isLight ? 'bg-neutral-200/70 border-l-2 border-black font-medium' : 'bg-white/10 border-l-2 border-white font-medium' 
              : isHotspotHighlighted
              ? isLight ? 'bg-neutral-200 border-l-2 border-neutral-900' : 'bg-neutral-800 border-l-2 border-neutral-200'
              : 'hover:bg-neutral-500/5'
          }`}
        >
          <span className={`w-10 select-none text-right pr-4 shrink-0 font-mono text-[11px] ${
            isLight ? 'text-neutral-400' : 'text-neutral-600'
          }`}>
            {lineNum}
          </span>
          <pre className={`overflow-x-auto whitespace-pre font-mono ${
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
      {/* Clean Top Navigation Bar */}
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
              Vayun Flow
            </span>
          </div>

          <h1 className={`text-2xl font-serif tracking-tight font-medium ${
            isLight ? 'text-black' : 'text-white'
          }`}>
            Repository Execution Trace & Scrubber
          </h1>
          <p className={`text-xs ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
            Trace API requests, variable mutations, and database lookups step-by-step.
          </p>
        </div>

        {/* Preset Selector & Custom Upload Button */}
        <div className="flex items-center gap-2 shrink-0">
          <div className={`p-1 rounded border flex items-center gap-1 ${
            isLight ? 'border-neutral-200 bg-neutral-50' : 'border-neutral-800 bg-neutral-950'
          }`}>
            {PRESET_PROJECTS.map(p => (
              <button
                key={p.id}
                onClick={() => handleSelectPreset(p)}
                className={`px-2.5 py-1 text-xs rounded transition-all font-mono ${
                  activeProject.id === p.id 
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
              isLight ? 'border-neutral-300 hover:bg-neutral-100 text-black' : 'border-neutral-700 hover:bg-neutral-900 text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Analyze Custom Code</span>
          </button>

          {onNavigateToViva && (
            <button
              onClick={onNavigateToViva}
              className={`px-3 py-1.5 rounded text-xs font-mono font-medium flex items-center gap-1.5 transition-colors ${
                isLight ? 'bg-black text-white hover:bg-neutral-800' : 'bg-white text-black hover:bg-neutral-200'
              }`}
            >
              <span>Viva Defense</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* AST Call-Graph Canvas */}
      <div className={`p-4 rounded-lg border ${
        isLight ? 'bg-white border-neutral-200' : 'bg-neutral-950 border-neutral-800'
      }`}>
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-200 dark:border-neutral-800 text-xs font-mono">
          <div className="flex items-center gap-2 font-medium">
            <Network className="w-4 h-4" />
            <span>Architecture Call-Graph Topology</span>
          </div>
          <span className="text-neutral-500">
            Click any node to navigate to lines
          </span>
        </div>

        {/* Nodes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {activeProject.callGraphNodes.map((node) => {
            const isActive = currentStep.activeNodeId === node.id;
            return (
              <div
                key={node.id}
                onClick={() => handleNodeClick(node)}
                className={`p-3 rounded border text-left cursor-pointer transition-all ${
                  isActive
                    ? isLight
                      ? 'border-black bg-neutral-100 ring-1 ring-black'
                      : 'border-white bg-neutral-900 ring-1 ring-white'
                    : isLight
                    ? 'border-neutral-200 bg-neutral-50 hover:border-neutral-400'
                    : 'border-neutral-800 bg-neutral-900/50 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 mb-1">
                  <span className="uppercase">{node.type}</span>
                  <span>{node.complexity}</span>
                </div>
                <div className="text-xs font-medium font-mono truncate mb-1">
                  {node.label}
                </div>
                <div className="text-[10px] text-neutral-400 font-mono truncate">
                  {node.filePath}:{node.startLine}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Execution Trace Scrubber Controls */}
      <div className={`p-4 rounded-lg border ${
        isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-neutral-950 border-neutral-800'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-2 rounded border flex items-center gap-2 text-xs font-mono transition-colors ${
                isPlaying
                  ? isLight ? 'bg-black text-white border-black' : 'bg-white text-black border-white'
                  : isLight ? 'bg-white hover:bg-neutral-100 border-neutral-300' : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-700'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? 'Pause' : 'Play Trace'}</span>
            </button>

            <div className="flex items-center gap-1">
              <button
                disabled={currentStepIndex === 0}
                onClick={() => handleSelectStep(Math.max(0, currentStepIndex - 1))}
                className={`p-2 rounded border text-xs font-mono disabled:opacity-40 transition-colors ${
                  isLight ? 'border-neutral-200 hover:bg-white' : 'border-neutral-800 hover:bg-neutral-900'
                }`}
                title="Previous Step"
              >
                <SkipBack className="w-3.5 h-3.5" />
              </button>

              <button
                disabled={currentStepIndex >= activeProject.traceSteps.length - 1}
                onClick={() => handleSelectStep(Math.min(activeProject.traceSteps.length - 1, currentStepIndex + 1))}
                className={`p-2 rounded border text-xs font-mono disabled:opacity-40 transition-colors ${
                  isLight ? 'border-neutral-200 hover:bg-white' : 'border-neutral-800 hover:bg-neutral-900'
                }`}
                title="Next Step"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="text-xs font-mono text-neutral-500">
              Step <span className="font-semibold text-black dark:text-white">{currentStepIndex + 1}</span> of {activeProject.traceSteps.length}
            </div>
          </div>

          {/* Stepper pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {activeProject.traceSteps.map((step, idx) => (
              <button
                key={step.stepIndex}
                onClick={() => handleSelectStep(idx)}
                className={`px-2.5 py-1 rounded text-xs font-mono whitespace-nowrap transition-all border ${
                  currentStepIndex === idx
                    ? isLight ? 'bg-black text-white border-black font-medium' : 'bg-white text-black border-white font-medium'
                    : isLight ? 'border-neutral-200 hover:bg-white text-neutral-600' : 'border-neutral-800 hover:bg-neutral-900 text-neutral-400'
                }`}
              >
                Step {step.stepIndex}
              </button>
            ))}
          </div>
        </div>

        {/* Current Step Description Card */}
        <div className={`mt-3 p-3 rounded border text-xs ${
          isLight ? 'bg-white border-neutral-200' : 'bg-neutral-900 border-neutral-800'
        }`}>
          <div className="font-semibold font-mono text-xs mb-1">
            {currentStep.title}
          </div>
          <p className={isLight ? 'text-neutral-600' : 'text-neutral-300'}>
            {currentStep.description}
          </p>
        </div>
      </div>

      {/* Main Split: Code Viewer (Left) + Runtime State & Hotspots (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Code Viewer (7 cols) */}
        <div className={`lg:col-span-7 rounded-lg border overflow-hidden flex flex-col ${
          isLight ? 'bg-white border-neutral-200' : 'bg-black border-neutral-800'
        }`}>
          {/* File Tabs */}
          <div className={`flex items-center gap-1 p-2 border-b overflow-x-auto ${
            isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-neutral-950 border-neutral-800'
          }`}>
            {activeProject.files.map(file => (
              <button
                key={file.id}
                onClick={() => {
                  setActiveFileId(file.id);
                  setSelectedHotspot(null);
                }}
                className={`px-3 py-1.5 rounded text-xs font-mono flex items-center gap-2 transition-all whitespace-nowrap border ${
                  activeFileId === file.id
                    ? isLight ? 'bg-white border-neutral-300 text-black font-semibold' : 'bg-neutral-900 border-neutral-700 text-white font-semibold'
                    : isLight ? 'border-transparent text-neutral-500 hover:text-black' : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>{file.name}</span>
              </button>
            ))}
          </div>

          {/* Active File Header */}
          <div className={`px-4 py-2 text-xs font-mono border-b flex items-center justify-between ${
            isLight ? 'bg-neutral-100/50 border-neutral-200 text-neutral-600' : 'bg-neutral-950 border-neutral-800 text-neutral-400'
          }`}>
            <span>{activeFile.path}</span>
            <span className="uppercase text-[11px]">{activeFile.language}</span>
          </div>

          {/* Code Body */}
          <div className="p-2 overflow-y-auto max-h-[500px]">
            {renderCodeLines()}
          </div>
        </div>

        {/* Right: Runtime State & Logic Hotspots (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Panel 1: Live Memory State */}
          <div className={`p-4 rounded-lg border ${
            isLight ? 'bg-white border-neutral-200' : 'bg-neutral-950 border-neutral-800'
          }`}>
            <div className="pb-3 mb-3 border-b border-neutral-200 dark:border-neutral-800 text-xs font-mono font-semibold">
              Heap & Scope Variables
            </div>

            <div className="space-y-2">
              {Object.entries(currentStep.variableState).map(([key, val]) => (
                <div 
                  key={key}
                  className={`p-2 rounded border font-mono text-xs flex items-center justify-between ${
                    isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-neutral-900 border-neutral-800'
                  }`}
                >
                  <span className={isLight ? 'text-neutral-500' : 'text-neutral-400'}>
                    {key}
                  </span>
                  <span className="font-semibold truncate max-w-[200px]">
                    {val}
                  </span>
                </div>
              ))}
            </div>

            {currentStep.runtimePayload && (
              <div className="mt-3">
                <div className="text-[10px] font-mono text-neutral-500 mb-1">
                  Wire Payload / Query
                </div>
                <pre className={`p-2 rounded text-[11px] font-mono overflow-x-auto ${
                  isLight ? 'bg-neutral-100 text-neutral-800' : 'bg-neutral-900 text-neutral-200'
                }`}>
                  {currentStep.runtimePayload}
                </pre>
              </div>
            )}
          </div>

          {/* Panel 2: Logic Hotspots */}
          <div className={`p-4 rounded-lg border ${
            isLight ? 'bg-white border-neutral-200' : 'bg-neutral-950 border-neutral-800'
          }`}>
            <div className="pb-3 mb-3 border-b border-neutral-200 dark:border-neutral-800 text-xs font-mono font-semibold flex items-center justify-between">
              <span>Logic & Security Hotspots</span>
              <span className="text-neutral-500 font-normal">{activeProject.hotspots.length} detected</span>
            </div>

            <div className="space-y-2.5">
              {activeProject.hotspots.map(hotspot => {
                const isSelected = selectedHotspot?.id === hotspot.id;
                return (
                  <div
                    key={hotspot.id}
                    onClick={() => handleHotspotClick(hotspot)}
                    className={`p-3 rounded border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? isLight ? 'border-black bg-neutral-100 ring-1 ring-black' : 'border-white bg-neutral-900 ring-1 ring-white'
                        : isLight ? 'border-neutral-200 hover:border-neutral-300' : 'border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold">{hotspot.title}</span>
                      <span className="text-[10px] font-mono text-neutral-500">Line {hotspot.line}</span>
                    </div>
                    <p className={`text-[11px] mb-2 ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                      {hotspot.description}
                    </p>
                    <div className={`p-2 rounded text-[11px] italic font-mono ${
                      isLight ? 'bg-neutral-100 text-neutral-800' : 'bg-neutral-900 text-neutral-300'
                    }`}>
                      💡 Question: "{hotspot.socraticHint}"
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Code Ingestion Modal */}
      {isCustomModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className={`max-w-2xl w-full p-6 rounded-lg border shadow-2xl space-y-4 ${
            isLight ? 'bg-white border-neutral-300 text-black' : 'bg-neutral-950 border-neutral-800 text-white'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="font-serif text-lg font-semibold">
                Analyze Custom Codebase
              </h3>
              <button 
                onClick={() => setIsCustomModalOpen(false)}
                className="text-xs font-mono uppercase text-neutral-500 hover:text-black dark:hover:text-white"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleAnalyzeCustomCode} className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <label className="text-xs font-mono block mb-1">File Name</label>
                  <input
                    type="text"
                    value={customFileName}
                    onChange={e => setCustomFileName(e.target.value)}
                    placeholder="app.py, server.ts, or cache.cpp"
                    className={`w-full p-2 text-xs rounded border font-mono ${
                      isLight ? 'bg-neutral-50 border-neutral-300' : 'bg-neutral-900 border-neutral-700'
                    }`}
                  />
                </div>

                <div>
                  <label className="text-xs font-mono block mb-1">Upload File</label>
                  <label className={`px-3 py-2 rounded text-xs font-mono border cursor-pointer inline-flex items-center gap-1.5 ${
                    isLight ? 'border-neutral-300 hover:bg-neutral-100' : 'border-neutral-700 hover:bg-neutral-900'
                  }`}>
                    <Upload className="w-3.5 h-3.5" />
                    <span>Choose file</span>
                    <input type="file" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono block mb-1">Paste Code (JavaScript, Python, C++, TypeScript, SQL)</label>
                <textarea
                  rows={10}
                  value={customInputText}
                  onChange={e => setCustomInputText(e.target.value)}
                  placeholder="Paste your multi-line function, route, or module code here..."
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
                  disabled={!customInputText.trim()}
                  className={`px-4 py-1.5 rounded text-xs font-mono font-medium disabled:opacity-40 ${
                    isLight ? 'bg-black text-white hover:bg-neutral-800' : 'bg-white text-black hover:bg-neutral-200'
                  }`}
                >
                  Trace Execution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
