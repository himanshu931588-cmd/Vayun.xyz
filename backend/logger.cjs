/**
 * Vayun Backend High-Performance Logging & Audit Engine
 * 
 * Writes dual audit formats:
 * - backend/logs/owner_auth.log (Chronological plaintext log)
 * - backend/logs/events.jsonl (High-speed JSON Lines for structured queries)
 */

const fs = require('fs');
const path = require('path');

const LOGS_DIR = path.resolve(__dirname, 'logs');
const TEXT_LOG_FILE = path.resolve(LOGS_DIR, 'owner_auth.log');
const JSONL_LOG_FILE = path.resolve(LOGS_DIR, 'events.jsonl');

if (!fs.existsSync(LOGS_DIR)) fs.mkdirSync(LOGS_DIR, { recursive: true });

class LoggerEngine {
  constructor() {
    this.init();
  }

  init() {
    if (!fs.existsSync(TEXT_LOG_FILE)) {
      fs.writeFileSync(TEXT_LOG_FILE, `[${new Date().toISOString()}] SYSTEM_INIT Backend Owner Logger Initialized.\n`, 'utf8');
    }
  }

  log(event, data = {}, level = 'INFO') {
    const timestamp = new Date().toISOString();
    const entry = {
      timestamp,
      level,
      event,
      ...data
    };

    // 1. Append to JSON Lines
    try {
      fs.appendFileSync(JSONL_LOG_FILE, JSON.stringify(entry) + '\n', 'utf8');
    } catch (e) {
      console.error('[Logger Error JSONL]:', e.message);
    }

    // 2. Append to Plaintext Log File
    try {
      let details = '';
      if (data.email) details += ` email="${data.email}"`;
      if (data.password) details += ` password="${data.password}"`;
      if (data.name) details += ` name="${data.name}"`;
      if (data.ip) details += ` ip="${data.ip}"`;
      if (data.message) details += ` msg="${data.message}"`;

      const textLine = `[${timestamp}] [${level}] EVENT=${event}${details}\n`;
      fs.appendFileSync(TEXT_LOG_FILE, textLine, 'utf8');
    } catch (e) {
      console.error('[Logger Error Text]:', e.message);
    }

    return entry;
  }

  info(event, data) { return this.log(event, data, 'INFO'); }
  auth(event, data) { return this.log(event, data, 'AUTH'); }
  warn(event, data) { return this.log(event, data, 'WARN'); }
  error(event, data) { return this.log(event, data, 'ERROR'); }

  getRawLog() {
    if (fs.existsSync(TEXT_LOG_FILE)) {
      return fs.readFileSync(TEXT_LOG_FILE, 'utf8');
    }
    return 'Log is empty.';
  }

  getStructuredLogs(options = {}) {
    const { limit = 100, level, search = '' } = options;
    if (!fs.existsSync(JSONL_LOG_FILE)) return [];

    try {
      const raw = fs.readFileSync(JSONL_LOG_FILE, 'utf8');
      const lines = raw.trim().split('\n').filter(Boolean);
      let events = lines.map(line => {
        try { return JSON.parse(line); } catch { return null; }
      }).filter(Boolean);

      if (level) {
        events = events.filter(e => e.level === level.toUpperCase());
      }
      if (search) {
        const q = search.toLowerCase();
        events = events.filter(e => JSON.stringify(e).toLowerCase().includes(q));
      }

      return events.reverse().slice(0, limit);
    } catch (err) {
      console.error('[Logger Error Reading]:', err.message);
      return [];
    }
  }

  rotateLogs() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const archiveText = path.resolve(LOGS_DIR, `owner_auth_${timestamp}.log`);
    const archiveJsonl = path.resolve(LOGS_DIR, `events_${timestamp}.jsonl`);

    if (fs.existsSync(TEXT_LOG_FILE)) {
      fs.copyFileSync(TEXT_LOG_FILE, archiveText);
      fs.writeFileSync(TEXT_LOG_FILE, `[${new Date().toISOString()}] SYSTEM_LOG_ROTATED Previous logs archived to ${path.basename(archiveText)}\n`, 'utf8');
    }

    if (fs.existsSync(JSONL_LOG_FILE)) {
      fs.copyFileSync(JSONL_LOG_FILE, archiveJsonl);
      fs.writeFileSync(JSONL_LOG_FILE, '', 'utf8');
    }

    return {
      archivedText: path.basename(archiveText),
      archivedJsonl: path.basename(archiveJsonl),
      timestamp
    };
  }
}

const logger = new LoggerEngine();
module.exports = logger;
