import { dump, load } from 'js-yaml';
import Papa from 'papaparse';

// ==========================================
// 1. JSON to CSV
// ==========================================
export function convertJsonToCsv(input: string): { output: string; error?: string } {
  const trimmed = input.trim();
  if (!trimmed) {
    return { output: '', error: 'Please enter JSON data to convert.' };
  }

  let parsed: any;
  try {
    parsed = JSON.parse(trimmed);
  } catch (err: any) {
    return { 
      output: '', 
      error: `Invalid JSON syntax: ${err.message || 'Check for missing quotes, brackets or trailing commas.'}` 
    };
  }

  try {
    // If it's a single object, wrap in an array
    let dataArray: any[] = [];
    if (Array.isArray(parsed)) {
      dataArray = parsed;
    } else if (typeof parsed === 'object' && parsed !== null) {
      dataArray = [parsed];
    } else {
      return { output: '', error: 'JSON must be an array of objects or a single object.' };
    }

    if (dataArray.length === 0) {
      return { output: '', error: 'JSON array is empty.' };
    }

    // Flatten nested objects so nested fields become dot-notation headers
    const flattenObject = (obj: any, prefix = ''): Record<string, any> => {
      const result: Record<string, any> = {};
      for (const key of Object.keys(obj)) {
        const val = obj[key];
        const newKey = prefix ? `${prefix}.${key}` : key;
        if (val !== null && typeof val === 'object' && !Array.isArray(val) && !(val instanceof Date)) {
          Object.assign(result, flattenObject(val, newKey));
        } else if (Array.isArray(val)) {
          result[newKey] = JSON.stringify(val);
        } else {
          result[newKey] = val;
        }
      }
      return result;
    };

    const flattened = dataArray.map(item => {
      if (typeof item === 'object' && item !== null) {
        return flattenObject(item);
      }
      return { value: item };
    });

    const csv = Papa.unparse(flattened, {
      quotes: true,
      header: true
    });

    return { output: csv };
  } catch (err: any) {
    return { output: '', error: `Failed to convert to CSV: ${err.message}` };
  }
}

// ==========================================
// 2. CSV to JSON
// ==========================================
export function convertCsvToJson(input: string, options: { pretty?: boolean } = { pretty: true }): { output: string; error?: string } {
  const trimmed = input.trim();
  if (!trimmed) {
    return { output: '', error: 'Please enter CSV text to convert.' };
  }

  try {
    const results = Papa.parse(trimmed, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: 'greedy'
    });

    if (results.errors && results.errors.length > 0 && results.data.length === 0) {
      return { 
        output: '', 
        error: `CSV parsing error at line ${results.errors[0].row || 1}: ${results.errors[0].message}` 
      };
    }

    const jsonStr = options.pretty ? JSON.stringify(results.data, null, 2) : JSON.stringify(results.data);
    return { output: jsonStr };
  } catch (err: any) {
    return { output: '', error: `CSV conversion failed: ${err.message}` };
  }
}

// ==========================================
// 3. JSON to YAML
// ==========================================
export function convertJsonToYaml(input: string): { output: string; error?: string } {
  const trimmed = input.trim();
  if (!trimmed) {
    return { output: '', error: 'Please enter JSON data to convert.' };
  }

  try {
    const parsed = JSON.parse(trimmed);
    const yamlStr = dump(parsed, {
      indent: 2,
      lineWidth: -1,
      noRefs: true
    });
    return { output: yamlStr };
  } catch (err: any) {
    return { output: '', error: `Invalid JSON: ${err.message}` };
  }
}

// ==========================================
// 4. YAML to JSON
// ==========================================
export function convertYamlToJson(input: string, options: { pretty?: boolean } = { pretty: true }): { output: string; error?: string } {
  const trimmed = input.trim();
  if (!trimmed) {
    return { output: '', error: 'Please enter YAML text to convert.' };
  }

  try {
    const loaded = load(trimmed);
    if (loaded === undefined) {
      return { output: '', error: 'YAML input is empty or contains only comments.' };
    }
    const jsonStr = options.pretty ? JSON.stringify(loaded, null, 2) : JSON.stringify(loaded);
    return { output: jsonStr };
  } catch (err: any) {
    const mark = err.mark ? ` at line ${err.mark.line + 1}, column ${err.mark.column + 1}` : '';
    return { output: '', error: `YAML parse error${mark}: ${err.reason || err.message}` };
  }
}

