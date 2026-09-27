import api from './api';

export const chatService = {
  getConversations: async () => {
    const res = await api.get('/chat/conversations');
    return res.data;
  },

  getMessages: async (conversationId) => {
    const res = await api.get(`/chat/conversations/${conversationId}/messages`);
    return res.data;
  },

  sendMessage: async (conversationId, messageData) => {
    const res = await api.post(`/chat/conversations/${conversationId}/messages`, messageData);
    return res.data;
  },
};
