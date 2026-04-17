import api from "../utils/axios";
import type { TimeSlot, Doctor } from "../store/slices/doctorSlice";

export const doctorService = {
  getDoctors: async () => {
    const response = await api.get("/doctors?all=true");
    return response.data;
  },

  getDoctorById: async (doctorId: string) => {
    const response = await api.get(`/doctors/${doctorId}`);
    return response.data;
  },

  updateAvailability: async (doctorId: string, availability: TimeSlot[]) => {
    const response = await api.put(`/doctors/${doctorId}/availability`, { availability });
    return response.data;
  },

  updateProfile: async (doctorId: string, profileData: Partial<Doctor>) => {
    const response = await api.put(`/doctors/${doctorId}/profile`, profileData);
    return response.data;
  },

  getDoctorReviews: async (doctorId: string) => {
    const response = await api.get(`/doctors/${doctorId}/reviews`);
    return response.data;
  }
};
