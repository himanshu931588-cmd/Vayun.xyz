import { 
  RepoProject, 
  CodeFile, 
  CallGraphNode, 
  CallGraphEdge, 
  TraceStep, 
  LogicHotspot, 
  VivaQuestion, 
  VivaMessage, 
  MentalModelScorecard, 
  InjectedBug 
} from '../types';

export const PRESET_PROJECTS: RepoProject[] = [
  {
    id: 'fullstack-auth',
    name: 'Full-Stack Auth & Token Pipeline',
    tagline: 'React 18 + Express Node.js + PostgreSQL JWT Session Handling',
    language: 'TypeScript / Node',
    files: [
      {
        id: 'frontend-login',
        name: 'LoginForm.tsx',
        path: 'src/components/LoginForm.tsx',
        language: 'typescript',
        layer: 'frontend',
        content: `import React, { useState } from 'react';
import { apiLogin } from '../services/apiClient';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    try {
      // Line 14: Client triggers auth payload transfer
      const res = await apiLogin({ email, password });
      localStorage.setItem('auth_token', res.token);
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-card">
      <input 
        type="email" 
        value={email} 
        onChange={e => setEmail(e.target.value)} 
        placeholder="engineer@univ.edu" 
        required 
      />
      <input 
        type="password" 
        value={password} 
        onChange={e => setPassword(e.target.value)} 
        placeholder="••••••••" 
        required 
      />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Verifying...' : 'Sign In'}
      </button>
      {error && <p className="error-text">{error}</p>}
    </form>
  );
};`
      },
      {
        id: 'api-client',
        name: 'apiClient.ts',
        path: 'src/services/apiClient.ts',
        language: 'typescript',
        layer: 'api',
        content: `export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: { id: string; email: string; role: string };
}

export async function apiLogin(credentials: LoginPayload): Promise<AuthResponse> {
  // Line 11: Network boundary dispatch to Express Gateway
  const response = await fetch('/api/v1/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Client-Version': '2.4.0'
    },
    body: JSON.stringify(credentials)
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || 'HTTP Status ' + response.status);
  }

  return response.json();
}`
      },
      {
        id: 'jwt-middleware',
        name: 'jwtAuth.ts',
        path: 'server/middleware/jwtAuth.ts',
        language: 'typescript',
        layer: 'middleware',
        content: `import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_vayun_fallback_key';

export interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string };
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header' });
  }

  const token = authHeader.split(' ')[1];
  try {
    // Line 17: Cryptographic signature verification
    const decoded = jwt.verify(token, JWT_SECRET) as { sub: string; role: string };
    req.user = { id: decoded.sub, role: decoded.role };
    next();
  } catch (err) {
    // Line 22: Fails when token expired or tampered
    return res.status(403).json({ error: 'Token signature invalid or expired' });
  }
}`
      },
      {
        id: 'auth-controller',
        name: 'authController.ts',
        path: 'server/controllers/authController.ts',
        language: 'typescript',
        layer: 'controller',
        content: `import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUserByEmail, recordLoginAttempt } from '../models/userModel';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_vayun_fallback_key';

export async function loginController(req: Request, res: Response) {
  const { email, password } = req.body;

  // Line 10: Input contract validation
  if (!email || !password || typeof email !== 'string') {
    return res.status(400).json({ error: 'Invalid input parameters' });
  }

  // Line 15: Retrieve persistent user record
  const user = await findUserByEmail(email.toLowerCase().trim());
  if (!user) {
    await recordLoginAttempt(email, false);
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // Line 22: Constant-time hash verification against timing attacks
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    await recordLoginAttempt(email, false);
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // Line 29: Issue bounded JWT bearer token
  const token = jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '2h', algorithm: 'HS256' }
  );

  await recordLoginAttempt(email, true);
  return res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
}`
      },
      {
        id: 'user-model',
        name: 'userModel.ts',
        path: 'server/models/userModel.ts',
        language: 'typescript',
        layer: 'model',
        content: `import { db } from '../db/connection';

export interface UserRecord {
  id: string;
  email: string;
  passwordHash: string;
  role: string;
  failedAttempts: number;
}

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  // Line 11: Parameterized SQL query preventing injection
  const query = 'SELECT id, email, password_hash AS "passwordHash", role, failed_attempts AS "failedAttempts" FROM users WHERE email = $1 LIMIT 1';
  const result = await db.query(query, [email]);
  return result.rows[0] || null;
}

export async function recordLoginAttempt(email: string, success: boolean): Promise<void> {
  // Line 18: Audit trail update for brute-force tracking
  const query = \`
    UPDATE users 
    SET failed_attempts = CASE WHEN $2 = true THEN 0 ELSE failed_attempts + 1 END,
        last_login_at = CASE WHEN $2 = true THEN NOW() ELSE last_login_at END
    WHERE email = $1
  \`;
  await db.query(query, [email, success]);
}`
      },
      {
        id: 'db-schema',
        name: 'schema.sql',
        path: 'server/db/schema.sql',
        language: 'sql',
        layer: 'db',
        content: `-- PostgreSQL Users Table DDL
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'student' CHECK (role IN ('student', 'instructor', 'admin')),
  failed_attempts INT DEFAULT 0,
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for O(log N) B-Tree lookup on auth requests
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`
      }
    ],
    callGraphNodes: [
      {
        id: 'node-ui',
        label: 'LoginForm (React UI)',
        fileId: 'frontend-login',
        filePath: 'src/components/LoginForm.tsx',
        startLine: 13,
        endLine: 25,
        type: 'component',
        complexity: 'O(1) Render'
      },
      {
        id: 'node-api-client',
        label: 'apiLogin() Gateway',
        fileId: 'api-client',
        filePath: 'src/services/apiClient.ts',
        startLine: 11,
        endLine: 24,
        type: 'route',
        complexity: 'O(1) HTTP / Wire'
      },
      {
        id: 'node-controller',
        label: 'loginController()',
        fileId: 'auth-controller',
        filePath: 'server/controllers/authController.ts',
        startLine: 8,
        endLine: 38,
        type: 'controller',
        complexity: 'O(1) Logic + Bcrypt Cost 12'
      },
      {
        id: 'node-model',
        label: 'findUserByEmail()',
        fileId: 'user-model',
        filePath: 'server/models/userModel.ts',
        startLine: 10,
        endLine: 15,
        type: 'model',
        complexity: 'O(log N) Indexed DB Query'
      },
      {
        id: 'node-db',
        label: 'users (PostgreSQL B-Tree)',
        fileId: 'db-schema',
        filePath: 'server/db/schema.sql',
        startLine: 13,
        endLine: 14,
        type: 'db',
        complexity: 'Disk IO / B-Tree'
      },
      {
        id: 'node-jwt-mw',
        label: 'requireAuth (JWT Middleware)',
        fileId: 'jwt-middleware',
        filePath: 'server/middleware/jwtAuth.ts',
        startLine: 10,
        endLine: 24,
        type: 'middleware',
        complexity: 'O(1) HMAC SHA256 Verify'
      }
    ],
    callGraphEdges: [
      { id: 'edge-1', source: 'node-ui', target: 'node-api-client', label: 'Form Submit Payload', payloadType: '{ email, password }' },
      { id: 'edge-2', source: 'node-api-client', target: 'node-controller', label: 'POST /api/v1/auth/login', payloadType: 'HTTP JSON Body' },
      { id: 'edge-3', source: 'node-controller', target: 'node-model', label: 'Lookup User Record', payloadType: 'email: string' },
      { id: 'edge-4', source: 'node-model', target: 'node-db', label: 'B-Tree Index Scan', payloadType: 'SELECT ... WHERE email=$1' },
      { id: 'edge-5', source: 'node-controller', target: 'node-jwt-mw', label: 'Downstream Protected Routes', payloadType: 'Bearer Token' }
    ],
    traceSteps: [
      {
        stepIndex: 1,
        title: 'Step 1: User Triggers Submit on React UI',
        description: 'User enters credentials in LoginForm. React captures inputs in state and calls apiLogin() with a sanitized payload.',
        fileId: 'frontend-login',
        startLine: 14,
        endLine: 18,
        activeNodeId: 'node-ui',
        variableState: {
          'email': '"engineer@univ.edu"',
          'password': '"••••••••" [masked]',
          'isPending': 'true',
          'error': 'null'
        },
        runtimePayload: JSON.stringify({ email: "engineer@univ.edu", password: "raw_password_secret" }, null, 2),
        type: 'request'
      },
      {
        stepIndex: 2,
        title: 'Step 2: HTTP Wire Serialization',
        description: 'apiClient sends POST request over fetch to /api/v1/auth/login with JSON body and custom client headers.',
        fileId: 'api-client',
        startLine: 11,
        endLine: 18,
        activeNodeId: 'node-api-client',
        variableState: {
          'endpoint': '"/api/v1/auth/login"',
          'method': '"POST"',
          'headers': '{"Content-Type": "application/json"}'
        },
        runtimePayload: 'POST /api/v1/auth/login HTTP/1.1\nHost: vayun.xyz\nContent-Type: application/json',
        type: 'request'
      },
      {
        stepIndex: 3,
        title: 'Step 3: Controller Input Validation & DB Lookup',
        description: 'Express parses body. loginController validates parameter types and invokes findUserByEmail with normalized lowercase email.',
        fileId: 'auth-controller',
        startLine: 10,
        endLine: 17,
        activeNodeId: 'node-controller',
        variableState: {
          'normalizedEmail': '"engineer@univ.edu"',
          'inputValidated': 'true',
          'dbFunction': 'findUserByEmail()'
        },
        runtimePayload: '{ email: "engineer@univ.edu", validated: true }',
        type: 'validation'
      },
      {
        stepIndex: 4,
        title: 'Step 4: Database B-Tree Index Scan',
        description: 'PostgreSQL uses idx_users_email to find user record in O(log N) time, returning user id, salt, and password_hash.',
        fileId: 'user-model',
        startLine: 11,
        endLine: 15,
        activeNodeId: 'node-model',
        variableState: {
          'queryPlan': 'Index Scan using idx_users_email on users',
          'recordFound': 'true',
          'userId': '"u_948f2a11"'
        },
        runtimePayload: '{"id": "u_948f2a11", "email": "engineer@univ.edu", "role": "student"}',
        type: 'query'
      },
      {
        stepIndex: 5,
        title: 'Step 5: Bcrypt Constant-Time Verification & JWT Issuance',
        description: 'Bcrypt verifies hash in constant time to prevent side-channel timing attacks. Controller signs 2-hour JWT token and returns HTTP 200.',
        fileId: 'auth-controller',
        startLine: 22,
        endLine: 35,
        activeNodeId: 'node-controller',
        variableState: {
          'isMatch': 'true',
          'jwtPayload': '{ sub: "u_948f2a11", role: "student", exp: 1718000000 }',
          'statusCode': '200 OK'
        },
        runtimePayload: '{"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", "status": "authenticated"}',
        type: 'response'
      }
    ],
    hotspots: [
      {
        id: 'hotspot-1',
        fileId: 'frontend-login',
        filePath: 'src/components/LoginForm.tsx',
        line: 16,
        severity: 'critical',
        type: 'unvalidated_input',
        title: 'Token Stored in LocalStorage (XSS Vulnerability)',
        description: 'Saving JWTs in localStorage exposes credentials to any malicious script injected through dependencies or XSS.',
        socraticHint: 'Where in the browser storage lifecycle is a credential immune to JavaScript execution context?'
      },
      {
        id: 'hotspot-2',
        fileId: 'auth-controller',
        filePath: 'server/controllers/authController.ts',
        line: 16,
        severity: 'warning',
        type: 'race_condition',
        title: 'Missing Distributed Rate Limiting on Login Route',
        description: 'Without IP or account-level rate limiting, this endpoint is vulnerable to brute-force credential stuffing and CPU exhaustion via bcrypt.',
        socraticHint: 'What happens to your event loop when 500 requests hit bcrypt.compare concurrently with work factor 12?'
      },
      {
        id: 'hotspot-3',
        fileId: 'jwt-middleware',
        filePath: 'server/middleware/jwtAuth.ts',
        line: 17,
        severity: 'info',
        type: 'unhandled_null',
        title: 'Fallback Secret in Middleware',
        description: 'Defaulting JWT secret to a hardcoded string when process.env.JWT_SECRET is missing allows forged signatures in staging environments.',
        socraticHint: 'Should a production service ever boot if mandatory cryptographic keys are undefined?'
      }
    ],
    vivaQuestions: [
      {
        id: 'viva-q1',
        tier: 1,
        category: 'Comprehension',
        question: 'Walk me through lines 15 to 26 in authController.ts. Why do we return the exact same generic error message when the user is not found as when the password fails to match?',
        fileId: 'auth-controller',
        startLine: 16,
        endLine: 26,
        contextHint: 'Look at the response status and error messages returned in both branches.',
        checkpoints: [
          'Prevents User Enumeration attacks',
          'Does not leak whether an email exists in the database',
          'Consistent response latency / timing defense'
        ],
        expectedConcepts: ['user enumeration', 'information disclosure', 'timing attack', 'attacker', 'security']
      },
      {
        id: 'viva-q2',
        tier: 2,
        category: 'Complexity & Trade-offs',
        question: 'In schema.sql, you created an index on users(email). What underlying data structure does PostgreSQL create for this index, what is the asymptotic lookup complexity, and what is the trade-off during user registration (INSERT)?',
        fileId: 'db-schema',
        startLine: 13,
        endLine: 14,
        contextHint: 'Focus on B-Tree balanced search, tree traversal time, and disk block rebalancing on writes.',
        checkpoints: [
          'Identifies B-Tree as the default index structure',
          'States lookup time is O(log N)',
          'Explains write penalty: INSERT requires updating the index and potential tree rebalancing'
        ],
        expectedConcepts: ['b-tree', 'btree', 'log n', 'insert overhead', 'write penalty', 'rebalancing']
      },
      {
        id: 'viva-q3',
        tier: 3,
        category: 'Scale & Edge Cases',
        question: 'Suppose your university platform experiences a sudden spike: 10,000 students submit the login form within 30 seconds. Given that bcrypt is computationally intensive and synchronous to CPU cores, what happens to the Node.js event loop and how would you re-architect this?',
        fileId: 'auth-controller',
        startLine: 22,
        endLine: 25,
        contextHint: 'Analyze thread pool saturation, libuv worker threads, and dedicated auth microservice/worker pools.',
        checkpoints: [
          'Recognizes libuv default 4-thread worker pool saturation',
          'Explains event loop blocking and request queuing',
          'Proposes offloading auth to isolated workers, increasing UV_THREADPOOL_SIZE, or adding rate limiting queues'
        ],
        expectedConcepts: ['libuv', 'worker threads', 'threadpool', 'cpu bound', 'queue', 'rate limit', 'event loop']
      }
    ],
    breakBugs: [
      {
        id: 'bug-1',
        title: 'Unhandled Null Pointer on User Profile Access',
        difficulty: 'Beginner',
        category: 'Null Pointer',
        targetFileId: 'auth-controller',
        targetFileName: 'server/controllers/authController.ts',
        originalSnippet: 'const user = await findUserByEmail(email.toLowerCase().trim());\nif (!user) {\n  await recordLoginAttempt(email, false);\n  return res.status(401).json({ error: "Invalid email or password" });\n}',
        buggySnippet: 'const user = await findUserByEmail(email.toLowerCase().trim());\n// BUG: Missing check for user existence before reading passwordHash\nconst isMatch = await bcrypt.compare(password, user.passwordHash);',
        triggerInput: 'POST /api/v1/auth/login with non-existent email "ghost@univ.edu"',
        stackTrace: `TypeError: Cannot read properties of null (reading 'passwordHash')
    at loginController (server/controllers/authController.ts:22:52)
    at Layer.handle [as handle_request] (node_modules/express/lib/router/layer.js:95:5)
    at next (node_modules/express/lib/router/route.js:144:13)
    at Route.dispatch (node_modules/express/lib/router/route.js:114:3)`,
        failingTestName: 'test_login_non_existent_user_returns_401()',
        hintLevel1: 'Notice the error: Cannot read properties of null (reading passwordHash). What did findUserByEmail return when the user does not exist?',
        hintLevel2: 'Before accessing user.passwordHash, check if the user object actually resolved or returned null.',
        rootCauseAnalysis: 'When a user does not exist in the database, findUserByEmail returns null. Accessing a property on null crashes the Express worker process with an unhandled TypeError.'
      },
      {
        id: 'bug-2',
        title: 'Expired JWT Token Signature Leak',
        difficulty: 'Intermediate',
        category: 'Token Expiry',
        targetFileId: 'jwt-middleware',
        targetFileName: 'server/middleware/jwtAuth.ts',
        originalSnippet: 'const token = authHeader.split(" ")[1];\ntry {\n  const decoded = jwt.verify(token, JWT_SECRET) as { sub: string; role: string };\n  req.user = { id: decoded.sub, role: decoded.role };\n  next();\n} catch (err) {\n  return res.status(403).json({ error: "Token signature invalid or expired" });\n}',
        buggySnippet: 'const token = authHeader.split(" ")[1];\n// BUG: using jwt.decode instead of jwt.verify (does not check cryptographic signature!)\nconst decoded = jwt.decode(token) as { sub: string; role: string };\nreq.user = { id: decoded.sub, role: decoded.role };\nnext();',
        triggerInput: 'GET /api/v1/student/records with forged unsigned JWT token',
        stackTrace: `SecurityAssertionError: Unsigned forged token was accepted by jwtAuth middleware!
    Expected: HTTP 403 Forbidden
    Received: HTTP 200 OK with req.user.role = "admin"
    at test_rejects_forged_unsigned_token (tests/security.test.ts:44:12)`,
        failingTestName: 'test_rejects_forged_unsigned_token()',
        hintLevel1: 'Look at the function called on jwt: decode vs verify. What is the fundamental difference in cryptographic enforcement?',
        hintLevel2: 'jwt.decode only parses the Base64 JSON payload without verifying the HMAC/RSA signature against JWT_SECRET!',
        rootCauseAnalysis: 'Using jwt.decode instead of jwt.verify bypasses cryptographic validation entirely, allowing any attacker to forge a payload with role="admin" without knowing the secret.'
      }
    ]
  },
  {
    id: 'fastapi-bookings',
    name: 'FastAPI High-Concurrency Hotel Booking Engine',
    tagline: 'Python 3.11 + AsyncIO + SQLAlchemy Atomic Room Allocations',
    language: 'Python',
    files: [
      {
        id: 'py-main',
        name: 'main.py',
        path: 'app/main.py',
        language: 'python',
        layer: 'api',
        content: `from fastapi import FastAPI
from app.routers import bookings

app = FastAPI(
    title="Vayun Booking Engine",
    version="1.0.0",
    docs_url="/docs"
)

# Route attachment
app.include_router(bookings.router, prefix="/api/v1/bookings", tags=["Bookings"])

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "vayun-booking-core"}`
      },
      {
        id: 'py-router',
        name: 'bookings.py',
        path: 'app/routers/bookings.py',
        language: 'python',
        layer: 'controller',
        content: `from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from app.services.booking_service import create_booking_atomic

router = APIRouter()

class BookingRequest(BaseModel):
    room_id: str
    guest_id: str
    nights: int

@router.post("/", status_code=status.HTTP_201_CREATED)
async def book_room(payload: BookingRequest):
    # Line 15: Validate positive booking duration
    if payload.nights <= 0:
        raise HTTPException(status_code=400, detail="Nights must be greater than zero")
    
    # Line 19: Hand off to atomic booking transaction
    booking = await create_booking_atomic(payload.room_id, payload.guest_id, payload.nights)
    if not booking:
        raise HTTPException(status_code=409, detail="Room already reserved for requested interval")
    
    return {"booking_id": booking["id"], "status": "confirmed"}`
      },
      {
        id: 'py-service',
        name: 'booking_service.py',
        path: 'app/services/booking_service.py',
        language: 'python',
        layer: 'model',
        content: `import asyncio
from app.core.concurrency import get_room_lock

# In-memory reservation table simulating transactional isolation
RESERVATIONS = {}

async def create_booking_atomic(room_id: str, guest_id: str, nights: int):
    # Line 9: Acquire distributed mutex to prevent race condition overbooking
    lock = get_room_lock(room_id)
    async with lock:
        # Check current occupancy
        if room_id in RESERVATIONS and RESERVATIONS[room_id]["is_active"]:
            return None
        
        # Simulate asynchronous DB transaction latency
        await asyncio.sleep(0.05)
        
        booking_record = {
            "id": f"bk_{room_id[:4]}_{guest_id[:4]}",
            "room_id": room_id,
            "guest_id": guest_id,
            "nights": nights,
            "is_active": True
        }
        RESERVATIONS[room_id] = booking_record
        return booking_record`
      },
      {
        id: 'py-concurrency',
        name: 'concurrency.py',
        path: 'app/core/concurrency.py',
        language: 'python',
        layer: 'middleware',
        content: `import asyncio

_room_locks: dict[str, asyncio.Lock] = {}

def get_room_lock(room_id: str) -> asyncio.Lock:
    # Line 7: Mutex map for atomic room serialization
    if room_id not in _room_locks:
        _room_locks[room_id] = asyncio.Lock()
    return _room_locks[room_id]`
      }
    ],
    callGraphNodes: [
      { id: 'py-node-1', label: 'FastAPI Gateway', fileId: 'py-main', filePath: 'app/main.py', startLine: 9, endLine: 13, type: 'route', complexity: 'Async Event Loop' },
      { id: 'py-node-2', label: 'POST /bookings Controller', fileId: 'py-router', filePath: 'app/routers/bookings.py', startLine: 12, endLine: 24, type: 'controller', complexity: 'Pydantic Schema Validation' },
      { id: 'py-node-3', label: 'Mutex Lock Acquirer', fileId: 'py-concurrency', filePath: 'app/core/concurrency.py', startLine: 6, endLine: 10, type: 'middleware', complexity: 'O(1) Mutex Map' },
      { id: 'py-node-4', label: 'create_booking_atomic()', fileId: 'py-service', filePath: 'app/services/booking_service.py', startLine: 8, endLine: 26, type: 'model', complexity: 'Critical Section (Isolated)' }
    ],
    callGraphEdges: [
      { id: 'py-edge-1', source: 'py-node-1', target: 'py-node-2', label: 'Route Dispatch', payloadType: 'BookingRequest JSON' },
      { id: 'py-edge-2', source: 'py-node-2', target: 'py-node-4', label: 'Invoke Service', payloadType: 'room_id, guest_id' },
      { id: 'py-edge-3', source: 'py-node-4', target: 'py-node-3', label: 'Acquire Mutex', payloadType: 'asyncio.Lock' }
    ],
    traceSteps: [
      {
        stepIndex: 1,
        title: 'Step 1: Inbound HTTP Request to FastAPI Router',
        description: 'Client sends POST /api/v1/bookings. FastAPI deserializes JSON into Pydantic model with automatic type coercion.',
        fileId: 'py-router',
        startLine: 12,
        endLine: 17,
        activeNodeId: 'py-node-2',
        variableState: {
          'room_id': '"room_suite_402"',
          'guest_id': '"guest_alok_99"',
          'nights': '3'
        },
        runtimePayload: '{"room_id": "room_suite_402", "guest_id": "guest_alok_99", "nights": 3}',
        type: 'request'
      },
      {
        stepIndex: 2,
        title: 'Step 2: Room Lock Acquisition',
        description: 'concurrency.py checks room mutex table. If not locked, acquires asyncio.Lock to enter critical section.',
        fileId: 'py-concurrency',
        startLine: 7,
        endLine: 10,
        activeNodeId: 'py-node-3',
        variableState: {
          'lockAcquired': 'True',
          'roomLockKey': '"room_suite_402"'
        },
        runtimePayload: 'Acquired asyncio.Lock(room_suite_402)',
        type: 'auth'
      },
      {
        stepIndex: 3,
        title: 'Step 3: Atomic Record Insertion & Mutex Release',
        description: 'Verifies room is free, writes reservation to dictionary, and yields control upon exiting context manager.',
        fileId: 'py-service',
        startLine: 16,
        endLine: 26,
        activeNodeId: 'py-node-4',
        variableState: {
          'booking_id': '"bk_room_gues"',
          'is_active': 'True',
          'status': 'confirmed'
        },
        runtimePayload: '{"booking_id": "bk_room_gues", "status": "confirmed"}',
        type: 'response'
      }
    ],
    hotspots: [
      {
        id: 'py-hotspot-1',
        fileId: 'py-concurrency',
        filePath: 'app/core/concurrency.py',
        line: 8,
        severity: 'critical',
        type: 'race_condition',
        title: 'In-Memory Locks Break Across Multi-Worker Uvicorn Processes',
        description: 'asyncio.Lock only serializes coroutines within a single Python process. Running Uvicorn with --workers 4 enables double bookings across OS processes.',
        socraticHint: 'How does an in-memory lock communicate across two separate Python operating system processes with separate memory spaces?'
      }
    ],
    vivaQuestions: [
      {
        id: 'py-viva-1',
        tier: 2,
        category: 'Complexity & Trade-offs',
        question: 'In concurrency.py, you use an in-memory dictionary of asyncio.Lock instances. Why will this fail to prevent double-bookings if this application is deployed with 4 Uvicorn worker processes on a production server?',
        fileId: 'py-concurrency',
        startLine: 6,
        endLine: 10,
        contextHint: 'Focus on OS process memory isolation versus thread memory sharing.',
        checkpoints: [
          'Understands multi-process memory isolation in Python',
          'Explains that each worker process has its own separate heap and lock dict',
          'Recommends distributed locking using Redis (Redlock) or database SELECT FOR UPDATE'
        ],
        expectedConcepts: ['process isolation', 'separate memory', 'redis', 'select for update', 'distributed lock', 'workers']
      }
    ],
    breakBugs: [
      {
        id: 'py-bug-1',
        title: 'Async Race Condition: Missing Await on Critical Lock',
        difficulty: 'Intermediate',
        category: 'Race Condition',
        targetFileId: 'py-service',
        targetFileName: 'app/services/booking_service.py',
        originalSnippet: 'async with lock:\n    if room_id in RESERVATIONS and RESERVATIONS[room_id]["is_active"]:\n        return None',
        buggySnippet: '# BUG: Lock instantiated but not entered via async context manager (no locking applied)\nif room_id in RESERVATIONS and RESERVATIONS[room_id]["is_active"]:\n    return None',
        triggerInput: 'Concurrent test: 10 simultaneous booking requests for the same room',
        stackTrace: `AssertionError: Concurrency violation! Expected 1 booking, found 7 duplicate bookings for room_suite_402
    at test_concurrent_double_booking_prevention (tests/test_concurrency.py:52)`,
        failingTestName: 'test_concurrent_double_booking_prevention()',
        hintLevel1: 'Notice the test failed because 7 concurrent requests succeeded for the exact same room. Where did the lock go?',
        hintLevel2: 'Without "async with lock:", code runs concurrently without waiting for previous requests to finish reading/writing RESERVATIONS.',
        rootCauseAnalysis: 'Bypassing the lock allows multiple async coroutines to interleave during the await asyncio.sleep call, causing all coroutines to observe an empty room before any of them marks it reserved.'
      }
    ]
  },
  {
    id: 'cpp-lru-cache',
    name: 'C++ Systems LRU Cache & Pointer Map',
    tagline: 'C++20 Doubly-Linked List + Unordered Map for O(1) Eviction',
    language: 'C++',
    files: [
      {
        id: 'cpp-header',
        name: 'LRUCache.h',
        path: 'include/LRUCache.h',
        language: 'cpp',
        layer: 'model',
        content: `#pragma once
#include <unordered_map>
#include <list>
#include <optional>

class LRUCache {
private:
    struct Node {
        int key;
        int value;
    };

    size_t m_capacity;
    std::list<Node> m_items;
    std::unordered_map<int, std::list<Node>::iterator> m_map;

public:
    explicit LRUCache(size_t capacity);
    std::optional<int> get(int key);
    void put(int key, int value);
    size_t size() const;
};`
      },
      {
        id: 'cpp-impl',
        name: 'LRUCache.cpp',
        path: 'src/LRUCache.cpp',
        language: 'cpp',
        layer: 'controller',
        content: `#include "LRUCache.h"

LRUCache::LRUCache(size_t capacity) : m_capacity(capacity) {}

std::optional<int> LRUCache::get(int key) {
    auto it = m_map.find(key);
    if (it == m_map.end()) {
        return std::nullopt;
    }
    // Line 11: Splice promotes node to front in O(1) time without allocation
    m_items.splice(m_items.begin(), m_items, it->second);
    return it->second->value;
}

void LRUCache::put(int key, int value) {
    auto it = m_map.find(key);
    if (it != m_map.end()) {
        it->second->value = value;
        m_items.splice(m_items.begin(), m_items, it->second);
        return;
    }

    if (m_items.size() >= m_capacity) {
        // Line 24: Evict least recently used item from back of list
        int evictedKey = m_items.back().key;
        m_map.erase(evictedKey);
        m_items.pop_back();
    }

    m_items.push_front({key, value});
    m_map[key] = m_items.begin();
}`
      }
    ],
    callGraphNodes: [
      { id: 'cpp-node-1', label: 'unordered_map (Hash Table)', fileId: 'cpp-header', filePath: 'include/LRUCache.h', startLine: 15, endLine: 16, type: 'model', complexity: 'O(1) Avg Hash Lookup' },
      { id: 'cpp-node-2', label: 'std::list (Doubly-Linked List)', fileId: 'cpp-header', filePath: 'include/LRUCache.h', startLine: 14, endLine: 15, type: 'db', complexity: 'O(1) Splice & Push' },
      { id: 'cpp-node-3', label: 'get(key) Lookup & Promote', fileId: 'cpp-impl', filePath: 'src/LRUCache.cpp', startLine: 5, endLine: 14, type: 'controller', complexity: 'O(1) Time Guarantee' },
      { id: 'cpp-node-4', label: 'put(key, val) Evict & Insert', fileId: 'cpp-impl', filePath: 'src/LRUCache.cpp', startLine: 16, endLine: 31, type: 'controller', complexity: 'O(1) Time Guarantee' }
    ],
    callGraphEdges: [
      { id: 'cpp-e1', source: 'cpp-node-3', target: 'cpp-node-1', label: 'Find Iterator', payloadType: 'key: int' },
      { id: 'cpp-e2', source: 'cpp-node-3', target: 'cpp-node-2', label: 'Splice to Head', payloadType: 'iterator' },
      { id: 'cpp-e3', source: 'cpp-node-4', target: 'cpp-node-2', label: 'Pop Back (LRU)', payloadType: 'Node' }
    ],
    traceSteps: [
      {
        stepIndex: 1,
        title: 'Step 1: put(key=42, val=900) Invocation',
        description: 'Cache verifies if key exists in hash map. On miss, checks if capacity is reached.',
        fileId: 'cpp-impl',
        startLine: 16,
        endLine: 22,
        activeNodeId: 'cpp-node-4',
        variableState: { 'key': '42', 'value': '900', 'capacity': '10', 'currentSize': '10' },
        runtimePayload: 'put(42, 900) -> Capacity Full, Eviction Needed',
        type: 'request'
      },
      {
        stepIndex: 2,
        title: 'Step 2: O(1) Eviction of Tail Node',
        description: 'm_items.back() provides LRU element. Erases key from hash map and pops list tail without traversing items.',
        fileId: 'cpp-impl',
        startLine: 23,
        endLine: 28,
        activeNodeId: 'cpp-node-2',
        variableState: { 'evictedKey': '1', 'erasedFromMap': 'true', 'tailPopped': 'true' },
        runtimePayload: 'Evicted Key: 1',
        type: 'query'
      },
      {
        stepIndex: 3,
        title: 'Step 3: Insert at Head and Store Iterator',
        description: 'New node pushed to front of list. Resulting iterator stored in map for instant direct pointer access in future gets.',
        fileId: 'cpp-impl',
        startLine: 29,
        endLine: 31,
        activeNodeId: 'cpp-node-1',
        variableState: { 'newHeadKey': '42', 'mapSize': '10' },
        runtimePayload: 'm_map[42] -> iterator pointing to list head',
        type: 'response'
      }
    ],
    hotspots: [
      {
        id: 'cpp-hotspot-1',
        fileId: 'cpp-impl',
        filePath: 'src/LRUCache.cpp',
        line: 11,
        severity: 'info',
        type: 'memory_leak',
        title: 'Iterator Invalidation Considerations',
        description: 'std::list preserves iterator validity upon insertion and splicing, unlike std::vector. Why would std::vector crash this implementation?',
        socraticHint: 'What happens to element memory addresses when a std::vector exceeds capacity and triggers reallocation?'
      }
    ],
    vivaQuestions: [
      {
        id: 'cpp-viva-1',
        tier: 2,
        category: 'Complexity & Trade-offs',
        question: 'Why did you use std::list (doubly-linked list) instead of std::vector to store items in this LRU cache? What would happen to the iterators stored in your unordered_map if you used std::vector?',
        fileId: 'cpp-header',
        startLine: 14,
        endLine: 16,
        contextHint: 'Focus on memory reallocation and iterator invalidation during vector capacity growth.',
        checkpoints: [
          'Recognizes that std::list iterators remain valid across insertions and deletions',
          'Explains that std::vector reallocates heap memory when resizing, invalidating all existing pointers/iterators',
          'Highlights that std::list::splice is O(1) pointer redirection without copying elements'
        ],
        expectedConcepts: ['iterator invalidation', 'reallocation', 'vector', 'doubly linked list', 'splice', 'pointers']
      }
    ],
    breakBugs: [
      {
        id: 'cpp-bug-1',
        title: 'Dangling Iterator / Out-of-Sync Hash Map',
        difficulty: 'Hard',
        category: 'Null Pointer',
        targetFileId: 'cpp-impl',
        targetFileName: 'src/LRUCache.cpp',
        originalSnippet: 'int evictedKey = m_items.back().key;\nm_map.erase(evictedKey);\nm_items.pop_back();',
        buggySnippet: '// BUG: Popped list item BEFORE erasing from map, causing map to hold a dangling iterator!\nm_items.pop_back();\n// m_map still contains evictedKey pointing to deallocated node memory',
        triggerInput: 'Consecutive get() on evicted element',
        stackTrace: `Segmentation Fault: Address boundary error (core dumped)
    #0 0x000055a42f in LRUCache::get(int) at src/LRUCache.cpp:11
    #1 0x000055a43a in main() at tests/test_lru.cpp:32`,
        failingTestName: 'test_lru_evicted_element_does_not_segfault()',
        hintLevel1: 'Check the order of operations when evicting an element: list removal vs map erasure.',
        hintLevel2: 'If you pop_back() first without erasing from map, the map still holds a pointer to deleted heap memory!',
        rootCauseAnalysis: 'Deallocating the list node while retaining its iterator in the hash map creates a dangling pointer. Calling get() subsequently dereferences freed memory, triggering a segmentation fault.'
      }
    ]
  }
];

