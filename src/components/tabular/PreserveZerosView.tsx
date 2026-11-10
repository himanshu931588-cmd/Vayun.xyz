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
  preserveLeadingZeros, 
  detectZeroStrippedColumns, 
  exportToCsvString, 
  TabularData 
} from '../../utils/tabularEngines';

interface PreserveZerosViewProps {
  onBack: () => void;
  theme?: 'dark' | 'light';
}

const SAMPLE_BROKEN_ZIP_CSV = `customer_id,name,city,state,zip_code,phone_number
1001,Johnathan Doe,Cambridge,MA,2138,4155550192
1002,Sarah Jenkins,Concord,MA,1742,6175550183
1003,Marcus Vance,Newark,NJ,7102,2015550119
1004,Emily Thorne,Princeton,NJ,8540,6095550144
1005,Alex Rivera,Trenton,NJ,8608,6095550177
`;

export const PreserveZerosView: React.FC<PreserveZerosViewProps> = ({ onBack, theme = 'dark' }) => {
  const [rawText, setRawText] = useState('');
  const [parsedData, setParsedData] = useState<TabularData | null>(null);
  const [selectedColumns, setSelectedColumns] = useState<number[]>([]);
  const [targetLength, setTargetLength] = useState<number>(5);
  const [outputMode, setOutputMode] = useState<'pad' | 'excelFormula' | 'quotes'>('excelFormula');
  const [cleanedData, setCleanedData] = useState<TabularData | null>(null);
  const [copied, setCopied] = useState(false);
  const isLight = theme === 'light';

  const processCsv = async (
    text: string, 
    cols = selectedColumns, 
    length = targetLength, 
    mode = outputMode
  ) => {
    if (!text.trim()) return;
    const parsed = await parseCsvString(text);
    setParsedData(parsed);

    let targetCols = cols;
    if (targetCols.length === 0) {
      targetCols = detectZeroStrippedColumns(parsed);
      setSelectedColumns(targetCols);
    }

    const fixed = preserveLeadingZeros(parsed, {
      targetColumnIndices: targetCols,
      targetLength: length,
      mode
    });
    setCleanedData(fixed);
  };

  const handleLoadSample = () => {
    setRawText(SAMPLE_BROKEN_ZIP_CSV);
    processCsv(SAMPLE_BROKEN_ZIP_CSV, [4], 5, outputMode);
    setSelectedColumns([4]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = String(event.target?.result || '');
      setRawText(content);
      processCsv(content);
    };
    reader.readAsText(file);
  };

  const toggleColumnSelection = (colIdx: number) => {
    const updated = selectedColumns.includes(colIdx)
      ? selectedColumns.filter(c => c !== colIdx)
      : [...selectedColumns, colIdx];
    setSelectedColumns(updated);
    if (rawText) {
      processCsv(rawText, updated, targetLength, outputMode);
    }
  };

  const handleDownloadFixed = () => {
    if (!cleanedData) return;
    const csvStr = exportToCsvString(cleanedData);
    const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'restored_leading_zeros.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyFixed = () => {
    if (!cleanedData) return;
    const csvStr = exportToCsvString(cleanedData);
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
            <input type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" />
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
          Preserve Leading Zeros
        </h1>
        <p className={`text-xs max-w-xl leading-relaxed ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
          Pads postal codes and phone numbers stripped to integers by spreadsheet applications, exporting them as string literals or formulas.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className={`font-mono text-[11px] uppercase tracking-wider ${isLight ? 'text-neutral-500' : 'text-neutral-500'}`}>
            Source Table
          </span>
          {rawText && (
            <button onClick={() => { setRawText(''); setParsedData(null); setCleanedData(null); }} className={`transition-colors ${isLight ? 'text-neutral-400 hover:text-black' : 'text-neutral-500 hover:text-white'}`}>
              Clear
            </button>
          )}
        </div>
        <textarea
          value={rawText}
          onChange={e => {
            setRawText(e.target.value);
            processCsv(e.target.value);
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
          <div className={`p-3 border rounded space-y-3 text-xs ${
            isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#0a0a0a] border-neutral-800'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-neutral-500 font-mono text-[11px] uppercase">Target Columns:</span>
              <span className="text-neutral-400 text-[11px]">Click to toggle</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {parsedData.headers.map((h, i) => {
                const isSelected = selectedColumns.includes(i);
                return (
                  <button
                    key={i}
                    onClick={() => toggleColumnSelection(i)}
                    className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                      isSelected
                        ? isLight ? 'bg-black text-white font-medium' : 'bg-white text-black font-medium'
                        : isLight ? 'bg-neutral-200 text-black hover:bg-neutral-300' : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800'
                    }`}
                  >
                    {h || `Col ${i + 1}`}
                  </button>
                );
              })}
            </div>

            <div className={`pt-2 border-t flex flex-wrap items-center justify-between gap-3 text-xs ${
              isLight ? 'border-neutral-200' : 'border-neutral-800'
            }`}>
              <div className="flex items-center gap-2">
                <span className={isLight ? 'text-neutral-600' : 'text-neutral-400'}>Target length:</span>
                <select
                  value={targetLength}
                  onChange={e => {
                    const len = parseInt(e.target.value, 10);
                    setTargetLength(len);
                    processCsv(rawText, selectedColumns, len, outputMode);
                  }}
                  className={`border rounded px-2 py-0.5 text-xs focus:outline-none ${
                    isLight ? 'bg-white border-neutral-300 text-black' : 'bg-black border-neutral-800 text-white'
                  }`}
                >
                  <option value={5}>5 digits (US ZIP)</option>
                  <option value={9}>9 digits (ZIP+4)</option>
                  <option value={10}>10 digits (Phone)</option>
                  <option value={6}>6 digits (Postal)</option>
                  <option value={0}>Auto</option>
                </select>
              </div>

              <div className={`flex items-center gap-1.5 p-1 rounded border font-mono text-[11px] ${
                isLight ? 'bg-white border-neutral-300' : 'bg-black border-neutral-800'
              }`}>
                <button
                  onClick={() => {
                    setOutputMode('excelFormula');
                    processCsv(rawText, selectedColumns, targetLength, 'excelFormula');
                  }}
                  className={`px-2 py-0.5 rounded ${
                    outputMode === 'excelFormula' 
                      ? isLight ? 'bg-black text-white' : 'bg-white text-black' 
                      : 'text-neutral-400'
                  }`}
                >
                  ="01742"
                </button>
                <button
                  onClick={() => {
                    setOutputMode('pad');
                    processCsv(rawText, selectedColumns, targetLength, 'pad');
                  }}
                  className={`px-2 py-0.5 rounded ${
                    outputMode === 'pad' 
                      ? isLight ? 'bg-black text-white' : 'bg-white text-black' 
                      : 'text-neutral-400'
                  }`}
                >
                  01742
                </button>
                <button
                  onClick={() => {
                    setOutputMode('quotes');
                    processCsv(rawText, selectedColumns, targetLength, 'quotes');
                  }}
                  className={`px-2 py-0.5 rounded ${
                    outputMode === 'quotes' 
                      ? isLight ? 'bg-black text-white' : 'bg-white text-black' 
                      : 'text-neutral-400'
                  }`}
                >
                  "01742"
                </button>
              </div>
            </div>
          </div>

          {cleanedData && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className={`font-mono text-[11px] uppercase tracking-wider ${isLight ? 'text-neutral-500' : 'text-neutral-500'}`}>
                  Formatted Table
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyFixed}
                    className={`px-2.5 py-1 rounded text-xs border transition-colors ${
                      isLight ? 'text-neutral-700 bg-neutral-100 hover:bg-neutral-200 border-neutral-300' : 'text-neutral-300 bg-neutral-900 hover:bg-neutral-800 border-neutral-800'
                    }`}
                  >
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                  <button
                    onClick={handleDownloadFixed}
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
                      {cleanedData.headers.map((h, i) => (
                        <th key={i} className="py-2 px-3 font-normal">
                          {h || `Col ${i + 1}`}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isLight ? 'divide-neutral-100' : 'divide-neutral-900'}`}>
                    {cleanedData.rows.map((row, rIdx) => (
                      <tr key={rIdx} className={isLight ? 'hover:bg-neutral-50' : 'hover:bg-neutral-900/40'}>
                        <td className="py-1.5 px-3 text-neutral-400">{rIdx + 1}</td>
                        {row.map((cell, cIdx) => (
                          <td 
                            key={cIdx} 
                            className={`py-1.5 px-3 truncate max-w-xs ${
                              selectedColumns.includes(cIdx) 
                                ? isLight ? 'text-black font-semibold bg-neutral-100' : 'text-white font-semibold bg-neutral-900' 
                                : isLight ? 'text-neutral-700' : 'text-neutral-300'
                            }`}
                          >
                            {cell}
                          </td>
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
