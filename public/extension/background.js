// Vayun.xyz Extension - Background Service Worker (Manifest V3)

chrome.runtime.onInstalled.addListener(() => {
  // Context menu for selected code or text
  chrome.contextMenus.create({
    id: 'vayun-inspect-flow',
    title: 'Inspect selection in Vayun Flow',
    contexts: ['selection']
  });

  chrome.contextMenus.create({
    id: 'vayun-defend-viva',
    title: 'Prepare Viva Defense for selection',
    contexts: ['selection']
  });

  chrome.contextMenus.create({
    id: 'vayun-open-hub',
    title: 'Open Vayun.xyz Workstation',
    contexts: ['page', 'action']
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  const baseUrl = 'https://vayun.xyz';

  if (info.menuItemId === 'vayun-inspect-flow') {
    const text = (info.selectionText || '').trim();
    const targetUrl = text 
      ? `${baseUrl}/#/flow?prefill=${encodeURIComponent(text.slice(0, 4000))}`
      : `${baseUrl}/#/flow`;
    chrome.tabs.create({ url: targetUrl });
  } else if (info.menuItemId === 'vayun-defend-viva') {
    const text = (info.selectionText || '').trim();
    const targetUrl = text 
      ? `${baseUrl}/#/viva?prefill=${encodeURIComponent(text.slice(0, 4000))}`
      : `${baseUrl}/#/viva`;
    chrome.tabs.create({ url: targetUrl });
  } else if (info.menuItemId === 'vayun-open-hub') {
    chrome.tabs.create({ url: baseUrl });
  }
});
