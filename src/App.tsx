import React, { useState } from "react";;
import { MdChatBubbleOutline, MdOutlineHistory, MdPersonOutline } from "react-icons/md";
import { TfiHeadphoneAlt } from "react-icons/tfi";
import { Component } from "./components/Base/Base";
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
interface ComponentProps {
  activeTab: 'Tab1' | 'Tab2' | 'Tab3' | 'Tab4';
  [key: string]: any;
}
const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ComponentProps["activeTab"]>("Tab1");
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
      {/* Header */}
      {/* <div style={{
        backgroundColor: "#007bff",
        color: "white",
        padding: "10px",
        textAlign: "center",
        fontWeight: "bold",
        borderTopLeftRadius: "14px", borderTopRightRadius: "14px"
      }}>
        n8n Copilot
      </div> */}
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
      {/* Body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "10px", display: "flex", flexDirection: "column", gap: "10px", }}>
        <Component  {...{ activeTab, setActiveTab }} />
      </div>

    </div>
  );
};

export default App;
