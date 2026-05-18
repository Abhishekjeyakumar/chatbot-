import { useState } from "react";
import dayjs from "dayjs";

import "./ChatInput.css";

import { FaPaperPlane, FaImage, FaMicrophone } from "react-icons/fa";

import { getGroqResponse } from "../service/groq";

import { saveMessage, updateChatTitle } from "../service/chat";
export function ChatInput({
  chatMessages,
  setChatMessages,
  activeChat,
  chats,
  setChats,
}) {
  const [inputText, setInputText] = useState("");

  const [loading, setLoading] = useState(false);

  // VOICE INPUT
  function startVoiceInput() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported");

      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;

      setInputText(transcript);
    };
  }

  // IMAGE UPLOAD
  async function handleImageUpload(event) {
    const file = event.target.files[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    const imageMessage = {
      message: imageUrl,

      sender: "user",

      id: crypto.randomUUID(),

      time: dayjs().format("hh:mm A"),

      type: "image",
    };

    const updatedMessages = [...chatMessages, imageMessage];

    setChatMessages(updatedMessages);

    // SAVE IMAGE MESSAGE
    await saveMessage(
      activeChat,
      "user",
      JSON.stringify({
        type: "image",
        url: imageUrl,
      }),
    );
  }

  // SEND MESSAGE
  async function sendMessage() {
    if (!inputText.trim() || loading) return;

    setLoading(true);

    try {
      const currentTime = dayjs().format("hh:mm A");

      // USER MESSAGE
      const userMessage = {
        message: inputText,

        sender: "user",

        id: crypto.randomUUID(),

        time: currentTime,

        type: "text",
      };

      const updatedMessages = [...chatMessages, userMessage];

      setChatMessages(updatedMessages);

      // SAVE USER MESSAGE
      await saveMessage(
        activeChat,
        "user",
        JSON.stringify({
          type: "text",
          text: inputText,
        }),
      );

      // AUTO CHAT TITLE
      if (chatMessages.length === 0) {
        const newTitle = inputText.slice(0, 30);

        await updateChatTitle(activeChat, newTitle);

        setChats(
          chats.map((chat) =>
            chat.id === activeChat
              ? {
                  ...chat,
                  title: newTitle,
                }
              : chat,
          ),
        );
      }

      const userInput = inputText;

      setInputText("");

      // AI RESPONSE
      const response = await getGroqResponse(userInput, updatedMessages);
      const botId = crypto.randomUUID();

      setChatMessages([
        ...updatedMessages,
        {
          message: "",
          sender: "robot",
          id: botId,
          time: dayjs().format("hh:mm A"),
          type: "text",
        },
      ]);

      let currentText = "";

      for (let i = 0; i < response.length; i += 3) {
        currentText += response.slice(i, i + 3);

        await new Promise((resolve) => setTimeout(resolve, 5));

        setChatMessages((prev) =>
          prev.map((msg) =>
            msg.id === botId
              ? {
                  ...msg,
                  message: currentText,
                }
              : msg,
          ),
        );
      }

      // SAVE BOT MESSAGE
      await saveMessage(
        activeChat,
        "robot",
        JSON.stringify({
          type: "text",
          text: response,
        }),
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      sendMessage();
    }
  }

  return (
    <div className="chat-input-container">
      {/* IMAGE */}
      <label className="icon-btn">
        <FaImage />

        <input
          type="file"
          hidden
          accept="image/*"
          onChange={handleImageUpload}
        />
      </label>

      {/* INPUT */}
      <input
        className="chat-input"
        placeholder="Ask anything..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      {/* MIC */}
      <button className="icon-btn" onClick={startVoiceInput}>
        <FaMicrophone />
      </button>

      {/* SEND */}
      <button className="send-button" onClick={sendMessage} disabled={loading}>
        {loading ? "..." : <FaPaperPlane />}
      </button>
    </div>
  );
}
