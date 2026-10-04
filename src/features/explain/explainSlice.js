import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../api/apiClient.js";

function extractErrorMessage(error) {
  const data = error.response?.data;
  if (!data) return "Something went wrong. Please try again.";
  if (data.errors?.length) return data.errors[0].message;
  return data.message || "Something went wrong. Please try again.";
}

export const explainTopic = createAsyncThunk(
  "explain/explainTopic",
  async ({ documentId, topic, level }, { rejectWithValue }) => {
    try {
      const res = await apiClient.post(`/documents/${documentId}/explain`, { topic, level });
      return { documentId, ...res.data }; // { topic, level, explanation, sources }
    } catch (error) {
      return rejectWithValue({ documentId, message: extractErrorMessage(error) });
    }
  }
);

const initialState = {
  // documentId -> { topic, level, explanation, sources, status, error }
  byDocument: {},
};

function getEntry(state, documentId) {
  if (!state.byDocument[documentId]) {
    state.byDocument[documentId] = {
      topic: "",
      level: "beginner",
      explanation: null,
      sources: [],
      status: "idle",
      error: null,
    };
  }
  return state.byDocument[documentId];
}

const explainSlice = createSlice({
  name: "explain",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(explainTopic.pending, (state, action) => {
        const { documentId } = action.meta.arg;
        const entry = getEntry(state, documentId);
        entry.status = "loading";
        entry.error = null;
      })
      .addCase(explainTopic.fulfilled, (state, action) => {
        const { documentId, topic, level, explanation, sources } = action.payload;
        const entry = getEntry(state, documentId);
        entry.status = "succeeded";
        entry.topic = topic;
        entry.level = level;
        entry.explanation = explanation;
        entry.sources = sources;
      })
      .addCase(explainTopic.rejected, (state, action) => {
        const { documentId, message } = action.payload;
        const entry = getEntry(state, documentId);
        entry.status = "failed";
        entry.error = message;
      });
  },
});

export default explainSlice.reducer;