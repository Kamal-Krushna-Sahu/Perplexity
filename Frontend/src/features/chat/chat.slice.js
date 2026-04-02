import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chats: [],
  activeChatId: null,
  messages: [],
  loading: false,
  error: null,
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChats: (state, action) => {
      state.chats = action.payload;
    },
    setActiveChatId: (state, action) => {
      state.activeChatId = action.payload;
    },
    addNewMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setChats,
  setActiveChatId,
  addNewMessage,
  setMessages,
  setLoading,
} = chatSlice.actions;
export default chatSlice.reducer;
