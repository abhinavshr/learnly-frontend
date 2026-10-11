import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../api/apiClient.js";

function extractErrorMessage(error) {
  const data = error.response?.data;
  if (!data) return "Something went wrong. Please try again.";
  if (data.errors?.length) return data.errors[0].message;
  return data.message || "Something went wrong. Please try again.";
}

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const res = await apiClient.post("/auth/register", { name, email, password });
      return res.data.user; // cookie is set by the Set-Cookie response header, not read here
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await apiClient.post("/auth/login", { email, password });
      return res.data.user;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Asks the backend "is my cookie valid, and who am I" — the only way to know
// on page load, since the httpOnly cookie is invisible to this code.
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.get("/auth/me");
      return res.data.user;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  // Best-effort: even if this fails (network blip), local state still clears below
  await apiClient.post("/auth/logout").catch(() => {});
});

const initialState = {
  user: null,
  isAuthenticated: false,
  status: "idle", // idle | loading | succeeded | failed
  error: null,
  isBootstrapping: true, // true until the one fetchCurrentUser() call on app load settles
};

function handlePending(state) {
  state.status = "loading";
  state.error = null;
}

function handleAuthSuccess(state, action) {
  state.status = "succeeded";
  state.user = action.payload;
  state.isAuthenticated = true;
}

function handleRejected(state, action) {
  state.status = "failed";
  state.error = action.payload;
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, handlePending)
      .addCase(registerUser.fulfilled, handleAuthSuccess)
      .addCase(registerUser.rejected, handleRejected)

      .addCase(loginUser.pending, handlePending)
      .addCase(loginUser.fulfilled, handleAuthSuccess)
      .addCase(loginUser.rejected, handleRejected)

      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isBootstrapping = false;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isBootstrapping = false;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.status = "idle";
        state.error = null;
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;