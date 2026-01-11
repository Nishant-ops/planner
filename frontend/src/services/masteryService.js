import api from './api';

export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const getMastery = async () => {
  const response = await api.get('/mastery');
  return response.data;
};

export const updateMastery = async (topicKey, data) => {
  const response = await api.put(`/mastery/${topicKey}`, data);
  return response.data;
};
