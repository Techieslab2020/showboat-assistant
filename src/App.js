import { useState } from "react";
import ChatWidget from "./components/ChatWidget";
import "./styles/chatbot.css";

function App() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating launcher */}
      <div className="chat-launcher" onClick={() => setOpen(!open)}>
        <img src="/logo.png" alt="Chatbot" />
      </div>

      {open && <ChatWidget />}
    </>
  );
}

export default App;
