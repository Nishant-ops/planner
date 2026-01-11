import api from './api';

// Get all checkpoint statuses for the authenticated user
export const getCheckpoints = async () => {
  try {
    const response = await api.get('/checkpoints');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch checkpoints:', error);
    throw error;
  }
};

// Attempt a checkpoint problem
export const attemptCheckpoint = async (tier, code) => {
  try {
    const response = await api.post('/checkpoints/attempt', {
      tier_number: tier,
      code: code,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to attempt checkpoint:', error);
    throw error;
  }
};
