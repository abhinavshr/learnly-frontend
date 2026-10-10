import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../api/apiClient.js";

function extractErrorMessage(error) {
  const data = error.response?.data;
  if (!data) return "Something went wrong. Please try again.";
  if (data.errors?.length) return data.errors[0].message;
  return data.message || "Something went wrong. Please try again.";
}

export const fetchFlashcardsForDocument = createAsyncThunk(
  "flashcards/fetchFlashcardsForDocument",
  async (documentId, { rejectWithValue }) => {
    try {
      const res = await apiClient.get(`/documents/${documentId}/flashcards`);
      return { documentId, cards: res.data.cards };
    } catch (error) {
      return rejectWithValue({ documentId, message: extractErrorMessage(error) });
    }
  }
);

export const generateFlashcards = createAsyncThunk(
  "flashcards/generateFlashcards",
  async ({ documentId, count, topic }, { rejectWithValue, dispatch }) => {
    try {
      await apiClient.post(`/documents/${documentId}/flashcards`, { count, topic });
      // The generate response doesn't include DB ids, so refetch the real list
      const refetched = await dispatch(fetchFlashcardsForDocument(documentId));
      if (fetchFlashcardsForDocument.rejected.match(refetched)) {
        throw new Error(refetched.payload?.message || "Generated, but failed to reload the list");
      }
      return { documentId };
    } catch (error) {
      return rejectWithValue({ documentId, message: extractErrorMessage(error) });
    }
  }
);

export const fetchDueFlashcards = createAsyncThunk(
  "flashcards/fetchDueFlashcards",
  async (limit, { rejectWithValue }) => {
    try {
      const res = await apiClient.get("/flashcards/due", { params: limit ? { limit } : undefined });
      return res.data.cards;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const reviewFlashcard = createAsyncThunk(
  "flashcards/reviewFlashcard",
  async ({ id, quality }, { rejectWithValue }) => {
    try {
      const res = await apiClient.post(`/flashcards/${id}/review`, { quality });
      return { id, quality, card: res.data.card };
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const deleteFlashcard = createAsyncThunk(
  "flashcards/deleteFlashcard",
  async ({ id, documentId }, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/flashcards/${id}`);
      return { id, documentId };
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

const initialState = {
  // documentId -> { cards: [], listStatus, listError, generateStatus, generateError }
  byDocument: {},
  // today's due queue (across all documents)
  due: { cards: [], status: "idle", error: null },
};

function getEntry(state, documentId) {
  if (!state.byDocument[documentId]) {
    state.byDocument[documentId] = { cards: [], listStatus: "idle", listError: null, generateStatus: "idle", generateError: null };
  }
  return state.byDocument[documentId];
}

const flashcardsSlice = createSlice({
  name: "flashcards",
  initialState,
  reducers: {
    // Removes one card from today's due queue once it's been rated in a review session
    removeFromDueQueue(state, action) {
      state.due.cards = state.due.cards.filter((c) => c.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFlashcardsForDocument.pending, (state, action) => {
        getEntry(state, action.meta.arg).listStatus = "loading";
        getEntry(state, action.meta.arg).listError = null;
      })
      .addCase(fetchFlashcardsForDocument.fulfilled, (state, action) => {
        const { documentId, cards } = action.payload;
        const entry = getEntry(state, documentId);
        entry.listStatus = "succeeded";
        entry.cards = cards;
      })
      .addCase(fetchFlashcardsForDocument.rejected, (state, action) => {
        const { documentId, message } = action.payload;
        const entry = getEntry(state, documentId);
        entry.listStatus = "failed";
        entry.listError = message;
      })

      .addCase(generateFlashcards.pending, (state, action) => {
        const entry = getEntry(state, action.meta.arg.documentId);
        entry.generateStatus = "loading";
        entry.generateError = null;
      })
      .addCase(generateFlashcards.fulfilled, (state, action) => {
        getEntry(state, action.payload.documentId).generateStatus = "succeeded";
      })
      .addCase(generateFlashcards.rejected, (state, action) => {
        const { documentId, message } = action.payload;
        const entry = getEntry(state, documentId);
        entry.generateStatus = "failed";
        entry.generateError = message;
      })

      .addCase(fetchDueFlashcards.pending, (state) => {
        state.due.status = "loading";
        state.due.error = null;
      })
      .addCase(fetchDueFlashcards.fulfilled, (state, action) => {
        state.due.status = "succeeded";
        state.due.cards = action.payload;
      })
      .addCase(fetchDueFlashcards.rejected, (state, action) => {
        state.due.status = "failed";
        state.due.error = action.payload;
      })

      .addCase(deleteFlashcard.fulfilled, (state, action) => {
        const { id, documentId } = action.payload;
        const entry = getEntry(state, documentId);
        entry.cards = entry.cards.filter((c) => c.id !== id);
      });
  },
});

export const { removeFromDueQueue } = flashcardsSlice.actions;
export default flashcardsSlice.reducer;