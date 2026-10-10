import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../api/apiClient.js";

function extractErrorMessage(error) {
  const data = error.response?.data;
  if (!data) return "Something went wrong. Please try again.";
  if (data.errors?.length) return data.errors[0].message;
  return data.message || "Something went wrong. Please try again.";
}

export const fetchQuizzesForDocument = createAsyncThunk(
  "quiz/fetchQuizzesForDocument",
  async (documentId, { rejectWithValue }) => {
    try {
      const res = await apiClient.get("/quizzes", { params: { documentId } });
      return { documentId, quizzes: res.data.quizzes };
    } catch (error) {
      return rejectWithValue({ documentId, message: extractErrorMessage(error) });
    }
  }
);

export const generateQuiz = createAsyncThunk(
  "quiz/generateQuiz",
  async ({ documentId, count, difficulty, topic }, { rejectWithValue }) => {
    try {
      const res = await apiClient.post(`/documents/${documentId}/quiz`, { count, difficulty, topic });
      return { documentId, quiz: res.data.quiz };
    } catch (error) {
      return rejectWithValue({ documentId, message: extractErrorMessage(error) });
    }
  }
);

export const generateWeakTopicQuiz = createAsyncThunk(
  "quiz/generateWeakTopicQuiz",
  async ({ documentId, count, difficulty, maxTopics }, { rejectWithValue }) => {
    try {
      const res = await apiClient.post(`/documents/${documentId}/quiz/weak`, { count, difficulty, maxTopics });
      return { documentId, quiz: res.data.quiz, weakTopics: res.data.weakTopics };
    } catch (error) {
      return rejectWithValue({ documentId, message: extractErrorMessage(error) });
    }
  }
);

const initialState = {
  // documentId -> { quizzes: [], listStatus, listError, generateStatus, generateError }
  byDocument: {},
};

function getEntry(state, documentId) {
  if (!state.byDocument[documentId]) {
    state.byDocument[documentId] = {
      quizzes: [],
      listStatus: "idle",
      listError: null,
      generateStatus: "idle",
      generateError: null,
    };
  }
  return state.byDocument[documentId];
}

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    clearGenerateError(state, action) {
      const entry = getEntry(state, action.payload);
      entry.generateError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizzesForDocument.pending, (state, action) => {
        const entry = getEntry(state, action.meta.arg);
        entry.listStatus = "loading";
        entry.listError = null;
      })
      .addCase(fetchQuizzesForDocument.fulfilled, (state, action) => {
        const { documentId, quizzes } = action.payload;
        const entry = getEntry(state, documentId);
        entry.listStatus = "succeeded";
        entry.quizzes = quizzes;
      })
      .addCase(fetchQuizzesForDocument.rejected, (state, action) => {
        const { documentId, message } = action.payload;
        const entry = getEntry(state, documentId);
        entry.listStatus = "failed";
        entry.listError = message;
      })

      .addCase(generateQuiz.pending, (state, action) => {
        const entry = getEntry(state, action.meta.arg.documentId);
        entry.generateStatus = "loading";
        entry.generateError = null;
      })
      .addCase(generateQuiz.fulfilled, (state, action) => {
        const { documentId, quiz } = action.payload;
        const entry = getEntry(state, documentId);
        entry.generateStatus = "succeeded";
        entry.quizzes.unshift({ ...quiz, questionCount: undefined, createdAt: new Date().toISOString() });
      })
      .addCase(generateQuiz.rejected, (state, action) => {
        const { documentId, message } = action.payload;
        const entry = getEntry(state, documentId);
        entry.generateStatus = "failed";
        entry.generateError = message;
      })

      .addCase(generateWeakTopicQuiz.pending, (state, action) => {
        const entry = getEntry(state, action.meta.arg.documentId);
        entry.generateStatus = "loading";
        entry.generateError = null;
      })
      .addCase(generateWeakTopicQuiz.fulfilled, (state, action) => {
        const { documentId, quiz } = action.payload;
        const entry = getEntry(state, documentId);
        entry.generateStatus = "succeeded";
        entry.quizzes.unshift({ ...quiz, questionCount: undefined, createdAt: new Date().toISOString() });
      })
      .addCase(generateWeakTopicQuiz.rejected, (state, action) => {
        const { documentId, message } = action.payload;
        const entry = getEntry(state, documentId);
        entry.generateStatus = "failed";
        entry.generateError = message;
      });
  },
});

export const { clearGenerateError } = quizSlice.actions;
export default quizSlice.reducer;