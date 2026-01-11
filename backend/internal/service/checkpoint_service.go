package service

import (
	"fmt"

	"github.com/yourusername/skilltree/internal/models"
	"github.com/yourusername/skilltree/internal/repository"
)

type CheckpointService struct {
	checkpointRepo *repository.CheckpointRepository
	masteryRepo    *repository.MasteryRepository
	geminiService  *GeminiService
}

func NewCheckpointService(
	checkpointRepo *repository.CheckpointRepository,
	masteryRepo *repository.MasteryRepository,
	geminiService *GeminiService,
) *CheckpointService {
	return &CheckpointService{
		checkpointRepo: checkpointRepo,
		masteryRepo:    masteryRepo,
		geminiService:  geminiService,
	}
}

// GetCheckpointStatus returns all checkpoint statuses with can_attempt flags
func (s *CheckpointService) GetCheckpointStatus(firebaseUID string) (*models.CheckpointResponse, error) {
	// Get all checkpoints for user
	checkpoints, err := s.checkpointRepo.GetAllByFirebaseUID(firebaseUID)
	if err != nil {
		return nil, fmt.Errorf("failed to get checkpoints: %w", err)
	}

	// Get user mastery to calculate can_attempt
	masteryData, err := s.masteryRepo.GetAllByUserID(firebaseUID)
	if err != nil {
		return nil, fmt.Errorf("failed to get mastery: %w", err)
	}

	// Build response
	response := &models.CheckpointResponse{
		Checkpoints: make(map[int]models.CheckpointStatus),
	}

	// Initialize all tiers (0-6)
	for tier := 0; tier <= 6; tier++ {
		status := models.CheckpointStatus{
			TierNumber: tier,
			IsPassed:   false,
			Attempts:   0,
			CanAttempt: false,
		}

		// Find checkpoint data if exists
		for _, checkpoint := range checkpoints {
			if checkpoint.TierNumber == tier {
				status.IsPassed = checkpoint.IsPassed
				status.Attempts = checkpoint.Attempts
				break
			}
		}

		// Calculate can_attempt: all topics in tier must have ≥70% confidence
		status.CanAttempt = s.canAttemptCheckpoint(tier, masteryData)

		response.Checkpoints[tier] = status
	}

	return response, nil
}

// canAttemptCheckpoint checks if user has completed all topics in a tier
func (s *CheckpointService) canAttemptCheckpoint(tier int, masteryData []models.UserMastery) bool {
	// Get all topics in the tier
	tierTopics := getTopicsForTier(tier)
	if len(tierTopics) == 0 {
		return false
	}

	// Check if ALL topics in tier have ≥70% confidence
	for _, topicKey := range tierTopics {
		found := false
		for _, mastery := range masteryData {
			if mastery.TopicKey == topicKey {
				if mastery.Confidence < 70 {
					return false // Topic not ready
				}
				found = true
				break
			}
		}
		if !found {
			return false // Topic not initialized
		}
	}

	return true
}

