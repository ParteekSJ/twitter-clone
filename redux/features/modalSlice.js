import { createSlice } from "@reduxjs/toolkit";

const modalSlice = createSlice({
  name: "modal",
  initialState: {
    isModalOpen: false,
  },
  reducers: {
    open: (state) => {
      state.isModalOpen = true;
    },
    close: (state) => {
      state.isModalOpen = false;
    },
  },
});

export const { open, close } = modalSlice.actions;
export default modalSlice.reducer;
