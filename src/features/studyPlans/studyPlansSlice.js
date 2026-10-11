import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../api/apiClient.js";

function extractErrorMessage(error) {
  const data = error.response?.data;
  if (!data) return "Something went wrong. Please try again.";
  if (data.errors?.length) return data.errors[0].message;
  return data.message || "Something went wrong. Please try again.";
}

export const fetchPlans = createAsyncThunk(
  "studyPlans/fetchPlans",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.get("/study-plans");
      return res.data.plans;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const fetchPlanById = createAsyncThunk(
  "studyPlans/fetchPlanById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await apiClient.get(`/study-plans/${id}`);
      return res.data; // { plan, days }
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const generatePlan = createAsyncThunk(
  "studyPlans/generatePlan",
  async ({ title, examDate, hoursPerDay, documentIds }, { rejectWithValue }) => {
    try {
      const res = await apiClient.post("/study-plans", { title, examDate, hoursPerDay, documentIds });
      return res.data; // { plan, days }
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const updateDayDone = createAsyncThunk(
  "studyPlans/updateDayDone",
  async ({ planId, dayIndex, isDone }, { rejectWithValue }) => {
    try {
      await apiClient.patch(`/study-plans/${planId}/days/${dayIndex}`, { isDone });
      return { dayIndex, isDone };
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const deletePlan = createAsyncThunk(
  "studyPlans/deletePlan",
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/study-plans/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

const initialState = {
  list: { plans: [], status: "idle", error: null },
  current: { plan: null, days: [], status: "idle", error: null },
  generateStatus: "idle",
  generateError: null,
  deletingId: null,
};

const studyPlansSlice = createSlice({
  name: "studyPlans",
  initialState,
  reducers: {
    clearCurrentPlan(state) {
      state.current = { plan: null, days: [], status: "idle", error: null };
    },
    resetGenerateStatus(state) {
      state.generateStatus = "idle";
      state.generateError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlans.pending, (state) => {
        state.list.status = "loading";
        state.list.error = null;
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.list.status = "succeeded";
        state.list.plans = action.payload;
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.list.status = "failed";
        state.list.error = action.payload;
      })

      .addCase(fetchPlanById.pending, (state) => {
        state.current.status = "loading";
        state.current.error = null;
      })
      .addCase(fetchPlanById.fulfilled, (state, action) => {
        state.current.status = "succeeded";
        state.current.plan = action.payload.plan;
        state.current.days = action.payload.days;
      })
      .addCase(fetchPlanById.rejected, (state, action) => {
        state.current.status = "failed";
        state.current.error = action.payload;
      })

      .addCase(generatePlan.pending, (state) => {
        state.generateStatus = "loading";
        state.generateError = null;
      })
      .addCase(generatePlan.fulfilled, (state) => {
        state.generateStatus = "succeeded";
      })
      .addCase(generatePlan.rejected, (state, action) => {
        state.generateStatus = "failed";
        state.generateError = action.payload;
      })

      // Optimistic toggle: flip immediately, roll back only if the server rejects it
      .addCase(updateDayDone.fulfilled, (state, action) => {
        const day = state.current.days.find((d) => d.dayIndex === action.payload.dayIndex);
        if (day) day.isDone = action.payload.isDone;
      })
      .addCase(updateDayDone.rejected, (state, action) => {
        const { dayIndex } = action.meta.arg;
        const day = state.current.days.find((d) => d.dayIndex === dayIndex);
        if (day) day.isDone = !day.isDone; // revert the optimistic flip
      })

      .addCase(deletePlan.pending, (state, action) => {
        state.deletingId = action.meta.arg;
      })
      .addCase(deletePlan.fulfilled, (state, action) => {
        state.deletingId = null;
        state.list.plans = state.list.plans.filter((p) => p.id !== action.payload);
      })
      .addCase(deletePlan.rejected, (state) => {
        state.deletingId = null;
      });
  },
});

export const { clearCurrentPlan, resetGenerateStatus } = studyPlansSlice.actions;
export default studyPlansSlice.reducer;