import "./Sidebar.css";

import {
  deleteChat,
  updateChatTitle,
} from "../service/chat";

import {
  useState,
} from "react";

export function Sidebar({
  chats,
  activeChat,
  setActiveChat,
  createNewChat,
  logoutUser,
  sidebarOpen,
  setChats,
  user,
}) {

  const [search, setSearch] =
    useState("");

  async function renameChat(chat) {

    const newTitle =
      prompt(
        "Rename chat",
        chat.title
      );

    if (!newTitle) return;

    await updateChatTitle(
      chat.id,
      newTitle
    );

    setChats((prev) =>
      prev.map((c) =>
        c.id === chat.id
          ? {
              ...c,
              title: newTitle,
            }
          : c
      )
    );
  }

  function shareChat(chat) {

    const shareUrl =
      `${window.location.origin}/chat/${chat.id}`;

    navigator.clipboard.writeText(
      shareUrl
    );

    alert("Link copied!");
  }

  return (

    <div
      className={
        sidebarOpen
          ? "sidebar"
          : "sidebar closed"
      }
    >

      {/* TOP */}
<div className="sidebar-top">

        <h2 className="logo">
          AskMe AI
        </h2>

        <button
          className="new-chat-btn"
          onClick={createNewChat}
        >
          + New Chat
        </button>

        {/* SEARCH */}
        <input
          className="search-input"
          placeholder="Search chats..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />

        {/* CHAT LIST */}
        <div className="chat-history">

          {chats
            .filter((chat) =>
              chat.title
                .toLowerCase()
                .includes(
                  search.toLowerCase()
                )
            )
            .map((chat) => (

              <div
  key={chat.id}
  className={
    activeChat === chat.id
      ? "chat-item active-chat"
      : "chat-item"
  }
  onClick={() =>
    setActiveChat(chat.id)
  }
>

  <span className="chat-title">
    {chat.title}
  </span>

  {/* THREE DOT MENU */}
  <div className="chat-menu">

    <button className="menu-dots">
      ⋮
    </button>

    <div className="dropdown-menu">

      <button
        onClick={(e) => {
          e.stopPropagation();
          renameChat(chat);
        }}
      >
        ✏ Rename
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          shareChat(chat);
        }}
      >
        🔗 Share
      </button>

      <button
        className="delete-option"
        onClick={async (e) => {

          e.stopPropagation();

          await deleteChat(chat.id);

          setChats((prev) =>
            prev.filter(
              (c) =>
                c.id !== chat.id
            )
          );
        }}
      >
        🗑 Delete
      </button>

    </div>

  </div>

</div>
            ))}

        </div>

      </div>

      {/* PROFILE */}
      {/* PROFILE */}
<div className="profile-section">

  <div className="profile-card">

    <div className="avatar">
      {user?.email?.[0]?.toUpperCase()}
    </div>

    <div className="profile-info">

      <div className="profile-label">
        Signed in as
      </div>

      <div className="profile-email">
        {user?.email}
      </div>

    </div>

  </div>

  <button
    className="logout-btn"
    onClick={logoutUser}
  >
    Logout
  </button>

</div>

    </div>
  );
}