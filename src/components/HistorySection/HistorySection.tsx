import { JSX } from "react";
import { FaTrash } from "react-icons/fa"; // Importing the trash icon from react-icons

interface ChatSession {
    id: string;
    label: string;
    messages: Array<{ role: "user" | "bot"; text: string | JSX.Element }>;
}

interface ComponentProps {
    activeTab: "Tab1" | "Tab2" | "Tab3" | "Tab4";
    activeChatId: string | null;
    chats: ChatSession[];
    setChats: React.Dispatch<React.SetStateAction<ChatSession[]>>;
    setActiveChatId: React.Dispatch<React.SetStateAction<string | null>>;
    setActiveTab: React.Dispatch<React.SetStateAction<"Tab1" | "Tab2" | "Tab3" | "Tab4">>;
    [key: string]: any;
}

const HistorySection: React.FC<ComponentProps> = ({
    activeChatId,
    chats,
    setChats,
    setActiveChatId,
    setActiveTab,
}) => {
    // Function to handle chat selection
    const handleChatSelect = (chatId: string) => {
        setActiveChatId(chatId);
        setActiveTab("Tab1");
    };

    // Function to handle chat deletion
    const handleDeleteChat = (chatId: string) => {
        const updatedChats = chats.filter((chat) => chat.id !== chatId);
        setChats(updatedChats);

        // If the deleted chat was the active chat, reset the active chat ID
        if (activeChatId === chatId) {
            setActiveChatId(null);
        }
    };

    return (
        <div style={{ padding: "10px", fontWeight: "700", height: "100%" }}>
            <h3 style={{ marginBottom: "16px", color: "#167477" }}>Chat History</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
                {chats.map((chat) => (
                    <li
                        key={chat.id}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "8px 12px",
                            marginBottom: "5px",
                            borderRadius: "8px",
                            backgroundColor: chat.id === activeChatId ? "#e0f7fa" : "#f5f5f5",
                            cursor: "pointer",
                            transition: "background-color 0.2s ease",
                        }}
                        onClick={() => handleChatSelect(chat.id)}
                    >
                        <span
                            style={{
                                fontWeight: chat.id === activeChatId ? "bold" : "normal",
                                color: chat.id === activeChatId ? "#167477" : "#333",
                            }}
                        >
                            {chat.label || `Chat ${chat.id}`}
                        </span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent the chat selection from triggering
                                handleDeleteChat(chat.id);
                            }}
                            style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "#ff4444",
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <FaTrash color="#1e7387" />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default HistorySection;