import React, { useState } from 'react';
import { 
  FileText, 
  Layers, 
  Database, 
  Plus, 
  Trash2, 
  Download, 
  Copy, 
  Check, 
  Scale
} from 'lucide-react';
import { SpecEndpoint, SpecSchema, SpecTradeOff } from '../../types';

interface VayunSpecViewProps {
  onBack: () => void;
  onNavigateToFlow?: () => void;
  theme?: 'dark' | 'light';
}

export const VayunSpecView: React.FC<VayunSpecViewProps> = ({
  onBack,
  onNavigateToFlow,
  theme = 'dark'
}) => {
  const isLight = theme === 'light';

  // State: Endpoints
  const [endpoints, setEndpoints] = useState<SpecEndpoint[]>([
    {
      id: 'ep-1',
      method: 'POST',
      path: '/api/v1/auth/login',
      description: 'Authenticate user with email/password and issue bounded JWT bearer token.',
      authRequired: false,
      requestBody: '{\n  "email": "user@univ.edu",\n  "password": "string"\n}',
      responseBody: '{\n  "token": "jwt_token_string",\n  "user": { "id": "uuid", "role": "student" }\n}'
    },
    {
      id: 'ep-2',
      method: 'POST',
      path: '/api/v1/bookings',
      description: 'Atomically reserve room interval with distributed mutex locking.',
      authRequired: true,
      requestBody: '{\n  "room_id": "string",\n  "guest_id": "string",\n  "nights": 3\n}',
      responseBody: '{\n  "booking_id": "bk_uuid",\n  "status": "confirmed"\n}'
    }
  ]);

  // State: Schemas
  const [schemas, setSchemas] = useState<SpecSchema[]>([
    {
      id: 'sch-1',
      name: 'users',
      fields: [
        { name: 'id', type: 'UUID', nullable: false, description: 'Primary key' },
        { name: 'email', type: 'VARCHAR(255)', nullable: false, description: 'Unique, indexed for O(log N) lookup' },
        { name: 'password_hash', type: 'VARCHAR(255)', nullable: false, description: 'Bcrypt salt + hash' },
        { name: 'failed_attempts', type: 'INT', nullable: false, description: 'Rate limit counter' }
      ]
    },
    {
      id: 'sch-2',
      name: 'bookings',
      fields: [
        { name: 'id', type: 'UUID', nullable: false, description: 'Primary key' },
        { name: 'room_id', type: 'VARCHAR(100)', nullable: false, description: 'Foreign key to rooms' },
        { name: 'guest_id', type: 'VARCHAR(100)', nullable: false, description: 'Foreign key to guests' },
        { name: 'is_active', type: 'BOOLEAN', nullable: false, description: 'Active reservation flag' }
      ]
    }
  ]);

  // State: Architecture Trade-Offs
  const [tradeOffs, setTradeOffs] = useState<SpecTradeOff[]>([
    {
      id: 'to-1',
      decisionTitle: 'Authentication Token Storage Mechanism',
      chosenApproach: 'HttpOnly SameSite Strict Cookie',
      rejectedApproach: 'Browser LocalStorage',
      timeComplexity: 'O(1) Header Parse',
      spaceComplexity: 'O(1) Memory',
      rationale: 'LocalStorage is vulnerable to cross-site scripting (XSS) extraction. HttpOnly cookies cannot be accessed by client JavaScript execution.'
    },
    {
      id: 'to-2',
      decisionTitle: 'Concurrency Conflict Resolution in Booking Engine',
      chosenApproach: 'Pessimistic Locking / Distributed Redis Mutex',
      rejectedApproach: 'Unchecked Application Memory Mutation',
      timeComplexity: 'O(1) Hash Lock',
      spaceComplexity: 'O(K) Active Rooms',
      rationale: 'In-memory locks fail when application is scaled across multiple OS worker processes. Distributed lock guarantees serializability.'
    }
  ]);

  const [copied, setCopied] = useState(false);

  // Add new endpoint
  const handleAddEndpoint = () => {
    const newEp: SpecEndpoint = {
      id: `ep-${Date.now()}`,
      method: 'GET',
      path: '/api/v1/resource',
      description: 'Retrieve resource payload.',
      authRequired: false,
      requestBody: '{}',
      responseBody: '{\n  "status": "ok"\n}'
    };
    setEndpoints(prev => [...prev, newEp]);
  };

  const handleDeleteEndpoint = (id: string) => {
    setEndpoints(prev => prev.filter(e => e.id !== id));
  };

  // Add new schema
  const handleAddSchema = () => {
    const newSch: SpecSchema = {
      id: `sch-${Date.now()}`,
      name: 'new_table',
      fields: [
        { name: 'id', type: 'UUID', nullable: false, description: 'Primary key' },
        { name: 'created_at', type: 'TIMESTAMP', nullable: false, description: 'Creation timestamp' }
      ]
    };
    setSchemas(prev => [...prev, newSch]);
  };

  const handleDeleteSchema = (id: string) => {
    setSchemas(prev => prev.filter(s => s.id !== id));
  };

  // Add new tradeoff
  const handleAddTradeOff = () => {
    const newTo: SpecTradeOff = {
      id: `to-${Date.now()}`,
      decisionTitle: 'Caching Strategy',
      chosenApproach: 'Redis Key-Value Cache',
      rejectedApproach: 'Direct DB Query for each hit',
      timeComplexity: 'O(1) Lookup',
      spaceComplexity: 'O(N) RAM',
      rationale: 'Avoids saturating the primary relational database pool on read-heavy routes.'
    };
    setTradeOffs(prev => [...prev, newTo]);
  };

  const handleDeleteTradeOff = (id: string) => {
    setTradeOffs(prev => prev.filter(t => t.id !== id));
  };

  // Generate Architecture Spec Markdown
  const generateMarkdownSpec = () => {
    return `# Architecture Specification
Generated via Vayun Spec (vayun.xyz)
Date: ${new Date().toISOString().split('T')[0]}

## 1. API Contracts
${endpoints.map(ep => `
### \`${ep.method} ${ep.path}\`
- **Description:** ${ep.description}
- **Auth Required:** ${ep.authRequired ? 'Yes' : 'No'}
\`\`\`json
// Request Body
${ep.requestBody}
\`\`\`
\`\`\`json
// Response Body
${ep.responseBody}
\`\`\`
`).join('\n')}

