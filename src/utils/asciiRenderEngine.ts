import { AsciiConfig, AsciiRenderMode, AsciiAnimStyle } from '../types';

export const DEFAULT_ASCII_CONFIG: AsciiConfig = {
  renderMode: "dither",
  bgMode: "none",
  bgBlur: 12,
  bgOpacity: 90,
  cellSize: 9,
  coverage: 100,
  invert: false,
  styleBlend: "source-over",
  charSet: "standard",
  customChars: "",
  brightness: 0,
  contrast: 158,
  edgeEmphasis: 0,
  density: 20,
  toneCurve: [
    { x: 0, y: 0 },
    { x: 1, y: 1 }
  ],
  tint: "#3ca6ff",
  tintOpacity: 0,
  overlayBlend: "multiply",
  saturation: 100,
  grayscale: 0,
  blurType: "off",
  blurAmount: 35,
  blurAngle: 0,
  directionalBothSides: false,
  tiltFocus: 35,
  tiltPosition: 50,
  tiltFeather: 15,
  lensFocus: 40,
  blurCenterX: 50,
  blurCenterY: 50,
  progressivePosition: 55,
  progressiveReverse: false,
  pfx: {
    vignette: { enabled: false, intensity: 38 },
    scanLines: { enabled: false, intensity: 40 },
    chromatic: { enabled: false, intensity: 15 },
    bloom: { enabled: false, intensity: 25 },
    filmGrain: { enabled: false, intensity: 30 },
    glitch: { enabled: false, intensity: 20 },
    pixelate: { enabled: false, intensity: 15 },
    halftone: { enabled: false, intensity: 20 },
    filmDust: { enabled: false, intensity: 20 }
  },
  animated: true,
  animStyle: "pulse",
  animSpeed: { enabled: true, intensity: 100 },
  animIntensity: { enabled: true, intensity: 60 },
  lights: { enabled: false, points: [] },
  mask: {
    enabled: false,
    tool: "freehand",
    brushSize: 30,
    showOverlay: true,
    invert: false,
    dataUrl: null,
    shapes: []
  }
};

// Standard ASCII char ramps
export const CHAR_RAMPS: Record<string, string> = {
  standard: " .:-=+*#%@",
  detailed: " .'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$",
  blocks: " ░▒▓█",
  simple: " .oO@",
  binary: "01",
  hex: "0123456789ABCDEF"
};

// 4x4 Bayer Dither Matrix normalized 0..15
const BAYER_4X4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5]
];

/**
 * Creates an authentic botanical Ink Garden procedural canvas
 */
