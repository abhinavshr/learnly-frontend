import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../api/apiClient.js";

function extractErrorMessage(error) {
  const data = error.response?.data;
  if (!data) return "Something went wrong. Please try again.";
  if (data.errors?.length) return data.errors[0].message;
  return data.message || "Something went wrong. Please try again.";
}

function cacheKey(documentId, length) {
  return `${documentId}:${length}`;
}

// Tries the cheap GET first (no AI call). If nothing is saved yet, generates one.
export const loadSummary = createAsyncThunk(
  "summary/loadSummary",
  async ({ documentId, length }, { rejectWithValue }) => {
    const key = cacheKey(documentId, length);
    try {
      const res = await apiClient.get(`/documents/${documentId}/summary`, { params: { length } });
      return { key, ...res.data.summary };
    } catch (error) {
      if (error.response?.status === 404) {
        try {
          const genRes = await apiClient.post(`/documents/${documentId}/summary`, { length });
          return { key, ...genRes.data.summary };
        } catch (genError) {
          return rejectWithValue({ key, message: extractErrorMessage(genError) });
        }
      }
      return rejectWithValue({ key, message: extractErrorMessage(error) });
    }
  }
);

export const regenerateSummary = createAsyncThunk(
  "summary/regenerateSummary",
  async ({ documentId, length }, { rejectWithValue }) => {
    const key = cacheKey(documentId, length);
    try {
      const res = await apiClient.post(`/documents/${documentId}/summary`, { length, refresh: true });
      return { key, ...res.data.summary };
    } catch (error) {
      return rejectWithValue({ key, message: extractErrorMessage(error) });
    }
  }
);

const initialState = {
  // "documentId:length" -> { content, cached, createdAt, status, error }
  byKey: {},
};

function getEntry(state, key) {
  if (!state.byKey[key]) {
    state.byKey[key] = { content: null, cached: false, createdAt: null, status: "idle", error: null };
  }
  return state.byKey[key];
}

const summarySlice = createSlice({
  name: "summary",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(loadSummary.pending, (state, action) => {
        const key = cacheKey(action.meta.arg.documentId, action.meta.arg.length);
        const entry = getEntry(state, key);
        entry.status = "loading";
        entry.error = null;
      })
      .addCase(loadSummary.fulfilled, (state, action) => {
        const { key, content, cached, createdAt } = action.payload;
        const entry = getEntry(state, key);
        entry.status = "succeeded";
        entry.content = content;
        entry.cached = cached;
        entry.createdAt = createdAt ?? null;
      })
      .addCase(loadSummary.rejected, (state, action) => {
        const { key, message } = action.payload;
        const entry = getEntry(state, key);
        entry.status = "failed";
        entry.error = message;
      })

      .addCase(regenerateSummary.pending, (state, action) => {
        const key = cacheKey(action.meta.arg.documentId, action.meta.arg.length);
        const entry = getEntry(state, key);
        entry.status = "loading";
        entry.error = null;
      })
      .addCase(regenerateSummary.fulfilled, (state, action) => {
        const { key, content, cached, createdAt } = action.payload;
        const entry = getEntry(state, key);
        entry.status = "succeeded";
        entry.content = content;
        entry.cached = cached;
        entry.createdAt = createdAt ?? null;
      })
      .addCase(regenerateSummary.rejected, (state, action) => {
        const { key, message } = action.payload;
        const entry = getEntry(state, key);
        entry.status = "failed";
        entry.error = message;
      });
  },
});

export default summarySlice.reducer;