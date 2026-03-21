import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "../features/chat/chat.slice.js";

export const store = configureStore({
  reducer: {
    chat: chatReducer,
  },
});
