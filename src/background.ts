chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed!");
});

chrome.sidePanel.setOptions({
  enabled: true,
  path: "index.html"
});