// AttemptCheckpoint validates code and updates checkpoint if passed
func (s *CheckpointService) AttemptCheckpoint(firebaseUID string, req *models.CheckpointAttemptRequest) (*models.CheckpointJudgeResponse, error) {
	// Get checkpoint
	checkpoint, err := s.checkpointRepo.GetByFirebaseUIDAndTier(firebaseUID, req.TierNumber)
	if err != nil {
		return nil, fmt.Errorf("failed to get checkpoint: %w", err)
	}
	if checkpoint == nil {
		return nil, fmt.Errorf("checkpoint not found for tier %d", req.TierNumber)
	}

	// Verify user can attempt (all tier topics >= 70%)
	masteryData, err := s.masteryRepo.GetAllByUserID(firebaseUID)
	if err != nil {
		return nil, fmt.Errorf("failed to get mastery: %w", err)
	}

	canAttempt := s.canAttemptCheckpoint(req.TierNumber, masteryData)
	if !canAttempt {
		return nil, fmt.Errorf("cannot attempt checkpoint: complete all tier %d topics first", req.TierNumber)
	}

	// Get checkpoint problem details
	checkpointProblem := getCheckpointProblem(req.TierNumber)
	if checkpointProblem == nil {
		return nil, fmt.Errorf("checkpoint problem not found for tier %d", req.TierNumber)
	}

	// Record attempt
	err = s.checkpointRepo.RecordAttempt(firebaseUID, req.TierNumber, req.Code)
	if err != nil {
		return nil, fmt.Errorf("failed to record attempt: %w", err)
	}

	// Call Gemini judge with checkpoint-specific validation
	judgeResult, err := s.geminiService.JudgeCheckpoint(
		req.Code,
		req.TierNumber,
		checkpointProblem.RequiredPatterns,
		checkpointProblem.Description,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to judge checkpoint: %w", err)
	}

	// Get updated attempts count
	updatedCheckpoint, _ := s.checkpointRepo.GetByFirebaseUIDAndTier(firebaseUID, req.TierNumber)
	attempts := 0
	if updatedCheckpoint != nil {
		attempts = updatedCheckpoint.Attempts
	}

	// Build response
	response := &models.CheckpointJudgeResponse{
		Verdict:         judgeResult["verdict"].(string),
		Feedback:        judgeResult["feedback"].(string),
		PatternsFound:   convertToStringSlice(judgeResult["patterns_found"]),
		MissingPatterns: convertToStringSlice(judgeResult["missing_patterns"]),
		IsPassed:        false,
		Attempts:        attempts,
	}

	// If ADVANCE, mark checkpoint as passed
	if response.Verdict == "ADVANCE" {
		err = s.checkpointRepo.MarkAsPassed(firebaseUID, req.TierNumber)
		if err != nil {
			return nil, fmt.Errorf("failed to mark checkpoint as passed: %w", err)
		}
		response.IsPassed = true
	}

	return response, nil
}

// Helper function to get topics for a specific tier
func getTopicsForTier(tier int) []string {
	tierMap := map[int][]string{
		0: {"ARRAY_SCAN", "RECURSION_ROOTS"},
		1: {"SORTING", "HASHING", "STACKS"},
		2: {"PREFIX_SUM", "TWO_POINTERS", "QUEUES", "LINKED_LISTS"},
		3: {"SLIDING_WINDOW", "BINARY_SEARCH", "MONOTONIC_STACK"},
		4: {"BINARY_TREES", "INTERVALS", "GREEDY"},
		5: {"DFS_BFS", "BACKTRACKING", "TRIES"},
		6: {"TOPOLOGICAL_SORT", "UNION_FIND", "BIT_MANIPULATION"},
	}
	return tierMap[tier]
}

// Helper function to get checkpoint problem metadata
func getCheckpointProblem(tier int) *CheckpointProblem {
	problems := map[int]*CheckpointProblem{
		0: {
			Description:      "Generate all subsets (power set) using recursion and array iteration",
			RequiredPatterns: []string{"Array Iteration", "Recursive Backtracking"},
		},
		1: {
			Description:      "Merge overlapping intervals with hash deduplication and stack validation",
			RequiredPatterns: []string{"Sorting", "Hashing", "Stack"},
		},
		2: {
			Description:      "Maximum sum subarray with prefix sum optimization and sliding window",
			RequiredPatterns: []string{"Prefix Sum", "Sliding Window", "Queue"},
		},
		3: {
			Description:      "Largest rectangle in histogram using binary search and monotonic stack",
			RequiredPatterns: []string{"Binary Search", "Monotonic Stack", "Sliding Window"},
		},
		4: {
			Description:      "Maximum non-overlapping intervals in binary tree with greedy selection",
			RequiredPatterns: []string{"Tree Traversal", "Interval Merging", "Greedy"},
		},
		5: {
			Description:      "Word Search II using Trie construction, DFS traversal, and backtracking",
			RequiredPatterns: []string{"Trie", "DFS", "Backtracking"},
		},
		6: {
			Description:      "Course scheduling with topological sort, union-find, and bitmask states",
			RequiredPatterns: []string{"Topological Sort", "Union-Find", "Bit Manipulation"},
		},
	}
	return problems[tier]
}

type CheckpointProblem struct {
	Description      string
	RequiredPatterns []string
}

// Helper function to convert interface{} to []string
func convertToStringSlice(data interface{}) []string {
	if data == nil {
		return []string{}
	}
	if slice, ok := data.([]interface{}); ok {
		result := make([]string, len(slice))
		for i, v := range slice {
			if str, ok := v.(string); ok {
				result[i] = str
			}
		}
		return result
	}
	if slice, ok := data.([]string); ok {
		return slice
	}
	return []string{}
}
