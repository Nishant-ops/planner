import { createContext, useState, useEffect, useContext } from 'react';
import { getMastery, updateMastery as apiUpdateMastery } from '../services/masteryService';
import { AuthContext } from './AuthContext';

export const MasteryContext = createContext();

export const MasteryProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [mastery, setMastery] = useState({});
  const [loading, setLoading] = useState(true);

  const loadMastery = async () => {
    if (!user) {
      setMastery({});
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getMastery();
      setMastery(data.mastery || {});
    } catch (error) {
      console.error('Failed to load mastery:', error);
      setMastery({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMastery();
  }, [user]);

  const updateMastery = async (topicKey, confidence, solvedProblems) => {
    try {
      await apiUpdateMastery(topicKey, {
        confidence,
        solved_problems: solvedProblems,
      });

      // Update local state
      setMastery((prev) => ({
        ...prev,
        [topicKey]: {
          confidence,
          solved: solvedProblems,
        },
      }));
    } catch (error) {
      console.error('Failed to update mastery:', error);
      throw error;
    }
  };

  const refreshMastery = async () => {
    await loadMastery();
  };

  return (
    <MasteryContext.Provider value={{ mastery, loading, updateMastery, refreshMastery }}>
      {children}
    </MasteryContext.Provider>
  );
};
