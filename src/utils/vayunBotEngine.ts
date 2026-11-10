import { ToolId } from '../types';
import { TOOLS } from './toolsData';
import { callGemini, getStoredApiKey, getStoredModel } from './geminiApi';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedTools?: ToolId[];
}

export const VAYUN_SYSTEM_INSTRUCTION = `You are Vayun (vayun.xyz), an expert, ultra-knowledgeable AI assistant, coding copilot, and workstation guide for the Vayun.xyz platform.

CORE PRINCIPLES OF VAYUN.XYZ:
1. Zero Remote Uploads: All document manipulation (PDFs, images, tables) and code AST analysis occur strictly inside client browser RAM via WebAssembly/JS. Nothing is uploaded to remote company servers.
2. Zero Tracking & No Accounts: No analytics pixels, no login walls, no paywalls. Everything is 100% free.
3. Anti-Black-Box Philosophy: We empower developers to understand their actual code AST, control flow, Big-O complexity, and failure modes instead of blindly relying on autocomplete.

TOOLS IN THE VAYUN WORKSTATION:
- Vayun Flow (tool:vayun-flow): Multi-file AST call graph generator and runtime trace scrubber. Visualizes function hops, state mutations, and API route flows.
- Vayun Viva (tool:vayun-viva): Socratic technical examiner simulator. Asks 3 tiers of probing architectural questions about the developer's real code.
- Vayun Break (tool:vayun-break): Wind-tunnel bug injection sandbox for practicing real-world debugging.
- Vayun Spec (tool:vayun-spec): Pre-code architecture and API contract modeling workbench.
- Ink Garden ASCII (tool:ascii-art): Canvas2D raster visualizer and ASCII optical shader engine.
- Split PDF (tool:split-pdf): High-capacity PDF extractor supporting ranges (e.g. 1-100, 1-500) and batch chunking (every 10, 25, 50 pages).
- Merge PDF (tool:merge-pdf): In-browser multi-PDF document joiner.
- Compress PDF (tool:compress-pdf): Client-side PDF stream optimization and size reduction.
- Image to PDF (tool:image-to-pdf): Convert PNG/JPEG galleries directly into PDFs.
- Resume Builder (tool:resume-builder): ATS-friendly, clean executive resume builder with live preview and PDF export.
- Token Slimmer (tool:token-slimmer): AI prompt token compressor preserving semantic meaning.
- Prompt Sanitizer (tool:prompt-sanitizer): Scans prompts and redacts API keys, credentials, and PII.
- Thread Rescuer (tool:thread-rescuer): Re-indexes lengthy LLM context threads into structured cards.
- Invoice Maker (tool:invoice-maker): Generates client-side printable PDF invoices and billing receipts.
- PayLink View (tool:paylink-view): Zero-knowledge shareable payment link visualizer.
- Clean CSV (tool:clean-csv): Deduplicate, normalize, and fix malformed tabular data in RAM.
- Preserve Zeros (tool:preserve-zeros): Prevents Excel/Sheets from truncating leading zeros in IDs, phone numbers, and codes.
- Table Converter (tool:table-converter): Converts tables between JSON, CSV, TSV, HTML, and Markdown.
- Browser Extension: Manifest V3 extension for Chrome, Edge, and Brave with right-click code inspection.

YOUR CAPABILITIES:
- You answer ANY question about how to use Vayun.xyz tools, explaining step-by-step instructions.
- You can explain, write, analyze, and debug code in any programming language (TypeScript, JavaScript, Python, C++, Java, Rust, Go, SQL, HTML/CSS).
- You can solve algorithms, optimize Big-O time and space complexity, and diagnose tricky concurrency or edge case bugs.
- You can answer questions about PDF document formats, token counting, LLMs, and web security.
- Whenever you recommend a Vayun tool for a task, mention its exact tool tag: [Tool Name](tool:tool-id) so the user can click it to jump right in.
- Maintain a polite, professional, concise, and helpful tone using simple English without emojis or sticker clutter.`;

