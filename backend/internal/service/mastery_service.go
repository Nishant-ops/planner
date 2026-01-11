package service

import (
	"fmt"

	"github.com/yourusername/skilltree/internal/models"
	"github.com/yourusername/skilltree/internal/repository"
)

type MasteryService struct {
	masteryRepo *repository.MasteryRepository
	userRepo    *repository.UserRepository
}

func NewMasteryService(masteryRepo *repository.MasteryRepository, userRepo *repository.UserRepository) *MasteryService {
	return &MasteryService{
		masteryRepo: masteryRepo,
		userRepo:    userRepo,
	}
}

// GetMasteryByFirebaseUID retrieves all mastery data for a user by Firebase UID
func (s *MasteryService) GetMasteryByFirebaseUID(firebaseUID string) (*models.MasteryResponse, error) {
	// Get user by Firebase UID
	user, err := s.userRepo.GetByFirebaseUID(firebaseUID)
	if err != nil {
		return nil, fmt.Errorf("failed to get user: %w", err)
	}
	if user == nil {
		return nil, fmt.Errorf("user not found")
	}

	// Get all mastery records
	masteries, err := s.masteryRepo.GetAllByUserID(user.FirebaseUID)
	if err != nil {
		return nil, fmt.Errorf("failed to get mastery: %w", err)
	}

	// Convert to response format
	response := &models.MasteryResponse{
		Mastery: make(map[string]models.MasteryData),
	}

	for _, m := range masteries {
		response.Mastery[m.TopicKey] = models.MasteryData{
			Confidence: m.Confidence,
			Solved:     m.SolvedProblems,
		}
	}

	return response, nil
}

// UpdateMastery updates mastery for a specific topic
func (s *MasteryService) UpdateMastery(firebaseUID, topicKey string, req *models.UpdateMasteryRequest) error {
	// Get user by Firebase UID
	user, err := s.userRepo.GetByFirebaseUID(firebaseUID)
	if err != nil {
		return fmt.Errorf("failed to get user: %w", err)
	}
	if user == nil {
		return fmt.Errorf("user not found")
	}

	// Validate confidence range
	if req.Confidence < 0 || req.Confidence > 100 {
		return fmt.Errorf("confidence must be between 0 and 100")
	}

	// Create mastery record
	mastery := &models.UserMastery{
		FirebaseUID:    user.FirebaseUID,
		TopicKey:       topicKey,
		Confidence:     req.Confidence,
		SolvedProblems: req.SolvedProblems,
	}

	// Upsert mastery
	if err := s.masteryRepo.Upsert(mastery); err != nil {
		return fmt.Errorf("failed to update mastery: %w", err)
	}

	return nil
}