// ==========================================
// 5. JSON to XML
// ==========================================
export function convertJsonToXml(input: string, rootTag = 'root'): { output: string; error?: string } {
  const trimmed = input.trim();
  if (!trimmed) {
    return { output: '', error: 'Please enter JSON data to convert to XML.' };
  }

  let parsed: any;
  try {
    parsed = JSON.parse(trimmed);
  } catch (err: any) {
    return { output: '', error: `Invalid JSON syntax: ${err.message}` };
  }

  const escapeXml = (unsafe: any): string => {
    if (unsafe === null || unsafe === undefined) return '';
    return String(unsafe)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  const sanitizeTag = (tag: string): string => {
    const cleaned = tag.replace(/[^a-zA-Z0-9_-]/g, '_');
    return /^[a-zA-Z_]/.test(cleaned) ? cleaned : `item_${cleaned}`;
  };

  const toXml = (obj: any, indent = '  '): string => {
    let xml = '';
    if (Array.isArray(obj)) {
      for (const item of obj) {
        xml += `${indent}<item>\n${toXml(item, indent + '  ')}${indent}</item>\n`;
      }
    } else if (typeof obj === 'object' && obj !== null) {
      for (const [key, val] of Object.entries(obj)) {
        const safeKey = sanitizeTag(key);
        if (Array.isArray(val)) {
          for (const item of val) {
            if (typeof item === 'object' && item !== null) {
              xml += `${indent}<${safeKey}>\n${toXml(item, indent + '  ')}${indent}</${safeKey}>\n`;
            } else {
              xml += `${indent}<${safeKey}>${escapeXml(item)}</${safeKey}>\n`;
            }
          }
        } else if (typeof val === 'object' && val !== null) {
          xml += `${indent}<${safeKey}>\n${toXml(val, indent + '  ')}${indent}</${safeKey}>\n`;
        } else {
          xml += `${indent}<${safeKey}>${escapeXml(val)}</${safeKey}>\n`;
        }
      }
    } else {
      xml += `${indent}${escapeXml(obj)}\n`;
    }
    return xml;
  };

  try {
    const safeRoot = sanitizeTag(rootTag || 'root');
    const innerXml = toXml(parsed, '  ');
    const fullXml = `<?xml version="1.0" encoding="UTF-8"?>\n<${safeRoot}>\n${innerXml}</${safeRoot}>`;
    return { output: fullXml };
  } catch (err: any) {
    return { output: '', error: `XML generation failed: ${err.message}` };
  }
}

// ==========================================
// 6. Base64 Encode / Decode (UTF-8 Safe)
// ==========================================
export function convertBase64(
  input: string, 
  mode: 'encode' | 'decode', 
  urlSafe = false
): { output: string; error?: string } {
  if (!input) {
    return { output: '', error: `Please enter text to ${mode}.` };
  }

  try {
    if (mode === 'encode') {
      // UTF-8 safe encode
      const bytes = new TextEncoder().encode(input);
      let binString = '';
      for (let i = 0; i < bytes.length; i++) {
        binString += String.fromCharCode(bytes[i]);
      }
      let base64 = btoa(binString);
      if (urlSafe) {
        base64 = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      }
      return { output: base64 };
    } else {
      // Decode
      let cleanInput = input.trim();
      if (urlSafe || cleanInput.includes('-') || cleanInput.includes('_')) {
        cleanInput = cleanInput.replace(/-/g, '+').replace(/_/g, '/');
        while (cleanInput.length % 4 !== 0) {
          cleanInput += '=';
        }
      }
      const binString = atob(cleanInput);
      const bytes = new Uint8Array(binString.length);
      for (let i = 0; i < binString.length; i++) {
        bytes[i] = binString.charCodeAt(i);
      }
      const decoded = new TextDecoder().decode(bytes);
      return { output: decoded };
    }
  } catch (err: any) {
    return { 
      output: '', 
      error: mode === 'decode' 
        ? 'Invalid Base64 string. Ensure input contains only valid Base64 characters.' 
        : `Encoding failed: ${err.message}` 
    };
  }
}

// ==========================================
// 7. URL Encode / Decode
// ==========================================
export function convertUrl(
  input: string, 
  mode: 'encode' | 'decode', 
  componentOnly = true
): { output: string; error?: string } {
  if (!input) {
    return { output: '', error: `Please enter URL string to ${mode}.` };
  }

  try {
    if (mode === 'encode') {
      const encoded = componentOnly ? encodeURIComponent(input) : encodeURI(input);
      return { output: encoded };
    } else {
      const decoded = componentOnly ? decodeURIComponent(input) : decodeURI(input);
      return { output: decoded };
    }
  } catch (err: any) {
    return { 
      output: '', 
      error: `URL decoding failed: Malformed URI sequence or invalid percentage encoding.` 
    };
  }
}

// ==========================================
// 8. JWT Token Decoder
// ==========================================
export interface JwtDecodedData {
  header: Record<string, any>;
  payload: Record<string, any>;
  signature: string;
  isExpired: boolean;
  expiresAtFormatted?: string;
  issuedAtFormatted?: string;
  timeRemaining?: string;
  algorithm?: string;
}

export function decodeJwt(token: string): { output: string; data?: JwtDecodedData; error?: string } {
  const clean = token.trim();
  if (!clean) {
    return { output: '', error: 'Please paste a JSON Web Token (JWT) to decode.' };
  }

  const parts = clean.split('.');
  if (parts.length < 2) {
    return { 
      output: '', 
      error: 'Invalid JWT format: A valid token must have 3 dot-separated parts (header.payload.signature).' 
    };
  }

  try {
    const base64UrlDecode = (str: string): string => {
      let b64 = str.replace(/-/g, '+').replace(/_/g, '/');
      while (b64.length % 4 !== 0) {
        b64 += '=';
      }
      const bin = atob(b64);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) {
        bytes[i] = bin.charCodeAt(i);
      }
      return new TextDecoder().decode(bytes);
    };

    const header = JSON.parse(base64UrlDecode(parts[0]));
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    const signature = parts[2] || 'NO_SIGNATURE';

    let isExpired = false;
    let expiresAtFormatted: string | undefined;
    let issuedAtFormatted: string | undefined;
    let timeRemaining: string | undefined;

    const nowSec = Math.floor(Date.now() / 1000);

    if (payload.exp && typeof payload.exp === 'number') {
      const expDate = new Date(payload.exp * 1000);
      expiresAtFormatted = expDate.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST (' + expDate.toUTCString() + ')';
      if (nowSec > payload.exp) {
        isExpired = true;
        const diffMin = Math.round((nowSec - payload.exp) / 60);
        timeRemaining = `Expired ${diffMin} minute(s) ago`;
      } else {
        isExpired = false;
        const diffMin = Math.round((payload.exp - nowSec) / 60);
        timeRemaining = `Valid for next ${diffMin} minute(s)`;
      }
    }

    if (payload.iat && typeof payload.iat === 'number') {
      const iatDate = new Date(payload.iat * 1000);
      issuedAtFormatted = iatDate.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST';
    }

    const fullOutput = JSON.stringify({
      header,
      payload,
      status: {
        isExpired,
        expiresAt: expiresAtFormatted,
        timeRemaining,
        algorithm: header.alg || 'unknown'
      }
    }, null, 2);

    return {
      output: fullOutput,
      data: {
        header,
        payload,
        signature,
        isExpired,
        expiresAtFormatted,
        issuedAtFormatted,
        timeRemaining,
        algorithm: header.alg
      }
    };
  } catch (err: any) {
    return { output: '', error: `Failed to decode JWT: ${err.message}` };
  }
}

