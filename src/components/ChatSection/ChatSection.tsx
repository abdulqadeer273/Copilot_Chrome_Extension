import { useState, useEffect, useRef, JSX } from "react";
import logo from '../../assets/github-copilot-icon.png';
import { IoImageOutline } from "react-icons/io5";
import { MdOutlineKeyboardVoice } from "react-icons/md";
import { LuSendHorizontal } from "react-icons/lu";
import ReactMarkdown from 'react-markdown';
import { BeatLoader } from "react-spinners";
import Templates from "../Templates/Templates";
const automationSteps = [
    {
        id: "initial",
        message: "What’s your starting point?",
        options: [
            { text: "I already have n8n hosted or in cloud", next: "existing-n8n" },
            { text: "I don't have setup yet", next: "no-n8n" }
        ]
    },
    {
        id: "existing-n8n",
        message: "Let’s start with building something smart.",
        options: [
            { text: "Pick from predefined workflows", next: "workflow-selection" },
            { text: "Ask me questions", next: "ask-questions" }
        ]
    },
    {
        id: "no-n8n",
        message: "Let's build something together quickly and for free (your first automation is on us).",
        next: "workflow-selection"
    },
    {
        id: "workflow-selection",
        message: "What is your most urgent need?",
        options: [
            { text: "More leads", next: "build-automation" },
            { text: "More traffic", next: "build-automation" },
            { text: "Less costs", next: "build-automation" },
            { text: "Better sales alignment", next: "build-automation" }
        ]
    },
    {
        id: "build-automation",
        message: "Let's configure your automation.",
        steps: [
            "CRM: <HubSpot> <Pipedrive> <Other> <I don’t have one>",
            "Data Provider: 'Shall we use Dataprovider X for Z? (Cost: Y)'",
            "Data Management: 'Use Airtable or set up NoCodeDB (recommended)?'",
            "✅ Step 1: Setup API trigger (Guide to get API keys)",
            "✅ Step 2: Configure the prompt (Use predefined structure)",
            "✅ Step 3: Test the workflow",
            "✅ Step 4: Finalize & launch"
        ],
        options: [
            { text: "Finish Setup", next: "chat-mode" }
        ]
    },
    {
        id: "chat-mode",
        message: "Your automation is live! Need help with something else?",
        options: [
            { text: "Start a new automation", next: "initial" },
            { text: "Ask a question", next: "ask-question" }
        ]
    }
];

