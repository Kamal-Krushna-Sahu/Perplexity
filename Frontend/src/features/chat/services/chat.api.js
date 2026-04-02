import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

async function createNewChat(message) {
  const response = await api.post("/api/chats", { message });
  return response.data;
}

async function sendMessage({ message, chatId }) {
  const response = await api.post(`/api/chats/${chatId}/messages`, {
    message,
    chatId,
  });
  return response.data;
}

async function getAllChats() {
  const response = await api.get("/api/chats");
  return response.data;
}

async function getAllMessages(chatId) {
  const response = await api.get(`/api/chats/${chatId}/messages`);
  return response.data;
}

async function deleteChat(chatId) {
  const response = await api.delete(`/api/chats/delete/${chatId}`);
  return response.data;
}

export { createNewChat, sendMessage, getAllChats, getAllMessages, deleteChat };
