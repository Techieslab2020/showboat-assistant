import React from "react";
import "../styles/chatbot.css";

export default function ChatHeader() {
  return (
    <div className="chat-header">
      <div className="chat-header-left">
        <div className="chat-title">
          <div className="name">Showboat Assistant</div>
          <div className="status">Online</div>
        </div>
      </div>
    </div>
  );
}