type Message = {
    id: string;
    role: "user" | "bot";
    text: string;
    options?: string[]; // Optional buttons
};
type ChatSession = {
    id: string;
    label: string;
    messages: Message[];
    completed?: boolean; // Track if guided steps are finished
};
interface ComponentProps {
    activeTab: "Tab1" | "Tab2" | "Tab3" | "Tab4";
    activeChatId: string | null;
    chats: ChatSession[];
    setChats: React.Dispatch<React.SetStateAction<ChatSession[]>>;
    setActiveChatId: React.Dispatch<React.SetStateAction<string | null>>;
    isToggled: boolean;
    [key: string]: any;
}
// interface TrackingEvent {
//     type: string;
//     data: any;
// }
const ChatSection: React.FC<ComponentProps> = ({ chats, activeChatId, setChats, setActiveChatId, isToggled }) => {
    const activeChat = chats.find(chat => chat.id === activeChatId);
    const [message, setMessage] = useState<string>("");
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [hasScroll, setHasScroll] = useState(false);
    useEffect(() => {
        const checkScroll = () => {
            if (chatContainerRef.current) {
                setHasScroll(chatContainerRef.current.scrollHeight > chatContainerRef.current.clientHeight);
            }
        };

        checkScroll(); // Check on mount
        window.addEventListener("resize", checkScroll); // Check when window resizes

        return () => window.removeEventListener("resize", checkScroll);
    }, [activeChat?.messages]);
    // const [chatSectionLoaded, setChatSectionLoaded] = useState(false);
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
            activeChat?.messages.slice(-20).map(msg => ({ role: msg.role, text: msg.text })) || [];



        try {
            setIsLoading(true);
            chrome.runtime.sendMessage(
                { type: "CAPTURE_SCREENSHOT" },
                async (response: { screenshot?: string } | undefined) => {
                    // If this is a new chat, assign a proper ID and name
                    if (activeChatIdRef.current === "new-chat") {
                        const newChatId = generateChatId(); // Generate a unique ID
                        const newChatName = generateChatName(`event-${Date.now()}`); // Generate a unique name

                        setChats(prevChats =>
                            prevChats.map(chat =>
                                chat.id === "new-chat"
                                    ? {
                                        ...chat,
                                        id: newChatId,
                                        label: newChatName,
                                        completed: true // Ensure completed is always true
                                    }
                                    : chat
                            )
                        );

                        // Update active chat references
                        setActiveChatId(newChatId);
                        activeChatIdRef.current = newChatId;
                    }

                    try {
                        const res: Response = await fetch("https://n8n.alsoknownas.me/webhook/chat", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                message: "This is Auto Sent Screenshot with DOM Monitoring",
                                screenshot: response?.screenshot || null,
                                history
                            }),
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
                        setChats(prevChats =>
                            prevChats.map(chat =>
                                chat.id === activeChatIdRef.current
                                    ? {
                                        ...chat,
                                        messages: [
                                            ...(chat.messages ?? []), // Ensure messages array exists
                                            { id: `msg-${Date.now()}`, role: "bot", text: textData } // Add a unique ID
                                        ]
                                    }
                                    : chat
                            )
                        );

                    } catch (error: unknown) {
                        console.error("Error fetching bot response:", error); // Log any errors
                        setChats(prevChats =>
                            prevChats.map(chat =>
                                chat.id === activeChatIdRef.current
                                    ? {
                                        ...chat,
                                        messages: [
                                            ...(chat.messages ?? []), // Ensure messages array exists
                                            { id: `msg-${Date.now()}`, role: "bot", text: "Error: Unable to get response from server." }
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
    const SCREENSHOT_DELAY = 3000; // 2 seconds delay

    useEffect(() => {
        let canTakeScreenshot = true; // Prevent multiple screenshots

        const handleMessage = async (message: any) => {
            if (
                message.source === "n8n-injected" &&
                (message.type === "CLICK" || message.type === "URL_CHANGE")
            ) {
                if (isLoading || !canTakeScreenshot || !isToggled) {
                    return; // Ignore if loading, already taking a screenshot, or isToggled is false
                }

                canTakeScreenshot = false; // Block additional screenshots temporarily

                setTimeout(async () => {
                    await sendScreenShot();
                    canTakeScreenshot = true; // Re-enable screenshots
                }, SCREENSHOT_DELAY);
            }
        };

        // ✅ Add the listener when component mounts or isToggled changes
        chrome.runtime.onMessage.addListener(handleMessage);

        // ✅ Clean up the listener when the component unmounts or isToggled changes
        return () => {
            chrome.runtime.onMessage.removeListener(handleMessage);
        };
    }, [isLoading, isToggled]); // ✅ Re-run effect when isToggled changes
    // Reacts to isLoading changes
    //console.log(events, 'events')
    const startNewChat = (): void => {
        const newChat: ChatSession = {
            id: "new-chat", // Generate a unique chat ID
            label: "new-chat",
            messages: [
                {
                    id: "msg-1",
                    role: "bot",
                    text: "What’s your starting point?",
                    options: ["I already have n8n hosted or in cloud", "I don't have setup yet"],
                }
            ],
            completed: false, // This means the user still needs to complete the guided steps
        };

        setChats(prevChats => [...prevChats, newChat]);
        setActiveChatId(newChat.id);
    };
    const handleUserSelection = (chatId: string, selectedOption: string) => {
        if (!activeChat?.completed) {
            setChats(prevChats =>
                prevChats.map(chat => {
                    if (chat.id !== chatId) return chat;

                    const updatedMessages = [...chat.messages];

                    // Add user selection as a message
                    updatedMessages.push({
                        id: `msg-${Date.now()}`,
                        role: "user",
                        text: selectedOption,
                    });

                    // Find the current step in automationSteps
                    const currentStep = automationSteps.find(step =>
                        step.options?.some(opt => opt.text === selectedOption)
                    );

                    // Get the `next` step from the selected option
                    const nextStepId = currentStep?.options?.find(opt => opt.text === selectedOption)?.next;
                    const nextStep = automationSteps.find(step => step.id === nextStepId);

                    if (nextStep) {
                        updatedMessages.push({
                            id: `msg-${Date.now()}`,
                            role: "bot",
                            text: nextStep.message,
                            options: nextStep.options?.map(opt => opt.text), // Show the next options
                        });
                    } else {
                        chat.completed = true; // Mark chat as completed if no next step
                    }

                    return { ...chat, messages: updatedMessages };
                })
            );
        }
    };



    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [activeChat?.messages]);

    // useEffect(() => {
    //     if (!chatSectionLoaded && !activeChatId) {
    //         startNewChat();
    //         setChatSectionLoaded(true)
    //     }
    // }, [])


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
            activeChat?.messages.slice(-20).map(msg => ({ role: msg.role, text: msg.text })) || [];

        try {
            // Start loading
            setIsLoading(true);

            chrome.runtime.sendMessage(
                { type: "CAPTURE_SCREENSHOT" },
                async (response: { screenshot?: string } | undefined) => {
                    // If this is a new chat, assign a proper ID and name
                    if (activeChatIdRef.current === "new-chat") {
                        const newChatId = generateChatId(); // Generate a unique ID
                        const newChatName = generateChatName(`event-${Date.now()}`); // Generate a unique name

                        setChats(prevChats =>
                            prevChats.map(chat =>
                                chat.id === "new-chat"
                                    ? {
                                        ...chat,
                                        id: newChatId,
                                        label: newChatName,
                                        completed: true // Ensure completed is always true
                                    }
                                    : chat
                            )
                        );

                        // Update active chat references
                        setActiveChatId(newChatId);
                        activeChatIdRef.current = newChatId;
                    } else {
                        // Add user message to the active chat
                        setChats(prevChats =>
                            prevChats.map(chat =>
                                chat.id === activeChatIdRef.current
                                    ? {
                                        ...chat,
                                        messages: [
                                            ...(chat.messages ?? []), // Ensure messages array exists
                                            { id: `msg-${Date.now()}`, role: "user", text: message } // Add a unique ID
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
                            body: JSON.stringify({
                                message,
                                screenshot: response?.screenshot || null,
                                history
                            }),
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
                        setChats(prevChats =>
                            prevChats.map(chat =>
                                chat.id === activeChatIdRef.current
                                    ? {
                                        ...chat,
                                        messages: [
                                            ...(chat.messages ?? []), // Ensure messages exist
                                            { id: `msg-${Date.now()}`, role: "bot" as "bot", text: textData } // Explicitly define role as "bot"
                                        ]
                                    }
                                    : chat
                            )
                        );
                    } catch (error: unknown) {
                        console.error("Error fetching bot response:", error); // Log any errors
                        // Add error message to the active chat
                        setChats(prevChats =>
                            prevChats.map(chat =>
                                chat.id === activeChatIdRef.current
                                    ? {
                                        ...chat,
                                        messages: [
                                            ...(chat.messages ?? []), // Ensure messages exist
                                            { id: `msg-${Date.now()}`, role: "bot", text: "Error: Unable to get response from server." } // Add a unique ID
                                        ]
                                    } : chat
                            )
                        )
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
    // const markdownContainerStyle = {
    //     width: '100%',
    //     maxWidth: '600px',
    //     border: '1px solid #ddd',
    //     borderRadius: '5px',
    //     padding: '10px',
    //     overflow: 'hidden'
    // };

    const textStyle = {
        OverflowX: 'auto',
        WhiteSpace: 'pre-wrap',
        WordWrap: 'break-word',
        maxWidth: '100%',
        lineHeight: '1rem'
    };

    const codeStyle = {
        OverflowX: 'auto',
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word' as 'break-word',
        maxWidth: '100%',
        // backgroundColor: '#f5f5f5', // Optional: Better visibility for code blocks
        padding: '4px',
        borderRadius: '4px',
        lineHeight: '1rem'
    };
    const listItemStyle = {
        whiteSpace: 'pre-wrap',
        WordWrap: 'break-word',
        OverflowWrap: 'break-word',
        maxWidth: '100%',
    };
    return (
        <>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    background: "#303030",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.5)",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    minHeight: "40px",
                    color: "white"
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
                        backgroundColor: "black",
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
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#212121")}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "black")}
                    title="Start a new chat"
                >
                    New Chat
                </button>
            </div>
            <div ref={chatContainerRef} style={{ height: "100%", display: "flex", flexDirection: "column", overflowY: "auto" }}>
                {activeChat?.messages?.length ?? 0 > 0 ? (
                    activeChat?.messages.map((msg) => (
                        <div key={msg.id} style={{
                            alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                            backgroundColor: msg.role === "user" ? "black" : "#303030",
                            color: "white",
                            padding: "10px",
                            borderRadius: "10px",
                            maxWidth: "70%",
                            marginBottom: "5px",
                            marginRight: hasScroll ? (msg.role === "user" ? "10px" : "0") : "0"
                        }}>
                            {typeof msg.text === "string" ?
                                <ReactMarkdown
                                    components={{
                                        code: ({ node, ...props }) => (
                                            <code style={codeStyle} {...props} />
                                        ),
                                        pre: ({ node, ...props }) => (
                                            <pre style={codeStyle} {...props} />
                                        ),
                                        p: ({ node, ...props }) => ( // ✅ Apply text wrapping to normal text
                                            <p style={textStyle} {...props} />
                                        ),
                                        span: ({ node, ...props }) => ( // ✅ Ensure inline text doesn't overflow
                                            <span style={textStyle} {...props} />
                                        ),
                                        li: ({ node, ...props }) => ( // ✅ Apply wrapping styles to <li>
                                            <li style={listItemStyle} {...props} />
                                        )
                                    }}
                                >{msg.text}</ReactMarkdown> : msg.text
                            }

                            {/* Render options inside chat bubble */}
                            {msg.options && msg.role === "bot" && (
                                <div style={{ marginTop: "10px" }}>
                                    {msg.options.map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => handleUserSelection(activeChat.id, option)}
                                            disabled={activeChat.completed}
                                            style={{
                                                background: activeChat.completed ? "#ddd" : "white", // Gray out if disabled
                                                color: activeChat.completed ? "#888" : "black", // Dim text color if disabled
                                                padding: "8px",
                                                borderRadius: "5px",
                                                marginTop: "5px",
                                                border: "none",
                                                cursor: activeChat.completed ? "not-allowed" : "pointer", // Show "not-allowed" cursor when disabled
                                                display: "block", // Each button takes a new line
                                                width: "100%", // Optional: Makes buttons full-width
                                                opacity: activeChat.completed ? 0.6 : 1, // Reduce opacity when disabled
                                            }}
                                        >
                                            {option}
                                        </button>

                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                ) : (!isLoading && !activeChatIdRef.current) && (
                    <div>
                        <div style={{ textAlign: "center", marginTop: "20px", color: "white" }}>
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
                border: "2px solid #303030",
                backgroundColor: "#303030",
                borderRadius: "1.5rem",
            }}>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask anything"
                    style={{
                        width: "100%",
                        resize: "none",
                        height: "40px",
                        overflowY: "auto",
                        outline: "none",
                        border: "none",
                        background: "none",
                        color: "white",
                    }}
                />
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "10px"
                }}>
                    <div>
                        <button style={{ background: "none", border: "none", cursor: "pointer", marginRight: "2px", color: "white" }}>
                            <IoImageOutline style={{ width: "24px", height: "24px" }} />
                        </button>
                        <button style={{ background: "none", border: "none", cursor: "pointer", color: "white" }}>
                            <MdOutlineKeyboardVoice style={{ width: "24px", height: "24px" }} />
                        </button>
                    </div>
                    <button onClick={sendMessage} style={{ background: "none", border: "none", cursor: "pointer", color: "white" }}>
                        <LuSendHorizontal style={{ width: "24px", height: "24px" }} />
                    </button>
                </div>
            </div>}
        </>
    );
};

export default ChatSection;