## 2. Database Entities & Schemas
${schemas.map(s => `
### Table: \`${s.name}\`
| Field | Type | Nullable | Notes |
|---|---|---|---|
${s.fields.map(f => `| \`${f.name}\` | \`${f.type}\` | ${f.nullable ? 'YES' : 'NO'} | ${f.description} |`).join('\n')}
`).join('\n')}

## 3. Engineering Trade-Offs & Complexity Matrix
${tradeOffs.map(t => `
### Decision: ${t.decisionTitle}
- **Chosen:** ${t.chosenApproach}
- **Rejected:** ${t.rejectedApproach}
- **Time Complexity:** ${t.timeComplexity}
- **Space Complexity:** ${t.spaceComplexity}
- **Rationale:** ${t.rationale}
`).join('\n')}
`;
  };

  const handleCopySpec = () => {
    navigator.clipboard.writeText(generateMarkdownSpec());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSpec = () => {
    const text = generateMarkdownSpec();
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ARCHITECTURE_SPEC.md';
    a.click();
    URL.revokeObjectURL(url);
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
              Vayun Spec
            </span>
          </div>

          <h1 className={`text-2xl font-serif tracking-tight font-medium ${
            isLight ? 'text-black' : 'text-white'
          }`}>
            Architecture & API Contract Workbench
          </h1>
          <p className={`text-xs ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
            Design schemas, API endpoints, and system trade-offs before writing code.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopySpec}
            className={`px-3 py-1.5 rounded text-xs font-mono flex items-center gap-1.5 border transition-colors ${
              isLight ? 'border-neutral-300 hover:bg-neutral-100' : 'border-neutral-700 hover:bg-neutral-900'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Markdown'}</span>
          </button>

          <button
            onClick={handleDownloadSpec}
            className={`px-3 py-1.5 rounded text-xs font-mono font-medium flex items-center gap-1.5 transition-colors ${
              isLight ? 'bg-black text-white hover:bg-neutral-800' : 'bg-white text-black hover:bg-neutral-200'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Spec</span>
          </button>
        </div>
      </div>

      {/* Module 1: API Endpoint Contracts */}
      <div className={`p-5 rounded-lg border space-y-4 ${
        isLight ? 'bg-white border-neutral-200' : 'bg-neutral-950 border-neutral-800'
      }`}>
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4" />
            <h2 className="text-xs font-mono font-semibold">
              1. API Endpoint Contracts ({endpoints.length})
            </h2>
          </div>
          <button
            onClick={handleAddEndpoint}
            className={`px-2.5 py-1 rounded text-xs font-mono flex items-center gap-1 border ${
              isLight ? 'border-neutral-200 hover:bg-neutral-100' : 'border-neutral-800 hover:bg-neutral-900'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Endpoint</span>
          </button>
        </div>

        <div className="space-y-4">
          {endpoints.map((ep) => (
            <div 
              key={ep.id}
              className={`p-4 rounded border space-y-3 ${
                isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-neutral-900 border-neutral-800'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="font-bold">{ep.method}</span>
                  <span className="font-semibold">{ep.path}</span>
                  {ep.authRequired && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded border border-neutral-400">
                      Auth Required
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteEndpoint(ep.id)}
                  className="text-neutral-400 hover:text-red-500"
                  title="Delete endpoint"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className={`text-xs ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                {ep.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                <div>
                  <div className="text-[10px] text-neutral-500 mb-1">Request Payload</div>
                  <pre className={`p-2.5 rounded text-[11px] overflow-x-auto ${
                    isLight ? 'bg-white border border-neutral-200' : 'bg-black border border-neutral-800'
                  }`}>
                    {ep.requestBody}
                  </pre>
                </div>
                <div>
                  <div className="text-[10px] text-neutral-500 mb-1">Response Payload</div>
                  <pre className={`p-2.5 rounded text-[11px] overflow-x-auto ${
                    isLight ? 'bg-white border border-neutral-200' : 'bg-black border border-neutral-800'
                  }`}>
                    {ep.responseBody}
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Module 2: Database Schema & Entity Modeler */}
      <div className={`p-5 rounded-lg border space-y-4 ${
        isLight ? 'bg-white border-neutral-200' : 'bg-neutral-950 border-neutral-800'
      }`}>
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            <h2 className="text-xs font-mono font-semibold">
              2. Database Entities & Schemas ({schemas.length})
            </h2>
          </div>
          <button
            onClick={handleAddSchema}
            className={`px-2.5 py-1 rounded text-xs font-mono flex items-center gap-1 border ${
              isLight ? 'border-neutral-200 hover:bg-neutral-100' : 'border-neutral-800 hover:bg-neutral-900'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Table</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {schemas.map(sch => (
            <div
              key={sch.id}
              className={`p-4 rounded border space-y-3 ${
                isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-neutral-900 border-neutral-800'
              }`}
            >
              <div className="flex items-center justify-between font-mono font-semibold text-sm">
                <span>Table: {sch.name}</span>
                <button
                  onClick={() => handleDeleteSchema(sch.id)}
                  className="text-neutral-400 hover:text-red-500"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-neutral-200 dark:border-neutral-800 text-[10px] text-neutral-500">
                      <th className="py-1">Field</th>
                      <th className="py-1">Type</th>
                      <th className="py-1">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    {sch.fields.map((f, fIdx) => (
                      <tr key={fIdx}>
                        <td className="py-1.5 font-medium">{f.name}</td>
                        <td className="py-1.5 text-neutral-500">{f.type}</td>
                        <td className="py-1.5 text-[11px] text-neutral-400">{f.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Module 3: Engineering Trade-Off Matrix */}
      <div className={`p-5 rounded-lg border space-y-4 ${
        isLight ? 'bg-white border-neutral-200' : 'bg-neutral-950 border-neutral-800'
      }`}>
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4" />
            <h2 className="text-xs font-mono font-semibold">
              3. Engineering Trade-Offs & Complexity Matrix ({tradeOffs.length})
            </h2>
          </div>
          <button
            onClick={handleAddTradeOff}
            className={`px-2.5 py-1 rounded text-xs font-mono flex items-center gap-1 border ${
              isLight ? 'border-neutral-200 hover:bg-neutral-100' : 'border-neutral-800 hover:bg-neutral-900'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Decision</span>
          </button>
        </div>

        <div className="space-y-3">
          {tradeOffs.map(to => (
            <div
              key={to.id}
              className={`p-4 rounded border text-xs space-y-2 ${
                isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-neutral-900 border-neutral-800'
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="font-bold font-mono text-sm">{to.decisionTitle}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-neutral-500">
                    {to.timeComplexity} • {to.spaceComplexity}
                  </span>
                  <button
                    onClick={() => handleDeleteTradeOff(to.id)}
                    className="text-neutral-400 hover:text-red-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 rounded border border-neutral-300 dark:border-neutral-700">
                  <div className="text-[10px] font-bold">Chosen:</div>
                  <div>{to.chosenApproach}</div>
                </div>

                <div className="p-2 rounded border border-neutral-300 dark:border-neutral-700 opacity-70">
                  <div className="text-[10px] font-bold">Rejected:</div>
                  <div>{to.rejectedApproach}</div>
                </div>
              </div>

              <p className={`pt-1 text-[11px] font-mono ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                <strong>Justification:</strong> {to.rationale}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