// Socratic Viva Evaluation Engine with Zero-Code-Generation Guardrail
export function evaluateVivaResponse(
  question: VivaQuestion,
  studentAnswer: string
): {
  score: number;
  rating: 'Mastery' | 'Competent' | 'Needs Depth' | 'Unsatisfactory';
  feedback: string;
  strengths: string[];
  gaps: string[];
  socraticFollowUp: string;
} {
  const normalized = studentAnswer.toLowerCase();
  
  // Guardrail check: if answer is too short or evasion
  if (normalized.trim().length < 20) {
    return {
      score: 15,
      rating: 'Unsatisfactory',
      feedback: 'Response is too brief to demonstrate engineering comprehension. State the technical mechanisms clearly.',
      strengths: [],
      gaps: ['Elaborate on the underlying system mechanisms and trade-offs.'],
      socraticFollowUp: 'What specific data structures or protocols are actively participating in this operation?'
    };
  }

  // Count concept matches
  const matchedConcepts = question.expectedConcepts.filter(concept => 
    normalized.includes(concept.toLowerCase())
  );

  const conceptCoverage = matchedConcepts.length / Math.max(question.expectedConcepts.length, 1);
  const wordCount = studentAnswer.trim().split(/\s+/).length;

  let rawScore = Math.round(conceptCoverage * 70);
  if (wordCount >= 30) rawScore += 15;
  if (wordCount >= 60) rawScore += 15;
  rawScore = Math.min(100, Math.max(10, rawScore));

  let rating: 'Mastery' | 'Competent' | 'Needs Depth' | 'Unsatisfactory';
  if (rawScore >= 85) rating = 'Mastery';
  else if (rawScore >= 70) rating = 'Competent';
  else if (rawScore >= 50) rating = 'Needs Depth';
  else rating = 'Unsatisfactory';

  const strengths: string[] = [];
  const gaps: string[] = [];

  question.checkpoints.forEach((cp, idx) => {
    if (idx < Math.ceil(question.checkpoints.length * (rawScore / 100))) {
      strengths.push(cp);
    } else {
      gaps.push(cp);
    }
  });

  // Pure Socratic follow-up without providing any direct code solutions!
  let socraticFollowUp = '';
  if (rating === 'Mastery') {
    socraticFollowUp = 'Strong defense. Now, what telemetry metric (e.g. p99 latency or cache miss ratio) would alert your team in production if this failed under 10x traffic?';
  } else if (rating === 'Competent') {
    socraticFollowUp = 'Good baseline. Can you sharpen your explanation by detailing how the memory layout or database engine handles this internally?';
  } else {
    socraticFollowUp = question.contextHint;
  }

  return {
    score: rawScore,
    rating,
    feedback: rating === 'Mastery' 
      ? 'Exceptional mental model demonstrated. You articulated the exact architectural mechanics and defensive trade-offs.'
      : rating === 'Competent'
      ? 'Solid grasp of the happy path. Deepen your defense of failure states and asynchronous boundaries.'
      : 'Identified surface behavior but missed the underlying systems reason. Review the highlighted lines.',
    strengths,
    gaps,
    socraticFollowUp
  };
}

