import { Router } from "express";
import authUser from "../middlewares/auth.middleware.js";
import {
  createNewChat,
  deleteChat,
  getAllChats,
  getAllMessages,
  sendMessage,
} from "../controllers/chat.controller.js";

const chatRouter = Router();

// chatRouter.post("/message", authUser, sendMessage);

chatRouter.post("/", authUser, createNewChat);
chatRouter.get("/", authUser, getAllChats);

chatRouter.post("/:chatId/messages", authUser, sendMessage);
chatRouter.get("/:chatId/messages", authUser, getAllMessages);

chatRouter.delete("/delete/:chatId", authUser, deleteChat);

export default chatRouter;
