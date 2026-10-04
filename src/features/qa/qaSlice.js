import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../api/apiClient.js";

function extractErrorMessage(error) {
  const data = error.response?.data;
  if (!data) return "Something went wrong. Please try again.";
  if (data.errors?.length) return data.errors[0].message;
  return data.message || "Something went wrong. Please try again.";
}

export const askQuestion = createAsyncThunk(
  "qa/askQuestion",
  async ({ documentId, question }, { rejectWithValue }) => {
    try {
      const res = await apiClient.post(`/documents/${documentId}/ask`, { question });
      return { documentId, question, ...res.data }; // { answer, sources }
    } catch (error) {
      return rejectWithValue({ documentId, message: extractErrorMessage(error) });
    }
  }
);

const initialState = {
  // documentId -> { messages: [{ role, text, sources? }], status, error }
  byDocument: {},
};

function getThread(state, documentId) {
  if (!state.byDocument[documentId]) {
    state.byDocument[documentId] = { messages: [], status: "idle", error: null };
  }
  return state.byDocument[documentId];
}

const qaSlice = createSlice({
  name: "qa",
  initialState,
  reducers: {
    clearThread(state, action) {
      delete state.byDocument[action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(askQuestion.pending, (state, action) => {
        const { documentId, question } = action.meta.arg;
        const thread = getThread(state, documentId);
        thread.messages.push({ role: "user", text: question });
        thread.status = "loading";
        thread.error = null;
      })
      .addCase(askQuestion.fulfilled, (state, action) => {
        const { documentId, answer, sources } = action.payload;
        const thread = getThread(state, documentId);
        thread.messages.push({ role: "assistant", text: answer, sources });
        thread.status = "succeeded";
      })
      .addCase(askQuestion.rejected, (state, action) => {
        const { documentId, message } = action.payload;
        const thread = getThread(state, documentId);
        thread.status = "failed";
        thread.error = message;
      });
  },
});

export const { clearThread } = qaSlice.actions;
export default qaSlice.reducer;