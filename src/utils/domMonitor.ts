export const monitorDOM = (callback: (changes: MutationRecord[]) => void) => {
  // Check if we're running in a Chrome extension context
  const isChromeExtension = typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id;

  if (!isChromeExtension) {
    console.warn('DOM monitoring is only available in Chrome extension context');
    return () => {};
  }

  const observer = new MutationObserver((mutations) => {
    callback(mutations);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true
  });

  return () => observer.disconnect();
};