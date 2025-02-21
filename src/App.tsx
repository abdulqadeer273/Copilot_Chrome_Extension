import React, { useState } from "react";

const App: React.FC = () => {
  const [messages, setMessages] = useState<{ role: "user" | "bot"; text: string }[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Capture screenshot
    chrome.runtime.sendMessage({ type: "CAPTURE_SCREENSHOT" }, async (response) => {
      const screenshot = response?.screenshot;
      console.log(screenshot, 'screenshot')
      setMessages([...messages, { role: "user", text: input }]);
      const res = await fetch("http://localhost:3000/api/sendMessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, screenshot }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
    });

    setInput("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "98vh", width: "100%", overflowY: "hidden", borderRadius: "1rem" }}>
      {/* Header */}
      <div style={{ backgroundColor: "#007bff", color: "white", padding: "10px", textAlign: "center", fontWeight: "bold", borderTopLeftRadius: "1rem", borderTopRightRadius: "1rem" }}>
        n8n Copilot
      </div>

      {/* Chat Body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "10px", display: "flex", flexDirection: "column", gap: "10px" }}>
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

      {/* Input Field */}
      <div style={{ display: "flex", padding: "10px", borderTop: "1px solid #ddd", backgroundColor: "white", borderBottomLeftRadius: "1rem", borderBottomRightRadius: "1rem" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
          style={{ flex: 1, padding: "8px", border: "1px solid #ddd", borderRadius: "5px" }}
        />
        <button onClick={sendMessage} style={{ marginLeft: "10px", padding: "8px 12px", backgroundColor: "#007bff", color: "white", borderRadius: "5px", border: "none", cursor: "pointer" }}>
          Send
        </button>
      </div>
    </div>
  );
};

export default App;