// Intelligent built-in knowledge base for instant offline answers when no Gemini API key is configured
export function getOfflineVayunAnswer(query: string): { reply: string; suggestedTools: ToolId[] } {
  const q = query.toLowerCase().trim();

  if (q.includes('split') || q.includes('extract') || q.includes('page') && q.includes('pdf')) {
    return {
      reply: `To split or extract pages from a PDF on Vayun:
1. Open the **Split PDF** tool.
2. Drag and drop your PDF document into the browser dropzone.
3. Choose your preferred extraction mode:
   - **Custom Page Ranges:** Enter comma-separated ranges such as "1-50, 51-100, 101-250".
   - **Quick Batch Presets:** Click to automatically split the PDF into fixed chunks of every 10, 25, or 50 pages.
   - **Individual Pages:** Extract every page as a separate numbered PDF.
4. Click **Split & Download**.

All processing is executed in local browser RAM via PDF-Lib and WebAssembly with zero remote uploads.`,
      suggestedTools: ['split-pdf']
    };
  }

  if (q.includes('merge') || q.includes('combine') && q.includes('pdf')) {
    return {
      reply: `To merge multiple PDF files:
1. Open the **Merge PDF** tool.
2. Drop or select two or more PDF documents.
3. Reorder the documents as desired using the drag handles.
4. Click **Merge PDFs** to instantly compile them into a single file in browser memory.`,
      suggestedTools: ['merge-pdf']
    };
  }

  if (q.includes('flow') || q.includes('ast') || q.includes('call graph') || q.includes('trace')) {
    return {
      reply: `**Vayun Flow** is designed for visual code execution tracing:
- It parses your code files into an Abstract Syntax Tree (AST).
- Generates an interactive graph displaying component hierarchies, API route calls, database lookups, and function interactions.
- Allows you to step through execution traces to inspect how data mutates across multiple files.

You can paste your snippets directly or inspect multi-file repositories.`,
      suggestedTools: ['vayun-flow']
    };
  }

  if (q.includes('viva') || q.includes('interview') || q.includes('exam') || q.includes('defense')) {
    return {
      reply: `**Vayun Viva Defense** acts as a strict Socratic technical examiner for your code:
- Paste your actual project code.
- Viva analyzes your logic and asks targeted questions across 3 tiers of depth:
  1. **Tier 1:** Core Control Flow & Data Structures.
  2. **Tier 2:** Asymptotic Complexity (Big-O) & Memory Allocation.
  3. **Tier 3:** Concurrency, Edge Case Failures & System Boundaries.
- You defend your architectural choices verbally or in text, receiving scored feedback and diagnostic gaps.`,
      suggestedTools: ['vayun-viva']
    };
  }

  if (q.includes('break') || q.includes('bug') || q.includes('inject') || q.includes('chaos')) {
    return {
      reply: `**Vayun Break** is an interactive bug injection sandbox:
- Paste your working code.
- Select from real-world bug archetypes: Null Pointer exceptions, Async Race Conditions, Off-by-one loops, or Memory Leaks.
- The engine injects subtle defects into your code, presents the resulting stack trace, and guides you with Socratic diagnostic hints to fix them.`,
      suggestedTools: ['vayun-break']
    };
  }

  if (q.includes('privacy') || q.includes('ram') || q.includes('upload') || q.includes('security') || q.includes('safe')) {
    return {
      reply: `**The Vayun Zero-Knowledge RAM Privacy Guarantee:**
- **Zero Remote Uploads:** All PDF manipulations, code AST parsing, image formatting, and CSV transformations execute strictly within your local browser tab memory via WebAssembly and JavaScript engines.
- **Zero Tracking:** No tracking cookies, no advertising pixels, and no third-party telemetry.
- **No Accounts Required:** Every tool is completely free with no registration or paywalls.
- When you close or refresh the tab, in-memory buffers are instantly purged by the browser runtime.`,
      suggestedTools: ['home']
    };
  }

  if (q.includes('extension') || q.includes('chrome') || q.includes('edge') || q.includes('plugin')) {
    return {
      reply: `To install the **Vayun Browser Extension** (Manifest V3) for Chrome, Edge, Brave, Arc, or Opera:
1. Click the **Extension** button in the top navigation or download \`vayun-extension.zip\`.
2. Extract the downloaded zip file into a folder on your computer.
3. Open your browser and navigate to \`chrome://extensions\` (or \`edge://extensions\`).
4. Toggle on **Developer mode** in the upper-right corner.
5. Click **Load unpacked** and select the extracted folder.

Once installed, you can highlight any code snippet on GitHub or LeetCode and right-click to inspect in Vayun Flow or Viva Defense.`,
      suggestedTools: ['home']
    };
  }

  if (q.includes('api') || q.includes('gemini') || q.includes('key') || q.includes('llm')) {
    return {
      reply: `To configure your **Google Gemini API Key**:
1. Click the **Gemini API** button in the header or hero section.
2. Obtain a free API key from Google AI Studio (starts with \`AIzaSy...\`).
3. Paste the key and choose your model:
   - **Gemini 2.0 Flash:** Ultra-fast, low-latency responses for general coding and explanations.
   - **Gemini 2.0 Flash-Lite:** Lightweight and high throughput.
   - **Gemini 1.5 Pro:** High reasoning for complex multi-file architectural reviews.

Your key is stored solely in your local browser \`localStorage\` and communicated directly to Google's HTTPS endpoint.`,
      suggestedTools: ['home']
    };
  }

  if (q.includes('resume') || q.includes('cv') || q.includes('job')) {
    return {
      reply: `**Vayun Resume Builder** helps you create clean, executive resumes:
- Real-time live preview with clean ATS-friendly typography.
- Professional sections for Work Experience, Education, Projects, Skills, and optional Photo.
- Instant 1-click PDF download generated entirely in browser memory without sending your resume data to remote servers.`,
      suggestedTools: ['resume-builder']
    };
  }

  if (q.includes('invoice') || q.includes('bill') || q.includes('paylink')) {
    return {
      reply: `**Vayun Invoicing & PayLinks:**
- **Invoice Maker:** Generate professional printable client invoices, line items, taxes, and payment instructions.
- **PayLink View:** Create and visualize zero-knowledge shareable payment links with QR codes for client billing.`,
      suggestedTools: ['invoice-maker', 'paylink-view']
    };
  }

  if (q.includes('csv') || q.includes('table') || q.includes('zero') || q.includes('excel')) {
    return {
      reply: `**Vayun Tabular Tools:**
- **Clean CSV:** Normalize delimiters, remove duplicate rows, and fix broken quotes.
- **Preserve Zeros:** Ensures leading zeros in employee IDs, postal codes, and phone numbers are not dropped by spreadsheet software.
- **Table Converter:** Convert tabular data between JSON, CSV, TSV, HTML, and Markdown format.`,
      suggestedTools: ['clean-csv', 'preserve-zeros', 'table-converter']
    };
  }

  // Generic fallback with helpful navigation guidance
  return {
    reply: `I am **Vayun**, your built-in workstation assistant. 

I can answer questions regarding any of the developer or document tools on this platform, help you analyze code, or guide you on PDF and data workflows.

**Popular Topics You Can Ask Me:**
- *"How do I split a 500-page PDF?"*
- *"How do I trace code with Vayun Flow?"*
- *"How does Viva Defense test my technical understanding?"*
- *"How does the 100% in-browser RAM privacy guarantee work?"*
- *"How do I install the Chrome/Edge extension?"*
- *"How do I connect my Gemini 2.0 Flash API key?"*

*Tip:* Connect a free Google Gemini API key via the **API Key** button in the header to ask arbitrary custom coding, debugging, and software engineering questions with full generative capabilities!`,
    suggestedTools: ['home', 'vayun-flow', 'split-pdf', 'vayun-viva']
  };
}