// ==========================================
// 9. Unix Timestamp Converter
// ==========================================
export interface TimestampData {
  unixSeconds: number;
  unixMillis: number;
  istDate: string;
  utcDate: string;
  isoDate: string;
  relativeTime: string;
}

export function convertUnixTimestamp(input: string | number): { output: string; data?: TimestampData; error?: string } {
  const str = String(input).trim();
  if (!str) {
    return { output: '', error: 'Please enter a Unix timestamp or ISO date string.' };
  }

  let date: Date;

  // Check if numeric timestamp
  if (/^\d+$/.test(str)) {
    const num = parseInt(str, 10);
    // If 10 digits or less, it's seconds; if 13 digits, milliseconds
    if (str.length <= 10) {
      date = new Date(num * 1000);
    } else {
      date = new Date(num);
    }
  } else {
    // Attempt parse string date
    date = new Date(str);
  }

  if (isNaN(date.getTime())) {
    return { output: '', error: 'Invalid timestamp or date format. Enter 10-digit seconds, 13-digit ms, or ISO string.' };
  }

  const unixMillis = date.getTime();
  const unixSeconds = Math.floor(unixMillis / 1000);

  const istDate = date.toLocaleString('en-IN', { 
    timeZone: 'Asia/Kolkata', 
    dateStyle: 'full', 
    timeStyle: 'long' 
  }) + ' (IST)';

  const utcDate = date.toUTCString();
  const isoDate = date.toISOString();

  // Relative time
  const now = Date.now();
  const diffSec = Math.round((unixMillis - now) / 1000);
  let relativeTime = '';
  if (Math.abs(diffSec) < 60) {
    relativeTime = diffSec >= 0 ? `in ${diffSec} seconds` : `${Math.abs(diffSec)} seconds ago`;
  } else if (Math.abs(diffSec) < 3600) {
    const mins = Math.round(diffSec / 60);
    relativeTime = mins >= 0 ? `in ${mins} minutes` : `${Math.abs(mins)} minutes ago`;
  } else if (Math.abs(diffSec) < 86400) {
    const hours = Math.round(diffSec / 3600);
    relativeTime = hours >= 0 ? `in ${hours} hours` : `${Math.abs(hours)} hours ago`;
  } else {
    const days = Math.round(diffSec / 86400);
    relativeTime = days >= 0 ? `in ${days} days` : `${Math.abs(days)} days ago`;
  }

  const output = [
    `Unix Timestamp (Seconds):      ${unixSeconds}`,
    `Unix Timestamp (Milliseconds): ${unixMillis}`,
    `Indian Standard Time (IST):    ${istDate}`,
    `Coordinated Universal Time:    ${utcDate}`,
    `ISO 8601:                      ${isoDate}`,
    `Relative Time:                 ${relativeTime}`
  ].join('\n');

  return {
    output,
    data: {
      unixSeconds,
      unixMillis,
      istDate,
      utcDate,
      isoDate,
      relativeTime
    }
  };
}

