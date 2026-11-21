import { ToolId } from '../../types';

export interface ConverterFaq {
  question: string;
  answer: string;
}

export interface ConverterMetaItem {
  id: ToolId;
  name: string;
  group: 'Data Formats' | 'Encoding' | 'Time & Numbers' | 'Frontend';
  tagline: string;
  inputLabel: string;
  outputLabel: string;
  inputPlaceholder: string;
  outputPlaceholder: string;
  defaultSample: string;
  downloadFilename: string;
  downloadMimeType: string;
  isReversible: boolean;
  swapToolId?: ToolId;
  explanation: string;
  workedExample: {
    title: string;
    input: string;
    output: string;
    notes?: string;
  };
  faqs: ConverterFaq[];
  relatedToolIds: ToolId[];
}

export const CONVERTERS_REGISTRY: Record<string, ConverterMetaItem> = {
  'json-to-csv': {
    id: 'json-to-csv',
    name: 'JSON to CSV Converter',
    group: 'Data Formats',
    tagline: 'Convert JSON arrays and nested objects into clean spreadsheet CSVs',
    inputLabel: 'JSON Input',
    outputLabel: 'CSV Output',
    inputPlaceholder: 'Paste JSON array of objects here...',
    outputPlaceholder: 'Converted CSV table will appear here...',
    defaultSample: JSON.stringify([
      { id: 101, name: 'Aarav Patel', role: 'Full Stack Engineer', city: 'Bengaluru', salary: 1450000, active: true },
      { id: 102, name: 'Priya Sharma', role: 'DevOps Lead', city: 'Pune', salary: 1680000, active: true },
      { id: 103, name: 'Rohan Gupta', role: 'AI Researcher', city: 'Hyderabad', salary: 1950000, active: false }
    ], null, 2),
    downloadFilename: 'vayun-export.csv',
    downloadMimeType: 'text/csv;charset=utf-8;',
    isReversible: true,
    swapToolId: 'csv-to-json',
    explanation: 'JSON to CSV flattens structured JSON documents, nested objects, and arrays into tabular Comma-Separated Values compatible with Microsoft Excel, Google Sheets, Pandas, and database loaders.',
    workedExample: {
      title: 'Flattening an Array of Developer Records',
      input: '[{"id": 1, "user": "karan", "tier": "pro"}, {"id": 2, "user": "ananya", "tier": "enterprise"}]',
      output: '"id","user","tier"\n"1","karan","pro"\n"2","ananya","enterprise"',
      notes: 'Nested fields are automatically resolved using dot-notation column headers.'
    },
    faqs: [
      {
        question: 'Does this converter upload my JSON data to an external server?',
        answer: 'No. Vayun Convert runs 100% inside your browser’s local JavaScript engine. Your API responses, personal records, and confidential payloads never touch a server.'
      },
      {
        question: 'How does it handle nested objects and arrays in JSON?',
        answer: 'Nested objects are recursively flattened using dot-notation headers (e.g. user.address.city). Arrays are converted to JSON strings inside their respective cells.'
      },
      {
        question: 'Can I open the generated CSV directly in Microsoft Excel?',
        answer: 'Yes. The output strictly follows RFC 4180 standards with quoted strings and standard line breaks, opening seamlessly in Excel, Numbers, and Google Sheets.'
      },
      {
        question: 'What is the maximum file size supported?',
        answer: 'Since processing is executed in local RAM via Web Workers and streaming chunks, you can comfortably convert files up to 5 MB without lag.'
      }
    ],
    relatedToolIds: ['csv-to-json', 'json-to-yaml', 'yaml-to-json', 'json-to-xml']
  },

  'csv-to-json': {
    id: 'csv-to-json',
    name: 'CSV to JSON Converter',
    group: 'Data Formats',
    tagline: 'Transform CSV spreadsheets and tabular data into structured JSON',
    inputLabel: 'CSV Input',
    outputLabel: 'JSON Output',
    inputPlaceholder: 'Paste CSV rows (with header on first row)...',
    outputPlaceholder: 'Structured JSON output will appear here...',
    defaultSample: `"product_id","item_name","category","stock","price_inr"
"SKU-901","Mechanical Keyboard","Peripherals",45,3499.00
"SKU-902","Ultra-Wide Monitor","Displays",12,24999.00
"SKU-903","USB-C Docking Hub","Accessories",88,2199.00`,
    downloadFilename: 'vayun-export.json',
    downloadMimeType: 'application/json;charset=utf-8;',
    isReversible: true,
    swapToolId: 'json-to-csv',
    explanation: 'CSV to JSON parses delimited text tables (comma, semicolon, or tab) into an array of clean JSON objects with auto-detected types for numbers, booleans, and strings.',
    workedExample: {
      title: 'Importing Inventory CSV to JSON Array',
      input: '"code","city"\n"BLR","Bengaluru"\n"DEL","New Delhi"',
      output: '[\n  {\n    "code": "BLR",\n    "city": "Bengaluru"\n  },\n  {\n    "code": "DEL",\n    "city": "New Delhi"\n  }\n]',
      notes: 'Header columns automatically map to object keys.'
    },
    faqs: [
      {
        question: 'Does CSV to JSON preserve numbers and boolean flags?',
        answer: 'Yes, dynamic typing is enabled by default so numeric amounts (e.g., 45, 24999.00) and booleans (true/false) are converted into native JSON types rather than strings.'
      },
      {
        question: 'Can I convert tab-separated (TSV) or semicolon-separated files?',
        answer: 'Yes, the parser automatically detects delimiters whether your data uses commas, tabs, or semicolons.'
      },
      {
        question: 'Is my uploaded CSV sent to any cloud server?',
        answer: 'Never. Parsing is executed completely client-side in your browser RAM with zero network requests.'
      }
    ],
    relatedToolIds: ['json-to-csv', 'json-to-yaml', 'yaml-to-json', 'clean-csv']
  },

  'json-to-yaml': {
    id: 'json-to-yaml',
    name: 'JSON to YAML Converter',
    group: 'Data Formats',
    tagline: 'Convert JSON configs into clean, readable YAML manifests',
    inputLabel: 'JSON Input',
    outputLabel: 'YAML Output',
    inputPlaceholder: 'Paste JSON configuration or payload here...',
    outputPlaceholder: 'Clean YAML output will appear here...',
    defaultSample: JSON.stringify({
      apiVersion: 'apps/v1',
      kind: 'Deployment',
      metadata: {
        name: 'vayun-api-service',
        labels: { app: 'vayun-cloud', tier: 'backend' }
      },
      spec: {
        replicas: 3,
        strategy: { type: 'RollingUpdate' },
        template: {
          spec: {
            containers: [{
              name: 'vayun-worker',
              image: 'registry.vayun.xyz/api:v1.4',
              ports: [{ containerPort: 8080 }]
            }]
          }
        }
      }
    }, null, 2),
    downloadFilename: 'vayun-config.yaml',
    downloadMimeType: 'text/yaml;charset=utf-8;',
    isReversible: true,
    swapToolId: 'yaml-to-json',
    explanation: 'JSON to YAML transforms JSON configurations into human-friendly YAML with 2-space indentation, ideal for Docker Compose, Kubernetes manifests, GitHub Actions, and CI/CD pipelines.',
    workedExample: {
      title: 'Converting Server Config JSON to YAML',
      input: '{"service": "vayun-auth", "port": 4000, "debug": false}',
      output: 'service: vayun-auth\nport: 4000\ndebug: false\n',
      notes: 'Produces standard YAML 1.2 compliant documents.'
    },
    faqs: [
      {
        question: 'Why convert JSON to YAML?',
        answer: 'YAML is significantly easier to read and maintain for developer configuration files, CI/CD scripts, Helm charts, and Kubernetes deployments without curly brace clutter.'
      },
      {
        question: 'Does this handle nested objects and multi-line strings?',
        answer: 'Yes, objects, arrays, and complex nested hierarchies are formatted cleanly with strict 2-space indentation.'
      },
      {
        question: 'Is my data secure?',
        answer: 'All conversions run client-side using js-yaml in your browser. No tokens, keys, or secrets are ever transmitted.'
      }
    ],
    relatedToolIds: ['yaml-to-json', 'json-to-csv', 'json-to-xml']
  },

  'yaml-to-json': {
    id: 'yaml-to-json',
    name: 'YAML to JSON Converter',
    group: 'Data Formats',
    tagline: 'Parse YAML documents and Helm manifests into formatted JSON',
    inputLabel: 'YAML Input',
    outputLabel: 'JSON Output',
    inputPlaceholder: 'Paste YAML content here...',
    outputPlaceholder: 'Parsed JSON will appear here...',
    defaultSample: `server:
  host: 0.0.0.0
  port: 8080
  workers: 4
database:
  engine: postgresql
  ssl: true
  pool_size: 20
features:
  - zero_leakage_ram
  - in_browser_converters
  - instant_export`,
    downloadFilename: 'vayun-config.json',
    downloadMimeType: 'application/json;charset=utf-8;',
    isReversible: true,
    swapToolId: 'json-to-yaml',
    explanation: 'YAML to JSON verifies and converts YAML syntax into standardized JSON. Catch syntax errors, indentation bugs, and unquoted strings with precise line-number error messages.',
    workedExample: {
      title: 'Parsing Docker Service YAML to JSON',
      input: 'app:\n  name: vayun-hub\n  version: 2.0',
      output: '{\n  "app": {\n    "name": "vayun-hub",\n    "version": 2\n  }\n}',
      notes: 'Line numbers are reported instantly if indentation is invalid.'
    },
    faqs: [
      {
        question: 'What happens if my YAML has an indentation error?',
        answer: 'Vayun Convert highlights the exact line and column number of the indentation mismatch so you can fix it immediately.'
      },
      {
        question: 'Can I pretty-print the JSON output?',
        answer: 'Yes, the output is formatted with 2-space indentation for maximum readability and can be copied or downloaded with one click.'
      }
    ],
    relatedToolIds: ['json-to-yaml', 'json-to-csv', 'json-to-xml']
  },

  'json-to-xml': {
    id: 'json-to-xml',
    name: 'JSON to XML Converter',
    group: 'Data Formats',
    tagline: 'Convert JSON payloads into formatted XML with customizable root tag',
    inputLabel: 'JSON Input',
    outputLabel: 'XML Output',
    inputPlaceholder: 'Paste JSON object or array...',
    outputPlaceholder: 'Structured XML document will appear here...',
    defaultSample: JSON.stringify({
      order: {
        id: 'ORD-98214',
        date: '2026-11-21',
        customer: {
          name: 'Vikram Mehta',
          email: 'vikram@example.com'
        },
        items: [
          { name: 'Cloud Server Pro', qty: 1, price: 4999 },
          { name: 'Domain Registration', qty: 2, price: 899 }
        ],
        currency: 'INR'
      }
    }, null, 2),
    downloadFilename: 'vayun-export.xml',
    downloadMimeType: 'application/xml;charset=utf-8;',
    isReversible: false,
    explanation: 'JSON to XML converts JSON data structures into well-formed XML documents with XML declaration headers, sanitized entity tags, and clean indentation.',
    workedExample: {
      title: 'Converting Order Data to XML',
      input: '{"book": {"title": "Zero to One", "author": "Peter Thiel"}}',
      output: '<?xml version="1.0" encoding="UTF-8"?>\n<root>\n  <book>\n    <title>Zero to One</title>\n    <author>Peter Thiel</author>\n  </book>\n</root>',
      notes: 'Special XML entities such as < and & are escaped automatically.'
    },
    faqs: [
      {
        question: 'Does this handle special characters in values?',
        answer: 'Yes, characters like &, <, >, ", and \' are safely converted to XML entities (&amp;, &lt;, etc.).'
      },
      {
        question: 'What is the root tag used for the document?',
        answer: 'By default, the XML document is wrapped in a standard <root> node, which ensures strict XML validity.'
      }
    ],
    relatedToolIds: ['json-to-csv', 'json-to-yaml', 'csv-to-json']
  },

  'base64-converter': {
    id: 'base64-converter',
    name: 'Base64 Encode & Decode',
    group: 'Encoding',
    tagline: 'Bidirectional UTF-8 safe Base64 encoder and decoder',
    inputLabel: 'Plaintext or Base64 Input',
    outputLabel: 'Converted Output',
    inputPlaceholder: 'Enter text to encode or Base64 string to decode...',
    outputPlaceholder: 'Encoded or decoded result will appear here...',
    defaultSample: 'Vayun Convert: Fast, Private, In-Browser Developer Tools 🚀',
    downloadFilename: 'base64-result.txt',
    downloadMimeType: 'text/plain;charset=utf-8;',
    isReversible: true,
    explanation: 'Base64 converts binary data and text into an ASCII string format using 64 printable characters. This tool is UTF-8 safe, preventing standard JavaScript btoa crashes on emojis and non-Latin scripts.',
    workedExample: {
      title: 'Encoding Unicode Text to Base64',
      input: 'Hello India 🇮🇳',
      output: 'SGVsbG8gSW5kaWEg8J+HruKAmQ==',
      notes: 'Full UTF-8 support ensures international characters and emojis decode without corruption.'
    },
    faqs: [
      {
        question: 'Why do other Base64 websites fail on emojis and Hindi text?',
        answer: 'Standard browser btoa() only supports Latin1 characters and throws an InvalidCharacterError on Unicode. Vayun uses a custom TextEncoder pipeline that safely handles all Unicode code points.'
      },
      {
        question: 'Are my encoded tokens or secrets recorded?',
        answer: 'No. Everything executes in client memory. No telemetry or inputs are stored or transmitted anywhere.'
      }
    ],
    relatedToolIds: ['url-converter', 'jwt-decoder']
  },

  'url-converter': {
    id: 'url-converter',
    name: 'URL Encode & Decode',
    group: 'Encoding',
    tagline: 'Encode and decode URI query parameters and special characters',
    inputLabel: 'URL or Query String',
    outputLabel: 'Converted Result',
    inputPlaceholder: 'Paste raw URL or percentage-encoded query parameter...',
    outputPlaceholder: 'Converted result will appear here...',
    defaultSample: 'https://vayun.xyz/search?q=developer tools in india&filter=json+to+csv&category=code & data',
    downloadFilename: 'url-result.txt',
    downloadMimeType: 'text/plain;charset=utf-8;',
    isReversible: true,
    explanation: 'URL Encoding converts reserved characters (such as spaces, ampersands, slashes, and non-ASCII glyphs) into percent-encoded octets (%20, %26) for safe HTTP transmission.',
    workedExample: {
      title: 'Encoding Query String with Spaces and Symbols',
      input: 'name=Himanshu Mishra&skills=AI & Cloud',
      output: 'name%3DHimanshu%20Mishra%26skills%3DAI%20%26%20Cloud',
      notes: 'Choose between component encoding or full URI encoding.'
    },
    faqs: [
      {
        question: 'What is the difference between encodeURI and encodeURIComponent?',
        answer: 'encodeURI preserves protocol and host delimiters like :// and ?, whereas encodeURIComponent escapes every special character, making query values safe inside URLs.'
      },
      {
        question: 'Does this handle multi-byte Unicode strings?',
        answer: 'Yes, UTF-8 byte sequences are properly escaped into standard percent-encoded pairs.'
      }
    ],
    relatedToolIds: ['base64-converter', 'jwt-decoder']
  },

  'jwt-decoder': {
    id: 'jwt-decoder',
    name: 'JWT Token Decoder',
    group: 'Encoding',
    tagline: 'Decode JSON Web Token headers and payloads client-side with expiration check',
    inputLabel: 'Encoded JWT String',
    outputLabel: 'Decoded Header, Claims & Expiration Status',
    inputPlaceholder: 'Paste your eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... token here',
    outputPlaceholder: 'Decoded JSON claims and token telemetry will appear here...',
    defaultSample: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzk4MTEyIiwibmFtZSI6IkhpbWFuc2h1IE1pc2hyYSIsImFkbWluIjp0cnVlLCJpYXQiOjE3MzIxNjk0MDAsImV4cCI6MTc2MzcyNjQwMCwiaXNzIjoidmF5dW4ueHl6In0.abcdef1234567890signature',
    downloadFilename: 'jwt-decoded.json',
    downloadMimeType: 'application/json;charset=utf-8;',
    isReversible: false,
    explanation: 'JWT Token Decoder splits and inspects JSON Web Tokens in your browser. View claims, issuer, algorithm, and calculate active/expired duration without exposing sensitive access tokens to external servers.',
    workedExample: {
      title: 'Inspecting Auth Claims and Expiration',
      input: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIn0.sig',
      output: '{\n  "header": {\n    "alg": "HS256"\n  },\n  "payload": {\n    "sub": "1234567890",\n    "name": "John Doe"\n  }\n}',
      notes: 'Decodes Base64Url parts directly in client RAM.'
    },
    faqs: [
      {
        question: 'Is it safe to paste production API tokens here?',
        answer: 'Yes! Unlike public converter sites that send tokens to backend servers, Vayun Convert decodes tokens entirely inside your local browser tab. No network requests are ever dispatched.'
      },
      {
        question: 'Does this tool verify token cryptographic signatures?',
        answer: 'This tool decodes and displays the header, payload claims, and algorithm. Verifying a cryptographic signature requires your private secret key, which should never be entered into any website.'
      },
      {
        question: 'How are timestamps like exp and iat formatted?',
        answer: 'Timestamps are automatically converted to human-readable Indian Standard Time (IST) and UTC with remaining expiration countdowns.'
      }
    ],
    relatedToolIds: ['base64-converter', 'url-converter', 'unix-timestamp']
  },

  'unix-timestamp': {
    id: 'unix-timestamp',
    name: 'Unix Timestamp to Date',
    group: 'Time & Numbers',
    tagline: 'Convert Unix epoch timestamps to human dates in IST and UTC',
    inputLabel: 'Unix Timestamp or Date String',
    outputLabel: 'Converted Date Formats & Relative Time',
    inputPlaceholder: 'Enter 10-digit (seconds) or 13-digit (ms) timestamp...',
    outputPlaceholder: 'Converted timezones and relative calculations will appear here...',
    defaultSample: '1732185600',
    downloadFilename: 'timestamp-converted.txt',
    downloadMimeType: 'text/plain;charset=utf-8;',
    isReversible: true,
    explanation: 'Unix Timestamp Converter translates seconds or milliseconds elapsed since January 1, 1970 UTC into clear calendar dates across Indian Standard Time (IST), UTC, ISO 8601, and relative offsets.',
    workedExample: {
      title: 'Converting Epoch Seconds to IST & UTC',
      input: '1732185600',
      output: 'IST: Thursday, November 21, 2026 at 4:10:00 PM IST\nUTC: Thu, 21 Nov 2026 10:40:00 GMT\nISO 8601: 2026-11-21T10:40:00.000Z',
      notes: 'Auto-detects 10-digit seconds vs 13-digit milliseconds.'
    },
    faqs: [
      {
        question: 'How does it distinguish seconds from milliseconds?',
        answer: 'If the timestamp is 10 digits or fewer (e.g. 1732185600), it treats it as epoch seconds; if 13 digits (e.g. 1732185600000), it treats it as milliseconds.'
      },
      {
        question: 'Are results formatted in Indian Standard Time (IST)?',
        answer: 'Yes! It explicitly renders dates in Indian Standard Time (Asia/Kolkata UTC+5:30) alongside standard UTC.'
      },
      {
        question: 'Can I convert backwards from a date string to a timestamp?',
        answer: 'Yes. Simply paste an ISO date or standard date string (e.g. 2026-11-21) and it converts it to numeric epoch timestamps.'
      }
    ],
    relatedToolIds: ['number-to-words-inr', 'jwt-decoder']
  },

  'number-to-words-inr': {
    id: 'number-to-words-inr',
    name: 'Number to Words (INR Lakh / Crore)',
    group: 'Time & Numbers',
    tagline: 'Convert invoice amounts and numbers to Indian words with Lakhs and Crores',
    inputLabel: 'Amount in INR (Numbers)',
    outputLabel: 'Amount in Words (Cheque / Invoice Format)',
    inputPlaceholder: 'Enter amount e.g. 1250000 or 45890.50...',
    outputPlaceholder: 'Words in Indian currency format will appear here...',
    defaultSample: '1245780.50',
    downloadFilename: 'amount-words.txt',
    downloadMimeType: 'text/plain;charset=utf-8;',
    isReversible: false,
    explanation: 'Number to Words (INR) converts financial values into words following the Indian Numbering System (Crore, Lakh, Thousand, Hundred, Rupees, Paise). Essential for GST invoices, banking cheques, and legal agreements.',
    workedExample: {
      title: 'Formatting an Indian Business Invoice Total',
      input: '1245780.50',
      output: 'Twelve Lakh Forty-Five Thousand Seven Hundred and Eighty Rupees and Fifty Paise Only\nFormatted: ₹ 12,45,780.50',
      notes: 'Includes exact paise handling and Indian comma grouping.'
    },
    faqs: [
      {
        question: 'How does the Indian numbering system differ from the Western system?',
        answer: 'In the Indian numbering system, numbers are grouped into Lakhs (1,00,000) and Crores (1,00,00,000) rather than Millions and Billions.'
      },
      {
        question: 'Does this converter handle decimal amounts (paise)?',
        answer: 'Yes. Decimal portions are automatically converted into words as Paise (e.g. .50 -> "and Fifty Paise Only").'
      },
      {
        question: 'Is this format accepted on Indian bank cheques and GST invoices?',
        answer: 'Yes, it follows the standard legal format ending with "Rupees Only" or "Rupees and [X] Paise Only" required by Indian financial institutions.'
      }
    ],
    relatedToolIds: ['unix-timestamp', 'invoice-maker', 'clean-csv']
  },

  'hex-to-rgb': {
    id: 'hex-to-rgb',
    name: 'HEX to RGB & HSL Converter',
    group: 'Frontend',
    tagline: 'Convert HEX color codes to RGB, RGBA, and HSL with live visual swatch',
    inputLabel: 'Color Code (HEX, RGB, or HSL)',
    outputLabel: 'CSS Color Formats',
    inputPlaceholder: 'Enter HEX code e.g. #3b82f6 or rgb(59, 130, 246)...',
    outputPlaceholder: 'CSS values will appear here...',
    defaultSample: '#3b82f6',
    downloadFilename: 'color-palette.txt',
    downloadMimeType: 'text/plain;charset=utf-8;',
    isReversible: true,
    explanation: 'HEX to RGB converts hexadecimal web colors to RGB, RGBA, HSL, and HSLA formats with an interactive live color preview swatch and 1-click CSS copying.',
    workedExample: {
      title: 'Converting Brand Blue to RGB & HSL',
      input: '#3b82f6',
      output: 'RGB: rgb(59, 130, 246)\nRGBA: rgba(59, 130, 246, 1)\nHSL: hsl(217, 91%, 60%)\nHSLA: hsla(217, 91%, 60%, 1)',
      notes: 'Live color picker allows visual tweaking in real time.'
    },
    faqs: [
      {
        question: 'Can I convert 8-digit HEX codes with alpha transparency?',
        answer: 'Yes! 8-digit hex codes (e.g. #3b82f680) are parsed with their exact decimal alpha opacity.'
      },
      {
        question: 'Can I reverse convert from RGB back to HEX?',
        answer: 'Yes, paste an rgb(r, g, b) value or click the Swap button to convert RGB back into HEX.'
      }
    ],
    relatedToolIds: ['px-to-rem']
  },

  'px-to-rem': {
    id: 'px-to-rem',
    name: 'px to rem / rem to px Converter',
    group: 'Frontend',
    tagline: 'Convert pixel values to rem units with adjustable base font size',
    inputLabel: 'Value in Pixels (px) or rem',
    outputLabel: 'Converted CSS & Tailwind Equivalent',
    inputPlaceholder: 'Enter pixels e.g. 24px or 1.5rem...',
    outputPlaceholder: 'Converted unit and CSS declaration will appear here...',
    defaultSample: '24px',
    downloadFilename: 'px-rem-result.txt',
    downloadMimeType: 'text/plain;charset=utf-8;',
    isReversible: true,
    explanation: 'px to rem converts absolute pixel sizes into relative rem units based on your root HTML font size (default 16px). Includes recommended Tailwind CSS class equivalents.',
    workedExample: {
      title: 'Converting 24px with Standard 16px Base',
      input: '24px',
      output: '1.5rem\nCSS: font-size: 1.5rem; /* 24px with base 16px */\nTailwind: p-6 / m-6 / w-6 / h-6',
      notes: 'Rem units ensure accessible scaling when users adjust system font settings.'
    },
    faqs: [
      {
        question: 'Why should I use rem instead of px in CSS?',
        answer: 'rem units scale relative to the user’s root browser font size, ensuring your web application respects accessibility settings for visually impaired users.'
      },
      {
        question: 'Can I change the base font size from 16px?',
        answer: 'Yes, you can configure any base font size (such as 10px for the 62.5% trick or 14px).'
      },
      {
        question: 'Does this converter provide Tailwind CSS equivalents?',
        answer: 'Yes, for standard 4px Tailwind grid multiples, it automatically suggests the matching utility class (e.g. 16px = 1rem = p-4/w-4/h-4).'
      }
    ],
    relatedToolIds: ['hex-to-rgb']
  }
};
