import { ToolId } from '../types';

export interface RecentFile {
  id: string;
  name: string;
  size: string;
  toolId: ToolId;
  toolName: string;
  timestamp: number;
  type: 'pdf' | 'code' | 'json' | 'csv' | 'invoice' | 'txt';
  isStarred?: boolean;
}

const RECENT_FILES_KEY = 'vayun_recent_files';
const STARRED_TOOLS_KEY = 'vayun_starred_tools';

const DEFAULT_RECENT_FILES: RecentFile[] = [
  {
    id: 'rec-1',
    name: 'auth_middleware.ts',
    size: '14.2 KB',
    toolId: 'vayun-flow',
    toolName: 'Vayun Flow',
    timestamp: Date.now() - 1000 * 60 * 12, // 12 mins ago
    type: 'code',
    isStarred: true
  },
  {
    id: 'rec-2',
    name: 'engineering_resume_2026.pdf',
    size: '184 KB',
    toolId: 'resume-builder',
    toolName: 'Resume Builder',
    timestamp: Date.now() - 1000 * 60 * 45, // 45 mins ago
    type: 'pdf',
    isStarred: true
  },
  {
    id: 'rec-3',
    name: 'q3_quarterly_financials.pdf',
    size: '2.8 MB',
    toolId: 'split-pdf',
    toolName: 'Split PDF',
    timestamp: Date.now() - 1000 * 60 * 60 * 3, // 3 hours ago
    type: 'pdf',
    isStarred: false
  },
  {
    id: 'rec-4',
    name: 'prompt_secrets_redacted.txt',
    size: '4.1 KB',
    toolId: 'secret-detonator',
    toolName: 'Secret Detonator',
    timestamp: Date.now() - 1000 * 60 * 60 * 8, // 8 hours ago
    type: 'txt',
    isStarred: true
  },
  {
    id: 'rec-5',
    name: 'invoice_INV-2026-081.pdf',
    size: '92 KB',
    toolId: 'invoice-maker',
    toolName: 'Invoice Maker',
    timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
    type: 'invoice',
    isStarred: false
  }
];

const DEFAULT_STARRED_TOOLS: ToolId[] = [
  'vayun-flow',
  'resume-builder',
  'split-pdf',
  'secret-detonator',
  'vayun-viva'
];

export function getRecentFiles(): RecentFile[] {
  try {
    const raw = localStorage.getItem(RECENT_FILES_KEY);
    if (!raw) {
      localStorage.setItem(RECENT_FILES_KEY, JSON.stringify(DEFAULT_RECENT_FILES));
      return DEFAULT_RECENT_FILES;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to load recent files', err);
    return DEFAULT_RECENT_FILES;
  }
}

export function addRecentFile(file: Omit<RecentFile, 'id' | 'timestamp'>): RecentFile[] {
  try {
    const current = getRecentFiles();
    const newEntry: RecentFile = {
      ...file,
      id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: Date.now()
    };
    // Dedup by name + toolId if already existing
    const filtered = current.filter(f => !(f.name === file.name && f.toolId === file.toolId));
    const updated = [newEntry, ...filtered].slice(0, 30);
    localStorage.setItem(RECENT_FILES_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn('Failed to add recent file', err);
    return getRecentFiles();
  }
}

export function toggleStarRecentFile(id: string): RecentFile[] {
  try {
    const current = getRecentFiles();
    const updated = current.map(f => {
      if (f.id === id) {
        return { ...f, isStarred: !f.isStarred };
      }
      return f;
    });
    localStorage.setItem(RECENT_FILES_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    return getRecentFiles();
  }
}

export function removeRecentFile(id: string): RecentFile[] {
  try {
    const current = getRecentFiles();
    const updated = current.filter(f => f.id !== id);
    localStorage.setItem(RECENT_FILES_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    return getRecentFiles();
  }
}

export function clearRecentFiles(): void {
  try {
    localStorage.setItem(RECENT_FILES_KEY, JSON.stringify([]));
  } catch (err) {
    console.warn('Failed to clear recent files', err);
  }
}

export function getStarredTools(): ToolId[] {
  try {
    const raw = localStorage.getItem(STARRED_TOOLS_KEY);
    if (!raw) {
      localStorage.setItem(STARRED_TOOLS_KEY, JSON.stringify(DEFAULT_STARRED_TOOLS));
      return DEFAULT_STARRED_TOOLS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_STARRED_TOOLS;
  }
}

export function toggleStarTool(toolId: ToolId): ToolId[] {
  try {
    const current = getStarredTools();
    const isStarred = current.includes(toolId);
    const updated = isStarred
      ? current.filter(id => id !== toolId)
      : [...current, toolId];
    localStorage.setItem(STARRED_TOOLS_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return getStarredTools();
  }
}

export function isToolStarred(toolId: ToolId): boolean {
  return getStarredTools().includes(toolId);
}
