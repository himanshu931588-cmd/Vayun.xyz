import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Upload, 
  Copy, 
  Check, 
  Download
} from 'lucide-react';
import { 
  parseCsvString, 
  deduplicateAndClean, 
  exportToCsvString, 
  TabularData, 
  DeduplicateResult 
} from '../../utils/tabularEngines';

interface CleanCsvViewProps {
  onBack: () => void;
  theme?: 'dark' | 'light';
}

const SAMPLE_CSV = `id,name,email,company,city,postal_code
101,John Doe,john.doe@acme.com,Acme Corp,Boston,02108
102,Jane Smith,jane.smith@global.io,Global Tech,New York,10001
103,Bob Wilson,bob.w@startup.co,Startup Labs,Austin,78701
101,John Doe,john.doe@acme.com,Acme Corp,Boston,02108
104,Alice Johnson,alice.j@corp.com,Alpha Corp,Seattle,98101
102,Jane Smith,jane.smith@global.io,Global Tech,New York,10001
,,,,,
105,Carlos Gomez,carlos@latam.org,Latam Dev,Miami,33101
106,Elena Rostova,elena@euro.de,Euro AI,Berlin,10115
103,Bob Wilson,bob.w@startup.co,Startup Labs,Austin,78701
`;

export const CleanCsvView: React.FC<CleanCsvViewProps> = ({ onBack, theme = 'dark' }) => {
  const [rawText, setRawText] = useState('');
  const [parsedData, setParsedData] = useState<TabularData | null>(null);
  const [keyColumnIndex, setKeyColumnIndex] = useState<number>(-1);
  const [trimWhitespace, setTrimWhitespace] = useState(true);
  const [removeEmptyRows, setRemoveEmptyRows] = useState(true);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [result, setResult] = useState<DeduplicateResult | null>(null);
  const [copied, setCopied] = useState(false);
  const isLight = theme === 'light';

  const processCsv = async (text: string, colIdx = keyColumnIndex) => {
    if (!text.trim()) return;
    const parsed = await parseCsvString(text);
    setParsedData(parsed);

    const cleaned = deduplicateAndClean(parsed, {
      keyColumnIndex: colIdx,
      trimWhitespace,
      removeEmptyRows,
      caseSensitive
    });
    setResult(cleaned);
  };

  const handleLoadSample = () => {
    setRawText(SAMPLE_CSV);
    processCsv(SAMPLE_CSV, 2);
    setKeyColumnIndex(2);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = String(event.target?.result || '');
      setRawText(content);
      processCsv(content, keyColumnIndex);
    };
    reader.readAsText(file);
  };

  const handleDownloadCleaned = () => {
    if (!result) return;
    const csvStr = exportToCsvString(result.data);
    const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cleaned_records.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyCleaned = () => {
    if (!result) return;
    const csvStr = exportToCsvString(result.data);
    navigator.clipboard.writeText(csvStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

        <div className="flex items-center gap-2">
          <label className={`cursor-pointer px-2.5 py-1 text-xs border rounded transition-colors flex items-center gap-1.5 ${
            isLight ? 'text-neutral-700 bg-neutral-100 hover:bg-neutral-200 border-neutral-300' : 'text-neutral-300 bg-neutral-900 hover:bg-neutral-800 border-neutral-800'
          }`}>
            <Upload className="w-3.5 h-3.5" />
            <span>Upload CSV</span>
            <input type="file" accept=".csv,.tsv,.txt" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            onClick={handleLoadSample}
            className={`px-2.5 py-1 text-xs border rounded transition-colors ${
              isLight ? 'text-neutral-700 bg-neutral-100 hover:bg-neutral-200 border-neutral-300' : 'text-neutral-300 bg-neutral-900 hover:bg-neutral-800 border-neutral-800'
            }`}
          >
            Load sample
          </button>
        </div>
      </div>

      <div className={`space-y-1.5 pb-4 border-b ${isLight ? 'border-neutral-200' : 'border-neutral-900'}`}>
        <h1 className={`text-2xl font-serif tracking-tight ${isLight ? 'text-black' : 'text-white'}`}>
          CSV Deduplicator
        </h1>
        <p className={`text-xs max-w-xl leading-relaxed ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
          Deduplicates tabular rows by selected primary column or entire row. Trims accidental whitespace and drops empty records in local memory.
        </p>
      </div>

      {/* Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className={`font-mono text-[11px] uppercase tracking-wider ${isLight ? 'text-neutral-500' : 'text-neutral-500'}`}>
            Source Table
          </span>
          {rawText && (
            <button onClick={() => { setRawText(''); setParsedData(null); setResult(null); }} className={`transition-colors ${isLight ? 'text-neutral-400 hover:text-black' : 'text-neutral-500 hover:text-white'}`}>
              Clear
            </button>
          )}
        </div>
        <textarea
          value={rawText}
          onChange={e => {
            setRawText(e.target.value);
            processCsv(e.target.value, keyColumnIndex);
          }}
          placeholder="Paste CSV rows here..."
          rows={6}
          className={`w-full p-3.5 border rounded text-xs font-mono transition-colors resize-y leading-relaxed focus:outline-none ${
            isLight ? 'bg-neutral-50 border-neutral-200 text-black placeholder-neutral-400 focus:border-black' : 'bg-[#0a0a0a] border-neutral-800 text-neutral-100 placeholder-neutral-600 focus:border-neutral-500'
          }`}
        />
      </div>

      {parsedData && parsedData.headers.length > 0 && (
        <div className="space-y-4">
          <div className={`p-3 border rounded flex flex-wrap items-center justify-between gap-4 text-xs ${
            isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#0a0a0a] border-neutral-800'
          }`}>
            <div className="flex items-center gap-2">
              <span className="text-neutral-500 font-mono text-[11px] uppercase">Deduplicate on:</span>
              <select
                value={keyColumnIndex}
                onChange={e => {
                  const idx = parseInt(e.target.value, 10);
                  setKeyColumnIndex(idx);
                  processCsv(rawText, idx);
                }}
                className={`border rounded px-2 py-1 text-xs focus:outline-none ${
                  isLight ? 'bg-white border-neutral-300 text-black' : 'bg-black border-neutral-800 text-white'
                }`}
              >
                <option value={-1}>All Columns (Entire Row)</option>
                {parsedData.headers.map((h, i) => (
                  <option key={i} value={i}>Column {i + 1}: {h || `Col ${i + 1}`}</option>
                ))}
              </select>
            </div>

            <div className={`flex items-center gap-4 ${isLight ? 'text-neutral-700' : 'text-neutral-300'}`}>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={trimWhitespace}
                  onChange={e => {
                    setTrimWhitespace(e.target.checked);
                    setTimeout(() => processCsv(rawText, keyColumnIndex), 10);
                  }}
                  className="rounded bg-neutral-900 border-neutral-700"
                />
                <span>Trim whitespace</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={removeEmptyRows}
                  onChange={e => {
                    setRemoveEmptyRows(e.target.checked);
                    setTimeout(() => processCsv(rawText, keyColumnIndex), 10);
                  }}
                  className="rounded bg-neutral-900 border-neutral-700"
                />
                <span>Drop empty rows</span>
              </label>
            </div>
          </div>

          {result && (
            <div className={`p-3 border rounded flex items-center justify-between text-xs font-mono ${
              isLight ? 'bg-neutral-50 border-neutral-200 text-neutral-700' : 'bg-[#0a0a0a] border-neutral-800 text-neutral-300'
            }`}>
              <span className={isLight ? 'text-neutral-500' : 'text-neutral-500'}>
                Input: {result.originalRowCount} rows | Cleaned: {result.cleanedRowCount} rows
              </span>
              <span>
                {result.duplicatesRemoved} duplicates removed, {result.emptyRowsRemoved} empty dropped
              </span>
            </div>
          )}

          {result && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className={`font-mono text-[11px] uppercase tracking-wider ${isLight ? 'text-neutral-500' : 'text-neutral-500'}`}>
                  Cleaned Data
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyCleaned}
                    className={`px-2.5 py-1 rounded text-xs border transition-colors ${
                      isLight ? 'text-neutral-700 bg-neutral-100 hover:bg-neutral-200 border-neutral-300' : 'text-neutral-300 bg-neutral-900 hover:bg-neutral-800 border-neutral-800'
                    }`}
                  >
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                  <button
                    onClick={handleDownloadCleaned}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      isLight ? 'bg-black text-white hover:bg-neutral-800' : 'bg-white text-black hover:bg-neutral-200'
                    }`}
                  >
                    Download CSV
                  </button>
                </div>
              </div>

              <div className={`border rounded-lg overflow-hidden max-h-80 overflow-y-auto ${
                isLight ? 'bg-white border-neutral-200' : 'bg-[#0a0a0a] border-neutral-800'
              }`}>
                <table className="min-w-full text-xs text-left font-mono">
                  <thead className={`border-b sticky top-0 ${
                    isLight ? 'bg-neutral-50 border-neutral-200 text-neutral-600' : 'bg-black border-neutral-800 text-neutral-400'
                  }`}>
                    <tr>
                      <th className="py-2 px-3 w-10 text-neutral-400">#</th>
                      {result.data.headers.map((h, i) => (
                        <th key={i} className="py-2 px-3 font-normal">
                          {h || `Col ${i + 1}`}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isLight ? 'divide-neutral-100' : 'divide-neutral-900'}`}>
                    {result.data.rows.map((row, rIdx) => (
                      <tr key={rIdx} className={isLight ? 'hover:bg-neutral-50' : 'hover:bg-neutral-900/40'}>
                        <td className="py-1.5 px-3 text-neutral-400">{rIdx + 1}</td>
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className={`py-1.5 px-3 truncate max-w-xs ${isLight ? 'text-black' : 'text-neutral-200'}`}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
