import api from "../utils/axios";

interface ProfileData {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

export const authService = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },
  
  register: async (userData: { name: string; email: string; password: string; role: string; speciality?: string }) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },
  
  getMe: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  updateProfile: async (profileData: ProfileData) => {
    const response = await api.put("/auth/profile", profileData);
    return response.data;
  }
};
