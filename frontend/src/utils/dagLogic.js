import { DAG_STRUCTURE } from '../data/dagStructure';

const CONFIDENCE_THRESHOLD = 70;

export const getStatus = (topicKey, mastery) => {
  const node = DAG_STRUCTURE[topicKey];
  if (!node) return 'LOCKED';

  const topicMastery = mastery[topicKey] || { confidence: 0, solved: [] };

  // If this topic is mastered (100% confidence)
  if (topicMastery.confidence >= 100) {
    return 'MASTERED';
  }

  // If this topic has some progress
  if (topicMastery.confidence > 0) {
    return 'IN_PROGRESS';
  }

  // Check if all prerequisites are met
  if (node.reqs.length === 0) {
    return 'UNLOCKED'; // Root node, no prerequisites
  }

  const allPrereqsMet = node.reqs.every((reqKey) => {
    const reqMastery = mastery[reqKey] || { confidence: 0 };
    return reqMastery.confidence >= CONFIDENCE_THRESHOLD;
  });

  return allPrereqsMet ? 'UNLOCKED' : 'LOCKED';
};

export const calculateConfidence = (solvedCount) => {
  // Each problem is worth ~33.3%, max 100%
  return Math.min(Math.floor((solvedCount / 3) * 100), 100);
};

export const getTopicsByTier = () => {
  const tiers = {};

  Object.entries(DAG_STRUCTURE).forEach(([key, node]) => {
    if (!tiers[node.tier]) {
      tiers[node.tier] = [];
    }
    tiers[node.tier].push({ key, ...node });
  });

  return tiers;
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'MASTERED':
      return 'emerald';
    case 'IN_PROGRESS':
      return 'blue';
    case 'UNLOCKED':
      return 'gray';
    case 'LOCKED':
      return 'red';
    default:
      return 'gray';
  }
};