// ==========================================
// 10. Number to Words in INR (Indian Lakh/Crore)
// ==========================================
export function convertNumberToWordsInr(input: string | number): { output: string; formattedInr: string; error?: string } {
  const clean = String(input).replace(/[₹,\s]/g, '').trim();
  if (!clean) {
    return { output: '', formattedInr: '', error: 'Please enter a number or amount.' };
  }

  const numVal = parseFloat(clean);
  if (isNaN(numVal) || !isFinite(numVal)) {
    return { output: '', formattedInr: '', error: 'Invalid number. Please enter numeric digits.' };
  }

  if (numVal < 0) {
    return { output: '', formattedInr: '', error: 'Negative numbers are not supported.' };
  }

  if (numVal === 0) {
    return { output: 'Zero Rupees Only', formattedInr: '₹ 0.00' };
  }

  // Split integer and paise
  const parts = clean.split('.');
  let integerPart = parseInt(parts[0], 10);
  let paisePart = parts[1] ? parseInt(parts[1].substring(0, 2).padEnd(2, '0'), 10) : 0;

  const ones = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const convertTwoDigits = (n: number): string => {
    if (n < 20) return ones[n];
    return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
  };

  const convertThreeDigits = (n: number): string => {
    let str = '';
    const hundred = Math.floor(n / 100);
    const rest = n % 100;
    if (hundred > 0) {
      str += ones[hundred] + ' Hundred';
      if (rest > 0) str += ' and ';
    }
    if (rest > 0) {
      str += convertTwoDigits(rest);
    }
    return str;
  };

  // Indian System: Crores (1,00,00,000), Lakhs (1,00,000), Thousands (1,000), Hundreds (100)
  const crore = Math.floor(integerPart / 10000000);
  integerPart %= 10000000;

  const lakh = Math.floor(integerPart / 100000);
  integerPart %= 100000;

  const thousand = Math.floor(integerPart / 1000);
  integerPart %= 1000;

  const remainder = integerPart;

  let words = '';
  if (crore > 0) {
    words += (crore >= 100 ? convertThreeDigits(crore) : convertTwoDigits(crore)) + ' Crore ';
  }
  if (lakh > 0) {
    words += convertTwoDigits(lakh) + ' Lakh ';
  }
  if (thousand > 0) {
    words += convertTwoDigits(thousand) + ' Thousand ';
  }
  if (remainder > 0) {
    words += convertThreeDigits(remainder) + ' ';
  }

  words = words.trim() + ' Rupees';

  if (paisePart > 0) {
    words += ' and ' + convertTwoDigits(paisePart) + ' Paise';
  }

  words += ' Only';

  // Format INR currency string: 12,45,670.00
  const formattedInr = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(numVal);

  return { output: words, formattedInr };
}

