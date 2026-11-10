import { SecretMaskResult } from '../types';

export function maskSecrets(
  text: string, 
  customIdentifiers: string[] = []
): SecretMaskResult {
  const replacements: SecretMaskResult['replacements'] = [];
  let masked = text;
  let counter = 1;

  function registerReplacement(original: string, prefix: string, type: SecretMaskResult['replacements'][0]['type']): string {
    const existing = replacements.find(r => r.original === original);
    if (existing) {
      return existing.placeholder;
    }
    const placeholder = `{{${prefix}_${counter++}}}`;
    replacements.push({
      placeholder,
      original,
      type
    });
    return placeholder;
  }

  // 1. OpenAI / Anthropic / HuggingFace API Keys
  // sk-..., sk-ant-..., hf_...
  masked = masked.replace(/\b(sk-(?:live|test|proj|ant)?[a-zA-Z0-9_\-]{20,})\b/g, (match) => {
    return registerReplacement(match, 'API_KEY', 'api_key');
  });

  // 2. AWS Access Key IDs: AKIA...
  masked = masked.replace(/\b(AKIA[0-9A-Z]{16})\b/g, (match) => {
    return registerReplacement(match, 'AWS_KEY', 'api_key');
  });

  // 3. JWT Tokens (header.payload.signature)
  masked = masked.replace(/\b(eyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,})\b/g, (match) => {
    return registerReplacement(match, 'JWT_TOKEN', 'jwt');
  });

  // 4. GitHub Tokens: ghp_..., gho_..., github_pat_...
  masked = masked.replace(/\b(gh[pousr]_[A-Za-z0-9_]{36,}|github_pat_[A-Za-z0-9_]{50,})\b/g, (match) => {
    return registerReplacement(match, 'GITHUB_TOKEN', 'api_key');
  });

  // 5. Generic Bearer Tokens
  masked = masked.replace(/\bBearer\s+([a-zA-Z0-9_\-\.]{25,})\b/g, (_match, token) => {
    const ph = registerReplacement(token, 'AUTH_TOKEN', 'api_key');
    return `Bearer ${ph}`;
  });

  // 6. Emails
  masked = masked.replace(/\b([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b/g, (match) => {
    return registerReplacement(match, 'CLIENT_EMAIL', 'email');
  });

  // 7. IPv4 Addresses (skip 127.0.0.1 and 0.0.0.0 optionally or mask them if public)
  masked = masked.replace(/\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g, (match) => {
    if (match === '127.0.0.1' || match === '0.0.0.0') return match;
    return registerReplacement(match, 'HOST_IP', 'ip');
  });

  // 8. Custom identifiers (e.g. client names, specific domains)
  for (const item of customIdentifiers) {
    const trimmed = item.trim();
    if (trimmed.length > 2) {
      const regex = new RegExp(`\\b${trimmed.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'gi');
      masked = masked.replace(regex, (match) => {
        return registerReplacement(match, 'CONFIDENTIAL_NAME', 'custom');
      });
    }
  }

  return {
    maskedText: masked,
    originalText: text,
    replacements
  };
}

export function rehydrateSecrets(
  aiResponse: string,
  replacements: SecretMaskResult['replacements']
): string {
  let restored = aiResponse;
  for (const item of replacements) {
    // Replace all occurrences of placeholder with original secret
    const escapedPlaceholder = item.placeholder.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    restored = restored.replace(new RegExp(escapedPlaceholder, 'g'), item.original);
  }
  return restored;
}
