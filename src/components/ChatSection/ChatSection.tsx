import { useState } from "react";
import logo from '../../assets/github-copilot-icon.png'
import { IoImageOutline } from "react-icons/io5";
import { MdOutlineKeyboardVoice } from "react-icons/md";
import { LuSendHorizontal } from "react-icons/lu";
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
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };
    return (
        <>
            <div style={{ height: "100%", display: "flex", flexDirection: "column", overflowY: "auto" }}>
                {messages.length > 0 && messages.some(msg => msg.text.trim() !== "") ? (
                    messages.map((msg, index) => (
                        msg.text.trim() !== "" && (
                            <div key={index} style={{
                                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                                backgroundColor: msg.role === "user" ? "#007bff" : "#f1f1f1",
                                color: msg.role === "user" ? "white" : "black",
                                padding: "10px",
                                borderRadius: "10px",
                                maxWidth: "70%",
                                marginBottom:"5px"
                            }}>
                                {msg.text}
                            </div>
                        )
                    ))
                ) : (
                    <div style={{ textAlign: "center", marginTop: "20px" }}>
                        <img src={logo} alt="Copilot" style={{ maxWidth: "100px", marginBottom: "-15px" }} />
                        <p>n8n Copilot your Ai companion</p>
                    </div>
                )}
            </div>
            {/* message Field */}
            <div style={{
                display: "flex",
                flexDirection: "column",
                padding: "10px",
                border: "2px solid black",
                backgroundColor: "#b7f0f2"
            }}>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask anything"
                    style={{
                        width: "100%",
                        backgroundColor: "#b7f0f2",
                        resize: "none",
                        height: "40px",
                        overflowY: "auto",
                        outline: "none",
                        border: "none"
                    }}
                />
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "10px"
                }}>
                    <div>
                        <button style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            marginRight: "2px"
                        }}>
                            <IoImageOutline style={{ width: "24px", height: "24px" }} />
                        </button>
                        <button style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer"
                        }}>
                            <MdOutlineKeyboardVoice style={{ width: "24px", height: "24px" }} />
                        </button>
                    </div>
                    <button onClick={sendMessage} style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer"
                    }}>
                        <LuSendHorizontal style={{ width: "24px", height: "24px" }} />
                    </button>
                </div>
            </div>

        </>
    )
}

export default ChatSection