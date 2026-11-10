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
  convertToSqlInsert, 
  convertToJsonArray, 
  convertToMarkdownTable, 
  convertToHtmlTable, 
  TabularData 
} from '../../utils/tabularEngines';

interface TableConverterViewProps {
  onBack: () => void;
  theme?: 'dark' | 'light';
}

const SAMPLE_CSV = `product_id,product_name,category,unit_price,in_stock
101,Mechanical Keyboard,Hardware,189.99,true
102,Vertical Mouse,Accessories,79.50,true
103,Studio Monitor,Displays,749.00,false
104,Headphones,Audio,299.00,true
`;

export const TableConverterView: React.FC<TableConverterViewProps> = ({ onBack, theme = 'dark' }) => {
  const [rawText, setRawText] = useState('');
  const [parsedData, setParsedData] = useState<TabularData | null>(null);
  const [targetFormat, setTargetFormat] = useState<'sql' | 'json' | 'markdown' | 'html'>('sql');
  const [tableName, setTableName] = useState('products');
  const [convertedOutput, setConvertedOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const isLight = theme === 'light';

  const handleConvert = async (
    text: string, 
    format = targetFormat, 
    tbl = tableName
  ) => {
    if (!text.trim()) return;
    const parsed = await parseCsvString(text);
    setParsedData(parsed);

    let output = '';
    if (format === 'sql') {
      output = convertToSqlInsert(parsed, tbl);
    } else if (format === 'json') {
      output = convertToJsonArray(parsed);
    } else if (format === 'markdown') {
      output = convertToMarkdownTable(parsed);
    } else if (format === 'html') {
      output = convertToHtmlTable(parsed);
    }

    setConvertedOutput(output);
  };

  const handleLoadSample = () => {
    setRawText(SAMPLE_CSV);
    handleConvert(SAMPLE_CSV, targetFormat, tableName);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = String(event.target?.result || '');
      setRawText(content);
      handleConvert(content, targetFormat, tableName);
    };
    reader.readAsText(file);
  };

  const handleCopy = () => {
    if (!convertedOutput) return;
    navigator.clipboard.writeText(convertedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!convertedOutput) return;
    let extension = 'sql';
    let mime = 'text/plain';

    if (targetFormat === 'json') {
      extension = 'json';
      mime = 'application/json';
    } else if (targetFormat === 'markdown') {
      extension = 'md';
      mime = 'text/markdown';
    } else if (targetFormat === 'html') {
      extension = 'html';
      mime = 'text/html';
    }

    const blob = new Blob([convertedOutput], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tableName}.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
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
          Table Converter
        </h1>
        <p className={`text-xs max-w-xl leading-relaxed ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
          Transforms CSV or TSV data into database SQL inserts, structured JSON, or Markdown tables.
        </p>
      </div>

      {/* Format Selector Bar */}
      <div className={`flex flex-wrap items-center justify-between gap-3 border-b pb-2 text-xs ${
        isLight ? 'border-neutral-200' : 'border-neutral-900'
      }`}>
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setTargetFormat('sql');
              handleConvert(rawText, 'sql', tableName);
            }}
            className={`px-3 py-1.5 rounded transition-colors ${
              targetFormat === 'sql'
                ? isLight ? 'bg-black text-white font-medium' : 'bg-white text-black font-medium'
                : isLight ? 'text-neutral-500 hover:text-black' : 'text-neutral-400 hover:text-white'
            }`}
          >
            SQL Insert
          </button>

          <button
            onClick={() => {
              setTargetFormat('json');
              handleConvert(rawText, 'json', tableName);
            }}
            className={`px-3 py-1.5 rounded transition-colors ${
              targetFormat === 'json'
                ? isLight ? 'bg-black text-white font-medium' : 'bg-white text-black font-medium'
                : isLight ? 'text-neutral-500 hover:text-black' : 'text-neutral-400 hover:text-white'
            }`}
          >
            JSON Array
          </button>

          <button
            onClick={() => {
              setTargetFormat('markdown');
              handleConvert(rawText, 'markdown', tableName);
            }}
            className={`px-3 py-1.5 rounded transition-colors ${
              targetFormat === 'markdown'
                ? isLight ? 'bg-black text-white font-medium' : 'bg-white text-black font-medium'
                : isLight ? 'text-neutral-500 hover:text-black' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Markdown Table
          </button>

          <button
            onClick={() => {
              setTargetFormat('html');
              handleConvert(rawText, 'html', tableName);
            }}
            className={`px-3 py-1.5 rounded transition-colors ${
              targetFormat === 'html'
                ? isLight ? 'bg-black text-white font-medium' : 'bg-white text-black font-medium'
                : isLight ? 'text-neutral-500 hover:text-black' : 'text-neutral-400 hover:text-white'
            }`}
          >
            HTML Table
          </button>
        </div>

        {targetFormat === 'sql' && (
          <div className="flex items-center gap-2">
            <span className="text-neutral-500 font-mono text-[11px]">Table name:</span>
            <input 
              type="text"
              value={tableName}
              onChange={(e) => {
                setTableName(e.target.value);
                handleConvert(rawText, targetFormat, e.target.value);
              }}
              className={`border px-2 py-0.5 rounded font-mono text-xs focus:outline-none w-28 ${
                isLight ? 'bg-white border-neutral-300 text-black' : 'bg-black border-neutral-800 text-white'
              }`}
            />
          </div>
        )}
      </div>

      {/* Side-by-side Convert Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className={`font-mono text-[11px] uppercase tracking-wider ${isLight ? 'text-neutral-500' : 'text-neutral-500'}`}>
              Source Table
            </span>
            {rawText && (
              <button onClick={() => { setRawText(''); setConvertedOutput(''); }} className={`transition-colors ${isLight ? 'text-neutral-400 hover:text-black' : 'text-neutral-500 hover:text-white'}`}>
                Clear
              </button>
            )}
          </div>
          <textarea
            value={rawText}
            onChange={(e) => {
              setRawText(e.target.value);
              handleConvert(e.target.value, targetFormat, tableName);
            }}
            placeholder="Paste CSV rows here..."
            rows={18}
            className={`w-full p-3.5 border rounded text-xs font-mono transition-colors resize-y leading-relaxed focus:outline-none ${
              isLight ? 'bg-neutral-50 border-neutral-200 text-black placeholder-neutral-400 focus:border-black' : 'bg-[#0a0a0a] border-neutral-800 text-neutral-100 placeholder-neutral-600 focus:border-neutral-500'
            }`}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className={`font-mono text-[11px] uppercase tracking-wider ${isLight ? 'text-neutral-500' : 'text-neutral-500'}`}>
              Output ({targetFormat.toUpperCase()})
            </span>
            {convertedOutput && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleCopy}
                  className={`px-2 py-0.5 rounded border text-xs transition-colors ${
                    isLight ? 'text-neutral-700 bg-neutral-100 hover:bg-neutral-200 border-neutral-300' : 'text-neutral-300 bg-neutral-900 hover:bg-neutral-800 border-neutral-800'
                  }`}
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  onClick={handleDownload}
                  className={`px-2 py-0.5 rounded font-medium text-xs transition-colors ${
                    isLight ? 'bg-black text-white hover:bg-neutral-800' : 'bg-white text-black hover:bg-neutral-200'
                  }`}
                >
                  Download
                </button>
              </div>
            )}
          </div>

          <textarea
            readOnly
            value={convertedOutput}
            placeholder="Converted output will appear here..."
            rows={18}
            className={`w-full p-3.5 border rounded text-xs font-mono resize-y leading-relaxed focus:outline-none ${
              isLight ? 'bg-neutral-50 border-neutral-200 text-neutral-800' : 'bg-[#070707] border-neutral-900 text-neutral-300'
            }`}
          />
        </div>
      </div>
    </div>
  );
};
