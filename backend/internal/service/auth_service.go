package service

import (
	"fmt"

	"github.com/yourusername/skilltree/internal/config"
	"github.com/yourusername/skilltree/internal/models"
	"github.com/yourusername/skilltree/internal/repository"
)

type AuthService struct {
	userRepo    *repository.UserRepository
	masteryRepo *repository.MasteryRepository
}

func NewAuthService(userRepo *repository.UserRepository, masteryRepo *repository.MasteryRepository) *AuthService {
	return &AuthService{
		userRepo:    userRepo,
		masteryRepo: masteryRepo,
	}
}

// RegisterOrGetUser creates a new user or returns existing user
func (s *AuthService) RegisterOrGetUser(req *models.CreateUserRequest) (*models.User, bool, error) {
	// Check if user already exists
	existingUser, err := s.userRepo.GetByFirebaseUID(req.FirebaseUID)
	if err != nil {
		return nil, false, fmt.Errorf("failed to check existing user: %w", err)
	}

	// User exists, return it
	if existingUser != nil {
		return existingUser, false, nil
	}

	// Create new user
	user, err := s.userRepo.Create(req)
	if err != nil {
		return nil, false, fmt.Errorf("failed to create user: %w", err)
	}

	// Initialize mastery for all 22 topics
	if err := s.masteryRepo.InitializeUserMastery(user.ID, config.AllTopics); err != nil {
		return nil, false, fmt.Errorf("failed to initialize mastery: %w", err)
	}

	return user, true, nil
}
