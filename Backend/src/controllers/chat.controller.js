import { generateChatTitle, generateResponse } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";

export async function createNewChat(req, res) {
  const { message } = req.body;

  const chatTitle = await generateChatTitle(message);

  const newChat = await chatModel.create({
    user: req.user.id,
    title: chatTitle,
  });

  res.status(201).json({
    message: "New Chat created successfully",
    chatId: newChat._id,
  });
}

export async function sendMessage(req, res) {
  const { message, chatId } = req.body;

  // let chatTitle = null,
  //   newChat = null;

  // if no chatId is given, then only create title & new chat
  // if (!chatId) {
  //   chatTitle = await generateChatTitle(message);

  //   newChat = await chatModel.create({
  //     user: req.user.id,
  //     title: chatTitle,
  //   });
  // }

  // in a follow up message, check if the chat exists with the chatId & requesting user
  if (chatId) {
    const isChatExist = await chatModel.findOne({
      _id: chatId,
      user: req.user.id,
    });

    if (!isChatExist) {
      return res.status(404).json({
        message: "Chat not Found",
        success: false,
      });
    }
  }

  const userMessage = await messageModel.create({
    // chat: chatId || newChat._id,
    chat: chatId,
    content: message,
    role: "user",
  });

  const allMessages = await messageModel.find({
    // chat: chatId || newChat._id,
    chat: chatId,
    // chat: { $in: [chatId, newChat?._id] }, // read about $in operator
  });

  const aiResponse = await generateResponse(allMessages);

  const aiMessage = await messageModel.create({
    // chat: chatId || newChat._id,
    chat: chatId,
    content: aiResponse,
    role: "ai",
  });

  res.status(201).json({
    message: "Response generated successfully",
    aiMessage,
  });
}

export async function getAllChats(req, res) {
  const user = req.user;

  const chats = await chatModel.find({ user: user.id });

  res.status(200).json({
    message: "All chats fetched successfully",
    chats,
  });
}

export async function getAllMessages(req, res) {
  const user = req.user;
  const { chatId } = req.params;

  // Verify that the requested messages belong to the requesting user
  const chat = await chatModel.findOne({
    _id: chatId,
    user: user.id,
  });

  if (!chat) {
    return res.status(404).json({
      message: "Chat not found",
    });
  }

  const messages = await messageModel.find({
    chat: chatId,
  });

  res.status(200).json({
    message: "Messages fetched successfully",
    messages,
  });
}

export async function deleteChat(req, res) {
  const { chatId } = req.params;

  // Make sure only the owner can delete a chat
  const chat = await chatModel.findOneAndDelete({
    _id: chatId,
    user: req.user.id,
  });

  if (!chat) {
    return res.status(404).json({
      message: "Chat not found",
    });
  }

  await messageModel.deleteMany({
    chat: chatId,
  });

  res.status(200).json({
    message: "chat deleted successfully",
  });
}
