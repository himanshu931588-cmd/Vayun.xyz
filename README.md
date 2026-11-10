# Vayun.xyz

Vayun.xyz is a privacy-first web platform designed for developers, engineering students, and professionals. It provides browser-based tools for code flow inspection, document processing, token analysis, and invoice creation without transmitting sensitive user data to external servers.

---

## Key Principles

- **Zero Remote Uploads:** All document operations, PDF manipulations, and code execution traces occur strictly within client browser memory. Your files and code never leave your machine.
- **Zero Tracking:** No behavioral trackers, advertising pixels, or third-party analytical cookies.
- **No Accounts:** No sign-up walls, email verification, or passwords required. Access all utilities immediately.
- **No Paywalls:** Every feature and tool is completely free with no subscription tiers or paywalls.
- **Fast and Lightweight:** Built with React 18, Vite, and Tailwind CSS for rapid load times and responsive performance.

---

## Features

### 1. Developer Flow and Code Defense
- **Vayun Flow:** Inspect and trace code execution paths across multiple files in a clear visual graph.
- **Vayun Viva:** Interactive questions to test understanding of your own code before reviews or interviews.
- **Vayun Break:** Identifies common edge cases, potential null pointers, and logic gaps in code snippets.
- **Vayun Spec:** Generates structured technical documentation from raw code.

### 2. Document and PDF Suite
- **Merge PDF:** Combine multiple PDF files into a single organized document.
- **Split & Extract PDF:** High-capacity extraction supporting multi-hundred page ranges (e.g. 1-100, 1-500), fixed-size chunking (every 10, 25, or 50 pages), and individual page separation with batch downloads.
- **Compress PDF:** Reduce file size while preserving legibility.
- **Image to PDF:** Convert image files directly into formatted PDF documents in browser memory.

### 3. AI and Context Utilities
- **Vayun AI Chatbot:** An in-browser AI copilot named Vayun accessible via the floating assistant widget or `⌘J` / `Ctrl+J`. It answers questions across all workstation tools, explains client-side RAM privacy, assists with code debugging, and provides one-click tool launch actions. Powered by Gemini 2.0 Flash when configured, with a comprehensive built-in offline knowledge engine.
- **High-Speed LLM Inference:** Powered by Gemini 2.0 Flash and Flash-Lite models with an in-memory response cache for instant generation.
- **Token Estimator:** Count tokens and estimate inference costs across major language model providers.
- **Prompt Sanitizer:** Automatically detect and remove secrets, passwords, and sensitive keys from prompts.
- **Context Rescuer:** Re-index and organize lengthy conversation threads into structured reference cards.

### 4. Business and Productivity
- **Invoice Generator:** Create clean, printable PDF invoices directly inside the browser.
- **Payment Link Manager:** Store and share payment links for freelance and client billing.

### 5. Browser Extension (Chrome, Edge, Brave, Arc, and Opera)
- **Quick Toolbar Access:** Launch Vayun Flow, Viva Defense, Split PDF, and Merge PDF from any browser tab with a single click.
- **Context Menu Inspection:** Highlight code or text on GitHub, LeetCode, or any web page, right-click, and select "Inspect selection in Vayun Flow" or "Prepare Viva Defense".
- **Instant Token Counter:** Embedded popup widget to measure prompt length, character count, and token estimations in browser RAM.
- **Privacy First:** Built on Manifest V3 with zero analytics, zero external network calls, and complete offline privacy.

#### Installing the Browser Extension
1. Download the extension package (`vayun-extension.zip`) from the Vayun website or locate the `public/extension/` directory in this repository.
2. Open your browser and navigate to `chrome://extensions` (or `edge://extensions` in Microsoft Edge).
3. Enable the **Developer mode** switch in the top-right corner.
4. Click **Load unpacked** and select the unzipped extension directory.

### 6. Helpdesk, Knowledge Base, and System Diagnostics
- **Searchable Knowledge Base:** Detailed explanations covering client-side RAM privacy architecture, high-capacity PDF extraction (up to 500+ pages), Gemini 2.0 Flash configuration, multi-file code tracing, and browser extension setup.
- **Client Runtime Self-Test:** Live environment verification assessing WebAssembly support, client heap memory usage, Web Worker readiness, and local storage capabilities.
- **Diagnostic State Reports:** One-click generation and clipboard copy of technical diagnostic state reports to assist in troubleshooting.
- **Direct Support Integration:** Immediate pre-formatted GitHub issue submission and feedback forms for questions or bug reports.

