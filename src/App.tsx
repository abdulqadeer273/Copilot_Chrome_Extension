import React, { useState, JSX, useEffect } from "react";;
import { MdChatBubbleOutline, MdOutlineHistory, MdPersonOutline } from "react-icons/md";
import { TfiHeadphoneAlt } from "react-icons/tfi";
import { Component } from "./components/Base/Base";
import EnableMonitoring from "./components/EnableMonitoring/EnableMonitoring";
const tabs = [
  {
    id: "Tab1",
    name: "chat",
    icon: <MdChatBubbleOutline fontSize={30} />,
  },
  {
    id: "Tab2",
    name: "history",
    icon: <MdOutlineHistory fontSize={30} />,
  },
  , {
    id: "Tab3",
    name: "support",
    icon: <TfiHeadphoneAlt fontSize={25} />,
  },
  {
    id: "Tab4",
    name: "profile",
    icon: <MdPersonOutline fontSize={30} />,
  }
]
type Message = {
  role: "user" | "bot";
  text: string | JSX.Element;
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

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ComponentProps["activeTab"]>("Tab1");
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isToggled, setIsToggled] = useState(false);

  useEffect(() => {
    const savedChats = localStorage.getItem("chats");
    const savedActiveChatId = localStorage.getItem("activeChatId");

    if (savedChats) {
      const parsedChats = JSON.parse(savedChats);
      // Ensure no temporary chats are loaded
      setChats(parsedChats.filter((chat: ChatSession) => chat.id !== "new-chat"));
    }

    if (savedActiveChatId) {
      setActiveChatId(savedActiveChatId);
    }
  }, []);

  useEffect(() => {
    // Filter out temporary chats (e.g., "new-chat") before saving to localStorage
    const validChats = chats.filter(chat => chat.id !== "new-chat");
    localStorage.setItem("chats", JSON.stringify(validChats));
  }, [chats]);

  // Save active chat ID to local storage whenever it changes
  useEffect(() => {
    if (activeChatId) {
      localStorage.setItem("activeChatId", activeChatId);
    }
  }, [activeChatId]);
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "97vh",
      width: "100%",
      overflowY: "hidden",
      borderRadius: "1rem",
      border: "2px solid",
      background: "turquoise"
    }}>
      {/* Copilot Header */}
      <div style={{ display: "flex", borderTopLeftRadius: "14px", borderTopRightRadius: "14px" }}>
        {tabs.map(elem => (
          <div key={elem?.id} style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "2px solid black",
            borderRight: "none",
            borderTop: "none",
            borderLeft: elem?.name === "chat" ? "none" : "2px solid black",
            minHeight: 60,
            background: activeTab === elem?.id ? "turquoise" : "white",
            cursor: "pointer"
          }}
            onClick={() => setActiveTab((elem?.id as ComponentProps["activeTab"]) || "Tab1")}
          >
            {elem?.icon}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid black", padding: "5px" }}>
        <h4>Get Continuous Suggestions</h4>
        <EnableMonitoring isToggled={isToggled} setIsToggled={setIsToggled} />
      </div>
      {/* Body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "10px", display: "flex", flexDirection: "column", gap: "10px", }}>
        <Component
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeChatId={activeChatId}
          setActiveChatId={setActiveChatId}
          chats={chats}
          setChats={setChats}
          isToggled={isToggled}
          setIsToggled={setIsToggled}
        />
      </div>

    </div>
  );
};

export default App;
