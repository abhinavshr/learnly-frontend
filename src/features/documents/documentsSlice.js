import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../api/apiClient.js";

function extractErrorMessage(error) {
  const data = error.response?.data;
  if (!data) return "Something went wrong. Please try again.";
  if (data.errors?.length) return data.errors[0].message;
  return data.message || "Something went wrong. Please try again.";
}

export const fetchDocuments = createAsyncThunk(
  "documents/fetchDocuments",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.get("/documents");
      return res.data.documents;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const fetchDocumentById = createAsyncThunk(
  "documents/fetchDocumentById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await apiClient.get(`/documents/${id}`);
      return res.data.document;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const uploadDocument = createAsyncThunk(
  "documents/uploadDocument",
  async ({ file, title }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (title) formData.append("title", title);

      const res = await apiClient.post("/documents", formData);
      return res.data.document;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const deleteDocument = createAsyncThunk(
  "documents/deleteDocument",
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/documents/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

const initialState = {
  items: [],
  status: "idle",
  error: null,
  uploadStatus: "idle",
  uploadError: null,
  deletingId: null,
  current: {
    data: null,
    status: "idle",
    error: null,
  },
};

const documentsSlice = createSlice({
  name: "documents",
  initialState,
  reducers: {
    clearUploadError(state) {
      state.uploadError = null;
    },
    resetUploadStatus(state) {
      state.uploadStatus = "idle";
      state.uploadError = null;
    },
    clearCurrentDocument(state) {
      state.current = { data: null, status: "idle", error: null };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocuments.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(fetchDocumentById.pending, (state) => {
        state.current.status = "loading";
        state.current.error = null;
      })
      .addCase(fetchDocumentById.fulfilled, (state, action) => {
        state.current.status = "succeeded";
        state.current.data = action.payload;
      })
      .addCase(fetchDocumentById.rejected, (state, action) => {
        state.current.status = "failed";
        state.current.error = action.payload;
      })

      .addCase(uploadDocument.pending, (state) => {
        state.uploadStatus = "loading";
        state.uploadError = null;
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.uploadStatus = "succeeded";
        state.items.unshift(action.payload);
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.uploadStatus = "failed";
        state.uploadError = action.payload;
      })

      .addCase(deleteDocument.pending, (state, action) => {
        state.deletingId = action.meta.arg;
      })
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.deletingId = null;
        state.items = state.items.filter((d) => d.id !== action.payload);
      })
      .addCase(deleteDocument.rejected, (state) => {
        state.deletingId = null;
      });
  },
});

export const { clearUploadError, resetUploadStatus, clearCurrentDocument } = documentsSlice.actions;
export default documentsSlice.reducer;