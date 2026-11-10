/**
 * Token Estimation & Cost Utility
 * Calibrated for modern LLMs (Claude 3.5 Sonnet / GPT-4o tokenizer behavior)
 */

export function estimateTokens(text: string): number {
  if (!text) return 0;
  
  // Heuristic:
  // - Plain English: ~4 characters per token
  // - Code / JSON / URLs / special characters: ~3 characters per token
  // - Leading whitespaces / newlines have token costs
  
  const trimmed = text.trim();
  if (trimmed.length === 0) return 0;
  
  // Count words, symbols, and code fences
  const codeBlockMatches = text.match(/```[\s\S]*?```/g) || [];
  let codeChars = 0;
  for (const block of codeBlockMatches) {
    codeChars += block.length;
  }
  const regularChars = Math.max(0, text.length - codeChars);
  
  const estimatedRegularTokens = Math.ceil(regularChars / 3.8);
  const estimatedCodeTokens = Math.ceil(codeChars / 3.1);
  
  return estimatedRegularTokens + estimatedCodeTokens;
}

export function formatTokenCount(tokens: number): string {
  if (tokens >= 1_000_000) {
    return `${(tokens / 1_000_000).toFixed(1)}M`;
  }
  if (tokens >= 1_000) {
    return `${(tokens / 1_000).toFixed(1)}k`;
  }
  return tokens.toLocaleString();
}

/**
 * Calculates estimated cost for tokens based on Claude 3.5 Sonnet ($3.00 / 1M prompt tokens)
 */
export function estimateTokenCost(tokens: number, ratePerMillion: number = 3.00): number {
  return (tokens / 1_000_000) * ratePerMillion;
}

export function formatUsd(amount: number): string {
  if (amount < 0.01 && amount > 0) {
    return `<$0.01`;
  }
  return `$${amount.toFixed(2)}`;
}
