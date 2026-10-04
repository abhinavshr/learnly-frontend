import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice.js";
import documentsReducer from "./features/documents/documentsSlice.js";
import qaReducer from "./features/qa/qaSlice.js";
import explainReducer from "./features/explain/explainSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    documents: documentsReducer,
    qa: qaReducer,
    explain: explainReducer,
  },
});