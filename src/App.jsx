import { useState, useEffect } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);
import "./App.css";

import { supabase } from "./lib/supabase";

import AuthPage from "./pages/AuthPage";

import { Sidebar } from "./components/Sidebar";

import { Navbar } from "./components/Navbar";

import ChatMessages from "./components/ChatMessages";

import { ChatInput } from "./components/ChatInput";

import { createChat, getChats, getMessages } from "./service/chat";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [user, setUser] = useState(null);

  const [theme, setTheme] = useState("dark");

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [chats, setChats] = useState([]);

  const [activeChat, setActiveChat] = useState(null);

  const [chatMessages, setChatMessages] = useState([]);

  // SESSION
  useEffect(() => {
    async function checkUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setIsAuthenticated(true);

        setUser(session.user);

        loadChats(session.user.id);
      }
    }

    checkUser();
  }, []);

  // LOAD CHATS
  async function loadChats(userId) {
    const data = await getChats(userId);

    setChats(data);

    if (data.length > 0) {
      const firstChatId = data[0].id;

      setActiveChat(firstChatId);

      await loadMessages(firstChatId);
    }
  }

  // LOAD MESSAGES
  async function loadMessages(chatId) {
    const data = await getMessages(chatId);

    console.log(data);

    const formatted = data.map((msg) => {
      let parsedMessage;

      try {
        parsedMessage = JSON.parse(msg.message);
      } catch {
        parsedMessage = {
          type: "text",
          text: msg.message,
        };
      }

      return {
        message:
          parsedMessage.type === "image"
            ? parsedMessage.url
            : parsedMessage.text,

        sender: msg.sender,

        id: msg.id,

        time: msg.created_at
          ? dayjs.utc(msg.created_at).local().format("hh:mm A")
          : dayjs().format("hh:mm A"),

        type: parsedMessage.type || "text",
      };
    });

    setChatMessages(formatted);
  }

  // CREATE CHAT
  async function createNewChat() {
    const newChat = await createChat(user.id);

    setChats([newChat, ...chats]);

    setActiveChat(newChat.id);

    setChatMessages([]);
  }

  // LOGOUT
  async function logoutUser() {
    await supabase.auth.signOut();

    setIsAuthenticated(false);

    setUser(null);
  }

  // LOGIN PAGE
  if (!isAuthenticated) {
    return <AuthPage setIsAuthenticated={setIsAuthenticated} />;
  }

  // CHAT APP
  return (
    <div className={`app-layout ${theme === "light" ? "light-theme" : ""}`}>
     <Sidebar
  chats={chats}
  setChats={setChats}
  activeChat={activeChat}
  setActiveChat={(id) => {

    setActiveChat(id);

    loadMessages(id);
  }}
  createNewChat={createNewChat}
  logoutUser={logoutUser}
  sidebarOpen={sidebarOpen}
  setSidebarOpen={setSidebarOpen}
  user={user}
/>

      <div className="chat-section">
        <Navbar
          theme={theme}
          setTheme={setTheme}
          setSidebarOpen={setSidebarOpen}
        />
        <ChatMessages chatMessages={chatMessages} />

        <ChatInput
          chatMessages={chatMessages}
          setChatMessages={setChatMessages}
          activeChat={activeChat}
          chats={chats}
          setChats={setChats}
        />
      </div>
    </div>
  );
}

export default App;
