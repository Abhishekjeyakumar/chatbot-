import { supabase } from "../lib/supabase";

// CREATE CHAT
export async function createChat(userId) {

  const { data, error } =
    await supabase
      .from("chats")
      .insert([
        {
          user_id: userId,
          title: "New Chat",
        },
      ])
      .select();

  if (error) {

    console.error(error);

    throw error;
  }

  return data[0];
}

// GET CHATS
export async function getChats(userId) {

  const { data, error } =
    await supabase
      .from("chats")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", {
        ascending: false,
      });

  if (error) {

    console.error(error);

    throw error;
  }

  return data;
}

// SAVE MESSAGE
export async function saveMessage(
  chatId,
  sender,
  message
) {

  const { data, error } =
    await supabase
      .from("messages")
      .insert([
        {
          chat_id: chatId,
          sender: sender,
          message: message,
        },
      ]);

  if (error) {

    console.error(
      "SAVE MESSAGE ERROR:",
      error
    );

    throw error;
  }

  return data;
}

// GET MESSAGES
export async function getMessages(chatId) {

  const { data, error } =
    await supabase
      .from("messages")
      .select("*")
      .eq("chat_id", chatId)
      .order("created_at", {
        ascending: true,
      });

  if (error) {

    console.error(error);

    throw error;
  }

  return data;
}
// UPDATE CHAT TITLE
export async function updateChatTitle(
  chatId,
  title
) {

  const { error } =
    await supabase
      .from("chats")
      .update({
        title,
      })
      .eq("id", chatId);

  if (error) {
    console.error(error);
  }
}
export async function deleteChat(
  chatId
) {

  await supabase
    .from("messages")
    .delete()
    .eq("chat_id", chatId);

  await supabase
    .from("chats")
    .delete()
    .eq("id", chatId);
}