// Compute aggregate mental-model scorecard
export function calculateScorecard(messages: VivaMessage[]): MentalModelScorecard {
  const evaluated = messages.filter(m => m.evaluation && m.sender === 'examiner');
  if (evaluated.length === 0) {
    return {
      controlFlow: 80,
      dataStructures: 75,
      edgeCases: 70,
      architecture: 75,
      overallReadiness: 75,
      questionsAnswered: 0,
      passedCheckpoints: 0,
      totalCheckpoints: 6
    };
  }

  const scores = evaluated.map(m => m.evaluation!.score);
  const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

  return {
    controlFlow: Math.min(100, Math.round(avg * 1.05)),
    dataStructures: Math.min(100, Math.round(avg * 0.95)),
    edgeCases: Math.min(100, Math.round(avg * 0.9)),
    architecture: Math.min(100, Math.round(avg * 1.02)),
    overallReadiness: avg,
    questionsAnswered: evaluated.length,
    passedCheckpoints: evaluated.reduce((acc, m) => acc + (m.evaluation?.strengths.length || 0), 0),
    totalCheckpoints: evaluated.reduce((acc, m) => acc + (m.evaluation?.strengths.length || 0) + (m.evaluation?.gaps.length || 0), 0) || 6
  };
}


// Custom Code Ingestion Parser
export function parseCustomCodeToProject(customCode: string, fileName: string = 'customApp.ts'): RepoProject {
  const lines = customCode.split('\n');
  const lower = customCode.toLowerCase();
  
  // Determine language
  let language: 'typescript' | 'javascript' | 'python' | 'cpp' | 'sql' = 'typescript';
  if (fileName.endsWith('.py') || lower.includes('def ') || lower.includes('import asyncio')) {
    language = 'python';
  } else if (fileName.endsWith('.cpp') || fileName.endsWith('.h') || lower.includes('#include')) {
    language = 'cpp';
  } else if (fileName.endsWith('.sql') || lower.includes('create table')) {
    language = 'sql';
  }

  // Detect functions / endpoints
  const discoveredNodes: CallGraphNode[] = [];
  const traceSteps: TraceStep[] = [];
  const hotspots: LogicHotspot[] = [];

  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    const trimmed = line.trim();

    // Function declarations
    if (trimmed.startsWith('function ') || trimmed.includes('async function') || trimmed.includes('def ') || trimmed.includes('const ') && trimmed.includes('=>')) {
      const funcName = trimmed.split('(')[0].replace(/^(async\s+|function\s+|const\s+|def\s+)/, '').trim();
      discoveredNodes.push({
        id: `node-${idx}`,
        label: `${funcName}()`,
        fileId: 'custom-file-1',
        filePath: fileName,
        startLine: lineNum,
        endLine: Math.min(lineNum + 15, lines.length),
        type: trimmed.includes('router') || trimmed.includes('app.') ? 'route' : 'controller',
        complexity: 'O(1) Entry'
      });
    }

    // Database calls
    if (trimmed.includes('db.') || trimmed.includes('query') || trimmed.includes('find') || trimmed.includes('select')) {
      discoveredNodes.push({
        id: `node-db-${idx}`,
        label: `DB Access (L${lineNum})`,
        fileId: 'custom-file-1',
        filePath: fileName,
        startLine: lineNum,
        endLine: lineNum + 2,
        type: 'db',
        complexity: 'I/O Bound'
      });
    }

    // Hotspot detection
    if (trimmed.includes('localStorage') && trimmed.includes('token')) {
      hotspots.push({
        id: `hotspot-${idx}`,
        fileId: 'custom-file-1',
        filePath: fileName,
        line: lineNum,
        severity: 'critical',
        type: 'unvalidated_input',
        title: 'Sensitive Credential in LocalStorage',
        description: 'Storing authentication tokens in localStorage is susceptible to script injection (XSS).',
        socraticHint: 'How does an HttpOnly cookie safeguard credentials from unauthorized client scripts?'
      });
    } else if (trimmed.includes('SELECT *')) {
      hotspots.push({
        id: `hotspot-${idx}`,
        fileId: 'custom-file-1',
        filePath: fileName,
        line: lineNum,
        severity: 'warning',
        type: 'n_plus_one',
        title: 'Unbounded SELECT * Query',
        description: 'Querying all columns causes redundant network payload and circumvents index-only scan optimizations.',
        socraticHint: 'What happens to cache throughput when unused large columns are fetched continuously?'
      });
    }
  });

  // Ensure at least 3 nodes
  if (discoveredNodes.length === 0) {
    discoveredNodes.push(
      { id: 'node-entry', label: 'Entry Gateway', fileId: 'custom-file-1', filePath: fileName, startLine: 1, endLine: Math.min(10, lines.length), type: 'route', complexity: 'O(1) Init' },
      { id: 'node-logic', label: 'Main Execution', fileId: 'custom-file-1', filePath: fileName, startLine: Math.min(11, lines.length), endLine: Math.min(30, lines.length), type: 'controller', complexity: 'Runtime Logic' },
      { id: 'node-res', label: 'Result Handler', fileId: 'custom-file-1', filePath: fileName, startLine: Math.max(1, lines.length - 10), endLine: lines.length, type: 'model', complexity: 'Response State' }
    );
  }

  // Create Edges
  const discoveredEdges: CallGraphEdge[] = [];
  for (let i = 0; i < discoveredNodes.length - 1; i++) {
    discoveredEdges.push({
      id: `edge-${i}`,
      source: discoveredNodes[i].id,
      target: discoveredNodes[i + 1].id,
      label: `Control Flow -> L${discoveredNodes[i + 1].startLine}`,
      payloadType: 'State Object'
    });
  }

  // Trace steps
  discoveredNodes.forEach((node, i) => {
    traceSteps.push({
      stepIndex: i + 1,
      title: `Step ${i + 1}: ${node.label} Invocation`,
      description: `Execution reaches lines ${node.startLine} to ${node.endLine} in ${fileName}. Scope variables are allocated in runtime memory.`,
      fileId: 'custom-file-1',
      startLine: node.startLine,
      endLine: node.endLine,
      activeNodeId: node.id,
      variableState: {
        'status': '"active"',
        'scopeLevel': `${i + 1}`,
        'allocatedBytes': `${(i + 1) * 64}B`
      },
      runtimePayload: `Call to ${node.label} at line ${node.startLine}`,
      type: i === 0 ? 'request' : i === discoveredNodes.length - 1 ? 'response' : 'validation'
    });
  });

  // Hotspots fallback
  if (hotspots.length === 0) {
    hotspots.push({
      id: 'hotspot-def',
      fileId: 'custom-file-1',
      filePath: fileName,
      line: Math.min(15, lines.length),
      severity: 'info',
      type: 'unhandled_null',
      title: 'Defensive Input & Boundary Check',
      description: 'Ensure boundary parameters and external payloads are validated before downstream mutations.',
      socraticHint: 'What is the failure behavior if this function receives undefined or null input arguments?'
    });
  }

  return {
    id: `custom-${Date.now()}`,
    name: `Custom Analysis: ${fileName}`,
    tagline: `Client-parsed AST and trace for ${fileName}`,
    language,
    files: [
      {
        id: 'custom-file-1',
        name: fileName,
        path: fileName,
        language,
        layer: 'controller',
        content: customCode
      }
    ],
    callGraphNodes: discoveredNodes,
    callGraphEdges: discoveredEdges,
    traceSteps,
    hotspots,
    vivaQuestions: [
      {
        id: 'cq-1',
        tier: 1,
        category: 'Comprehension',
        question: `Walk me through lines ${discoveredNodes[0].startLine} to ${discoveredNodes[0].endLine} in ${fileName}. How does control flow enter here, and what data structures are created in memory?`,
        fileId: 'custom-file-1',
        startLine: discoveredNodes[0].startLine,
        endLine: discoveredNodes[0].endLine,
        contextHint: 'Focus on initialization, memory allocation, and argument validation.',
        checkpoints: ['Explains entry preconditions', 'Articulates scope memory allocation', 'Clarifies return type'],
        expectedConcepts: ['memory', 'allocation', 'function', 'scope', 'validation', 'return']
      },
      {
        id: 'cq-2',
        tier: 2,
        category: 'Complexity & Trade-offs',
        question: `What is the Big-O time and space complexity of the logic around line ${discoveredNodes[Math.min(1, discoveredNodes.length - 1)].startLine}? What trade-offs were made?`,
        fileId: 'custom-file-1',
        startLine: discoveredNodes[Math.min(1, discoveredNodes.length - 1)].startLine,
        endLine: discoveredNodes[Math.min(1, discoveredNodes.length - 1)].endLine,
        contextHint: 'Analyze loops, recursions, and auxiliary memory structures.',
        checkpoints: ['Identifies asymptotic runtime', 'Considers memory overhead', 'Justifies architectural choice'],
        expectedConcepts: ['complexity', 'big-o', 'runtime', 'space', 'trade-off', 'time']
      }
    ],
    breakBugs: [
      {
        id: 'cbug-1',
        title: 'Boundary & Unhandled State Injection',
        difficulty: 'Intermediate',
        category: 'Null Pointer',
        targetFileId: 'custom-file-1',
        targetFileName: fileName,
        originalSnippet: lines.slice(0, 5).join('\n'),
        buggySnippet: '// Injected unhandled null state:\nthrow new Error("Unhandled exception during runtime execution");',
        triggerInput: 'Invalid or null arguments payload',
        stackTrace: `RuntimeError: Unhandled exception in ${fileName} at line ${discoveredNodes[0].startLine}\n    at processTicksAndRejections (node:internal/process/task_queues:95:5)`,
        failingTestName: 'test_custom_boundary_validation()',
        hintLevel1: 'Check if edge-case arguments are handled gracefully before processing.',
        hintLevel2: 'Add defensive guard clauses at function entry.',
        rootCauseAnalysis: 'External callers may pass unexpected or empty values, causing execution failure without graceful degradation.'
      }
    ]
  };
}
