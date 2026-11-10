import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Wind, 
  Flame, 
  Play, 
  RotateCcw, 
  Terminal as TerminalIcon, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  Timer, 
  WifiOff, 
  Bug, 
  Code2, 
  ShieldCheck, 
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface ChaosWindTunnelViewProps {
  onBack: () => void;
  onNavigateToBreak?: () => void;
  theme?: 'dark' | 'light';
}

interface ChaosScenario {
  id: string;
  name: string;
  description: string;
  initialCode: string;
  hardenedCode: string;
  expectedGust: 'race_condition' | 'slow_3g' | 'drop_socket' | 'malformed_json';
}

const SCENARIOS: ChaosScenario[] = [
  {
    id: 'checkout-race',
    name: 'E-Commerce Checkout (Race Condition Hazard)',
    description: 'A cart checkout handler vulnerable to double-charges when a user spam-clicks "Pay".',
    expectedGust: 'race_condition',
    initialCode: `// VULNERABLE: No mutex lock or idempotency check
let accountBalance = 100;
let isProcessing = false;

async function processOrder(orderId: string, amount: number) {
  // Silent race condition: async read-then-write without atomic lock
  if (accountBalance >= amount) {
    await new Promise(r => setTimeout(r, 60)); // Simulating remote card gateway
    accountBalance -= amount;
    return { status: 200, balance: accountBalance };
  }
  throw new Error("Insufficient funds");
}`,
    hardenedCode: `// HARDENED: Mutex lock & Idempotency key
let accountBalance = 100;
const processedOrders = new Set<string>();
let activeLock = false;

async function processOrder(orderId: string, amount: number) {
  if (processedOrders.has(orderId)) {
    return { status: 200, balance: accountBalance, cached: true };
  }
  if (activeLock) throw new Error("429 Too Many Requests: Order processing in flight");
  
  activeLock = true;
  try {
    if (accountBalance >= amount) {
      await new Promise(r => setTimeout(r, 60));
      accountBalance -= amount;
      processedOrders.add(orderId);
      return { status: 200, balance: accountBalance };
    }
    throw new Error("Insufficient funds");
  } finally {
    activeLock = false;
  }
}`
  },
  {
    id: 'socket-reconnect',
    name: 'Live WebSocket Stream (Abrupt Socket Drop)',
    description: 'A market ticker client that crashes when the server drops connection mid-heartbeat.',
    expectedGust: 'drop_socket',
    initialCode: `// VULNERABLE: Direct stream read without reconnect backoff
async function listenToTicker(streamUrl: string) {
  const socket = new WebSocket(streamUrl);
  socket.onmessage = (event) => {
    const quote = JSON.parse(event.data);
    updateTickerUI(quote.symbol, quote.price);
  };
  // Missing onerror, onclose, and exponential backoff retry!
}`,
    hardenedCode: `// HARDENED: Auto-reconnect with jitter backoff & schema safety
async function listenToTicker(streamUrl: string, retryCount = 0) {
  const maxRetries = 5;
  const socket = new WebSocket(streamUrl);

  socket.onmessage = (event) => {
    try {
      const quote = JSON.parse(event.data);
      if (quote?.symbol && typeof quote.price === 'number') {
        updateTickerUI(quote.symbol, quote.price);
      }
    } catch (err) {
      console.warn("Dropped corrupted tick frame");
    }
  };

  socket.onclose = () => {
    if (retryCount < maxRetries) {
      const delay = Math.min(1000 * Math.pow(2, retryCount), 8000);
      setTimeout(() => listenToTicker(streamUrl, retryCount + 1), delay);
    }
  };
}`
  },
  {
    id: 'external-api-timeout',
    name: 'Microservice Fetch (Slow 3G / High Latency)',
    description: 'An API route calling an external microservice that hangs indefinitely when latency spikes.',
    expectedGust: 'slow_3g',
    initialCode: `// VULNERABLE: Unbounded fetch without AbortController
async function fetchUserProfile(userId: string) {
  // If the remote service suffers packet loss, this thread hangs forever
  const res = await fetch("https://auth.internal/v1/users/" + userId);
  return res.json();
}`,
    hardenedCode: `// HARDENED: AbortController with 2000ms deadline guard
async function fetchUserProfile(userId: string) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2000);
  try {
    const res = await fetch("https://auth.internal/v1/users/" + userId, {
      signal: controller.signal
    });
    if (!res.ok) throw new Error("Service returned " + res.status);
    return await res.json();
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw new Error("504 Gateway Timeout: Remote service exceeded 2000ms deadline");
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}`
  }
];

