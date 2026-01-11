import { createContext, useState, useEffect, useContext } from 'react';
import { getCheckpoints } from '../services/checkpointService';
import { AuthContext } from './AuthContext';

export const CheckpointContext = createContext();

export const CheckpointProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [checkpoints, setCheckpoints] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCheckpoints = async () => {
    if (!user) {
      setCheckpoints([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getCheckpoints();
      setCheckpoints(data.checkpoints || []);
    } catch (error) {
      console.error('Failed to load checkpoints:', error);
      setCheckpoints([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCheckpoints();
  }, [user]);

  const refreshCheckpoints = async () => {
    await loadCheckpoints();
  };

  // Helper to get checkpoint by tier
  const getCheckpointByTier = (tier) => {
    return checkpoints.find((cp) => cp.tier_number === tier) || null;
  };

  // Helper to check if a tier is unlocked (previous checkpoint passed)
  const isTierUnlocked = (tier) => {
    if (tier === 0) return true; // First tier always unlocked

    const previousCheckpoint = getCheckpointByTier(tier - 1);
    return previousCheckpoint?.is_passed || false;
  };

  return (
    <CheckpointContext.Provider
      value={{
        checkpoints,
        loading,
        refreshCheckpoints,
        getCheckpointByTier,
        isTierUnlocked
      }}
    >
      {children}
    </CheckpointContext.Provider>
  );
};
