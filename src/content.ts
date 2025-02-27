console.log("✅ Content script is running inside n8n!");

// Listen for messages from injected.ts
window.addEventListener("message", (event) => {
    // Ignore messages not from our injected script or from React DevTools
    if (event.source !== window || event.data.source !== "n8n-injected") return;

    // console.log("📩 Message from Injected Script:", event.data);

    // Forward the message to the Chrome extension (side panel)
    chrome.runtime.sendMessage(event.data);
});

const script = document.createElement("script");
script.src = chrome.runtime.getURL("injected.js"); // Inject the script
(document.head || document.documentElement).appendChild(script);
console.log("✅ Injected script added:", script.src);


