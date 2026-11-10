/**
 * Vayun Backend Cryptographic & Security Module
 * Uses standard Node.js crypto module (Zero external dependencies)
 */

const crypto = require('crypto');

const SECRET_KEY = process.env.VAYUN_SECRET_KEY || 'vayun_owner_secret_jwt_signature_key_2026';

/**
 * Derives a secure PBKDF2 cryptographic hash for password storage
 */
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

/**
 * Verifies a plaintext password against a stored PBKDF2 hash and salt
 */
function verifyPassword(password, storedHash, storedSalt) {
  if (!password || !storedHash || !storedSalt) return false;
  const hash = crypto.pbkdf2Sync(password, storedSalt, 10000, 64, 'sha512').toString('hex');
  return hash === storedHash;
}

/**
 * Generates a signed, stateless session token
 */
function generateToken(payload, expiresInMs = 7 * 24 * 60 * 60 * 1000) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify({
    ...payload,
    exp: Date.now() + expiresInMs,
    iat: Date.now()
  })).toString('base64url');

  const signature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(`${header}.${body}`)
    .digest('base64url');

  return `${header}.${body}.${signature}`;
}

/**
 * Validates a signed session token
 */
function verifyToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [header, body, signature] = parts;
  const expectedSig = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(`${header}.${body}`)
    .digest('base64url');

  if (signature !== expectedSig) return null;

  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (payload.exp && Date.now() > payload.exp) {
      return null; // Expired
    }
    return payload;
  } catch {
    return null;
  }
}

module.exports = {
  hashPassword,
  verifyPassword,
  generateToken,
  verifyToken
};
