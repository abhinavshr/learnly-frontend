import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice.js";
import documentsReducer from "./features/documents/documentsSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    documents: documentsReducer,
  },
});