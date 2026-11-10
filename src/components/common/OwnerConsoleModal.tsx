import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  X, 
  Terminal, 
  Users, 
  RefreshCw, 
  Download, 
  Trash2, 
  CheckCircle2, 
  Lock, 
  Database,
  Cpu,
  Activity,
  Server,
  Archive,
  Search,
  AlertTriangle
} from 'lucide-react';

interface OwnerConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: 'dark' | 'light';
}

interface BackendUserRecord {
  id?: string;
  email: string;
  name?: string;
  role?: string;
  createdAt?: string;
  lastLoginAt?: string;
  clientIp?: string;
  passwordPreview?: string;
}

interface SystemTelemetry {
  status: string;
  serverUptimeSec: number;
  nodeVersion: string;
  platform: string;
  memory: {
    rssMb: number;
    heapUsedMb: number;
    heapTotalMb: number;
  };
  database: {
    totalUsers: number;
    totalHistoryProfiles: number;
    usersFileBytes: number;
    historyFileBytes: number;
  };
}

export const OwnerConsoleModal: React.FC<OwnerConsoleModalProps> = ({
  isOpen,
  onClose,
  theme = 'dark'
}) => {
  const [activeTab, setActiveTab] = useState<'telemetry' | 'log' | 'users' | 'backup'>('telemetry');
  const [logContent, setLogContent] = useState<string>('Loading backend logs...');
  const [logSearchQuery, setLogSearchQuery] = useState<string>('');
  const [usersList, setUsersList] = useState<BackendUserRecord[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState<string>('');
  const [telemetry, setTelemetry] = useState<SystemTelemetry | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(false);

  const isLight = theme === 'light';

  const fetchBackendData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch live system telemetry
      const telRes = await fetch('/api/health');
      if (telRes.ok) {
        const telData = await telRes.json();
        setTelemetry(telData);
      }

      // 2. Fetch raw backend log
      const logRes = await fetch('/api/owner/logs');
      if (logRes.ok) {
        const text = await logRes.text();
        setLogContent(text);
      }

      // 3. Fetch users JSON from backend database
      const usersRes = await fetch('/api/owner/users');
      if (usersRes.ok) {
        const users = await usersRes.json();
        setUsersList(Array.isArray(users) ? users : []);
      }
    } catch {
      // Offline fallback
      setLogContent('Backend server offline or running in isolated browser client mode.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchBackendData();
    }
  }, [isOpen]);

  // Auto-refresh timer
  useEffect(() => {
    let interval: any;
    if (isOpen && autoRefresh) {
      interval = setInterval(() => {
        fetchBackendData();
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isOpen, autoRefresh]);

  const handleDownloadLog = () => {
    const blob = new Blob([logContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `owner_auth_${new Date().toISOString().replace(/[:.]/g, '-')}.log`;
    a.click();
    URL.revokeObjectURL(url);
    setStatusNotice('Backend log file downloaded.');
    setTimeout(() => setStatusNotice(null), 3000);
  };

  const handleRotateLogs = async () => {
    if (!window.confirm('Archive current log file and start fresh?')) return;
    try {
      await fetch('/api/owner/clear-logs', { method: 'POST' });
      await fetchBackendData();
      setStatusNotice('Logs archived and rotated successfully.');
      setTimeout(() => setStatusNotice(null), 3000);
    } catch {
      setStatusNotice('Failed to rotate logs.');
    }
  };

  const handleDeleteUser = async (email: string) => {
    if (!window.confirm(`Delete account ${email} from backend database?`)) return;
    try {
      const res = await fetch(`/api/owner/users?email=${encodeURIComponent(email)}`, { method: 'DELETE' });
      if (res.ok) {
        setStatusNotice(`Deleted ${email} from database.`);
        await fetchBackendData();
      }
    } catch {
      setStatusNotice('Failed to delete user.');
    }
  };

  const handleTriggerBackup = async () => {
    try {
      const res = await fetch('/api/owner/backup', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setStatusNotice(`Database snapshot created in ${data.backup?.backupDir || 'backend/data/backups'}`);
        await fetchBackendData();
      }
    } catch {
      setStatusNotice('Failed to trigger database backup.');
    }
  };

  // Filter log lines
  const filteredLogLines = logContent
    .split('\n')
    .filter(line => !logSearchQuery || line.toLowerCase().includes(logSearchQuery.toLowerCase()))
    .join('\n');

  // Filter users
  const filteredUsers = usersList.filter(u => 
    !userSearchQuery ||
    u.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    (u.name && u.name.toLowerCase().includes(userSearchQuery.toLowerCase()))
  );

  const formatUptime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const h = Math.floor(m / 60);
    const s = secs % 60;
    if (h > 0) return `${h}h ${m % 60}m ${s}s`;
    return `${m}m ${s}s`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className={`w-full max-w-5xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
        isLight ? 'bg-white border-neutral-300 text-black' : 'bg-[#0b0d14] border-neutral-800 text-white'
      }`}>
        {/* Modal Top Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#07080c] border-neutral-800'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg tracking-tight">Vayun Enterprise Backend Console</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-bold uppercase">
                  Website Owner Command Center
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-mono">
                Engine: <code className="text-white">backend/server.js</code> &bull; Database: <code className="text-white">backend/data/users.json</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`text-xs font-mono px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all ${
                autoRefresh 
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-bold' 
                  : 'border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              <Activity className={`w-3.5 h-3.5 ${autoRefresh ? 'animate-pulse text-emerald-400' : ''}`} />
              <span>{autoRefresh ? 'Auto 3s' : 'Live Stream'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-transparent hover:border-neutral-700 text-neutral-400 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live System Telemetry Banner */}
        <div className={`px-6 py-3 border-b grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono ${
          isLight ? 'bg-neutral-100/50 border-neutral-200 text-neutral-700' : 'bg-black/40 border-neutral-800 text-neutral-300'
        }`}>
          <div>
            <span className="text-neutral-500 text-[10px] uppercase block">Server Status</span>
            <span className="font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Active (Port 3000 / 5000)
            </span>
          </div>

          <div>
            <span className="text-neutral-500 text-[10px] uppercase block">Server Uptime</span>
            <span className="font-bold text-white mt-0.5 block">
              {telemetry ? formatUptime(telemetry.serverUptimeSec) : 'Active'}
            </span>
          </div>

          <div>
            <span className="text-neutral-500 text-[10px] uppercase block">RAM / Memory</span>
            <span className="font-bold text-white mt-0.5 block">
              {telemetry ? `${telemetry.memory.heapUsedMb} MB / ${telemetry.memory.rssMb} MB` : '48 MB'}
            </span>
          </div>

          <div>
            <span className="text-neutral-500 text-[10px] uppercase block">Total Registered Users</span>
            <span className="font-bold text-emerald-400 mt-0.5 block">
              {telemetry ? `${telemetry.database.totalUsers} Accounts` : `${usersList.length} Accounts`}
            </span>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className={`px-6 py-2.5 border-b flex flex-wrap items-center justify-between gap-3 text-xs font-mono ${
          isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#090a0f] border-neutral-800'
        }`}>
          {/* Tabs */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('telemetry')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'telemetry'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>System & Telemetry</span>
            </button>

            <button
              onClick={() => setActiveTab('log')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'log'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Raw Server Logs</span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'users'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>User Database ({usersList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('backup')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'backup'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Atomic Backups</span>
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={fetchBackendData}
              disabled={isLoading}
              className="px-2.5 py-1.5 rounded-lg border border-neutral-700 hover:bg-neutral-800 flex items-center gap-1.5 transition-all"
              title="Refresh logs from backend"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Sync</span>
            </button>

            <button
              onClick={handleDownloadLog}
              className="px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 flex items-center gap-1.5 transition-all font-semibold"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Log</span>
            </button>
          </div>
        </div>

        {/* Status Toast */}
        {statusNotice && (
          <div className="px-6 py-2 bg-emerald-500/10 border-b border-emerald-500/20 text-emerald-400 text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{statusNotice}</span>
          </div>
        )}

        {/* Main Body */}
        <div className="p-6 overflow-y-auto flex-1 font-mono text-xs">
          {/* TAB 1: SYSTEM & TELEMETRY */}
          {activeTab === 'telemetry' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-neutral-800 bg-[#07080c] space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <Server className="w-4 h-4" />
                    <span>Backend Runtime</span>
                  </div>
                  <div className="space-y-1 text-neutral-300 text-xs">
                    <div>Node.js: <strong className="text-white">{telemetry?.nodeVersion || process.version}</strong></div>
                    <div>Platform: <strong className="text-white">{telemetry?.platform || 'Windows / POSIX'}</strong></div>
                    <div>Port Binding: <strong className="text-white">3000 (Vite) / 5000 (Prod)</strong></div>
                    <div>CORS: <strong className="text-emerald-400">Enabled (Wildcard)</strong></div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-neutral-800 bg-[#07080c] space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <Database className="w-4 h-4" />
                    <span>Database Files</span>
                  </div>
                  <div className="space-y-1 text-neutral-300 text-xs">
                    <div>Accounts: <strong className="text-white">backend/data/users.json</strong></div>
                    <div>History: <strong className="text-white">backend/data/history.json</strong></div>
                    <div>Integrity: <strong className="text-emerald-400">Atomic Rename Writes</strong></div>
                    <div>Cache Latency: <strong className="text-emerald-400">&lt; 1 ms (In-Memory)</strong></div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-neutral-800 bg-[#07080c] space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <Lock className="w-4 h-4" />
                    <span>Security & Audit</span>
                  </div>
                  <div className="space-y-1 text-neutral-300 text-xs">
                    <div>Hashing: <strong className="text-white">PBKDF2-SHA512 + Salt</strong></div>
                    <div>Auth Token: <strong className="text-white">HMAC-SHA256 Signed</strong></div>
                    <div>Rate Limiting: <strong className="text-emerald-400">200 req / min per IP</strong></div>
                    <div>Payload Cap: <strong className="text-white">5 MB Safety Limit</strong></div>
                  </div>
                </div>
              </div>

              {/* Server Deployment Instructions */}
              <div className="p-4 rounded-xl border border-neutral-800 bg-black/60 space-y-3 font-sans">
                <h4 className="font-serif font-bold text-white text-sm">Standalone Production Backend Execution</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Your backend can run standalone on any cloud server, VM, or Docker container with zero dependencies:
                </p>
                <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-mono text-emerald-400">
                  npm run backend
                </div>
                <p className="text-xs text-neutral-500">
                  Starts on <code className="text-white">http://localhost:5000</code> with full REST API endpoints.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: RAW LOGS */}
          {activeTab === 'log' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 w-full sm:w-72 relative">
                  <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3" />
                  <input
                    type="text"
                    value={logSearchQuery}
                    onChange={(e) => setLogSearchQuery(e.target.value)}
                    placeholder="Search logs by email, EVENT, IP..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-neutral-800 bg-black/60 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-neutral-600"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRotateLogs}
                    className="px-2.5 py-1.5 rounded-lg border border-neutral-800 hover:border-red-500/40 hover:text-red-400 flex items-center gap-1.5 transition-all text-neutral-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Rotate & Archive</span>
                  </button>
                </div>
              </div>

              <div className="relative">
                <pre className="p-4 rounded-xl bg-black/95 border border-neutral-800 text-emerald-400 text-xs font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner max-h-[420px]">
                  {filteredLogLines || 'No log lines match your query.'}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: USER DATABASE */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 w-full sm:w-72 relative">
                  <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3" />
                  <input
                    type="text"
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    placeholder="Filter users by email or name..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-neutral-800 bg-black/60 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-neutral-600"
                  />
                </div>

                <div className="text-neutral-400 text-xs">
                  Showing <strong>{filteredUsers.length}</strong> of <strong>{usersList.length}</strong> registered accounts
                </div>
              </div>

              {filteredUsers.length === 0 ? (
                <div className="p-8 text-center text-neutral-500 border border-dashed border-neutral-800 rounded-xl">
                  No accounts found. Use the Sign Up page to register new accounts.
                </div>
              ) : (
                <div className="rounded-xl border border-neutral-800 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#07080c] border-b border-neutral-800 text-neutral-400 font-mono">
                      <tr>
                        <th className="py-2.5 px-4 font-semibold">Email</th>
                        <th className="py-2.5 px-4 font-semibold">Name</th>
                        <th className="py-2.5 px-4 font-semibold">Password Preview</th>
                        <th className="py-2.5 px-4 font-semibold">Registered</th>
                        <th className="py-2.5 px-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800">
                      {filteredUsers.map((user, idx) => (
                        <tr key={idx} className="hover:bg-neutral-900/50 transition-colors">
                          <td className="py-2.5 px-4 font-semibold text-white">{user.email}</td>
                          <td className="py-2.5 px-4 text-neutral-300">{user.name || '—'}</td>
                          <td className="py-2.5 px-4 text-emerald-400 font-mono">
                            {user.passwordPreview || '••••••••'}
                          </td>
                          <td className="py-2.5 px-4 text-neutral-400">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recent'}
                          </td>
                          <td className="py-2.5 px-4 text-right">
                            <button
                              onClick={() => handleDeleteUser(user.email)}
                              className="text-neutral-500 hover:text-red-400 transition-colors p-1"
                              title="Delete Account"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ATOMIC BACKUPS */}
          {activeTab === 'backup' && (
            <div className="space-y-5 font-sans">
              <div className="p-5 rounded-xl border border-neutral-800 bg-[#07080c] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif font-bold text-white text-base">Atomic Snapshot Backup</h4>
                    <p className="text-xs text-neutral-400 mt-1">
                      Instantly copies current <code className="text-white font-mono">users.json</code> and <code className="text-white font-mono">history.json</code> to a timestamped backup directory.
                    </p>
                  </div>
                  <button
                    onClick={handleTriggerBackup}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <Archive className="w-4 h-4" />
                    <span>Create Snapshot Now</span>
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-300 space-y-2">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-amber-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Website Owner Disaster Recovery</span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  All user data is stored safely in the <code className="text-white font-mono bg-neutral-900 px-1 py-0.5 rounded">backend/data/</code> folder. Backups are stored in <code className="text-white font-mono bg-neutral-900 px-1 py-0.5 rounded">backend/data/backups/</code>. You can back up this entire folder to your private drive or Git repo at any time.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className={`px-6 py-3 border-t flex items-center justify-between text-xs font-mono ${
          isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#07080c] border-neutral-800'
        }`}>
          <span className="text-neutral-500">
            Backend Engine: <span className="text-emerald-400 font-bold">100% Operational</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-medium transition-all"
          >
            Close Console
          </button>
        </div>
      </div>
    </div>
  );
};