### 7. Owner Administration
- **Owner Audit Logs:** Silent system event logging for the website administrator.
- **Owner Command Console:** An administrative interface to review system health, download diagnostics, and run automated backups.

---

## Technology Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS, Vite, Lucide Icons
- **Document Processing:** PDF-Lib, jsPDF, html2canvas, PapaParse
- **Backend Service:** Node.js HTTP server, crypto module (PBKDF2 and HMAC-SHA256)
- **Data Storage:** Atomic JSON document storage with automatic snapshots

---

## Getting Started

### Prerequisites

Please ensure you have the following installed on your system:
- Node.js (version 18.0.0 or higher)
- npm (version 9.0.0 or higher)

### Installation

1. Clone the repository to your local computer:
   ```bash
   git clone https://github.com/himanshu931588-cmd/Vayun.xyz.git
   cd Vayun.xyz
   ```

2. Install the necessary dependencies:
   ```bash
   npm install
   ```

### Running the Application

- **Development Mode:**
  Start the Vite development server with hot module reloading:
  ```bash
  npm run dev
  ```
  Open your web browser and navigate to `http://localhost:3000`.

- **Production Build:**
  Verify TypeScript types and build the optimized production assets:
  ```bash
  npm run build
  ```

- **Preview Production Build:**
  Test the production build locally:
  ```bash
  npm run preview
  ```

- **Standalone Backend Service:**
  If you wish to run the backend server separately:
  ```bash
  npm run backend
  ```
  The backend API runs on `http://localhost:5000`.

---

## Project Structure

```
Vayun.xyz/
|-- backend/                 # Node.js backend services
|   |-- data/                # User document store and backups
|   |-- logs/                # System audit and event logs
|   |-- crypto.cjs           # Password hashing and token verification
|   |-- database.cjs         # Atomic file storage
|   |-- logger.cjs           # Event logging engine
|   |-- routes.cjs           # API endpoint handlers
|   `-- server.cjs           # Standalone HTTP server
|-- public/                  # Public assets, favicon, extension package, and brand marks
|   |-- extension/           # Chrome / Chromium Manifest V3 browser extension
|   `-- vayun-extension.zip  # Downloadable extension package
|-- src/
|   |-- assets/              # Wordmarks and graphic assets
|   |-- components/
|   |   |-- common/          # Header, footer, logo, and owner console
|   |   |-- developer/       # Vayun Flow, Viva, Break, and Spec tools
|   |   |-- documents/       # PDF suite components
|   |   |-- home/            # Overview and tool directory
|   |   `-- ui/              # Modal and form components
|   |-- types/               # TypeScript interfaces and definitions
|   |-- utils/               # Local storage, PDF, and auth utilities
|   |-- App.tsx              # Main application router and state
|   `-- main.tsx             # Application mount point
|-- index.html               # Main HTML entry point
|-- package.json             # Project dependencies and scripts
|-- tsconfig.json            # TypeScript configuration
`-- vite.config.ts           # Vite build and proxy settings
```

---

## Privacy and Data Security

Vayun.xyz operates on a strict zero-upload and zero-tracking model. All uploaded documents, PDFs, tables, and code files are processed locally within the browser session memory and are never uploaded to our servers.

There are no user accounts, no sign-in requirements, and no paywalls. All functionality is available immediately upon opening the site.

---

## Contributing

Contributions, suggestions, and issue reports are welcome. If you would like to contribute:

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes with clear messages:
   ```bash
   git commit -m "Add feature description"
   ```
4. Push to your branch and submit a pull request.

---

## Support and Donations

Vayun.xyz is an independent, open project developed without advertising, tracking, or paywalls. If you find these tools helpful and would like to support ongoing development, maintenance, and hosting costs, you are welcome to buy a coffee:

- Buy Me a Coffee: https://buymeacoffee.com/himanshu.mishra1185

Every contribution is sincerely appreciated.

---

## Contact and Support

If you have questions, feedback, or need assistance, please feel free to open an issue on the GitHub repository:
- Repository: [https://github.com/himanshu931588-cmd/Vayun.xyz](https://github.com/himanshu931588-cmd/Vayun.xyz)

Thank you for using Vayun.xyz.
