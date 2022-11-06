import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chatId: "",
  user: {},
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    changeChat: (state, action) => {
      state.user = action.payload.user;
      state.chatId = action.payload.chatId;
    },
  },
});

// Action creators are generated for each case reducer function
export const { changeChat } = chatSlice.actions;

export default chatSlice.reducer;
