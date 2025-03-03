import { useState, useEffect, useRef, JSX } from "react";
import logo from '../../assets/github-copilot-icon.png';
import { IoImageOutline } from "react-icons/io5";
import { MdOutlineKeyboardVoice } from "react-icons/md";
import { LuSendHorizontal } from "react-icons/lu";
import ReactMarkdown from 'react-markdown';
import { BeatLoader } from "react-spinners";
import Templates from "../Templates/Templates";

type Message = {
    role: "user" | "bot";
    text: string | JSX.Element;
    id?: number; // Optional ID for tracking messages 
};
type ChatSession = {
    id: string;
    label: string;
    messages: Message[];
};
interface ComponentProps {
    activeTab: "Tab1" | "Tab2" | "Tab3" | "Tab4";
    activeChatId: string | null;
    chats: ChatSession[];
    setChats: React.Dispatch<React.SetStateAction<ChatSession[]>>;
    setActiveChatId: React.Dispatch<React.SetStateAction<string | null>>;
    [key: string]: any;
}
// interface TrackingEvent {
//     type: string;
//     data: any;
// }
const ChatSection: React.FC<ComponentProps> = ({ chats, activeChatId, setChats, setActiveChatId }) => {
    const activeChat = chats.find(chat => chat.id === activeChatId);
    const [message, setMessage] = useState<string>("");
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [chatSectionLoaded, setChatSectionLoaded] = useState(false);
    // const [events, setEvents] = useState<TrackingEvent[]>([]);
    // const SCREENSHOT_DELAY = 4000;
    const activeChatIdRef = useRef<string | null>(activeChatId);
    const generateChatId = (): string => {
        return `chat-${Date.now()}`; // Use timestamp for uniqueness
    };

    const generateChatName = (message: string): string => {
        return message.substring(0, 20); // Use the first 20 characters of the message as the name
    };
    async function sendScreenShot() {
        // Ensure there's an active chat
        if (!activeChatIdRef.current) {
            console.error("No active chat selected");
            return;
        }

        //console.log(chats, 'chats');
        //console.log(activeChatIdRef.current, 'activeChatIdRef.current');
        // Get the active chat
        const activeChat = chats.find(chat => chat.id === activeChatIdRef.current);
        console.log(activeChat, 'activeChat');

        const history: { role: "user" | "bot"; text: string | JSX.Element }[] =
            activeChat?.messages.slice(-15).map(msg => ({ role: msg.role, text: msg.text })) || [];



        try {
            setIsLoading(true);
            chrome.runtime.sendMessage(
                { type: "CAPTURE_SCREENSHOT" },
                async (response: { screenshot?: string } | undefined) => {
                    if (!response?.screenshot) {
                        // Update the active chat with an error message
                        setChats(prevChats =>
                            prevChats.map(chat =>
                                chat.id === activeChatIdRef.current
                                    ? {
                                        ...chat,
                                        messages: [
                                            ...chat.messages,
                                            { role: "bot" as "bot", text: "Error: This page is not allowing screenshots." }
                                        ]
                                    }
                                    : chat
                            )
                        );
                        setIsLoading(false); // Stop loading
                        return;
                    }
                    const screenshot: string = response.screenshot;


                    // If this is a new chat, assign a proper ID and name
                    if (activeChatIdRef.current === "new-chat") {
                        const newChatId = generateChatId(); // Generate a unique ID
                        const newChatName = generateChatName(`event-${Date.now()}`); // Generate a name from the message

                        // Create a new chat with the proper ID and name
                        const newChat: ChatSession = {
                            id: newChatId,
                            label: newChatName,
                            messages: [],
                        };

                        // Replace the temporary chat with the new chat
                        setChats(prevChats => [
                            ...prevChats.filter(chat => chat.id !== "new-chat"), // Remove the temporary chat
                            newChat, // Add the new chat
                        ]);

                        // Set the new chat as active
                        setActiveChatId(newChatId);
                        activeChatIdRef.current = newChatId; // Update the ref
                    }

                    try {
                        const res: Response = await fetch("https://n8n.alsoknownas.me/webhook/chat", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ message: "My current view", screenshot, history }),
                        });

                        //console.log("Response status:", res.status); // Log the status
                        //console.log("Response OK:", res.ok); // Log if the response is OK

                        if (!res.ok) {
                            if (res.status === 404) {
                                console.error("Webhook not found. Make sure the workflow is active in n8n.");
                            }
                            throw new Error(`Server responded with status ${res.status}`);
                        }

                        const textData: string = await res.text();
                        //console.log("Bot response:", textData); // Log the bot's response

                        // Add bot response to the active chat
                        setChats(prevChats => {
                            const updatedChats = prevChats.map(chat =>
                                chat.id === activeChatIdRef.current
                                    ? {
                                        ...chat,
                                        messages: [
                                            ...chat.messages,
                                            { role: "bot" as "bot", text: textData }
                                        ]
                                    }
                                    : chat
                            );

                            //console.log("Updated chats:", updatedChats); // Log the updated chats
                            return updatedChats;
                        });

                    } catch (error: unknown) {
                        console.error("Error fetching bot response:", error); // Log any errors
                        setChats(prevChats =>
                            prevChats.map(chat =>
                                chat.id === activeChatIdRef.current
                                    ? {
                                        ...chat,
                                        messages: [
                                            ...chat.messages,
                                            { role: "bot" as "bot", text: "Error: Unable to get response from server." }
                                        ]
                                    }
                                    : chat
                            )
                        );
                    } finally {
                        setIsLoading(false); // Stop loading
                    }
                }
            );
        } catch (error: unknown) {
            console.error("Error capturing screenshot:", error);
            setIsLoading(false); // Stop loading
        }
    }
    const SCREENSHOT_DELAY = 2000; // 2 seconds delay

    useEffect(() => {
        let canTakeScreenshot = true; // Flag to track if a screenshot can be taken

        const handleMessage = async (message: any) => {
            if (message.source === "n8n-injected" && (message.type === "CLICK" || message.type === "URL_CHANGE")) {
                if (isLoading || !canTakeScreenshot) {
                    return; // Ignore clicks while loading OR if a screenshot is already taken
                }

                canTakeScreenshot = false; // Prevent multiple screenshots

                setTimeout(async () => {
                    await sendScreenShot();
                    canTakeScreenshot = true; // Allow new screenshots after this one is sent
                }, SCREENSHOT_DELAY);
            }
        };

        // ✅ Listen for messages from background.js
        chrome.runtime.onMessage.addListener(handleMessage);

        return () => {
            chrome.runtime.onMessage.removeListener(handleMessage);
        };
    }, [isLoading]); // Reacts to isLoading changes
    //console.log(events, 'events')
    const startNewChat = (): void => {
        const newChat: ChatSession = {
            id: "new-chat", // Temporary ID
            label: "New Chat", // Temporary label
            messages: [],
        };

        // Add the new chat to the chats state
        setChats(prevChats => [...prevChats, newChat]);

        // Set the new chat as active
        setActiveChatId("new-chat");
    };
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [activeChat?.messages]);
    useEffect(() => {
        if (!chatSectionLoaded && !activeChatId) {
            startNewChat();
            setChatSectionLoaded(true)
        }
    }, [])


    // Keep the ref in sync with the state
    useEffect(() => {
        activeChatIdRef.current = activeChatId;
    }, [activeChatId]);
    const sendMessage = async (): Promise<void> => {
        if (!message.trim()) {
            console.error("Message is empty");
            return;
        }

        // Ensure there's an active chat
        if (!activeChatIdRef.current) {
            console.error("No active chat selected");
            return;
        }

        // Get the active chat
        const activeChat = chats.find(chat => chat.id === activeChatIdRef.current);
        if (!activeChat) {
            console.error("Active chat not found");
            return;
        }

        // Prepare history from the active chat's messages
        const history: { role: "user" | "bot"; text: string | JSX.Element }[] =
            activeChat?.messages.slice(-15).map(msg => ({ role: msg.role, text: msg.text })) || [];

        try {
            // Start loading
            setIsLoading(true);

            chrome.runtime.sendMessage(
                { type: "CAPTURE_SCREENSHOT" },
                async (response: { screenshot?: string } | undefined) => {
                    if (!response?.screenshot) {
                        // Update the active chat with an error message
                        setChats(prevChats =>
                            prevChats.map(chat =>
                                chat.id === activeChatIdRef.current
                                    ? {
                                        ...chat,
                                        messages: [
                                            ...chat.messages,
                                            { role: "bot" as "bot", text: "Error: This page is not allowing screenshots." }
                                        ]
                                    }
                                    : chat
                            )
                        );
                        setIsLoading(false); // Stop loading
                        return;
                    }
                    const screenshot: string = response.screenshot;

                    // If this is a new chat, assign a proper ID and name
                    if (activeChatIdRef.current === "new-chat") {
                        const newChatId = generateChatId(); // Generate a unique ID
                        const newChatName = generateChatName(message); // Generate a name from the message

                        // Create a new chat with the proper ID and name
                        const newChat: ChatSession = {
                            id: newChatId,
                            label: newChatName,
                            messages: [
                                { role: "user" as "user", text: message }
                            ],
                        };

                        // Replace the temporary chat with the new chat
                        setChats(prevChats => [
                            ...prevChats.filter(chat => chat.id !== "new-chat"), // Remove the temporary chat
                            newChat, // Add the new chat
                        ]);

                        // Set the new chat as active
                        setActiveChatId(newChatId);
                        activeChatIdRef.current = newChatId; // Update the ref
                    } else {
                        // Add user message to the active chat
                        setChats(prevChats =>
                            prevChats.map(chat =>
                                chat.id === activeChatIdRef.current
                                    ? {
                                        ...chat,
                                        messages: [
                                            ...chat.messages,
                                            { role: "user", text: message }
                                        ]
                                    }
                                    : chat
                            )
                        );
                    }

                    try {
                        const res: Response = await fetch("https://n8n.alsoknownas.me/webhook/chat", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ message, screenshot, history }),
                        });

                        //console.log("Response status:", res.status); // Log the status
                        //console.log("Response OK:", res.ok); // Log if the response is OK

                        if (!res.ok) {
                            if (res.status === 404) {
                                console.error("Webhook not found. Make sure the workflow is active in n8n.");
                            }
                            throw new Error(`Server responded with status ${res.status}`);
                        }

                        const textData: string = await res.text();
                        //console.log("Bot response:", textData); // Log the bot's response

                        // Add bot response to the active chat
                        setChats(prevChats => {
                            const updatedChats = prevChats.map(chat =>
                                chat.id === activeChatIdRef.current
                                    ? {
                                        ...chat,
                                        messages: [
                                            ...chat.messages,
                                            { role: "bot" as "bot", text: textData }
                                        ]
                                    }
                                    : chat
                            );

                            //console.log("Updated chats:", updatedChats); // Log the updated chats
                            return updatedChats;
                        });

                    } catch (error: unknown) {
                        console.error("Error fetching bot response:", error); // Log any errors
                        // Add error message to the active chat
                        setChats(prevChats =>
                            prevChats.map(chat =>
                                chat.id === activeChatIdRef.current
                                    ? {
                                        ...chat,
                                        messages: [
                                            ...chat.messages,
                                            { role: "bot" as "bot", text: "Error: Unable to get response from server." }
                                        ]
                                    }
                                    : chat
                            )
                        );
                    } finally {
                        setIsLoading(false); // Stop loading
                    }
                }
            );
        } catch (error: unknown) {
            console.error("Error capturing screenshot:", error);
            setIsLoading(false); // Stop loading
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
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    background: "#b7f0f2",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.5)",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    minHeight: "40px"
                }}
            >
                <p style={{ marginLeft: "10px" }}>
                    {chats.find(chat => chat.id === activeChatIdRef.current)
                        ? chats.find((chat) => chat.id === activeChatId)?.label
                        : "No Active Chat"}
                </p>
                <button
                    onClick={startNewChat} // Trigger the new chat function
                    style={{
                        backgroundColor: "#167477",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: "600",
                        display: "flex",
                        alignItems: "center",
                        margin: "5px 5px",
                        transition: "background-color 0.2s ease",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#125a5d")}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#167477")}
                    title="Start a new chat"
                >
                    New Chat
                </button>
            </div>
            <div style={{ height: "100%", display: "flex", flexDirection: "column", overflowY: "auto" }}>
                {activeChat?.messages?.length ?? 0 > 0 ? (
                    activeChat?.messages.map((msg, index) => (
                        <div key={index} style={{
                            alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                            backgroundColor: msg.role === "user" ? "#167477" : "#f1f1f1",
                            color: msg.role === "user" ? "white" : "black",
                            paddingLeft: "10px",
                            paddingRight: "10px",
                            borderRadius: "10px",
                            maxWidth: "70%",
                            marginBottom: "5px"
                        }}>
                            {typeof msg.text === "string" ? <ReactMarkdown>{msg.text}</ReactMarkdown> : msg.text}
                        </div>
                    ))
                ) : (!isLoading &&
                    <div>
                        <div style={{ textAlign: "center", marginTop: "20px" }}>
                            <img src={logo} alt="Copilot" style={{ maxWidth: "100px", marginBottom: "-15px" }} />
                            <p>n8n Copilot your Ai companion</p>
                        </div>
                        <Templates />
                    </div>
                )}

                {isLoading && (
                    <div style={{ marginTop: "5px", marginBottom: "5px" }}>
                        <BeatLoader
                            color={"grey"}
                            size={10}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                        />
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            {/* Message Field */}
            {chats.find(chat => chat.id === activeChatIdRef.current) && <div style={{
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
            </div>}
        </>
    );
};

export default ChatSection;
