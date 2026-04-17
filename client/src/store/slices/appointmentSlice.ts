import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { appointmentService } from "../../services/appointmentService";

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
  rating?: number;
  review?: string;
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
      const data = await appointmentService.getAppointments();
      return data; // array of Appointments
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to fetch appointments";
      return rejectWithValue(message);
    }
  },
);

export const createAppointment = createAsyncThunk(
  "appointment/createAppointment",
  async (appointmentData: Partial<Appointment>, { rejectWithValue }) => {
    try {
      const data = await appointmentService.createAppointment(appointmentData);
      return data; // created Appointment
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to create appointment";
      return rejectWithValue(message);
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
      const data = await appointmentService.updateStatus(id, status);
      return data; // updated Appointment
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to update appointment status";
      return rejectWithValue(message);
    }
  },
);

export const rateAppointmentAsync = createAsyncThunk(
  "appointment/rate",
  async (
    { id, rating, review }: { id: string; rating: number; review: string },
    { rejectWithValue },
  ) => {
    try {
      const data = await appointmentService.rateAppointment(id, rating, review);
      return data; // updated Appointment
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to submit rating";
      return rejectWithValue(message);
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
      })
      // Rate Appointment
      .addCase(rateAppointmentAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(rateAppointmentAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        const updated = action.payload;
        const index = state.appointments.findIndex(
          (apt) => apt._id === updated._id,
        );
        if (index !== -1) {
          state.appointments[index] = { ...state.appointments[index], ...updated } as Appointment;
        }
      })
      .addCase(rateAppointmentAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedAppointment, clearAppointmentError } =
  appointmentSlice.actions;

export default appointmentSlice.reducer;
