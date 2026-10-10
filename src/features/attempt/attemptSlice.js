import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../api/apiClient.js";

function extractErrorMessage(error) {
  const data = error.response?.data;
  if (!data) return "Something went wrong. Please try again.";
  if (data.errors?.length) return data.errors[0].message;
  return data.message || "Something went wrong. Please try again.";
}

export const startAttempt = createAsyncThunk(
  "attempt/startAttempt",
  async ({ quizId, mode, timeLimitMinutes }, { rejectWithValue }) => {
    try {
      const res = await apiClient.post(`/quizzes/${quizId}/attempts`, { mode, timeLimitMinutes });
      return res.data; // { attempt, questions }
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const submitAttempt = createAsyncThunk(
  "attempt/submitAttempt",
  async ({ attemptId, answers }, { rejectWithValue }) => {
    try {
      const res = await apiClient.post(`/attempts/${attemptId}/submit`, { answers });
      return res.data; // { attempt, topics, results }
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

const initialState = {
  // the attempt currently in progress
  attemptId: null,
  quizId: null,
  mode: null,
  timeLimitSeconds: null,
  totalQuestions: 0,
  questions: [],
  startStatus: "idle", // idle | loading | succeeded | failed
  startError: null,
  submitStatus: "idle",
  submitError: null,
};

const attemptSlice = createSlice({
  name: "attempt",
  initialState,
  reducers: {
    resetAttempt() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(startAttempt.pending, (state) => {
        state.startStatus = "loading";
        state.startError = null;
        state.submitStatus = "idle";
        state.submitError = null;
      })
      .addCase(startAttempt.fulfilled, (state, action) => {
        const { attempt, questions } = action.payload;
        state.startStatus = "succeeded";
        state.attemptId = attempt.id;
        state.quizId = attempt.quizId;
        state.mode = attempt.mode;
        state.timeLimitSeconds = attempt.timeLimitSeconds;
        state.totalQuestions = attempt.totalQuestions;
        state.questions = questions;
      })
      .addCase(startAttempt.rejected, (state, action) => {
        state.startStatus = "failed";
        state.startError = action.payload;
      })

      .addCase(submitAttempt.pending, (state) => {
        state.submitStatus = "loading";
        state.submitError = null;
      })
      .addCase(submitAttempt.fulfilled, (state) => {
        state.submitStatus = "succeeded";
      })
      .addCase(submitAttempt.rejected, (state, action) => {
        state.submitStatus = "failed";
        state.submitError = action.payload;
      });
  },
});

export const { resetAttempt } = attemptSlice.actions;
export default attemptSlice.reducer;