export function createInkGardenDemoCanvas(width: number = 800, height: number = 600): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // Botanical ink wash background
  const bgGrad = ctx.createRadialGradient(width * 0.5, height * 0.45, 50, width * 0.5, height * 0.5, width * 0.7);
  bgGrad.addColorStop(0, '#f2ece4');
  bgGrad.addColorStop(0.6, '#ded6c7');
  bgGrad.addColorStop(1, '#a89c89');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Atmospheric ink clouds
  ctx.fillStyle = 'rgba(40, 36, 32, 0.08)';
  for (let i = 0; i < 18; i++) {
    const rx = width * (0.15 + (i * 0.05) % 0.8);
    const ry = height * (0.2 + (i * 0.07) % 0.7);
    ctx.beginPath();
    ctx.arc(rx, ry, 60 + (i * 12) % 100, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw Zen botanical ink branches & flowers
  ctx.save();
  ctx.strokeStyle = '#1a1816';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const drawBranch = (startX: number, startY: number, length: number, angle: number, depth: number) => {
    if (depth <= 0) return;
    const endX = startX + Math.cos(angle) * length;
    const endY = startY + Math.sin(angle) * length;

    ctx.lineWidth = Math.max(1, depth * 2.2);
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.quadraticCurveTo(
      (startX + endX) / 2 + (Math.sin(depth) * 8),
      (startY + endY) / 2 + (Math.cos(depth) * 8),
      endX,
      endY
    );
    ctx.stroke();

    // Floral ink blossom
    if (depth <= 2) {
      ctx.fillStyle = depth === 1 ? 'rgba(180, 50, 60, 0.85)' : 'rgba(30, 26, 24, 0.85)';
      ctx.beginPath();
      ctx.arc(endX, endY, 6 + (depth * 2), 0, Math.PI * 2);
      ctx.fill();

      // Petals
      for (let p = 0; p < 5; p++) {
        const petAngle = (p * Math.PI * 2) / 5;
        const petX = endX + Math.cos(petAngle) * 9;
        const petY = endY + Math.sin(petAngle) * 9;
        ctx.fillStyle = 'rgba(210, 65, 80, 0.65)';
        ctx.beginPath();
        ctx.arc(petX, petY, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    drawBranch(endX, endY, length * 0.76, angle - 0.38, depth - 1);
    drawBranch(endX, endY, length * 0.72, angle + 0.34, depth - 1);
  };

  // Main branch structures
  drawBranch(width * 0.35, height * 0.88, 110, -Math.PI / 2 + 0.2, 5);
  drawBranch(width * 0.68, height * 0.86, 95, -Math.PI / 2 - 0.25, 4);
  drawBranch(width * 0.5, height * 0.92, 130, -Math.PI / 2, 5);
  ctx.restore();

  // Subtle ink typography seal
  ctx.fillStyle = '#b32428';
  ctx.fillRect(width * 0.82, height * 0.12, 38, 38);
  ctx.strokeStyle = '#f2ece4';
  ctx.strokeRect(width * 0.82 + 2, height * 0.12 + 2, 34, 34);
  ctx.fillStyle = '#f2ece4';
  ctx.font = 'bold 16px serif';
  ctx.fillText('風', width * 0.82 + 11, height * 0.12 + 25);

  return canvas;
}

/**
 * Calculates tone curve interpolation
 */
function applyToneCurve(val: number, curve: { x: number; y: number }[]): number {
  if (!curve || curve.length < 2) return val;
  const norm = val / 255;
  // Simple linear interpolation between first two control points
  const p0 = curve[0];
  const p1 = curve[1];
  const slope = (p1.y - p0.y) / Math.max(0.001, (p1.x - p0.x));
  const mapped = p0.y + (norm - p0.x) * slope;
  return Math.min(255, Math.max(0, Math.round(mapped * 255)));
}

/**
 * Edge detection kernel (Sobel approximation)
 */
function getSobelEdge(data: Uint8ClampedArray, width: number, height: number, x: number, y: number): number {
  if (x <= 0 || x >= width - 1 || y <= 0 || y >= height - 1) return 0;
  const idx = (y * width + x) * 4;

  const getLuma = (ox: number, oy: number) => {
    const i = ((y + oy) * width + (x + ox)) * 4;
    return 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  };

  const gx = -getLuma(-1, -1) - 2 * getLuma(-1, 0) - getLuma(-1, 1) +
              getLuma(1, -1) + 2 * getLuma(1, 0) + getLuma(1, 1);
  const gy = -getLuma(-1, -1) - 2 * getLuma(0, -1) - getLuma(1, -1) +
              getLuma(-1, 1) + 2 * getLuma(0, 1) + getLuma(1, 1);

  return Math.min(255, Math.sqrt(gx * gx + gy * gy));
}

/**
 * Core Render Pipeline: Renders Source Image to Target Canvas using AsciiConfig
 */
export function renderAsciiFrame(
  sourceCanvasOrImage: HTMLCanvasElement | HTMLImageElement,
  targetCanvas: HTMLCanvasElement,
  config: AsciiConfig,
  timeSec: number = 0
): void {
  const width = targetCanvas.width;
  const height = targetCanvas.height;
  const ctx = targetCanvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return;

  // Offscreen sampling canvas for reading pixels
  const sampleCanvas = document.createElement('canvas');
  sampleCanvas.width = width;
  sampleCanvas.height = height;
  const sCtx = sampleCanvas.getContext('2d', { willReadFrequently: true });
  if (!sCtx) return;

  // 1. Draw source photo into sample canvas
  sCtx.drawImage(sourceCanvasOrImage, 0, 0, width, height);
  const imgData = sCtx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // Clear target canvas
  ctx.save();
  ctx.clearRect(0, 0, width, height);

  // Background Mode Handling
  if (config.bgMode === 'original') {
    ctx.save();
    ctx.globalAlpha = config.bgOpacity / 100;
    ctx.drawImage(sourceCanvasOrImage, 0, 0, width, height);
    ctx.restore();
  } else if (config.bgMode === 'blurred') {
    ctx.save();
    ctx.globalAlpha = config.bgOpacity / 100;
    ctx.filter = `blur(${Math.max(1, config.bgBlur)}px)`;
    ctx.drawImage(sourceCanvasOrImage, 0, 0, width, height);
    ctx.filter = 'none';
    ctx.restore();
  } else if (config.bgMode === 'solid') {
    ctx.fillStyle = config.invert ? '#ffffff' : '#0a0a0a';
    ctx.fillRect(0, 0, width, height);
  } else {
    // "none": default clean neutral backdrop
    ctx.fillStyle = config.invert ? '#ffffff' : '#000000';
    ctx.fillRect(0, 0, width, height);
  }

  // Animation phase calculation
  const speed = config.animated && config.animSpeed.enabled ? (config.animSpeed.intensity / 50) : 0;
  const animAmp = (config.animIntensity.intensity / 100);
  const t = timeSec * speed * 2.5;

  // Grid division
  const cellSize = Math.max(3, Math.round(config.cellSize));
  const cols = Math.floor(width / cellSize);
  const rows = Math.floor(height / cellSize);

  // Glyphs setup for 'characters' mode
  let chars = CHAR_RAMPS[config.charSet] || CHAR_RAMPS.standard;
  if (config.charSet === 'custom' && config.customChars.trim().length > 0) {
    chars = config.customChars;
  }

  // Matrix code rain column tracker
  const matrixGlyphs = "ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ1234567890ABCDEF";

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `${Math.round(cellSize * 1.15)}px monospace`;

  // 2. Iterate cells
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Respect coverage %
      if (config.coverage < 100) {
        const pseudoRand = ((c * 37 + r * 19) % 100);
        if (pseudoRand >= config.coverage) continue;
      }

      const cx = c * cellSize + cellSize / 2;
      const cy = r * cellSize + cellSize / 2;

      // Sample average color of cell
      let sumR = 0, sumG = 0, sumB = 0, count = 0;
      const step = Math.max(1, Math.floor(cellSize / 3));

      for (let dy = -cellSize / 2; dy < cellSize / 2; dy += step) {
        for (let dx = -cellSize / 2; dx < cellSize / 2; dx += step) {
          const px = Math.min(width - 1, Math.max(0, Math.floor(cx + dx)));
          const py = Math.min(height - 1, Math.max(0, Math.floor(cy + dy)));
          const i = (py * width + px) * 4;
          sumR += data[i];
          sumG += data[i + 1];
          sumB += data[i + 2];
          count++;
        }
      }

      let red = count ? sumR / count : 0;
      let green = count ? sumG / count : 0;
      let blue = count ? sumB / count : 0;

      // Color adjustments: Brightness & Contrast
      if (config.brightness !== 0) {
        red = Math.min(255, Math.max(0, red + config.brightness));
        green = Math.min(255, Math.max(0, green + config.brightness));
        blue = Math.min(255, Math.max(0, blue + config.brightness));
      }

      if (config.contrast !== 100) {
        const factor = (259 * (config.contrast + 255)) / (255 * (259 - config.contrast + 0.001));
        red = Math.min(255, Math.max(0, factor * (red - 128) + 128));
        green = Math.min(255, Math.max(0, factor * (green - 128) + 128));
        blue = Math.min(255, Math.max(0, factor * (blue - 128) + 128));
      }

      // Saturation & Grayscale
      let luma = 0.299 * red + 0.587 * green + 0.114 * blue;
      if (config.grayscale > 0) {
        const gFactor = config.grayscale / 100;
        red = red * (1 - gFactor) + luma * gFactor;
        green = green * (1 - gFactor) + luma * gFactor;
        blue = blue * (1 - gFactor) + luma * gFactor;
      }

      if (config.saturation !== 100) {
        const sFactor = config.saturation / 100;
        red = Math.min(255, Math.max(0, luma + (red - luma) * sFactor));
        green = Math.min(255, Math.max(0, luma + (green - luma) * sFactor));
        blue = Math.min(255, Math.max(0, luma + (blue - luma) * sFactor));
      }

      // Edge emphasis Sobel addition
      if (config.edgeEmphasis > 0) {
        const edge = getSobelEdge(data, width, height, Math.floor(cx), Math.floor(cy));
        const boost = (edge * config.edgeEmphasis) / 100;
        luma = Math.min(255, luma + boost);
      }

      // Tone curve adjustment
      luma = applyToneCurve(luma, config.toneCurve);

      // Invert
      if (config.invert) {
        luma = 255 - luma;
        red = 255 - red;
        green = 255 - green;
        blue = 255 - blue;
      }

      // Animation factor computation
      let animOffset = 1.0;
      if (config.animated && speed > 0) {
        if (config.animStyle === 'pulse') {
          animOffset = 1.0 + Math.sin(t * 1.4) * (0.35 * animAmp);
        } else if (config.animStyle === 'wave') {
          animOffset = 1.0 + Math.sin((cx * 0.03 + cy * 0.03) + t * 2.0) * (0.45 * animAmp);
        } else if (config.animStyle === 'shimmer') {
          const noise = Math.sin(cx * 12.3 + cy * 7.1 + t * 4.0);
          animOffset = 1.0 + noise * (0.4 * animAmp);
        } else if (config.animStyle === 'ripple') {
          const dx = cx - width / 2;
          const dy = cy - height / 2;
          const dist = Math.sqrt(dx * dx + dy * dy);
          animOffset = 1.0 + Math.cos(dist * 0.04 - t * 3.0) * (0.45 * animAmp);
        } else if (config.animStyle === 'flicker') {
          animOffset = 1.0 + ((Math.sin(t * 17.0 + c) > 0.6 ? 0.35 : -0.2) * animAmp);
        }
      }

      const normLuma = Math.min(1.0, Math.max(0, (luma / 255) * animOffset));
      const effectiveSize = cellSize * (0.3 + normLuma * 0.7);

      // Tint color blending
      if (config.tintOpacity > 0 && config.tint) {
        // Parse hex tint
        const tintHex = config.tint.replace('#', '');
        const tr = parseInt(tintHex.substring(0, 2), 16) || 0;
        const tg = parseInt(tintHex.substring(2, 4), 16) || 0;
        const tb = parseInt(tintHex.substring(4, 6), 16) || 0;
        const alpha = config.tintOpacity / 100;
        red = red * (1 - alpha) + tr * alpha;
        green = green * (1 - alpha) + tg * alpha;
        blue = blue * (1 - alpha) + tb * alpha;
      }

      ctx.fillStyle = `rgb(${Math.round(red)}, ${Math.round(green)}, ${Math.round(blue)})`;
      ctx.strokeStyle = `rgb(${Math.round(red)}, ${Math.round(green)}, ${Math.round(blue)})`;

      // 3. Render Mode Drawing Logic
      switch (config.renderMode) {
        case 'characters': {
          const charIndex = Math.min(chars.length - 1, Math.floor(normLuma * chars.length));
          const char = chars[charIndex] || ' ';
          ctx.fillText(char, cx, cy);
          break;
        }

        case 'dither': {
          // Bayer 4x4 matrix threshold
          const bx = c % 4;
          const by = r % 4;
          const threshold = BAYER_4X4[by][bx] / 16;
          if (normLuma > threshold) {
            const rad = Math.max(1, (cellSize / 2) * (normLuma - threshold + 0.4));
            ctx.beginPath();
            ctx.arc(cx, cy, rad, 0, Math.PI * 2);
            ctx.fill();
          }
          break;
        }

        case 'dots': {
          const radius = Math.max(0.5, (cellSize / 2) * normLuma);
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'pixel': {
          const s = cellSize * normLuma;
          ctx.fillRect(cx - s / 2, cy - s / 2, s, s);
          break;
        }

        case 'mosaic': {
          ctx.fillRect(c * cellSize, r * cellSize, cellSize - 1, cellSize - 1);
          break;
        }

        case 'cross': {
          const len = (cellSize / 2) * normLuma;
          ctx.lineWidth = Math.max(1, cellSize * 0.18);
          ctx.beginPath();
          ctx.moveTo(cx - len, cy);
          ctx.lineTo(cx + len, cy);
          ctx.moveTo(cx, cy - len);
          ctx.lineTo(cx, cy + len);
          ctx.stroke();
          break;
        }

        case 'diamond': {
          const d = (cellSize / 2) * normLuma;
          ctx.beginPath();
          ctx.moveTo(cx, cy - d);
          ctx.lineTo(cx + d, cy);
          ctx.lineTo(cx, cy + d);
          ctx.lineTo(cx - d, cy);
          ctx.closePath();
          ctx.fill();
          break;
        }

        case 'voxel': {
          // Isometric 3D box
          const v = (cellSize / 2) * normLuma;
          ctx.beginPath();
          ctx.moveTo(cx, cy - v);
          ctx.lineTo(cx + v, cy - v * 0.5);
          ctx.lineTo(cx + v, cy + v * 0.5);
          ctx.lineTo(cx, cy + v);
          ctx.lineTo(cx - v, cy + v * 0.5);
          ctx.lineTo(cx - v, cy - v * 0.5);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          break;
        }

        case 'lego': {
          const w = cellSize - 2;
          ctx.fillRect(cx - w / 2, cy - w / 2, w, w);
          // Stud
          ctx.fillStyle = config.invert ? '#ffffff' : 'rgba(255,255,255,0.4)';
          ctx.beginPath();
          ctx.arc(cx, cy, w * 0.28, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'mixed': {
          if (normLuma > 0.75) {
            ctx.fillText('#', cx, cy);
          } else if (normLuma > 0.45) {
            ctx.beginPath();
            ctx.arc(cx, cy, cellSize * 0.35, 0, Math.PI * 2);
            ctx.fill();
          } else if (normLuma > 0.2) {
            ctx.fillText('+', cx, cy);
          } else {
            ctx.fillText('.', cx, cy);
          }
          break;
        }

        case 'lines': {
          const h = Math.max(1, cellSize * normLuma);
          ctx.fillRect(c * cellSize, cy - h / 2, cellSize, h);
          break;
        }

        case 'diagonal': {
          ctx.lineWidth = Math.max(1, cellSize * 0.25 * normLuma);
          ctx.beginPath();
          ctx.moveTo(c * cellSize, (r + 1) * cellSize);
          ctx.lineTo((c + 1) * cellSize, r * cellSize);
          ctx.stroke();
          break;
        }

        case 'braille': {
          // Map quadrants to braille dots
          const code = 0x2800 + Math.floor(normLuma * 255);
          ctx.fillText(String.fromCharCode(code), cx, cy);
          break;
        }

        case 'disco': {
          const ringRad = (cellSize / 2) * normLuma;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(cx, cy, ringRad, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(cx, cy, Math.max(1, ringRad * 0.4), 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'hexdump': {
          const hexStr = Math.floor(normLuma * 255).toString(16).toUpperCase().padStart(2, '0');
          ctx.font = `${Math.round(cellSize * 0.8)}px monospace`;
          ctx.fillText(hexStr, cx, cy);
          break;
        }

        case 'matrix': {
          ctx.fillStyle = `rgb(40, ${Math.min(255, 120 + Math.round(normLuma * 135))}, 70)`;
          const gIndex = Math.floor((normLuma * 17 + (timeSec * 8 + c * 3)) % matrixGlyphs.length);
          ctx.fillText(matrixGlyphs[gIndex], cx, cy);
          break;
        }

        case 'rings': {
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(cx, cy, (cellSize / 2) * normLuma, 0, Math.PI * 2);
          ctx.stroke();
          break;
        }

        case 'hearts': {
          ctx.fillText('♥', cx, cy);
          break;
        }

        case 'stars': {
          ctx.fillText('★', cx, cy);
          break;
        }

        case 'hexagons': {
          const hexR = (cellSize / 2) * normLuma;
          ctx.beginPath();
          for (let a = 0; a < 6; a++) {
            const angle = (a * Math.PI) / 3;
            const hx = cx + Math.cos(angle) * hexR;
            const hy = cy + Math.sin(angle) * hexR;
            if (a === 0) ctx.moveTo(hx, hy);
            else ctx.lineTo(hx, hy);
          }
          ctx.closePath();
          ctx.fill();
          break;
        }

        case 'triangles': {
          const tr = (cellSize / 2) * normLuma;
          const up = (c + r) % 2 === 0;
          ctx.beginPath();
          if (up) {
            ctx.moveTo(cx, cy - tr);
            ctx.lineTo(cx + tr, cy + tr);
            ctx.lineTo(cx - tr, cy + tr);
          } else {
            ctx.moveTo(cx, cy + tr);
            ctx.lineTo(cx + tr, cy - tr);
            ctx.lineTo(cx - tr, cy - tr);
          }
          ctx.closePath();
          ctx.fill();
          break;
        }

        case 'bubbles': {
          const rad = (cellSize / 2) * normLuma;
          ctx.beginPath();
          ctx.arc(cx, cy, rad, 0, Math.PI * 2);
          ctx.stroke();
          // Arc specular shine
          if (rad > 2) {
            ctx.beginPath();
            ctx.arc(cx - rad * 0.25, cy - rad * 0.25, rad * 0.4, -Math.PI * 0.5, 0);
            ctx.stroke();
          }
          break;
        }

        case 'hatch': {
          ctx.lineWidth = 1;
          const rad = cellSize / 2;
          ctx.beginPath();
          ctx.moveTo(cx - rad, cy + rad);
          ctx.lineTo(cx + rad, cy - rad);
          ctx.stroke();
          if (normLuma > 0.5) {
            ctx.beginPath();
            ctx.moveTo(cx - rad, cy - rad);
            ctx.lineTo(cx + rad, cy + rad);
            ctx.stroke();
          }
          break;
        }

        case 'contour': {
          // Topographic iso-line rings
          const bands = Math.floor(normLuma * 5);
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(cx, cy, (cellSize / 2) * ((bands + 1) / 5), 0, Math.PI * 2);
          ctx.stroke();
          break;
        }

        case 'halfblocks': {
          if (normLuma > 0.66) {
            ctx.fillText('█', cx, cy);
          } else if (normLuma > 0.33) {
            ctx.fillText(r % 2 === 0 ? '▀' : '▄', cx, cy);
          } else if (normLuma > 0.1) {
            ctx.fillText('·', cx, cy);
          }
          break;
        }

        default: {
          // Default fallback
          const radius = Math.max(1, (cellSize / 2) * normLuma);
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.fill();
          break;
        }
      }
    }
  }

  // 5. Post-Effects (PFX)
  applyPostEffects(ctx, width, height, config.pfx, timeSec);

  // 6. Lights & Glow
  if (config.lights.enabled && config.lights.points && config.lights.points.length > 0) {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    for (const light of config.lights.points) {
      const lx = light.x * width;
      const ly = light.y * height;
      const lrad = Math.max(10, light.radius);
      const grad = ctx.createRadialGradient(lx, ly, 0, lx, ly, lrad);
      grad.addColorStop(0, `rgba(255, 255, 255, ${Math.min(1, light.intensity / 100)})`);
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(lx, ly, lrad, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  ctx.restore();
}

/**
 * Layers Post-Effects (scanlines, vignette, bloom, chromatic, film grain, glitch, etc.)
 */
function applyPostEffects(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  pfx: AsciiConfig['pfx'],
  timeSec: number
): void {
  // Vignette
  if (pfx.vignette.enabled) {
    ctx.save();
    const vGrad = ctx.createRadialGradient(width / 2, height / 2, width * 0.3, width / 2, height / 2, width * 0.72);
    vGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vGrad.addColorStop(1, `rgba(0, 0, 0, ${pfx.vignette.intensity / 100})`);
    ctx.fillStyle = vGrad;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }

  // ScanLines
  if (pfx.scanLines.enabled) {
    ctx.save();
    ctx.fillStyle = `rgba(0, 0, 0, ${(pfx.scanLines.intensity / 100) * 0.55})`;
    for (let y = 0; y < height; y += 4) {
      ctx.fillRect(0, y, width, 1.5);
    }
    ctx.restore();
  }

  // Chromatic Aberration
  if (pfx.chromatic.enabled) {
    ctx.save();
    const shift = Math.max(1, Math.round((pfx.chromatic.intensity / 100) * 8));
    ctx.globalCompositeOperation = 'screen';
    ctx.drawImage(ctx.canvas, -shift, 0, width, height);
    ctx.drawImage(ctx.canvas, shift, 0, width, height);
    ctx.restore();
  }

  // Film Grain
  if (pfx.filmGrain.enabled) {
    ctx.save();
    const grainImg = ctx.createImageData(120, 120);
    const gData = grainImg.data;
    const alpha = (pfx.filmGrain.intensity / 100) * 45;
    for (let i = 0; i < gData.length; i += 4) {
      const v = Math.random() * 255;
      gData[i] = v;
      gData[i + 1] = v;
      gData[i + 2] = v;
      gData[i + 3] = alpha;
    }
    // Pattern repeat
    const patCanvas = document.createElement('canvas');
    patCanvas.width = 120;
    patCanvas.height = 120;
    patCanvas.getContext('2d')?.putImageData(grainImg, 0, 0);
    const pat = ctx.createPattern(patCanvas, 'repeat');
    if (pat) {
      ctx.fillStyle = pat;
      ctx.fillRect(0, 0, width, height);
    }
    ctx.restore();
  }

  // Glitch
  if (pfx.glitch.enabled && (Math.sin(timeSec * 15) > 0.4)) {
    ctx.save();
    const sliceCount = 3;
    for (let s = 0; s < sliceCount; s++) {
      const sy = Math.random() * height;
      const sh = 10 + Math.random() * 25;
      const sxOffset = (Math.random() - 0.5) * (pfx.glitch.intensity * 0.4);
      ctx.drawImage(ctx.canvas, 0, sy, width, sh, sxOffset, sy, width, sh);
    }
    ctx.restore();
  }
}

/**
 * Converts image to plain ASCII text for clipboard export
 */
export function generatePlainTextAscii(
  sourceCanvas: HTMLCanvasElement,
  cols: number = 80,
  charSet: string = 'standard',
  invert: boolean = false
): string {
  const chars = CHAR_RAMPS[charSet] || CHAR_RAMPS.standard;
  const ratio = sourceCanvas.height / sourceCanvas.width;
  const rows = Math.round(cols * ratio * 0.5); // 0.5 font aspect ratio compensation

  const thumb = document.createElement('canvas');
  thumb.width = cols;
  thumb.height = rows;
  const tCtx = thumb.getContext('2d');
  if (!tCtx) return '';

  tCtx.drawImage(sourceCanvas, 0, 0, cols, rows);
  const data = tCtx.getImageData(0, 0, cols, rows).data;

  let result = '';
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = (r * cols + c) * 4;
      let luma = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      if (invert) luma = 255 - luma;
      const idx = Math.min(chars.length - 1, Math.floor((luma / 255) * chars.length));
      result += chars[idx] || ' ';
    }
    result += '\n';
  }
  return result;
}
