//console.log("✅ Injected script running inside the n8n page!");

// Ensure script runs only once
if ((window as any).n8nInjectedScriptLoaded) {
    //console.log("⚠️ Injected script already loaded. Skipping...");
} else {
    (window as any).n8nInjectedScriptLoaded = true; // Prevent re-injection

    let lastClick = { x: 0, y: 0, time: 0 };

    const handleClick = (event: MouseEvent) => {
        const now = Date.now();
        const x = event.clientX;
        const y = event.clientY;

        if (now - lastClick.time < 200 && lastClick.x === x && lastClick.y === y) {
            //console.log("🚫 Duplicate click ignored!");
            return;
        }

        lastClick = { x, y, time: now };

        const target = event.target as HTMLElement;

        // ✅ Allow normal link behavior
        if (target.tagName === "A" || target.closest("a")) {
            return;
        }
        event.preventDefault();

        window.postMessage({
            source: "n8n-injected",
            type: "CLICK",
            x,
            y,
            target: (event.target as HTMLElement)?.tagName,
        }, "*");
    };

    // Ensure only one listener is attached
    document.removeEventListener("click", handleClick, true);
    document.addEventListener("click", handleClick, { capture: true, passive: false });

    // ✅ Track URL changes
    let lastUrl = window.location.href;

    const trackUrlChange = () => {
        if (window.location.href !== lastUrl) {
            lastUrl = window.location.href;
            //console.log("🌍 URL changed:", lastUrl);

            window.postMessage(
                { source: "n8n-injected", type: "URL_CHANGE", url: lastUrl },
                "*"
            );
        }
    };

    // Hook into pushState and replaceState (for SPA changes)
    const pushState = history.pushState;
    const replaceState = history.replaceState;

    history.pushState = function (data: any, unused: string, url?: string | URL | null | undefined) {
        pushState.apply(history, [data, unused, url]);
        trackUrlChange();
    };

    history.replaceState = function (data: any, unused: string, url?: string | URL | null | undefined) {
        replaceState.apply(history, [data, unused, url]);
        trackUrlChange();
    };

    // Also observe DOM changes (some SPAs update the page without pushState)
    const observer = new MutationObserver(trackUrlChange);
    observer.observe(document, { subtree: true, childList: true });

    //console.log("🔍 URL Tracking initialized");
}
