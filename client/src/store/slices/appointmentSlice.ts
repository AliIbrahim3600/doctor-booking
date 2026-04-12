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
/* TODO: REMOVE THIS MOCK DATA LATER WHEN BACKEND IS READY */
const MOCK_APPOINTMENTS: Appointment[] = [
  {
    _id: "appt_1",
    patientId: "pat_1",
    patientName: "John Doe",
    doctorId: "1",
    doctorName: "Dr. Sarah Jenkins",
    speciality: "Cardiology",
    date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    time: "09:00 AM",
    status: "pending",
    fees: 150,
    createdAt: new Date().toISOString()
  },
  {
    _id: "appt_2",
    patientId: "pat_2",
    patientName: "Emily Smith",
    doctorId: "1",
    doctorName: "Dr. Sarah Jenkins",
    speciality: "Cardiology",
    date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    time: "11:30 AM",
    status: "confirmed",
    fees: 150,
    createdAt: new Date().toISOString()
  },
  {
    _id: "appt_3",
    patientId: "pat_3",
    patientName: "Michael Brown",
    doctorId: "1",
    doctorName: "Dr. Sarah Jenkins",
    speciality: "Cardiology",
    date: new Date(Date.now() - 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    time: "03:00 PM",
    status: "completed",
    fees: 150,
    createdAt: new Date().toISOString()
  },
  {
    _id: "appt_4",
    patientId: "pat_4",
    patientName: "Jessica Taylor",
    doctorId: "1",
    doctorName: "Dr. Sarah Jenkins",
    speciality: "Cardiology",
    date: new Date(Date.now() + 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    time: "10:00 AM",
    status: "cancelled",
    fees: 150,
    createdAt: new Date().toISOString()
  },
  {
    _id: "appt_5",
    patientId: "pat_5",
    patientName: "Alice Walker",
    doctorId: "2",
    doctorName: "Dr. Michael Chen",
    speciality: "Internal Medicine",
    date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    time: "02:00 PM",
    status: "pending",
    fees: 180,
    createdAt: new Date().toISOString()
  },
  {
    _id: "appt_6",
    patientId: "pat_6",
    patientName: "Bob Singer",
    doctorId: "2",
    doctorName: "Dr. Michael Chen",
    speciality: "Internal Medicine",
    date: new Date(Date.now() + 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    time: "09:30 AM",
    status: "confirmed",
    fees: 180,
    createdAt: new Date().toISOString()
  },
  {
    _id: "appt_7",
    patientId: "pat_7",
    patientName: "Charlie Adams",
    doctorId: "3",
    doctorName: "Dr. Elena Rodriguez",
    speciality: "Pediatrics",
    date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    time: "10:15 AM",
    status: "completed",
    fees: 100,
    createdAt: new Date().toISOString()
  },
  {
    _id: "appt_8",
    patientId: "pat_8",
    patientName: "Diana Prince",
    doctorId: "3",
    doctorName: "Dr. Elena Rodriguez",
    speciality: "Pediatrics",
    date: new Date(Date.now() + 172800000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    time: "01:45 PM",
    status: "pending",
    fees: 100,
    createdAt: new Date().toISOString()
  }
];

/*
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
*/
/* TODO: REMOVE THIS LATER WHEN BACKEND IS READY */
export const fetchAppointments = createAsyncThunk(
  "appointment/fetchAppointments",
  async (_, { rejectWithValue }) => {
    return new Promise<Appointment[]>((resolve) => setTimeout(() => resolve([...MOCK_APPOINTMENTS]), 800));
  }
);
/* TODO: REMOVE THIS LATER WHEN BACKEND IS READY */
export const createAppointment = createAsyncThunk(
  "appointment/createAppointment",
  async (appointmentData: Partial<Appointment>, { rejectWithValue }) => {
    return new Promise<Appointment>((resolve) => {
      setTimeout(() => {
        const newAppt: Appointment = {
          _id: Math.random().toString(36).substr(2, 9),
          patientId: appointmentData.patientId || "anon",
          patientName: appointmentData.patientName || "Unknown",
          doctorId: appointmentData.doctorId || "",
          doctorName: appointmentData.doctorName || "",
          speciality: appointmentData.speciality || "",
          date: appointmentData.date || "",
          time: appointmentData.time || "",
          status: "pending",
          fees: appointmentData.fees || 0,
          notes: appointmentData.notes,
          createdAt: new Date().toISOString()
        };
        MOCK_APPOINTMENTS.unshift(newAppt);
        resolve(newAppt);
      }, 1000);
    });
  }
);
/* TODO: REMOVE THIS LATER WHEN BACKEND IS READY */
export const updateAppointmentStatusAsync = createAsyncThunk(
  "appointment/updateStatus",
  async (
    { id, status }: { id: string; status: AppointmentStatus },
    { rejectWithValue },
  ) => {
    return new Promise<{ _id: string; status: AppointmentStatus }>((resolve) => {
      setTimeout(() => {
        resolve({ _id: id, status });
      }, 500);
    });
  }
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