// ==========================================
// 11. HEX to RGB / HSL
// ==========================================
export interface ColorData {
  hex: string;
  rgb: string;
  rgba: string;
  hsl: string;
  hsla: string;
  r: number;
  g: number;
  b: number;
  alpha: number;
}

export function convertHexToRgbHsl(input: string): { output: string; data?: ColorData; error?: string } {
  let hex = input.trim();
  if (!hex) {
    return { output: '', error: 'Please enter a HEX color code (e.g. #3b82f6).' };
  }

  // Handle RGB input for reverse conversion
  const rgbMatch = hex.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/i);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1], 10);
    const g = parseInt(rgbMatch[2], 10);
    const b = parseInt(rgbMatch[3], 10);
    const a = rgbMatch[4] ? parseFloat(rgbMatch[4]) : 1;
    const toHex = (n: number) => n.toString(16).padStart(2, '0');
    hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  if (hex.startsWith('#')) {
    hex = hex.slice(1);
  }

  if (hex.length === 3 || hex.length === 4) {
    hex = hex.split('').map(c => c + c).join('');
  }

  if (!/^[0-9a-fA-F]{6}$/.test(hex.slice(0, 6))) {
    return { output: '', error: 'Invalid HEX code. Expected 3 or 6 hex digits (e.g. #FF5722 or #FFF).' };
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const alpha = hex.length >= 8 ? parseFloat((parseInt(hex.substring(6, 8), 16) / 255).toFixed(2)) : 1;

  // Calculate HSL
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
      case gNorm: h = (bNorm - rNorm) / d + 2; break;
      case bNorm: h = (rNorm - gNorm) / d + 4; break;
    }
    h = Math.round(h * 60);
  }

  const sPct = Math.round(s * 100);
  const lPct = Math.round(l * 100);

  const rgb = `rgb(${r}, ${g}, ${b})`;
  const rgba = `rgba(${r}, ${g}, ${b}, ${alpha})`;
  const hsl = `hsl(${h}, ${sPct}%, ${lPct}%)`;
  const hsla = `hsla(${h}, ${sPct}%, ${lPct}%, ${alpha})`;
  const fullHex = `#${hex.slice(0, 6).toLowerCase()}`;

  const output = [
    `HEX:  ${fullHex}`,
    `RGB:  ${rgb}`,
    `RGBA: ${rgba}`,
    `HSL:  ${hsl}`,
    `HSLA: ${hsla}`
  ].join('\n');

  return {
    output,
    data: {
      hex: fullHex,
      rgb,
      rgba,
      hsl,
      hsla,
      r,
      g,
      b,
      alpha
    }
  };
}

// ==========================================
// 12. px to rem Converter
// ==========================================
export interface PxRemData {
  pxValue: number;
  remValue: number;
  baseSize: number;
  cssDeclaration: string;
  tailwindClass?: string;
}

export function convertPxToRem(
  input: string | number, 
  baseSize = 16, 
  direction: 'px-to-rem' | 'rem-to-px' = 'px-to-rem'
): { output: string; data?: PxRemData; error?: string } {
  const clean = String(input).replace(/[pxrem\s]/g, '').trim();
  if (!clean) {
    return { output: '', error: 'Please enter a value to convert.' };
  }

  const num = parseFloat(clean);
  if (isNaN(num)) {
    return { output: '', error: 'Please enter a valid numeric value.' };
  }

  const base = baseSize > 0 ? baseSize : 16;

  if (direction === 'px-to-rem') {
    const rem = parseFloat((num / base).toFixed(4));
    const output = `${rem}rem`;

    // Common Tailwind Spacing Matcher (4px = 0.25rem = 1 unit)
    const twUnit = (num / 4);
    let tailwindClass = '';
    if (Number.isInteger(twUnit) && twUnit >= 0 && twUnit <= 96) {
      tailwindClass = `p-${twUnit} / m-${twUnit} / w-${twUnit} / h-${twUnit}`;
    }

    return {
      output,
      data: {
        pxValue: num,
        remValue: rem,
        baseSize: base,
        cssDeclaration: `font-size: ${rem}rem; /* ${num}px with base ${base}px */`,
        tailwindClass
      }
    };
  } else {
    const px = parseFloat((num * base).toFixed(2));
    const output = `${px}px`;

    return {
      output,
      data: {
        pxValue: px,
        remValue: num,
        baseSize: base,
        cssDeclaration: `font-size: ${px}px; /* ${num}rem with base ${base}px */`
      }
    };
  }
}