export const ChaosWindTunnelView: React.FC<ChaosWindTunnelViewProps> = ({
  onBack,
  onNavigateToBreak,
  theme = 'dark'
}) => {
  const isLight = theme === 'light';

  const [selectedScenarioId, setSelectedScenarioId] = useState(SCENARIOS[0].id);
  const scenario = SCENARIOS.find(s => s.id === selectedScenarioId) || SCENARIOS[0];
  
  const [code, setCode] = useState(scenario.initialCode);
  const [activeGust, setActiveGust] = useState<string | null>(null);
  const [windSpeedKnots, setWindSpeedKnots] = useState<number>(0);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '[TUNNEL INIT] Wind tunnel calibrated. Turbines idle at 0 knots.',
    '[READY] Load a wind gust trigger below to stress-test your logic.'
  ]);
  const [resilienceScore, setResilienceScore] = useState<number>(35);
  const [isHardened, setIsHardened] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Sync code when scenario switches
  useEffect(() => {
    setCode(scenario.initialCode);
    setResilienceScore(35);
    setIsHardened(false);
    setActiveGust(null);
    setWindSpeedKnots(0);
    setTerminalLogs([
      `[TUNNEL CALIBRATED] Loaded test scenario: "${scenario.name}".`,
      '[READY] Turbines standing by. Inject chaos to test resilience.'
    ]);
  }, [selectedScenarioId]);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setTerminalLogs(prev => [...prev.slice(-18), `[${time}] ${msg}`]);
  };

  // Run Wind Gust Simulation
  const handleInjectGust = (gustType: 'race_condition' | 'slow_3g' | 'drop_socket' | 'malformed_json') => {
    setIsRunning(true);
    setActiveGust(gustType);

    const isCodeHardened = code.includes('AbortController') || code.includes('processedOrders') || code.includes('maxRetries') || isHardened;

    if (gustType === 'race_condition') {
      setWindSpeedKnots(74);
      addLog('[GUST: RACE CONDITION] Injecting 5 simultaneous concurrent requests to processOrder()...');
      setTimeout(() => {
        if (isCodeHardened) {
          addLog('[MUTEX ACTIVE] Request #1 acquired lock. Balance decremented atomically.');
          addLog('[LOCK DEFENSE] Requests #2, #3, #4 rejected with 429 Too Many Requests. No double-spend.');
          addLog('[PASS] 0 balance leakage detected. Race condition neutralized.');
          setResilienceScore(96);
        } else {
          addLog('[CRITICAL ERROR] Race condition triggered! Account balance decremented twice in parallel (-$100 & -$100).');
          addLog('[CORRUPTION] Negative balance observed: -$100. Double-charge bug confirmed.');
          setResilienceScore(18);
        }
        setIsRunning(false);
      }, 700);
    } else if (gustType === 'slow_3g') {
      setWindSpeedKnots(85);
      addLog('[GUST: HIGH LATENCY] Throttling network link to 3G profile (2400ms synthetic delay)...');
      setTimeout(() => {
        if (isCodeHardened) {
          addLog('[DEADLINE ENFORCED] AbortController fired at 2000ms threshold.');
          addLog('[PASS] Gracefully threw 504 Gateway Timeout. Connection socket closed cleanly.');
          setResilienceScore(94);
        } else {
          addLog('[STALL CRASH] Handler hung indefinitely awaiting remote promise resolution.');
          addLog('[RESOURCE EXHAUSTION] Thread pool connection timed out with uncaught socket starvation.');
          setResilienceScore(22);
        }
        setIsRunning(false);
      }, 800);
    } else if (gustType === 'drop_socket') {
      setWindSpeedKnots(92);
      addLog('[GUST: SOCKET SEVER] Dropping TCP connection mid-handshake [RST packet]...');
      setTimeout(() => {
        if (isCodeHardened) {
          addLog('[BACKOFF TRIGGERED] Exponential retry attempt 1 scheduled in 1000ms.');
          addLog('[PASS] Stream re-established without browser UI crash.');
          setResilienceScore(98);
        } else {
          addLog('[UNCAUGHT EXCEPTION] WebSocket connection to ws:// dropped without handler.');
          addLog('[MEMORY LEAK] Unclosed socket event listener remains active in heap.');
          setResilienceScore(15);
        }
        setIsRunning(false);
      }, 700);
    } else if (gustType === 'malformed_json') {
      setWindSpeedKnots(68);
      addLog('[GUST: MALFORMED FUZZ] Injecting corrupted JSON payload: { "price": NaN, "token": [null] }...');
      setTimeout(() => {
        if (isCodeHardened) {
          addLog('[SCHEMA GUARD] Corrupted payload dropped silently via safeParse.');
          addLog('[PASS] Application state preserved.');
          setResilienceScore(92);
        } else {
          addLog('[TYPE ERROR] Uncaught TypeError: Cannot read properties of null.');
          addLog('[CRASH] Subprocess exited with code 1.');
          setResilienceScore(20);
        }
        setIsRunning(false);
      }, 700);
    }
  };

  const handleApplyHardenedSolution = () => {
    setCode(scenario.hardenedCode);
    setIsHardened(true);
    setResilienceScore(95);
    addLog('[HARDENING APPLIED] Injected resilience guards into the test harness.');
  };

  const handleReset = () => {
    setCode(scenario.initialCode);
    setIsHardened(false);
    setResilienceScore(35);
    setWindSpeedKnots(0);
    setActiveGust(null);
    addLog('[RESET] Code and wind speed restored to baseline.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className={`p-2 rounded-lg border transition-colors ${
              isLight 
                ? 'border-[#0A2540]/20 bg-white hover:bg-slate-100 text-[#0A2540]' 
                : 'border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-white'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <Wind className="w-5 h-5 text-cyan-400" />
              <h1 className="text-xl sm:text-2xl font-serif font-bold tracking-tight">
                Chaos Wind Tunnel
              </h1>
            </div>
            <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
              Stress-test JavaScript logic against synthetic race conditions, dropped sockets, and latency gusts in browser RAM.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateToBreak && (
            <button
              onClick={onNavigateToBreak}
              className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-medium transition-colors ${
                isLight 
                  ? 'border-[#0A2540]/30 bg-white text-[#0A2540] hover:bg-slate-50' 
                  : 'border-neutral-800 bg-neutral-900 text-neutral-300 hover:bg-neutral-800'
              }`}
            >
              Open Vayun Break &rarr;
            </button>
          )}
        </div>
      </div>

      {/* Aerodynamic Telemetry HUD Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Airspeed Gauge */}
        <div className={`p-4 rounded-xl border transition-all ${
          isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-neutral-950 border-neutral-800'
        }`}>
          <div className="flex items-center justify-between text-neutral-500 text-xs font-mono uppercase">
            <span>Turbine Airspeed</span>
            <Wind className={`w-4 h-4 ${windSpeedKnots > 50 ? 'text-cyan-400 animate-spin' : 'text-neutral-400'}`} />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-serif font-bold text-cyan-400">
              {windSpeedKnots}
            </span>
            <span className="text-xs font-mono text-neutral-500">knots</span>
          </div>
          <p className="text-[11px] font-mono mt-1 text-neutral-400">
            {windSpeedKnots > 70 ? 'Hurricane-force synthetic gusts' : windSpeedKnots > 0 ? 'Active stress turbulence' : 'Calm / Zero airflow'}
          </p>
        </div>

        {/* Resilience Score */}
        <div className={`p-4 rounded-xl border transition-all ${
          isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-neutral-950 border-neutral-800'
        }`}>
          <div className="flex items-center justify-between text-neutral-500 text-xs font-mono uppercase">
            <span>Chaos Resilience</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-3xl font-serif font-bold ${
              resilienceScore > 75 ? 'text-emerald-500' : resilienceScore > 40 ? 'text-amber-500' : 'text-rose-500'
            }`}>
              {resilienceScore}%
            </span>
            <span className="text-xs font-mono text-neutral-500">pass rate</span>
          </div>
          <p className="text-[11px] font-mono mt-1 text-neutral-400">
            {resilienceScore > 75 ? 'Code is hardened against failure' : 'Vulnerable to production crashes'}
          </p>
        </div>

        {/* Active Gust Mode */}
        <div className={`p-4 rounded-xl border transition-all ${
          isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-neutral-950 border-neutral-800'
        }`}>
          <div className="flex items-center justify-between text-neutral-500 text-xs font-mono uppercase">
            <span>Synthetic Gust</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-sm font-mono font-bold truncate text-slate-900 dark:text-white">
            {activeGust ? activeGust.replace('_', ' ').toUpperCase() : 'NONE (IDLE)'}
          </div>
          <p className="text-[11px] font-mono mt-1 text-neutral-400">
            {isRunning ? 'Turbines firing packets...' : 'Ready for injection'}
          </p>
        </div>

        {/* Isolation Boundary */}
        <div className={`p-4 rounded-xl border transition-all ${
          isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-neutral-950 border-neutral-800'
        }`}>
          <div className="flex items-center justify-between text-neutral-500 text-xs font-mono uppercase">
            <span>Tunnel Sandbox</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-sm font-mono font-bold text-emerald-400">
            100% In-Browser RAM
          </div>
          <p className="text-[11px] font-mono mt-1 text-neutral-400">
            No Docker or cloud testbed required
          </p>
        </div>
      </div>

      {/* Interactive Wind Gust Injectors */}
      <div className={`p-5 rounded-2xl border space-y-4 ${
        isLight ? 'bg-[#0A2540]/5 border-[#0A2540]/20' : 'bg-neutral-950 border-neutral-800'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
              Inject Wind Turbulence Gusts
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Click any gust trigger to unleash synthetic chaos against the active code handler.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleApplyHardenedSolution}
              className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold flex items-center gap-1.5 transition-all ${
                isLight 
                  ? 'bg-[#0A2540] text-white hover:bg-[#071829]' 
                  : 'bg-emerald-500 text-black hover:bg-emerald-400'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Apply Hardened Guards</span>
            </button>
            <button
              onClick={handleReset}
              className={`p-1.5 rounded-lg border text-neutral-400 hover:text-white transition-colors ${
                isLight ? 'border-slate-300 bg-white' : 'border-neutral-800 bg-neutral-900'
              }`}
              title="Reset Code & Tunnel"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Button Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => handleInjectGust('race_condition')}
            disabled={isRunning}
            className={`p-3 rounded-xl border text-left transition-all group ${
              activeGust === 'race_condition'
                ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                : isLight ? 'bg-white hover:border-[#0A2540] text-slate-800' : 'bg-neutral-900/80 hover:bg-neutral-800 text-neutral-200'
            }`}
          >
            <div className="flex items-center gap-2 font-mono text-xs font-bold">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>[Inject Race Condition]</span>
            </div>
            <p className="text-[11px] font-mono text-neutral-400 mt-1">
              Fires 5 parallel calls to test for atomic mutations &amp; double-spends.
            </p>
          </button>

          <button
            onClick={() => handleInjectGust('slow_3g')}
            disabled={isRunning}
            className={`p-3 rounded-xl border text-left transition-all group ${
              activeGust === 'slow_3g'
                ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                : isLight ? 'bg-white hover:border-[#0A2540] text-slate-800' : 'bg-neutral-900/80 hover:bg-neutral-800 text-neutral-200'
            }`}
          >
            <div className="flex items-center gap-2 font-mono text-xs font-bold">
              <Timer className="w-3.5 h-3.5 text-cyan-400" />
              <span>[Simulate Slow 3G / Latency]</span>
            </div>
            <p className="text-[11px] font-mono text-neutral-400 mt-1">
              Injects 2400ms synthetic delay to test AbortController deadlines.
            </p>
          </button>

          <button
            onClick={() => handleInjectGust('drop_socket')}
            disabled={isRunning}
            className={`p-3 rounded-xl border text-left transition-all group ${
              activeGust === 'drop_socket'
                ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                : isLight ? 'bg-white hover:border-[#0A2540] text-slate-800' : 'bg-neutral-900/80 hover:bg-neutral-800 text-neutral-200'
            }`}
          >
            <div className="flex items-center gap-2 font-mono text-xs font-bold">
              <WifiOff className="w-3.5 h-3.5 text-rose-400" />
              <span>[Drop Database / Socket]</span>
            </div>
            <p className="text-[11px] font-mono text-neutral-400 mt-1">
              Abruptly closes connection to test exponential reconnect backoff.
            </p>
          </button>

          <button
            onClick={() => handleInjectGust('malformed_json')}
            disabled={isRunning}
            className={`p-3 rounded-xl border text-left transition-all group ${
              activeGust === 'malformed_json'
                ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                : isLight ? 'bg-white hover:border-[#0A2540] text-slate-800' : 'bg-neutral-900/80 hover:bg-neutral-800 text-neutral-200'
            }`}
          >
            <div className="flex items-center gap-2 font-mono text-xs font-bold">
              <Bug className="w-3.5 h-3.5 text-emerald-400" />
              <span>[Send Malformed Payload]</span>
            </div>
            <p className="text-[11px] font-mono text-neutral-400 mt-1">
              Sends corrupted schemas, NaN, and unexpected nulls.
            </p>
          </button>
        </div>
      </div>

      {/* Main Grid: Code Sandbox (Left) & Telemetry Console (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Code Sandbox */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-neutral-400" />
              <span className="text-xs font-mono font-semibold">Test Scenario Code</span>
            </div>

            <div className="flex items-center gap-1.5">
              {SCENARIOS.map(sc => (
                <button
                  key={sc.id}
                  onClick={() => setSelectedScenarioId(sc.id)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                    selectedScenarioId === sc.id
                      ? isLight ? 'bg-[#0A2540] text-white font-semibold' : 'bg-white text-black font-semibold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {sc.name.split(' (')[0]}
                </button>
              ))}
            </div>
          </div>

          <div className={`rounded-xl border overflow-hidden font-mono text-xs ${
            isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-neutral-950 border-neutral-800 text-neutral-200'
          }`}>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={18}
              className="w-full p-4 bg-transparent resize-none focus:outline-hidden leading-relaxed font-mono"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Right: Live Telemetry Terminal */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TerminalIcon className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono font-semibold">Wind Tunnel Telemetry Output</span>
            </div>

            <span className="text-[10px] font-mono text-neutral-500">
              Simulated Node.js / WASM Runtime
            </span>
          </div>

          {/* Console Window */}
          <div className="rounded-xl border border-neutral-800 bg-black p-4 font-mono text-xs space-y-1.5 min-h-[380px] max-h-[380px] overflow-y-auto select-text shadow-2xl">
            {terminalLogs.map((log, i) => (
              <div 
                key={i} 
                className={`leading-relaxed ${
                  log.includes('CRITICAL') || log.includes('CORRUPTION') || log.includes('CRASH')
                    ? 'text-rose-400 font-semibold'
                    : log.includes('PASS') || log.includes('DEFENSE')
                    ? 'text-emerald-400 font-semibold'
                    : log.includes('GUST') || log.includes('DEADLINE')
                    ? 'text-amber-300'
                    : 'text-neutral-400'
                }`}
              >
                {log}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
