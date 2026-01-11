import api from './api';

export const chatWithArchitect = async (topicKey, message) => {
  const response = await api.post('/ai/chat', {
    topic_key: topicKey,
    message,
  });
  return response.data;
};

export const analyzeComplexity = async (code) => {
  const response = await api.post('/ai/complexity', {
    code,
  });
  return response.data;
};

export const judgeCode = async (topicKey, problemId, code) => {
  const response = await api.post('/ai/judge', {
    topic_key: topicKey,
    problem_id: problemId,
    code,
  });
  return response.data;
};
