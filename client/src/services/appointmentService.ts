import api from "../utils/axios";
import type { AppointmentStatus, Appointment } from "../store/slices/appointmentSlice";

export const appointmentService = {
  getAppointments: async () => {
    const response = await api.get("/appointments");
    return response.data;
  },

  createAppointment: async (appointmentData: Partial<Appointment>) => {
    const response = await api.post("/appointments", appointmentData);
    return response.data;
  },

  updateStatus: async (id: string, status: AppointmentStatus) => {
    const response = await api.patch(`/appointments/${id}/status`, { status });
    return response.data;
  },

  rateAppointment: async (id: string, rating: number, review: string) => {
    const response = await api.patch(`/appointments/${id}/rate`, { rating, review });
    return response.data;
  }
};
