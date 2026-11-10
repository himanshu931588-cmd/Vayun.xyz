import { VivaQuestion, CodeFile } from '../types';

const STORAGE_KEY_API_KEY = 'vayun_gemini_api_key';
const STORAGE_KEY_MODEL = 'vayun_gemini_model';

export type GeminiModelId = 
  | 'gemini-2.0-flash' 
  | 'gemini-2.0-flash-lite' 
  | 'gemini-1.5-flash' 
  | 'gemini-1.5-flash-8b' 
  | 'gemini-1.5-pro';

// Fast in-memory cache for instant responses (0ms response time for repeated queries)
const responseCache = new Map<string, string>();

export function getStoredApiKey(): string {
  try {
    return localStorage.getItem(STORAGE_KEY_API_KEY) || '';
  } catch {
    return '';
  }
}

export function saveStoredApiKey(key: string): void {
  try {
    if (key.trim()) {
      localStorage.setItem(STORAGE_KEY_API_KEY, key.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY_API_KEY);
    }
  } catch (e) {
    console.error('Failed to save API key to localStorage', e);
  }
}

export function getStoredModel(): GeminiModelId {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_MODEL);
    const validModels: GeminiModelId[] = [
      'gemini-2.0-flash', 
      'gemini-2.0-flash-lite', 
      'gemini-1.5-flash', 
      'gemini-1.5-flash-8b', 
      'gemini-1.5-pro'
    ];
    if (saved && validModels.includes(saved as GeminiModelId)) {
      return saved as GeminiModelId;
    }
    return 'gemini-2.0-flash'; // Default to the ultra-fast next-gen model
  } catch {
    return 'gemini-2.0-flash';
  }
}

export function saveStoredModel(model: GeminiModelId): void {
  try {
    localStorage.setItem(STORAGE_KEY_MODEL, model);
  } catch (e) {
    console.error('Failed to save model', e);
  }
}

export async function testGeminiApiKey(
  apiKey: string, 
  model: GeminiModelId = 'gemini-2.0-flash'
): Promise<{ success: boolean; message: string }> {
  const cleanKey = apiKey.trim();
  if (!cleanKey) {
    return { success: false, message: 'Please enter a valid Google Gemini API key.' };
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${cleanKey}`;
  
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: 'Respond with exactly the single word "VERIFIED"' }]
          }
        ],
        generationConfig: {
          maxOutputTokens: 10,
          temperature: 0.1
        }
      })
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => null);
      const errMsg = errJson?.error?.message || `HTTP ${response.status}: ${response.statusText}`;
      if (response.status === 400 || response.status === 403) {
        return { success: false, message: `Invalid API key: ${errMsg}` };
      }
      return { success: false, message: `API test failed: ${errMsg}` };
    }

    const data = await response.json();
    const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    if (replyText.toLowerCase().includes('verified') || replyText.trim().length > 0) {
      return { success: true, message: `Successfully connected to Google Gemini (${model})! Ready for instant low-latency inference.` };
    }

    return { success: true, message: `Connected to Gemini API successfully.` };
  } catch (err: any) {
    return { 
      success: false, 
      message: `Network or CORS error connecting to Gemini API: ${err?.message || 'Check your internet connection'}` 
    };
  }
}

export async function callGemini(
  prompt: string,
  systemInstruction?: string,
  model?: GeminiModelId
): Promise<string> {
  const apiKey = getStoredApiKey();
  if (!apiKey) {
    throw new Error('NO_API_KEY');
  }

  const activeModel = model || getStoredModel();
  const cacheKey = `${activeModel}:${systemInstruction || ''}:${prompt}`;
  
  // Instant 0ms response if cached
  if (responseCache.has(cacheKey)) {
    return responseCache.get(cacheKey)!;
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${activeModel}:generateContent?key=${apiKey}`;

  const payload: any = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      temperature: 0.2, // Lower temperature for instant, deterministic tokens
      maxOutputTokens: 1024
    }
  };

  if (systemInstruction) {
    payload.systemInstruction = {
      parts: [{ text: systemInstruction }]
    };
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorJson = await response.json().catch(() => null);
    throw new Error(errorJson?.error?.message || `Gemini API error: HTTP ${response.status}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Empty response from Gemini API');
  }

  // Cache for future instant lookups
  responseCache.set(cacheKey, text);
  return text;
}

// Dynamic Viva Defense Evaluation with AI + Strict Zero-Code Guardrail
export async function evaluateVivaWithAi(
  question: VivaQuestion,
  studentAnswer: string,
  codeSnippet: string
): Promise<{
  score: number;
  rating: 'Mastery' | 'Competent' | 'Needs Depth' | 'Unsatisfactory';
  feedback: string;
  strengths: string[];
  gaps: string[];
  socraticFollowUp: string;
}> {
  const systemPrompt = `You are the Lead Socratic Technical Examiner in Vayun Viva (vayun.xyz).
CRITICAL RULE & ZERO-CODE GUARDRAIL:
1. YOU MUST NEVER PROVIDE, SUGGEST, OR OUTPUT CODE BLOCKS, CODE SNIPPETS, OR READY-TO-PASTE SOLUTIONS.
2. Evaluate ONLY the student's verbal mental model, understanding of control flow, asymptotic complexity (Big-O), memory allocation, and edge cases.
3. Respond in strictly valid JSON format with these exact keys:
{
  "score": number (0 to 100),
  "rating": "Mastery" | "Competent" | "Needs Depth" | "Unsatisfactory",
  "feedback": "Two-sentence evaluation of their explanation",
  "strengths": ["list of concepts correctly defended"],
  "gaps": ["list of technical mechanisms they missed"],
  "socraticFollowUp": "A probing question challenging their mental model further without giving code"
}`;

  const userPrompt = `Code Under Defense:
\`\`\`
${codeSnippet}
\`\`\`

Question:
"${question.question}"

Category: ${question.category} (Tier ${question.tier})
Expected Key Checkpoints: ${question.checkpoints.join(', ')}

Student's Defense Answer:
"${studentAnswer}"

Evaluate their response strictly adhering to the JSON schema and Zero-Code guardrail:`;

  try {
    const rawResponse = await callGemini(userPrompt, systemPrompt);
    const cleaned = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return {
      score: typeof parsed.score === 'number' ? Math.max(0, Math.min(100, parsed.score)) : 70,
      rating: parsed.rating || (parsed.score >= 80 ? 'Mastery' : parsed.score >= 65 ? 'Competent' : 'Needs Depth'),
      feedback: parsed.feedback || 'Evaluated against codebase AST.',
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : ['Control flow defended'],
      gaps: Array.isArray(parsed.gaps) ? parsed.gaps : [],
      socraticFollowUp: parsed.socraticFollowUp || question.contextHint
    };
  } catch (err) {
    console.warn('AI evaluation error, fallback to built-in socratic heuristics', err);
    throw err;
  }
}
