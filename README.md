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
- **Split PDF:** Separate specific page ranges into standalone files.
- **Compress PDF:** Reduce file size while preserving legibility.
- **Page Extraction:** Extract individual pages or reorder document layouts.

### 3. AI and Context Utilities
- **Token Estimator:** Count tokens and estimate inference costs across major language model providers.
- **Prompt Sanitizer:** Automatically detect and remove secrets, passwords, and sensitive keys from prompts.
- **Context Rescuer:** Re-index and organize lengthy conversation threads into structured reference cards.

### 4. Business and Productivity
- **Invoice Generator:** Create clean, printable PDF invoices directly inside the browser.
- **Payment Link Manager:** Store and share payment links for freelance and client billing.

### 5. Owner Administration
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
|-- public/                  # Public assets, favicon, and brand marks
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
