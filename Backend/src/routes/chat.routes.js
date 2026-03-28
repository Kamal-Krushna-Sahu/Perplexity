import { Router } from "express";
import authUser from "../middlewares/auth.middleware.js";
import {
  deleteChat,
  getAllChats,
  getAllMessages,
  sendMessage,
} from "../controllers/chat.controller.js";

const chatRouter = Router();

chatRouter.post("/message", authUser, sendMessage);

chatRouter.get("/", authUser, getAllChats);

chatRouter.get("/:chatId/messages", authUser, getAllMessages);

chatRouter.delete("/delete/:chatId", authUser, deleteChat);

export default chatRouter;
