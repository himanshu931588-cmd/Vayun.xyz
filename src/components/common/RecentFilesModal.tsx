import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  Star, 
  Trash2, 
  ArrowRight, 
  FileText, 
  FileCode, 
  Receipt, 
  ShieldCheck, 
  Search,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { ToolId } from '../../types';
import { 
  RecentFile, 
  getRecentFiles, 
  toggleStarRecentFile, 
  removeRecentFile, 
  clearRecentFiles 
} from '../../utils/recentFilesStorage';

interface RecentFilesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (id: ToolId) => void;
  initialTab?: 'recent' | 'starred';
  theme?: 'dark' | 'light';
}

export const RecentFilesModal: React.FC<RecentFilesModalProps> = ({
  isOpen,
  onClose,
  onSelectTool,
  initialTab = 'recent',
  theme = 'dark'
}) => {
  const [activeTab, setActiveTab] = useState<'recent' | 'starred'>(initialTab);
  const [files, setFiles] = useState<RecentFile[]>(getRecentFiles);
  const [searchQuery, setSearchQuery] = useState('');

  const isLight = theme === 'light';

  React.useEffect(() => {
    if (isOpen) {
      setFiles(getRecentFiles());
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const handleToggleStar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = toggleStarRecentFile(id);
    setFiles(updated);
  };

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = removeRecentFile(id);
    setFiles(updated);
  };

  const handleClearAll = () => {
    if (window.confirm('Clear all local recent files history? This will remove records from local RAM.')) {
      clearRecentFiles();
      setFiles([]);
    }
  };

  const handleOpenFile = (toolId: ToolId) => {
    onSelectTool(toolId);
    onClose();
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'code':
        return <FileCode className="w-4 h-4 text-emerald-500 shrink-0" />;
      case 'pdf':
        return <FileText className="w-4 h-4 text-blue-500 shrink-0" />;
      case 'invoice':
        return <Receipt className="w-4 h-4 text-amber-500 shrink-0" />;
      default:
        return <FileText className="w-4 h-4 text-purple-500 shrink-0" />;
    }
  };

  const formatRelativeTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const filteredFiles = files.filter(file => {
    if (activeTab === 'starred' && !file.isStarred) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return file.name.toLowerCase().includes(q) || file.toolName.toLowerCase().includes(q);
  });

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
    >
      <div className={`w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden transition-all flex flex-col max-h-[85vh] ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0b0c0e] border-neutral-800 text-white'
      }`}>
        
        {/* Top Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between shrink-0 ${
          isLight ? 'border-slate-200 bg-slate-50/80' : 'border-neutral-900 bg-neutral-950/80'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${
              isLight ? 'bg-white border-slate-200 text-blue-600' : 'bg-neutral-900 border-neutral-800 text-emerald-400'
            }`}>
              {activeTab === 'recent' ? <Clock className="w-4 h-4" /> : <Star className="w-4 h-4 fill-amber-400 text-amber-400" />}
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-wider font-semibold">
                {activeTab === 'recent' ? 'Recent Local Files' : 'Starred Items'}
              </div>
              <div className="text-[11px] text-neutral-500">
                100% In-Browser RAM History • Zero Cloud Storage
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab & Search Strip */}
        <div className={`px-6 py-3 border-b flex items-center justify-between gap-3 shrink-0 ${
          isLight ? 'border-slate-200 bg-slate-50/40' : 'border-neutral-900 bg-neutral-950/40'
        }`}>
          {/* Tabs */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('recent')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition-all select-none ${
                activeTab === 'recent'
                  ? isLight ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'bg-white text-black font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Recent files ({files.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('starred')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition-all select-none ${
                activeTab === 'starred'
                  ? isLight ? 'bg-blue-600 text-white font-semibold shadow-xs' : 'bg-white text-black font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>Starred ({files.filter(f => f.isStarred).length})</span>
            </button>
          </div>

          {/* Clear history */}
          {files.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-[11px] font-mono text-neutral-400 hover:text-red-400 transition-colors flex items-center gap-1"
              title="Clear all recent files"
            >
              <Trash2 className="w-3 h-3" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
        </div>

        {/* Search Input Bar */}
        <div className={`px-6 py-2.5 border-b shrink-0 ${
          isLight ? 'border-slate-100 bg-white' : 'border-neutral-900 bg-black/40'
        }`}>
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by file name or tool..."
              className={`w-full pl-9 pr-8 py-1.5 rounded-lg text-xs font-mono border focus:outline-hidden ${
                isLight 
                  ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500' 
                  : 'bg-neutral-900 border-neutral-800 text-white placeholder-neutral-500 focus:border-neutral-600'
              }`}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* File List Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-2 flex-1">
          {filteredFiles.length > 0 ? (
            filteredFiles.map((file) => (
              <div
                key={file.id}
                onClick={() => handleOpenFile(file.toolId)}
                className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all group ${
                  isLight 
                    ? 'bg-slate-50/70 border-slate-200/90 hover:bg-blue-50/50 hover:border-blue-300' 
                    : 'bg-neutral-900/50 border-neutral-800/80 hover:bg-neutral-900 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-2 rounded-lg border shrink-0 ${
                    isLight ? 'bg-white border-slate-200' : 'bg-black border-neutral-800'
                  }`}>
                    {getFileIcon(file.type)}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold truncate">
                        {file.name}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400 shrink-0">
                        {file.size}
                      </span>
                    </div>

                    <div className="text-[11px] font-mono text-neutral-400 flex items-center gap-2 mt-0.5">
                      <span className={`text-xs ${isLight ? 'text-blue-600' : 'text-emerald-400'}`}>
                        {file.toolName}
                      </span>
                      <span>•</span>
                      <span>{formatRelativeTime(file.timestamp)}</span>
                    </div>
                  </div>
                </div>

                {/* Right Actions: Star, Delete, Open */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={(e) => handleToggleStar(file.id, e)}
                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                    title={file.isStarred ? 'Remove from starred' : 'Add to starred'}
                  >
                    <Star className={`w-3.5 h-3.5 ${
                      file.isStarred ? 'fill-amber-400 text-amber-400' : 'text-neutral-400 hover:text-amber-400'
                    }`} />
                  </button>

                  <button
                    onClick={(e) => handleRemove(file.id, e)}
                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-neutral-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    title="Remove from history"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="pl-1">
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-blue-600 dark:group-hover:text-white transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={`py-12 px-4 text-center rounded-xl border border-dashed ${
              isLight ? 'border-slate-200 text-slate-500' : 'border-neutral-800 text-neutral-500'
            }`}>
              {activeTab === 'starred' ? (
                <>
                  <Star className="w-6 h-6 mx-auto mb-2 text-amber-400 opacity-60" />
                  <div className="font-mono text-xs font-semibold mb-1">No starred files yet</div>
                  <p className="text-[11px] max-w-xs mx-auto">
                    Click the star icon next to any recent file to keep it pinned here for instant access.
                  </p>
                </>
              ) : (
                <>
                  <Clock className="w-6 h-6 mx-auto mb-2 opacity-50" />
                  <div className="font-mono text-xs font-semibold mb-1">No recent files found</div>
                  <p className="text-[11px] max-w-xs mx-auto">
                    Files you process in Vayun Flow, PDF tools, Invoicing, or Token Slimmer will appear here in your browser's private memory.
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className={`px-6 py-3 border-t flex items-center justify-between text-[11px] font-mono shrink-0 ${
          isLight ? 'border-slate-200 bg-slate-50 text-slate-600' : 'border-neutral-900 bg-neutral-950 text-neutral-400'
        }`}>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Zero Remote Storage • Cleared When Browser Cache Clears</span>
          </div>

          <span className="text-neutral-500">
            {filteredFiles.length} file{filteredFiles.length === 1 ? '' : 's'}
          </span>
        </div>

      </div>
    </div>
  );
};
export default RecentFilesModal;
