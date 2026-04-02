import { initializeSocketConnection } from "../services/chat.socket";
import {
  createNewChat,
  sendMessage,
  getAllChats,
  getAllMessages,
  deleteChat,
} from "../services/chat.api.js";
import {
  setChats,
  setActiveChatId,
  addNewMessage,
  setMessages,
  setLoading,
} from "../chat.slice.js";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

export const useChat = () => {
  const dispatch = useDispatch();

  const allChats = useSelector((state) => state.chat.chats);
  const activeChatId = useSelector((state) => state.chat.activeChatId);
  const allMessages = useSelector((state) => state.chat.messages);
  const loading = useSelector((state) => state.chat.loading);

  function handleNewChat() {
    dispatch(setLoading(true));
    dispatch(setMessages([]));
    dispatch(setActiveChatId(null));
    dispatch(setLoading(false));
  }

  async function handleCreateNewChat(message) {
    dispatch(setLoading(true));
    const response = await createNewChat(message);
    await handleSendMessage({
      message,
      chatId: response.chatId,
    });
    dispatch(setLoading(false));
  }

  async function handleSendMessage({ message, chatId }) {
    dispatch(setLoading(true));
    dispatch(addNewMessage({ content: message, role: "user" }));
    dispatch(setActiveChatId(chatId));
    const response = await sendMessage({ message, chatId });
    dispatch(
      addNewMessage({ content: response?.aiMessage?.content, role: "ai" }),
    );
    dispatch(setLoading(false));
  }

  async function handleGetAllChats() {
    dispatch(setLoading(true));
    const response = await getAllChats();
    dispatch(setChats(response.chats));
    dispatch(setLoading(false));
    return response.chats;
  }

  async function handleGetAllMessages(chatId) {
    dispatch(setLoading(true));
    const response = await getAllMessages(chatId);
    dispatch(setMessages(response.messages));
    dispatch(setActiveChatId(chatId));
    dispatch(setLoading(false));
  }

  async function handleDeleteChat(chatId) {
    dispatch(setLoading(true));
    const response = await deleteChat(chatId);
    dispatch(setMessages(response));
    dispatch(setLoading(false));
  }

  useEffect(() => {
    handleGetAllChats();
  }, [activeChatId]);

  return {
    initializeSocketConnection,
    handleSendMessage,
    handleGetAllChats,
    handleGetAllMessages,
    handleDeleteChat,
    handleNewChat,
    handleCreateNewChat,
    allChats,
    activeChatId,
    allMessages,
    loading,
  };
};
