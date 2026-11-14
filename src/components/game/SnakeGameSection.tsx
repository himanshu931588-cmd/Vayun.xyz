import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Gamepad2, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Trophy, 
  Flame, 
  ChevronDown, 
  ChevronUp, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight,
  Terminal,
  Sparkles
} from 'lucide-react';

interface SnakeGameSectionProps {
  theme?: 'dark' | 'light';
}

interface Point {
  x: number;
  y: number;
}

interface FoodItem extends Point {
  type: 'token' | 'bug' | 'proof' | 'turbo';
  points: number;
  color: string;
  symbol: string;
}

const GRID_SIZE = 20; // 20x20 grid
const SPEEDS = {
  chill: 120,
  normal: 85,
  turbo: 55
};

export const SnakeGameSection: React.FC<SnakeGameSectionProps> = ({ theme = 'dark' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('vayun_snake_highscore');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });
  const [difficulty, setDifficulty] = useState<'chill' | 'normal' | 'turbo'>('normal');
  const [isMuted, setIsMuted] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameLoopRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);

  // Snake State
  const snakeRef = useRef<Point[]>([
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
  ]);
  const directionRef = useRef<Point>({ x: 1, y: 0 });
  const nextDirectionRef = useRef<Point>({ x: 1, y: 0 });
  const foodRef = useRef<FoodItem>({
    x: 15,
    y: 10,
    type: 'token',
    points: 10,
    color: '#10b981',
    symbol: '🪙'
  });
  const particlesRef = useRef<Array<{ x: number; y: number; vx: number; vy: number; color: string; life: number }>>([]);

  const isLight = theme === 'light';

  // Sound Synth via Web Audio API (100% in-RAM)
  const playSound = useCallback((type: 'eat' | 'die' | 'start') => {
    if (isMuted) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'eat') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === 'die') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(55, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === 'start') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(330, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      }
    } catch {
      // Audio not permitted or suspended
    }
  }, [isMuted]);

  // Spawn random food
  const spawnFood = useCallback((): FoodItem => {
    const snake = snakeRef.current;
    let newX = 0;
    let newY = 0;
    let collision = true;

    while (collision) {
      newX = Math.floor(Math.random() * GRID_SIZE);
      newY = Math.floor(Math.random() * GRID_SIZE);
      collision = snake.some(seg => seg.x === newX && seg.y === newY);
    }

    const rand = Math.random();
    if (rand < 0.6) {
      return { x: newX, y: newY, type: 'token', points: 10, color: isLight ? '#2563eb' : '#10b981', symbol: '🪙' };
    } else if (rand < 0.8) {
      return { x: newX, y: newY, type: 'bug', points: 25, color: '#f59e0b', symbol: '🐛' };
    } else if (rand < 0.95) {
      return { x: newX, y: newY, type: 'proof', points: 50, color: '#8b5cf6', symbol: '🛡️' };
    } else {
      return { x: newX, y: newY, type: 'turbo', points: 100, color: '#06b6d4', symbol: '⚡' };
    }
  }, [isLight]);

  // Create particles on eat
  const createParticles = (x: number, y: number, color: string) => {
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3;
      particlesRef.current.push({
        x: x * 20 + 10,
        y: y * 20 + 10,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        life: 1
      });
    }
  };

  // Start / Reset Game
  const startGame = () => {
    snakeRef.current = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 }
    ];
    directionRef.current = { x: 1, y: 0 };
    nextDirectionRef.current = { x: 1, y: 0 };
    foodRef.current = spawnFood();
    particlesRef.current = [];
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setIsPlaying(true);
    playSound('start');
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || isGameOver) {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          startGame();
        }
        return;
      }

      // Pause toggle
      if (e.key === ' ') {
        e.preventDefault();
        setIsPaused(prev => !prev);
        return;
      }

      // Reset
      if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        startGame();
        return;
      }

      const current = directionRef.current;
      let newDir: Point | null = null;

      if ((e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') && current.y !== 1) {
        newDir = { x: 0, y: -1 };
      } else if ((e.key === 'ArrowDown' || e.key.toLowerCase() === 's') && current.y !== -1) {
        newDir = { x: 0, y: 1 };
      } else if ((e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') && current.x !== 1) {
        newDir = { x: -1, y: 0 };
      } else if ((e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') && current.x !== -1) {
        newDir = { x: 1, y: 0 };
      }

      if (newDir) {
        e.preventDefault();
        nextDirectionRef.current = newDir;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isGameOver, playSound]);

  // Handle D-pad directional clicks for mobile
  const handleDirectionClick = (dir: 'up' | 'down' | 'left' | 'right') => {
    if (!isPlaying) {
      startGame();
      return;
    }
    const current = directionRef.current;
    if (dir === 'up' && current.y !== 1) nextDirectionRef.current = { x: 0, y: -1 };
    if (dir === 'down' && current.y !== -1) nextDirectionRef.current = { x: 0, y: 1 };
    if (dir === 'left' && current.x !== 1) nextDirectionRef.current = { x: -1, y: 0 };
    if (dir === 'right' && current.x !== -1) nextDirectionRef.current = { x: 1, y: 0 };
  };

  // Main Render & Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;
    const speed = SPEEDS[difficulty];

    const loop = (time: number) => {
      // 1. Logic Tick
      if (isPlaying && !isPaused && !isGameOver) {
        if (time - lastTickRef.current >= speed) {
          lastTickRef.current = time;

          directionRef.current = nextDirectionRef.current;
          const head = { ...snakeRef.current[0] };
          head.x += directionRef.current.x;
          head.y += directionRef.current.y;

          // Wall collision
          if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
            setIsGameOver(true);
            setIsPlaying(false);
            playSound('die');
            return;
          }

          // Self collision
          if (snakeRef.current.some(seg => seg.x === head.x && seg.y === head.y)) {
            setIsGameOver(true);
            setIsPlaying(false);
            playSound('die');
            return;
          }

          const newSnake = [head, ...snakeRef.current];

          // Food Collision
          if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
            const addedPoints = foodRef.current.points;
            createParticles(head.x, head.y, foodRef.current.color);
            playSound('eat');
            setScore(prev => {
              const updated = prev + addedPoints;
              if (updated > highScore) {
                setHighScore(updated);
                try {
                  localStorage.setItem('vayun_snake_highscore', updated.toString());
                } catch {}
              }
              return updated;
            });
            foodRef.current = spawnFood();
          } else {
            newSnake.pop(); // Remove tail
          }

          snakeRef.current = newSnake;
        }
      }

      // 2. Render Frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background grid
      ctx.fillStyle = isLight ? '#f8fafc' : '#08090b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid lines
      ctx.strokeStyle = isLight ? 'rgba(226, 232, 240, 0.8)' : 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(canvas.width, i * cellSize);
        ctx.stroke();
      }

      // Draw Food
      const food = foodRef.current;
      ctx.fillStyle = food.color;
      ctx.shadowColor = food.color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(
        food.x * cellSize + cellSize / 2,
        food.y * cellSize + cellSize / 2,
        cellSize / 2.4,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw Snake
      snakeRef.current.forEach((seg, index) => {
        const isHead = index === 0;
        if (isHead) {
          ctx.fillStyle = isLight ? '#2563eb' : '#34d399';
          ctx.shadowColor = isLight ? 'rgba(37,99,235,0.4)' : 'rgba(52,211,153,0.5)';
          ctx.shadowBlur = 8;
        } else {
          ctx.shadowBlur = 0;
          if (isLight) {
            ctx.fillStyle = `rgba(37, 99, 235, ${Math.max(0.35, 1 - index / snakeRef.current.length)})`;
          } else {
            ctx.fillStyle = `rgba(52, 211, 153, ${Math.max(0.3, 1 - index / snakeRef.current.length)})`;
          }
        }

        const padding = 2;
        ctx.beginPath();
        ctx.roundRect(
          seg.x * cellSize + padding,
          seg.y * cellSize + padding,
          cellSize - padding * 2,
          cellSize - padding * 2,
          isHead ? 6 : 4
        );
        ctx.fill();

        // Draw eyes on head
        if (isHead) {
          ctx.shadowBlur = 0;
          ctx.fillStyle = isLight ? '#ffffff' : '#000000';
          const eyeSize = 2;
          const cx = seg.x * cellSize + cellSize / 2;
          const cy = seg.y * cellSize + cellSize / 2;
          const dir = directionRef.current;

          let eye1X = cx - 3;
          let eye1Y = cy - 3;
          let eye2X = cx + 3;
          let eye2Y = cy - 3;

          if (dir.x === 1) {
            eye1X = cx + 3; eye1Y = cy - 3;
            eye2X = cx + 3; eye2Y = cy + 3;
          } else if (dir.x === -1) {
            eye1X = cx - 3; eye1Y = cy - 3;
            eye2X = cx - 3; eye2Y = cy + 3;
          } else if (dir.y === 1) {
            eye1X = cx - 3; eye1Y = cy + 3;
            eye2X = cx + 3; eye2Y = cy + 3;
          }

          ctx.beginPath();
          ctx.arc(eye1X, eye1Y, eyeSize, 0, Math.PI * 2);
          ctx.arc(eye2X, eye2Y, eyeSize, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      ctx.shadowBlur = 0;

      // Draw & update particles
      particlesRef.current.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.05;

        if (p.life > 0) {
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.life;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      });
      particlesRef.current = particlesRef.current.filter(p => p.life > 0);

      // Pause or Game Over overlay on canvas
      if (!isPlaying || isPaused || isGameOver) {
        ctx.fillStyle = isLight ? 'rgba(255, 255, 255, 0.75)' : 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = isLight ? '#0f172a' : '#ffffff';
        ctx.font = 'bold 16px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if (isGameOver) {
          ctx.fillStyle = '#ef4444';
          ctx.fillText('STACK COLLISION (GAME OVER)', canvas.width / 2, canvas.height / 2 - 14);
          ctx.fillStyle = isLight ? '#334155' : '#94a3b8';
          ctx.font = '12px "JetBrains Mono", monospace';
          ctx.fillText(`Final Score: ${score} pts • Space/Tap to Restart`, canvas.width / 2, canvas.height / 2 + 14);
        } else if (isPaused) {
          ctx.fillText('PROCESS PAUSED', canvas.width / 2, canvas.height / 2 - 10);
          ctx.fillStyle = isLight ? '#334155' : '#94a3b8';
          ctx.font = '11px "JetBrains Mono", monospace';
          ctx.fillText('Press Space to Resume', canvas.width / 2, canvas.height / 2 + 12);
        } else {
          ctx.fillText('VAYUN TERMINAL SNAKE', canvas.width / 2, canvas.height / 2 - 14);
          ctx.fillStyle = isLight ? '#334155' : '#94a3b8';
          ctx.font = '11px "JetBrains Mono", monospace';
          ctx.fillText('Press Play or Space to Launch', canvas.width / 2, canvas.height / 2 + 12);
        }
      }

      gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [isPlaying, isPaused, isGameOver, difficulty, isLight, score, highScore, spawnFood, playSound]);

  return (
    <div className={`rounded-2xl border transition-all overflow-hidden ${
      isLight 
        ? 'bg-white border-slate-200/90 shadow-sm text-slate-900' 
        : 'bg-[#0a0b0e] border-neutral-800 text-white'
    }`}>
      
      {/* Interactive Top Banner Header */}
      <div 
        onClick={() => setIsExpanded(prev => !prev)}
        className={`px-5 py-3.5 flex items-center justify-between cursor-pointer select-none transition-colors ${
          isLight ? 'hover:bg-slate-50 border-b border-slate-100' : 'hover:bg-neutral-900/60 border-b border-neutral-800/80'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${
            isLight ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-neutral-900 border-neutral-800 text-emerald-400'
          }`}>
            <Gamepad2 className="w-4 h-4 stroke-[2]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-tight">
                Developer Arcade: Terminal Snake
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded uppercase font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                100% In-RAM
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 font-mono">
              Take a mental break • Collect tokens, bug fixes & proofs
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="text-neutral-400">Score:</span>
              <span className="font-bold text-blue-600 dark:text-emerald-400">{score}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-neutral-400">High:</span>
              <span className="font-bold text-amber-500">{highScore}</span>
            </div>
          </div>

          <button 
            className="p-1 rounded text-neutral-400 hover:text-white transition-colors"
            aria-label={isExpanded ? 'Collapse Arcade' : 'Expand Arcade'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Game Console Surface */}
      {isExpanded && (
        <div className="p-5 sm:p-6 space-y-5 animate-fade-in">
          
          {/* Top Control Bar: Speed, Sound, Score, Play/Pause */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono pb-2 border-b border-black/5 dark:border-white/5">
            <div className="flex items-center gap-2">
              <button
                onClick={isPlaying ? () => setIsPaused(p => !p) : startGame}
                className={`px-3.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
                  isPlaying && !isPaused
                    ? 'bg-amber-500 hover:bg-amber-600 text-black'
                    : isLight
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-black font-bold'
                }`}
              >
                {isPlaying && !isPaused ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isPaused ? 'Resume' : isGameOver ? 'Play Again' : 'Start'}</span>
                  </>
                )}
              </button>

              <button
                onClick={startGame}
                className={`p-1.5 rounded-lg border transition-colors ${
                  isLight ? 'border-slate-200 hover:bg-slate-100 text-slate-700' : 'border-neutral-800 hover:bg-neutral-800 text-neutral-300'
                }`}
                title="Restart Game (R)"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsMuted(m => !m)}
                className={`p-1.5 rounded-lg border transition-colors ${
                  isLight ? 'border-slate-200 hover:bg-slate-100 text-slate-700' : 'border-neutral-800 hover:bg-neutral-800 text-neutral-300'
                }`}
                title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-neutral-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-500" />}
              </button>
            </div>

            {/* Difficulty Tabs */}
            <div className={`p-0.5 rounded-lg border flex items-center gap-1 text-[11px] ${
              isLight ? 'bg-slate-100 border-slate-200' : 'bg-neutral-900 border-neutral-800'
            }`}>
              {(['chill', 'normal', 'turbo'] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  className={`px-2 py-1 rounded capitalize transition-all ${
                    difficulty === diff
                      ? isLight ? 'bg-white text-blue-600 font-semibold shadow-xs' : 'bg-neutral-800 text-white font-semibold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>

            {/* Live Score Counter */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-neutral-400 text-[11px]">Score:</span>
                <span className="font-bold text-sm text-blue-600 dark:text-emerald-400">{score}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-neutral-400 text-[11px]">Best:</span>
                <span className="font-bold text-sm text-amber-500">{highScore}</span>
              </div>
            </div>
          </div>

          {/* Central Game Area: Canvas + D-Pad on Mobile */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            
            {/* Retro Terminal Canvas */}
            <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-neutral-800 shadow-xl bg-black">
              <canvas
                ref={canvasRef}
                width={360}
                height={360}
                className="w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] block cursor-pointer select-none"
                onClick={() => {
                  if (!isPlaying || isGameOver) startGame();
                }}
              />
            </div>

            {/* Sidebar / Instructions & Mobile Touch D-Pad */}
            <div className="space-y-4 max-w-xs text-left">
              
              {/* Legend of Food Items */}
              <div className={`p-3 rounded-xl border space-y-2 text-xs font-mono ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-900/60 border-neutral-800'
              }`}>
                <div className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                  RAM Tokens & Rewards
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>Token (+10)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                    <span>Bug Fix (+25)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0" />
                    <span>Proof (+50)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shrink-0" />
                    <span>Turbo (+100)</span>
                  </div>
                </div>
              </div>

              {/* Desktop Keyboard Controls Legend */}
              <div className="hidden sm:block text-[11px] font-mono text-neutral-400 space-y-1">
                <div className="text-neutral-500 font-semibold uppercase text-[10px]">Controls</div>
                <div>• Move: <kbd className="px-1 py-0.5 rounded border border-neutral-700 bg-neutral-900 text-white">W</kbd> <kbd className="px-1 py-0.5 rounded border border-neutral-700 bg-neutral-900 text-white">A</kbd> <kbd className="px-1 py-0.5 rounded border border-neutral-700 bg-neutral-900 text-white">S</kbd> <kbd className="px-1 py-0.5 rounded border border-neutral-700 bg-neutral-900 text-white">D</kbd> or Arrows</div>
                <div>• Pause: <kbd className="px-1.5 py-0.5 rounded border border-neutral-700 bg-neutral-900 text-white">Space</kbd></div>
                <div>• Restart: <kbd className="px-1 py-0.5 rounded border border-neutral-700 bg-neutral-900 text-white">R</kbd></div>
              </div>

              {/* Mobile / Tablet Touch D-Pad */}
              <div className="sm:hidden flex flex-col items-center gap-1.5 pt-1">
                <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider mb-1">
                  Touch D-Pad
                </div>
                <button
                  onClick={() => handleDirectionClick('up')}
                  className="w-12 h-10 rounded-lg border border-neutral-700 bg-neutral-850 active:bg-blue-600 flex items-center justify-center text-white"
                  aria-label="Up"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDirectionClick('left')}
                    className="w-12 h-10 rounded-lg border border-neutral-700 bg-neutral-850 active:bg-blue-600 flex items-center justify-center text-white"
                    aria-label="Left"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={startGame}
                    className="w-12 h-10 rounded-lg border border-emerald-500/40 bg-emerald-500/20 active:bg-emerald-500 flex items-center justify-center text-emerald-400 font-mono text-xs font-bold"
                    aria-label="Start / Restart"
                  >
                    GO
                  </button>
                  <button
                    onClick={() => handleDirectionClick('right')}
                    className="w-12 h-10 rounded-lg border border-neutral-700 bg-neutral-850 active:bg-blue-600 flex items-center justify-center text-white"
                    aria-label="Right"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={() => handleDirectionClick('down')}
                  className="w-12 h-10 rounded-lg border border-neutral-700 bg-neutral-850 active:bg-blue-600 flex items-center justify-center text-white"
                  aria-label="Down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};
export default SnakeGameSection;
