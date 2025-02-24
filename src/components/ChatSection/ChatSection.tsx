import { useState } from "react";

const ChatSection = () => {
    const [messages, setMessages] = useState<{ role: "user" | "bot"; text: string }[]>([]);
    const [message, setMessage] = useState("");
    const sendMessage = async () => {
        if (!message.trim()) return;
        // Capture screenshot
        chrome.runtime.sendMessage({ type: "CAPTURE_SCREENSHOT" }, async (response) => {
            const screenshot = response?.screenshot;
            setMessages([...messages, { role: "user", text: message }]);
            const res = await fetch("http://localhost:3000/api/sendMessage", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: message, screenshot }),
            });

            const data = await res.json();
            setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
        });

        setMessage("");
    };
    return (
        <>
            <div style={{ height: "100%", display: "flex", flexDirection: "column", overflowY: "auto" }}>
                {messages.map((msg, index) => (
                    <div key={index} style={{
                        alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                        backgroundColor: msg.role === "user" ? "#007bff" : "#f1f1f1",
                        color: msg.role === "user" ? "white" : "black",
                        padding: "10px",
                        borderRadius: "10px",
                        maxWidth: "70%",
                    }}>
                        {msg.text}
                    </div>
                ))}
            </div>
            {/* message Field */}
            <div style={{
                display: "flex",
                padding: "10px",
                borderTop: "1px solid #ddd",
                backgroundColor: "white"
            }}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask something..."
                    style={{ flex: 1, padding: "8px", border: "1px solid #ddd", borderRadius: "5px" }}
                />
                <button onClick={sendMessage} style={{ marginLeft: "10px", padding: "8px 12px", backgroundColor: "#003671", color: "white", borderRadius: "5px", border: "none", cursor: "pointer" }}>
                    Send
                </button>
            </div>
        </>
    )
}

export default ChatSection