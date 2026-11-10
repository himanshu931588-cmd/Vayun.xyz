import { estimateTokens, estimateTokenCost } from './tokenEstimator';

export interface TokenSlimmerOptions {
  stripComments: boolean;
  stripCopyrights: boolean;
  compressWhitespace: boolean;
  removeHtmlTags: boolean;
  convertToDenseMarkdown: boolean;
}

export interface SlimmerResult {
  originalText: string;
  optimizedText: string;
  originalTokens: number;
  optimizedTokens: number;
  savedTokens: number;
  savedPercent: number;
  originalCostUsd: number;
  optimizedCostUsd: number;
  savedCostUsd: number;
}

// Common license & copyright disclaimers in source files & docs
const COPYRIGHT_PATTERNS = [
  /\/\*[\s\S]*?(copyright|all rights reserved|mit license|apache license|gnu general public|proprietary)[\s\S]*?\*\//gi,
  /(#|\/\/)\s*(copyright|all rights reserved|licensed under|mit license|apache 2\.0)[^\n]*/gi,
  /copyright\s*(\(c\)|©)?\s*\d{4}[^\n]*/gi,
  /all rights reserved\.?/gi,
  /confidential and proprietary[^\n]*/gi,
  /this source code is subject to[^\n]*/gi,
  /page \d+ of \d+/gi,
  /header: [^\n]+/gi,
  /footer: [^\n]+/gi,
];

export function slimDocument(
  text: string,
  options: TokenSlimmerOptions = {
    stripComments: true,
    stripCopyrights: true,
    compressWhitespace: true,
    removeHtmlTags: false,
    convertToDenseMarkdown: true,
  }
): SlimmerResult {
  const originalTokens = estimateTokens(text);
  let processed = text;

  // 1. Strip copyrights and legal boilerplates
  if (options.stripCopyrights) {
    for (const pattern of COPYRIGHT_PATTERNS) {
      processed = processed.replace(pattern, '');
    }
  }

  // 2. Strip comments (non-code documentation noise or code comments)
  if (options.stripComments) {
    // Single line comments not inside quotes or markdown urls
    processed = processed.replace(/^[ \t]*\/\/[^\n]*/gm, '');
    processed = processed.replace(/^[ \t]*#[^#\n][^\n]*/gm, '');
    // Multi-line C-style comments
    processed = processed.replace(/\/\*[\s\S]*?\*\//g, '');
  }

  // 3. Remove HTML tags if present (e.g. from pasted web pages or docx exports)
  if (options.removeHtmlTags) {
    processed = processed.replace(/<script[\s\S]*?<\/script>/gi, '');
    processed = processed.replace(/<style[\s\S]*?<\/style>/gi, '');
    processed = processed.replace(/<[^>]+>/g, ' ');
  }

  // 4. Convert verbose tables/formatting to dense Markdown
  if (options.convertToDenseMarkdown) {
    // Strip decorative horizontal rules, ASCII boxes
    processed = processed.replace(/^[=\-_~*]{4,}$/gm, '');
    // Condense bullet points: "*   Item" -> "- Item"
    processed = processed.replace(/^[ \t]*[*•][ \t]+/gm, '- ');
    // Remove repeated numbering dots
    processed = processed.replace(/^[ \t]*(\d+)\.\s+/gm, '$1. ');
  }

  // 5. Compress redundant line breaks and trailing whitespace
  if (options.compressWhitespace) {
    // Trim each line
    processed = processed
      .split('\n')
      .map(line => line.trimEnd())
      .filter((line, i, arr) => {
        // Drop more than 2 consecutive blank lines
        if (line === '' && arr[i - 1] === '') {
          return false;
        }
        return true;
      })
      .join('\n');

    // Replace 3+ consecutive newlines with 2
    processed = processed.replace(/\n{3,}/g, '\n\n').trim();
  }

  const optimizedTokens = estimateTokens(processed);
  const savedTokens = Math.max(0, originalTokens - optimizedTokens);
  const savedPercent = originalTokens > 0 ? Math.round((savedTokens / originalTokens) * 100) : 0;
  
  const originalCostUsd = estimateTokenCost(originalTokens);
  const optimizedCostUsd = estimateTokenCost(optimizedTokens);
  const savedCostUsd = estimateTokenCost(savedTokens);

  return {
    originalText: text,
    optimizedText: processed,
    originalTokens,
    optimizedTokens,
    savedTokens,
    savedPercent,
    originalCostUsd,
    optimizedCostUsd,
    savedCostUsd,
  };
}
