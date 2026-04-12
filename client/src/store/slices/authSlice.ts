import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "../../utils/axios";
import { Navigate } from "react-router";

// ── Types ──────────────────────────────────────────────
export type UserRole = "patient" | "doctor" | "admin";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// ── Initial State ──────────────────────────────────────
const rawUser = localStorage.getItem("user"); // comment this when to convert to api
const initialState: AuthState = {
  // user: null,
  user: rawUser ? JSON.parse(rawUser) : null, // comment this when to convert to api
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  isLoading: false,
  error: null,
};

// ── Mock Backend State ─────────────────────────────────
// We use a global array here to simulate a backend DB
const MOCK_USERS: User[] = [  // comment this when to convert to api
  { _id: "1", name: "Ahmed Patient", email: "patient@mock.com", role: "patient" },  // comment this when to convert to api
  { _id: "2", name: "Dr. Sarah", email: "doctor@mock.com", role: "doctor" },  // comment this when to convert to api
  { _id: "3", name: "Admin Setup", email: "admin@mock.com", role: "admin" },  // comment this when to convert to api
];  // comment this when to convert to api

// ── Async Thunks ───────────────────────────────────────
/*
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials: Record<string, string>, { rejectWithValue }) => {
    try {
      // Replace with actual endpoint later
      const response = await api.post("/auth/login", credentials);
      localStorage.setItem("token", response.data.token);
      return response.data; // { user, token }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);
*/

// comment this when to convert to api
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials: Record<string, string>, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay
      
      const user = MOCK_USERS.find(u => u.email === credentials.email);
      // For mock purposes, if it's not found we might just simulate success if they registered,
      // but wait, if we register it adds to MOCK_USERS memory, so find will work during the session!
      if (!user) {
        return rejectWithValue("Invalid email or password");
      }

      // No password check in mock currently, just email matching
      const token = "mock-jwt-token-" + user._id;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      return { user, token };
    } catch (error: any) {
      return rejectWithValue(error.message || "Login failed");
    }
  }
);

/*
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData: Record<string, string>, { rejectWithValue }) => {
    try {
      // Replace with actual endpoint later
      const response = await api.post("/auth/register", userData);
      localStorage.setItem("token", response.data.token);
      return response.data; // { user, token }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Registration failed");
    }
  }
);
*/

// comment this when to convert to api
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData: Record<string, string>, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay
      
      const exists = MOCK_USERS.find(u => u.email === userData.email);
      if (exists) {
        return rejectWithValue("User already exists with this email");
      }

      const newUser: User = {
        _id: Math.random().toString(36).substring(7),
        name: userData.name,
        email: userData.email,
        role: (userData.role as UserRole) || "patient",
      };

      MOCK_USERS.push(newUser);

      const token = "mock-jwt-token-" + newUser._id;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(newUser));
      
      return { user: newUser, token };
    } catch (error: any) {
      return rejectWithValue(error.message || "Registration failed");
    }
  }
);

// ── Slice ──────────────────────────────────────────────
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /** Logout — reset to initial state */
    logout(state) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");  // comment this when to convert to api
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },

    /** Update the current user's profile info */
    updateProfile(state, action: PayloadAction<Partial<User>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },

    /** Clear any existing error */
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, updateProfile, clearAuthError } = authSlice.actions;

export default authSlice.reducer;
