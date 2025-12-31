import React, { useState, useEffect, useRef } from "react";
import "../styles/chatbot.css";

const INITIAL_SUGGESTIONS = [
  "What is ShowBoat Hub?",
  "What services do you offer?",
  "What types of events do you handle?",
  "Contact us"
];

export default function ChatWidget() {
  const [messages, setMessages] = useState([
    {
      from: "bot",
      type: "text",
      text: "👋 Hi — welcome to ShowBoat Hub!\nWe create unforgettable brand experiences and large-scale events.\nHow can I help you today?"
    },
    {
      from: "bot",
      type: "buttons",
      buttons: INITIAL_SUGGESTIONS
    }
  ]);

  const [input, setInput] = useState("");

  // 🔑 AUTO-SCROLL REF
  const messagesEndRef = useRef(null);

  // 🔑 AUTO-SCROLL EFFECT
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages]);

  /* ---------------------------------
     Send Message
  ---------------------------------- */
  const sendMessage = async (text) => {
    if (!text.trim()) return;

    // Add user message
    setMessages((prev) => [
      ...prev,
      { from: "user", type: "text", text }
    ]);

    setInput("");

    try {
      const res = await fetch("/.netlify/functions/dialogflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { from: "bot", type: "text", text: data.reply }
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          type: "text",
          text: "⚠️ Something went wrong. Please try again."
        }
      ]);
    }
  };

  return (
    <div className="chat-widget">
      {/* HEADER */}
      <div className="chat-header">
        <div className="chat-title">
          <div className="name">Showboat Assistant</div>
        </div>
      </div>

      {/* BODY (SINGLE SCROLL AREA) */}
      <div className="chat-body">
        {messages.map((msg, i) => {
          if (msg.type === "text") {
            return (
              <div key={i} className={`bubble ${msg.from}`}>
                {msg.text}
              </div>
            );
          }

          if (msg.type === "buttons") {
            return (
              <div key={i} className="quick-buttons">
                {msg.buttons.map((b, idx) => (
                  <button key={idx} onClick={() => sendMessage(b)}>
                    {b}
                  </button>
                ))}
              </div>
            );
          }

          return null;
        })}

        {/* 👇 AUTO-SCROLL ANCHOR (DO NOT REMOVE) */}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div className="chat-input">
        <input
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
        />
        <button onClick={() => sendMessage(input)}>Send</button>
      </div>
    </div>
  );
}
