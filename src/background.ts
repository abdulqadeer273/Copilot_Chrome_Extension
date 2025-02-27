chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  // console.log("📩 Message received from content script:", message);

  if (message.type === "CAPTURE_SCREENSHOT") {
    chrome.tabs.captureVisibleTab(
      chrome.windows.WINDOW_ID_CURRENT,
      { format: "png" },
      (dataUrl) => {
        if (chrome.runtime.lastError) {
          console.error("❌ Screenshot error:", chrome.runtime.lastError);
          sendResponse({ error: "Failed to capture screenshot" });
        } else {
          sendResponse({ screenshot: dataUrl });
        }
      }
    );
    return true; // Keep sendResponse function alive for async response
  }

  sendResponse({ status: "received" });
});

chrome.runtime.onInstalled.addListener(() => {
  if (chrome.sidePanel && chrome.sidePanel.setPanelBehavior) {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
  } else {
    console.warn("⚠️ sidePanel API not supported in this Chrome version.");
  }
});
