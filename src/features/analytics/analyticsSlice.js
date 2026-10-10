import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../api/apiClient.js";

function extractErrorMessage(error) {
  const data = error.response?.data;
  if (!data) return "Something went wrong. Please try again.";
  if (data.errors?.length) return data.errors[0].message;
  return data.message || "Something went wrong. Please try again.";
}

export const fetchTopicStats = createAsyncThunk(
  "analytics/fetchTopicStats",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.get("/analytics/topics");
      return res.data; // { settings, topics }
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

const initialState = {
  topics: [],
  settings: null,
  status: "idle", // idle | loading | succeeded | failed
  error: null,
};

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopicStats.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTopicStats.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.topics = action.payload.topics;
        state.settings = action.payload.settings;
      })
      .addCase(fetchTopicStats.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default analyticsSlice.reducer;