import api from "../utils/axios";

export const authService = {
  login: async (credentials: Record<string, string>) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },
  
  register: async (userData: Record<string, string>) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },
  
  getMe: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  updateProfile: async (profileData: Record<string, any>) => {
    const response = await api.put("/auth/profile", profileData);
    return response.data;
  }
};
