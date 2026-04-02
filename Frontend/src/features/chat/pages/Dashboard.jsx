import { useState, useRef, useEffect } from "react";
import { useChat } from "../hooks/useChat.js";
import MarkdownRenderer from "../components/MarkdownRenderer.jsx";

export default function Dashboard() {
  const useChatHook = useChat();

  const allChats = useChatHook.allChats;
  const allMessages = useChatHook.allMessages;
  const activeChatId = useChatHook.activeChatId;
  const activeChat = allChats.find((chat) => chat._id === activeChatId);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // on Dashboard page only initializeSocketConnection (socket.io), connects frontend & backend with socket.io
  useEffect(() => {
    useChatHook.initializeSocketConnection();
  }, []);

  // handle new Chat
  function handleNewChat() {
    useChatHook.handleNewChat();
  }

  // handle Create New Chat (send message to AI on a New Chat page)
  async function handleSend() {
    if (!input.trim() || isTyping) return;
    const userMessage = input.trim();
    setInput("");

    // if no activeChatId then create new Chat, or create follow up message
    if (!activeChatId) {
      await useChatHook.handleCreateNewChat(userMessage);
    } else {
      await useChatHook.handleSendMessage({
        message: userMessage,
        chatId: activeChatId,
      });
    }
  }

  // fetch all messages of a chat when clicked
  async function handleClick(chatId) {
    await useChatHook.handleGetAllMessages(chatId);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function autoResize(e) {
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 140) + "px";
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [isTyping]);

  return (
    <div
      className="flex h-screen w-screen overflow-hidden"
      style={{
        background: "#0a0a0a",
        fontFamily: "'DM Mono', 'Fira Code', 'Courier New', monospace",
      }}
    >
      {/* Sidebar */}
      <aside
        className="flex flex-col w-56 shrink-0 m-3 mr-0 rounded-2xl overflow-hidden"
        style={{
          background: "#111111",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.04)",
        }}
      >
        {/* Logo / Brand */}
        <div
          className="px-4 py-4 flex items-center gap-2"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
            style={{
              background: "linear-gradient(135deg, #e0e0e0 0%, #888 100%)",
              color: "#0a0a0a",
            }}
          >
            ✦
          </div>
          <span
            className="text-sm font-semibold tracking-widest uppercase"
            style={{ color: "rgba(255,255,255,0.7)", letterSpacing: "0.15em" }}
          >
            Perplexity
          </span>
        </div>

        {/* New Chat button */}
        <div className="px-3 pt-3">
          <button
            onClick={handleNewChat}
            className="w-full text-xs py-2 rounded-xl flex items-center justify-center gap-2 transition-all duration-200"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.5)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.09)";
              e.currentTarget.style.color = "rgba(255,255,255,0.8)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              e.currentTarget.style.color = "rgba(255,255,255,0.5)";
            }}
          >
            <span className="text-base leading-none">+</span>
            <span>New chat</span>
          </button>
        </div>

        {/* Section label */}
        <p
          className="px-4 pt-4 pb-1 text-xs uppercase tracking-widest"
          style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.6rem" }}
        >
          Recent
        </p>

        {/* Chat list */}
        <nav className="flex-1 overflow-y-auto px-2 pb-2 space-y-1 scrollbar-hide">
          {allChats.map((chat) => {
            const isActive = chat._id === activeChatId;
            return (
              <button
                key={chat._id}
                onClick={() => handleClick(chat._id)}
                className="w-full text-left px-3 py-2.5 rounded-xl text-xs transition-all duration-200 truncate"
                style={{
                  background: isActive
                    ? "rgba(255,255,255,0.1)"
                    : "transparent",
                  color: isActive
                    ? "rgba(255,255,255,0.9)"
                    : "rgba(255,255,255,0.4)",
                  border: isActive
                    ? "1px solid rgba(255,255,255,0.12)"
                    : "1px solid transparent",
                  boxShadow: isActive
                    ? "inset 0 0 0 1px rgba(255,255,255,0.04)"
                    : "none",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.65)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "rgba(255,255,255,0.4)";
                  }
                }}
              >
                {chat.title}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div
          className="px-4 py-3 flex items-center gap-2"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs"
            style={{
              background: "rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            U
          </div>
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
            Your Account
          </span>
        </div>
      </aside>

      {/* Main content */}
      <main
        className="flex flex-col flex-1 m-3 rounded-2xl overflow-hidden"
        style={{
          background: "#0f0f0f",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {/* Top bar */}
        <div
          className="flex items-center justify-between px-6 py-3 shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div>
            <p
              className="text-xs uppercase tracking-widest"
              style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.6rem" }}
            >
              Active conversation
            </p>
            <h1
              className="text-sm font-medium mt-0.5"
              style={{ color: "rgba(255,255,255,0.75)" }}
            >
              {activeChat?.title}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: "#4ade80" }}
            />
            <span
              className="text-xs"
              style={{ color: "rgba(255,255,255,0.25)" }}
            >
              online
            </span>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 scrollbar-hide">
          {allMessages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-3 select-none">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                ✦
              </div>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.2)" }}>
                Start a conversation
              </p>
            </div>
          )}

          {allMessages?.map((msg, i) =>
            msg.role === "user" ? (
              /* User bubble — right aligned */
              <div key={i} className="flex justify-end">
                <div
                  className="max-w-sm px-4 py-2.5 rounded-2xl rounded-tr-md text-sm leading-relaxed"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "rgba(255,255,255,0.85)",
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ) : (
              /* AI bubble — left aligned, large */
              <div key={i} className="flex justify-start">
                <div className="flex gap-3 max-w-2xl">
                  <div
                    className="w-7 h-7 rounded-xl shrink-0 mt-0.5 flex items-center justify-center text-xs"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.5)",
                    }}
                  >
                    ✦
                  </div>
                  <div
                    className="px-5 py-4 rounded-2xl rounded-tl-md text-sm leading-loose"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "rgba(255,255,255,0.7)",
                    }}
                  >
                    <MarkdownRenderer content={msg.content} />
                  </div>
                </div>
              </div>
            ),
          )}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-2xl">
                <div
                  className="w-7 h-7 rounded-xl shrink-0 flex items-center justify-center text-xs"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  ✦
                </div>
                <div
                  className="px-5 py-4 rounded-2xl rounded-tl-md flex items-center gap-1.5"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        background: "rgba(255,255,255,0.35)",
                        animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="px-6 pb-5 pt-2 shrink-0">
          <div
            className="flex items-end gap-3 px-4 py-3 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                autoResize(e);
              }}
              onKeyDown={handleKeyDown}
              placeholder="How can I help you today?"
              className="flex-1 bg-transparent resize-none outline-none text-sm leading-relaxed"
              style={{
                color: "rgba(255,255,255,0.75)",
                caretColor: "rgba(255,255,255,0.6)",
                maxHeight: "140px",
                fontFamily: "inherit",
              }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center transition-all duration-200 mb-0.5"
              style={{
                background:
                  input.trim() && !isTyping
                    ? "rgba(255,255,255,0.9)"
                    : "rgba(255,255,255,0.07)",
                color:
                  input.trim() && !isTyping
                    ? "#0a0a0a"
                    : "rgba(255,255,255,0.2)",
                border: "1px solid rgba(255,255,255,0.1)",
                cursor: input.trim() && !isTyping ? "pointer" : "not-allowed",
              }}
              onMouseEnter={(e) => {
                if (input.trim() && !isTyping) {
                  e.currentTarget.style.transform = "scale(1.08)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 19V5M5 12l7-7 7 7"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          <p
            className="text-center text-xs mt-2"
            style={{ color: "rgba(255,255,255,0.15)", fontSize: "0.6rem" }}
          >
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&display=swap');
        
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.35; }
          40% { transform: translateY(-5px); opacity: 0.9; }
        }

        textarea::placeholder {
          color: rgba(255,255,255,0.2);
        }
      `}</style>
    </div>
  );
}
