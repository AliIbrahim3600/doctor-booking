import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "../../utils/axios";

// ── Types ──────────────────────────────────────────────
export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

export interface Appointment {
  _id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  speciality: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  fees: number;
  notes?: string;
  createdAt: string;
}

export interface AppointmentState {
  appointments: Appointment[];
  selectedAppointment: Appointment | null;
  isLoading: boolean;
  error: string | null;
}

// ── Initial State ──────────────────────────────────────
const initialState: AppointmentState = {
  appointments: [],
  selectedAppointment: null,
  isLoading: false,
  error: null,
};

// ── Async Thunks ───────────────────────────────────────

export const fetchAppointments = createAsyncThunk(
  "appointment/fetchAppointments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/appointments");
      return response.data; // array of Appointments
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch appointments",
      );
    }
  },
);

export const createAppointment = createAsyncThunk(
  "appointment/createAppointment",
  async (appointmentData: Partial<Appointment>, { rejectWithValue }) => {
    try {
      const response = await api.post("/appointments", appointmentData);
      return response.data; // created Appointment
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create appointment",
      );
    }
  },
);

export const updateAppointmentStatusAsync = createAsyncThunk(
  "appointment/updateStatus",
  async (
    { id, status }: { id: string; status: AppointmentStatus },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.patch(`/appointments/${id}/status`, {
        status,
      });
      return response.data; // updated Appointment
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update appointment status",
      );
    }
  },
);


// ── Slice ──────────────────────────────────────────────
const appointmentSlice = createSlice({
  name: "appointment",
  initialState,
  reducers: {
    /** Set the currently selected appointment (for detail views) */
    setSelectedAppointment(state, action: PayloadAction<Appointment | null>) {
      state.selectedAppointment = action.payload;
    },

    /** Clear appointment-related errors */
    clearAppointmentError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Appointments
      .addCase(fetchAppointments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.appointments = action.payload;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create Appointment
      .addCase(createAppointment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.appointments.unshift(action.payload);
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Appointment Status
      .addCase(updateAppointmentStatusAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateAppointmentStatusAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        const updated = action.payload;
        const index = state.appointments.findIndex(
          (apt) => apt._id === updated._id,
        );
        if (index !== -1) {
          state.appointments[index] = { ...state.appointments[index], ...updated } as Appointment;
        }
      })
      .addCase(updateAppointmentStatusAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedAppointment, clearAppointmentError } =
  appointmentSlice.actions;

export default appointmentSlice.reducer;
