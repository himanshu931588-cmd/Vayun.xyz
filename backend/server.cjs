/**
 * Vayun.xyz - Enterprise High-Performance Backend Server
 * 
 * Capabilities:
 * - Atomic JSON Database with zero data-corruption guarantees
 * - Dual Audit Logging (Plaintext + High-Speed JSON Lines)
 * - Rate Limiter (Anti-DDoS / Brute Force protection)
 * - Cloud History Synchronization for Student Developers
 * - Owner Administration Suite & System Telemetry
 * 
 * Usage:
 *   node backend/server.js
 *   (or npm run backend)
 */

const http = require('http');
const { handleApiRequest } = require('./routes.cjs');

const PORT = process.env.PORT || 5000;

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE, PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
}

const server = http.createServer(async (req, res) => {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  try {
    const handled = await handleApiRequest(req, res);
    if (!handled) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Endpoint not found', path: req.url }));
    }
  } catch (err) {
    console.error('[Unhandled Server Error]:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Internal Server Error', message: err.message }));
  }
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(` ⚡ Vayun.xyz Powerful Backend Engine Active`);
  console.log(` 🚀 Listening on: http://localhost:${PORT}`);
  console.log(` 📊 Health & Metrics: http://localhost:${PORT}/api/health`);
  console.log(` 🛡️ Owner Console API: http://localhost:${PORT}/api/owner/metrics`);
  console.log(`======================================================\n`);
});

// Graceful Shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down backend server gracefully...');
  server.close(() => {
    process.exit(0);
  });
});