export async function askVayunBot(
  userQuery: string,
  chatHistory: ChatMessage[] = []
): Promise<{ reply: string; suggestedTools: ToolId[] }> {
  const apiKey = getStoredApiKey();

  // If no Gemini API key is configured, use the intelligent built-in knowledge engine
  if (!apiKey) {
    return getOfflineVayunAnswer(userQuery);
  }

  // Build context from recent history (last 4 turns)
  const conversationContext = chatHistory
    .slice(-4)
    .map(m => `${m.role === 'user' ? 'User' : 'Vayun'}: ${m.content}`)
    .join('\n\n');

  const fullPrompt = `${conversationContext ? `Recent Conversation History:\n${conversationContext}\n\n` : ''}User Query:\n${userQuery}\n\nProvide a polite, accurate, concise, and structured response. If a Vayun tool directly solves this, reference it using the exact format: [Tool Name](tool:tool-id)`;

  try {
    const rawReply = await callGemini(fullPrompt, VAYUN_SYSTEM_INSTRUCTION);

    // Extract tool IDs mentioned in the response
    const suggestedTools: ToolId[] = [];
    const toolRegex = /\(tool:([a-z0-9-]+)\)/g;
    let match;
    while ((match = toolRegex.exec(rawReply)) !== null) {
      const toolId = match[1] as ToolId;
      if (!suggestedTools.includes(toolId) && TOOLS.some(t => t.id === toolId)) {
        suggestedTools.push(toolId);
      }
    }

    return {
      reply: rawReply,
      suggestedTools
    };
  } catch (err: any) {
    console.warn('Gemini API call failed, falling back to built-in knowledge base:', err);
    return getOfflineVayunAnswer(userQuery);
  }
}
