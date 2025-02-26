import { useState, useEffect, useRef } from "react";
import logo from '../../assets/github-copilot-icon.png';
import { IoImageOutline } from "react-icons/io5";
import { MdOutlineKeyboardVoice } from "react-icons/md";
import { LuSendHorizontal } from "react-icons/lu";
import ReactMarkdown from 'react-markdown';

type Message = { role: "user" | "bot"; text: string };

const ChatSection = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState<string>("");
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async (): Promise<void> => {
        if (!message.trim()) {
            console.error("Message is empty");
            return;
        }

        const history = messages.map(msg => ({ role: msg.role, text: msg.text }));

        try {
            chrome.runtime.sendMessage({ type: "CAPTURE_SCREENSHOT" }, async (response: { screenshot?: string } | undefined) => {
                if (!response?.screenshot) {
                    setMessages(prev => [...prev, { role: "bot", text: "Error: This page is not allowing screenshots." }]);
                    return;
                }
                const screenshot: string = response?.screenshot;

                setMessages((prev) => [...prev, { role: "user", text: message }]);

                try {
                    const res: Response = await fetch("http://localhost:5678/webhook/chat", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ message, screenshot, history }),
                    });

                    if (!res.ok) {
                        if (res.status === 404) {
                            console.error("Webhook not found. Make sure the workflow is active in n8n.");
                        }
                        throw new Error(`Server responded with status ${res.status}`);
                    }

                    const textData: string = await res.text();
                    setMessages(prev => [...prev, { role: "bot", text: textData }]);
                } catch (error: unknown) {
                    console.error("Error sending message:", error);
                    setMessages(prev => [...prev, { role: "bot", text: "Error: Unable to get response from server." }]);
                }
            });
        } catch (error: unknown) {
            console.error("Error capturing screenshot:", error);
        }

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
                {messages.length > 0 ? (
                    messages.map((msg, index) => (
                        <div key={index} style={{
                            alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                            backgroundColor: msg.role === "user" ? "#167477" : "#f1f1f1",
                            color: msg.role === "user" ? "white" : "black",
                            padding: "10px",
                            borderRadius: "10px",
                            maxWidth: "70%",
                            marginBottom: "5px"
                        }}>
                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>
                    ))
                ) : (
                    <div style={{ textAlign: "center", marginTop: "20px" }}>
                        <img src={logo} alt="Copilot" style={{ maxWidth: "100px", marginBottom: "-15px" }} />
                        <p>n8n Copilot your Ai companion</p>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            {/* Message Field */}
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
                        <button style={{ background: "none", border: "none", cursor: "pointer", marginRight: "2px" }}>
                            <IoImageOutline style={{ width: "24px", height: "24px" }} />
                        </button>
                        <button style={{ background: "none", border: "none", cursor: "pointer" }}>
                            <MdOutlineKeyboardVoice style={{ width: "24px", height: "24px" }} />
                        </button>
                    </div>
                    <button onClick={sendMessage} style={{ background: "none", border: "none", cursor: "pointer" }}>
                        <LuSendHorizontal style={{ width: "24px", height: "24px" }} />
                    </button>
                </div>
            </div>
        </>
    );
};

export default ChatSection;
