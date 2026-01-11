package handler

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/yourusername/skilltree/internal/models"
	"github.com/yourusername/skilltree/internal/service"
)

type AuthHandler struct {
	authService *service.AuthService
}

func NewAuthHandler(authService *service.AuthService) *AuthHandler {
	return &AuthHandler{authService: authService}
}

// Register handles user registration
// POST /api/auth/register
func (h *AuthHandler) Register(w http.ResponseWriter, r *http.Request) {
	var req models.CreateUserRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"Invalid request body"}`, http.StatusBadRequest)
		return
	}

	// Validate required fields
	if req.FirebaseUID == "" || req.Email == "" {
		http.Error(w, `{"error":"firebase_uid and email are required"}`, http.StatusBadRequest)
		return
	}

	user, isNew, err := h.authService.RegisterOrGetUser(&req)
	if err != nil {
		log.Printf("Failed to register user: %v", err)
		http.Error(w, `{"error":"Failed to register user"}`, http.StatusInternalServerError)
		return
	}

	response := map[string]interface{}{
		"user":   user,
		"is_new": isNew,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
