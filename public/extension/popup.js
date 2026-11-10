// Vayun.xyz Chrome/Edge Browser Extension - Popup Logic
document.addEventListener('DOMContentLoaded', () => {
  const tokenInput = document.getElementById('token-input');
  const tokenCount = document.getElementById('token-count');
  const charCount = document.getElementById('char-count');
  const wordCount = document.getElementById('word-count');

  // Load saved draft from local storage if available
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    chrome.storage.local.get(['vayun_quick_draft'], (result) => {
      if (result.vayun_quick_draft) {
        tokenInput.value = result.vayun_quick_draft;
        updateCounts();
      }
    });
  }

  function updateCounts() {
    const text = tokenInput.value || '';
    const chars = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    // Approximating tokens: roughly 1 token per 4 chars or 0.75 words, standard heuristic
    const tokens = chars === 0 ? 0 : Math.ceil(chars / 3.8);

    charCount.textContent = chars.toLocaleString();
    wordCount.textContent = words.toLocaleString();
    tokenCount.textContent = tokens.toLocaleString();

    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ vayun_quick_draft: text });
    }
  }

  tokenInput.addEventListener('input', updateCounts);

  // Safely open links in a new browser tab
  const links = document.querySelectorAll('a[href]');
  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const url = link.getAttribute('href');
      if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.create) {
        chrome.tabs.create({ url });
      } else {
        window.open(url, '_blank');
      }
    });
  });
});
