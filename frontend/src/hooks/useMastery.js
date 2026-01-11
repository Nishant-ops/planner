import { useContext } from 'react';
import { MasteryContext } from '../contexts/MasteryContext';

export const useMastery = () => {
  const context = useContext(MasteryContext);
  if (!context) {
    throw new Error('useMastery must be used within MasteryProvider');
  }
  return context;
};
