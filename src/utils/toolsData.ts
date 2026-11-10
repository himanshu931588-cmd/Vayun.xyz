import { ToolMeta } from '../types';

export const TOOLS: ToolMeta[] = [
  // Developer Flow & Viva Suite
  {
    id: 'vayun-flow',
    name: 'Vayun Flow',
    tagline: 'AST call-graph & runtime trace scrubber',
    category: 'developer',
    categoryName: 'Developer Flow',
    icon: 'Network',
    description: 'Transform multi-file student repositories into visual execution maps. Scrub through variable mutations, API routes, and DB index lookups step-by-step.',
    seoSlug: 'vayun-flow',
    popular: true,
    keywords: ['api', 'flow', 'ast', 'callgraph', 'trace', 'scrubber', 'debug', 'code', 'repository', 'github', 'architecture', 'graph', 'database', 'queries', 'variables']
  },
  {
    id: 'vayun-viva',
    name: 'Vayun Viva',
    tagline: 'Socratic codebase defense & placement simulator',
    category: 'developer',
    categoryName: 'Developer Flow',
    icon: 'ShieldCheck',
    description: 'Defend your actual codebase against a strict Socratic technical examiner across 3 tiers of depth. Prove understanding without AI autocomplete shortcuts.',
    seoSlug: 'vayun-viva',
    popular: true,
    keywords: ['viva', 'defense', 'interview', 'placement', 'socratic', 'exam', 'questions', 'scorecard', 'test', 'voice', 'oral', 'code defense', 'anti-black-box', 'guardrail', 'api']
  },
  {
    id: 'vayun-break',
    name: 'Vayun Break',
    tagline: 'Wind-tunnel bug injection sandbox',
    category: 'developer',
    categoryName: 'Developer Flow',
    icon: 'Flame',
    description: 'Inject real-world bugs (null pointers, async race conditions, off-by-one loops) into working code and practice stack-trace diagnosis with Socratic hints.',
    seoSlug: 'vayun-break',
    popular: true,
    keywords: ['break', 'bug', 'chaos', 'wind-tunnel', 'stack trace', 'error', 'debugging', 'rubber-duck', 'hints', 'race condition', 'null pointer', 'diagnostics', 'tests']
  },
  {
    id: 'vayun-spec',
    name: 'Vayun Spec',
    tagline: 'Pre-code architecture & trade-off workbench',
    category: 'developer',
    categoryName: 'Developer Flow',
    icon: 'Scale',
    description: 'Model database entities, API endpoint contracts, and Big-O architectural trade-offs before writing or generating code.',
    seoSlug: 'vayun-spec',
    keywords: ['spec', 'api', 'contracts', 'schema', 'architecture', 'endpoints', 'trade-offs', 'database', 'model', 'pre-code', 'design', 'openapi', 'rest']
  },
  {
    id: 'ascii-art',
    name: 'Ink Garden ASCII',
    tagline: 'Canvas2D raster visualizer & ASCII engine',
    category: 'developer',
    categoryName: 'Developer Flow',
    icon: 'Sparkles',
    description: 'Recreate the 21st.dev Ink Garden effect in pure Canvas2D. Features 25 render modes, Bayer dithering, matrix code rain, harmonic pulse, and real-time PFX optical shaders.',
    seoSlug: 'ink-garden-ascii',
    popular: true,
    keywords: ['ascii', 'ink garden', '21st.dev', 'dither', 'matrix', 'raster', 'canvas', 'halftone', 'shader', 'bloom', 'vignette', 'scanlines', 'art', 'code rain', 'sobel', 'contour']
  },

  // PDF Suite & Executive Resume
  {
    id: 'resume-builder',
    name: 'Resume Builder',
    tagline: 'Executive CV with photo & PDF export',
    category: 'pdf',
    categoryName: 'PDF Suite',
    icon: 'FileText',
    description: 'Create an ATS-friendly executive resume with photo upload, work history, skills, and instant clean PDF generation.',
    seoSlug: 'resume-builder',
    popular: true,
    keywords: ['resume', 'cv', 'builder', 'curriculum vitae', 'job', 'placement', 'photo', 'pdf', 'ats', 'career', 'student', 'internship', 'profile']
  },
  {
    id: 'merge-pdf',
    name: 'Merge PDF',
    tagline: 'Combine multiple PDF files',
    category: 'pdf',
    categoryName: 'PDF Suite',
    icon: 'Layers',
    description: 'Combine multiple PDF documents into a single file in the exact order you choose. 100% in-browser RAM execution.',
    seoSlug: 'merge-pdf',
    popular: true,
    keywords: ['merge', 'combine', 'pdf', 'join', 'append', 'documents', 'unite', 'order']
  },
  {
    id: 'split-pdf',
    name: 'Split & Extract PDF',
    tagline: 'Separate pages or extract ranges',
    category: 'pdf',
    categoryName: 'PDF Suite',
    icon: 'Scissors',
    description: 'Extract specific page ranges (e.g. 1-4, 8) or split multi-page documents into standalone single-page files.',
    seoSlug: 'split-pdf',
    keywords: ['split', 'extract', 'pdf', 'pages', 'range', 'cut', 'separate', 'select']
  },
  {
    id: 'compress-pdf',
    name: 'Compress PDF',
    tagline: 'Reduce file size client-side',
    category: 'pdf',
    categoryName: 'PDF Suite',
    icon: 'FileArchive',
    description: 'Compress heavy PDFs by removing redundant metadata, optimizing dictionaries, and cleaning object streams.',
    seoSlug: 'compress-pdf',
    popular: true,
    keywords: ['compress', 'shrink', 'reduce', 'pdf', 'size', 'optimize', 'lighten', 'mb', 'kb']
  },
  {
    id: 'image-to-pdf',
    name: 'Image to PDF',
    tagline: 'Convert PNG & JPG to PDF',
    category: 'pdf',
    categoryName: 'PDF Suite',
    icon: 'Image',
    description: 'Convert images (PNG, JPEG, WebP) into a consolidated, clean, printable PDF document with custom page margins.',
    seoSlug: 'image-to-pdf',
    keywords: ['image', 'jpg', 'png', 'jpeg', 'webp', 'photo', 'picture', 'convert', 'pdf', 'document']
  },

  // AI & Token Tools
  {
    id: 'thread-rescuer',
    name: 'Thread Rescuer',
    tagline: 'Conversation continuity capsule',
    category: 'ai',
    categoryName: 'AI Context',
    icon: 'BrainCircuit',
    description: 'Distill long Claude or ChatGPT conversations into a structured continuity brief to continue in a fresh session.',
    seoSlug: 'thread-rescuer',
    popular: true,
    keywords: ['thread', 'rescuer', 'ai', 'context', 'chatgpt', 'claude', 'token', 'summary', 'capsule', 'conversation', 'llm', 'prompt']
  },
  {
    id: 'token-slimmer',
    name: 'Token Slimmer',
    tagline: 'Strip comments, logs, and whitespace',
    category: 'ai',
    categoryName: 'AI Context',
    icon: 'Minimize2',
    description: 'Reduce code prompt token cost by up to 60% by stripping comments, debug console calls, and extra spacing.',
    seoSlug: 'token-slimmer',
    popular: true,
    keywords: ['token', 'slimmer', 'minify', 'strip', 'comments', 'console', 'whitespace', 'cost', 'llm', 'prompt', 'code']
  },
  {
    id: 'prompt-sanitizer',
    name: 'Prompt Sanitizer',
    tagline: 'Mask API keys and sensitive secrets',
    category: 'ai',
    categoryName: 'AI Context',
    icon: 'ShieldCheck',
    description: 'Automatically redact API keys, JWT tokens, IP addresses, emails, and credentials before pasting into LLM chats.',
    seoSlug: 'prompt-sanitizer',
    keywords: ['prompt', 'sanitizer', 'mask', 'redact', 'api key', 'secret', 'jwt', 'credentials', 'password', 'privacy', 'security']
  },

  // Billing & Micro-Transactions
  {
    id: 'invoice-maker',
    name: 'Instant Invoice',
    tagline: 'Client-side PDF invoicing with pay links',
    category: 'billing',
    categoryName: 'Invoicing',
    icon: 'Receipt',
    description: 'Generate clean, printable PDF invoices and shareable PayLinks with zero account sign-up.',
    seoSlug: 'invoice-maker',
    popular: true,
    keywords: ['invoice', 'bill', 'receipt', 'paylink', 'payment', 'freelance', 'billing', 'upi', 'stripe', 'money', 'pdf']
  },
  {
    id: 'paylink-view',
    name: 'PayLink Reader',
    tagline: 'Decode & view shared invoice links',
    category: 'billing',
    categoryName: 'Invoicing',
    icon: 'Link',
    description: 'Decode and inspect cryptographic zero-backend invoice payloads from URL hash fragments.',
    seoSlug: 'paylink-view',
    keywords: ['paylink', 'reader', 'decode', 'view', 'invoice', 'shared', 'payment', 'url', 'hash']
  },
  {
    id: 'receipt-matcher',
    name: 'Receipt Matcher',
    tagline: 'Extract line items from expense photos',
    category: 'billing',
    categoryName: 'Invoicing',
    icon: 'Sparkles',
    description: 'Parse receipts or expense photos client-side to generate line items ready to import into your invoice.',
    seoSlug: 'receipt-matcher',
    keywords: ['receipt', 'matcher', 'expense', 'photo', 'ocr', 'items', 'extract', 'bills', 'scan']
  },

  // Tabular Data Scrubbing
  {
    id: 'clean-csv',
    name: 'Clean CSV',
    tagline: 'Remove empty rows, trim whitespace & dedup',
    category: 'tabular',
    categoryName: 'Tabular',
    icon: 'Table',
    description: 'Sanitize messy CSV exports by trimming whitespace, normalizing delimiters, removing blank rows, and deduplicating.',
    seoSlug: 'clean-csv',
    keywords: ['csv', 'clean', 'tabular', 'spreadsheet', 'excel', 'dedup', 'whitespace', 'sanitize', 'table', 'data']
  },
  {
    id: 'preserve-zeros',
    name: 'Preserve Leading Zeros',
    tagline: 'Format IDs and ZIP codes for Excel',
    category: 'tabular',
    categoryName: 'Tabular',
    icon: 'FileSpreadsheet',
    description: 'Fix Excel auto-formatting that strips leading zeros from ZIP codes, student IDs, and phone numbers.',
    seoSlug: 'preserve-zeros',
    keywords: ['preserve', 'zeros', 'leading zeros', 'excel', 'zip code', 'phone', 'id', 'csv', 'format']
  },
  {
    id: 'table-converter',
    name: 'Table Converter',
    tagline: 'Convert CSV to Markdown, JSON, HTML, SQL',
    category: 'tabular',
    categoryName: 'Tabular',
    icon: 'FileCode2',
    description: 'Convert CSV tables into GitHub Markdown tables, formatted JSON arrays, HTML markup, or SQL INSERT queries.',
    seoSlug: 'table-converter',
    keywords: ['table', 'converter', 'csv', 'json', 'sql', 'markdown', 'html', 'export', 'transform']
  }
];
