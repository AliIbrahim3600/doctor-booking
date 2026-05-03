import api from "../utils/axios";

export const recordService = {
  getRecords: async () => {
    const response = await api.get("/records");
    return response.data;
  },

  createRecord: async (data: { title: string; category: string; fileUrl?: string; description?: string }) => {
    const response = await api.post("/records", data);
    return response.data;
  },

  deleteRecord: async (id: string) => {
    const response = await api.delete(`/records/${id}`);
    return response.data;
  },
};