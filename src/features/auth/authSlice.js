import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../api/apiClient.js";
import { getToken, setToken, clearToken } from "../../utils/tokenStorage.js";

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
      return res.data; // { token, user }
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
      return res.data; // { token, user }
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Rehydrates the logged-in user from a token already sitting in the cookie
// (e.g. after a page refresh), using GET /api/auth/me.
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

const initialState = {
  user: null,
  token: getToken(),
  status: "idle", // idle | loading | succeeded | failed
  error: null,
};

function handlePending(state) {
  state.status = "loading";
  state.error = null;
}

function handleAuthSuccess(state, action) {
  state.status = "succeeded";
  state.user = action.payload.user;
  state.token = action.payload.token;
  setToken(action.payload.token);
}

function handleRejected(state, action) {
  state.status = "failed";
  state.error = action.payload;
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.status = "idle";
      state.error = null;
      clearToken();
    },
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
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        // Cookie held a token the backend no longer accepts (expired/invalid)
        state.user = null;
        state.token = null;
        clearToken();
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;