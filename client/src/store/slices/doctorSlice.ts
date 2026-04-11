import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "../../utils/axios";

// ── Types ──────────────────────────────────────────────
export interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
}

export interface Doctor {
  _id: string;
  name: string;
  email: string;
  speciality: string;
  experience: number;
  fees: number;
  avatar?: string;
  phone?: string;
  about?: string;
  availability: TimeSlot[];
  isApproved: boolean;
}

export interface DoctorState {
  doctors: Doctor[];
  selectedDoctor: Doctor | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    speciality: string;
    search: string;
  };
}

// ── Initial State ──────────────────────────────────────
const initialState: DoctorState = {
  doctors: [],
  selectedDoctor: null,
  isLoading: false,
  error: null,
  filters: {
    speciality: "",
    search: "",
  },
};

// ── Async Thunks ───────────────────────────────────────
export const fetchDoctors = createAsyncThunk(
  "doctor/fetchDoctors",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/doctors");
      return response.data; // array of Doctors
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch doctors");
    }
  }
);

export const fetchDoctorById = createAsyncThunk(
  "doctor/fetchDoctorById",
  async (doctorId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/doctors/${doctorId}`);
      return response.data; // single Doctor
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch doctor details");
    }
  }
);

// ── Slice ──────────────────────────────────────────────
const doctorSlice = createSlice({
  name: "doctor",
  initialState,
  reducers: {
    /** Set the currently selected doctor explicitly if needed */
    setSelectedDoctor(state, action: PayloadAction<Doctor | null>) {
      state.selectedDoctor = action.payload;
    },

    /** Update speciality filter */
    setSpecialityFilter(state, action: PayloadAction<string>) {
      state.filters.speciality = action.payload;
    },

    /** Update search query filter */
    setSearchFilter(state, action: PayloadAction<string>) {
      state.filters.search = action.payload;
    },

    /** Reset all filters */
    clearFilters(state) {
      state.filters = { speciality: "", search: "" };
    },

    /** Clear doctor-related errors */
    clearDoctorError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Doctors
      .addCase(fetchDoctors.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.doctors = action.payload;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Single Doctor
      .addCase(fetchDoctorById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDoctorById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedDoctor = action.payload;
      })
      .addCase(fetchDoctorById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSelectedDoctor,
  setSpecialityFilter,
  setSearchFilter,
  clearFilters,
  clearDoctorError,
} = doctorSlice.actions;

export default doctorSlice.reducer;
