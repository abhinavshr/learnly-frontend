import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice.js";
import documentsReducer from "./features/documents/documentsSlice.js";
import qaReducer from "./features/qa/qaSlice.js";
import explainReducer from "./features/explain/explainSlice.js";
import summaryReducer from "./features/summary/summarySlice.js";
import quizReducer from "./features/quiz/quizSlice.js";
import attemptReducer from "./features/attempt/attemptSlice.js";
import analyticsReducer from "./features/analytics/analyticsSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    documents: documentsReducer,
    qa: qaReducer,
    explain: explainReducer,
    summary: summaryReducer,
    quiz: quizReducer,
    attempt: attemptReducer,
    analytics: analyticsReducer,
  },
});