import api from "../utils/axios";

export const messageService = {
  getConversations: async () => {
    const response = await api.get("/messages/conversations");
    return response.data;
  },

  getMessages: async (userId: string) => {
    const response = await api.get(`/messages/${userId}`);
    return response.data;
  },

  sendMessage: async (data: { receiverId: string; receiverRole: string; content: string }) => {
    const response = await api.post("/messages", data);
    return response.data;
  },
};