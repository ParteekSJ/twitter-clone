import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: "post",
  initialState: {
    postId: "",
  },
  reducers: {
    setId: (state, action) => {
      state.postId = action.payload;
    },
  },
});
export const { setId } = postSlice.actions;
export default postSlice.reducer;
