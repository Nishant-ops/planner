import { DAG_STRUCTURE } from '../data/dagStructure';

const CONFIDENCE_THRESHOLD = 70;

export const getStatus = (topicKey, mastery, checkpoints = []) => {
  const node = DAG_STRUCTURE[topicKey];
  if (!node) return 'LOCKED';

  const topicMastery = mastery[topicKey] || { confidence: 0, solved: [] };

  // Check checkpoint gate: if tier > 0, previous tier checkpoint must be passed
  if (node.tier > 0) {
    const previousTier = node.tier - 1;
    const previousCheckpoint = checkpoints.find(cp => cp.tier_number === previousTier);

    if (previousCheckpoint && !previousCheckpoint.is_passed) {
      // Previous checkpoint not passed - entire tier is blocked
      return 'CHECKPOINT_BLOCKED';
    }
  }

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
    case 'CHECKPOINT_BLOCKED':
      return 'yellow';
    case 'LOCKED':
      return 'red';
    default:
      return 'gray';
  }
};

// Check if user can attempt a checkpoint (all tier topics ≥70% confidence)
export const canAttemptCheckpoint = (tier, mastery) => {
  const tierTopics = Object.entries(DAG_STRUCTURE)
    .filter(([_, node]) => node.tier === tier)
    .map(([key, _]) => key);

  return tierTopics.every((topicKey) => {
    const topicMastery = mastery[topicKey] || { confidence: 0 };
    return topicMastery.confidence >= CONFIDENCE_THRESHOLD;
  });
};

// Get checkpoint status for a tier
export const getCheckpointStatus = (tier, checkpoints = []) => {
  const checkpoint = checkpoints.find(cp => cp.tier_number === tier);

  if (!checkpoint) {
    return { exists: false, passed: false, attempts: 0 };
  }

  return {
    exists: true,
    passed: checkpoint.is_passed,
    attempts: checkpoint.attempts,
    lastAttempt: checkpoint.last_attempt_at,
    passedAt: checkpoint.passed_at
  };
};
