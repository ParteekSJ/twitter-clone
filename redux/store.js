import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "@redux/features/modalSlice";
import postReducer from "@redux/features/postSlice";

export default configureStore({
  reducer: {
    modal: modalReducer,
    post: postReducer,
  },
});
