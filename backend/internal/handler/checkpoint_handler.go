package handler

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/yourusername/skilltree/internal/models"
	"github.com/yourusername/skilltree/internal/service"
)

type CheckpointHandler struct {
	checkpointService *service.CheckpointService
}

func NewCheckpointHandler(checkpointService *service.CheckpointService) *CheckpointHandler {
	return &CheckpointHandler{checkpointService: checkpointService}
}

// GetCheckpoints retrieves all checkpoint statuses for the authenticated user
// GET /api/checkpoints
func (h *CheckpointHandler) GetCheckpoints(w http.ResponseWriter, r *http.Request) {
	// Get Firebase UID from context (set by auth middleware)
	firebaseUID, ok := r.Context().Value("firebase_uid").(string)
	if !ok {
		http.Error(w, `{"error":"Unauthorized"}`, http.StatusUnauthorized)
		return
	}

	checkpointStatus, err := h.checkpointService.GetCheckpointStatus(firebaseUID)
	if err != nil {
		log.Printf("Failed to get checkpoint status: %v", err)
		http.Error(w, `{"error":"Failed to get checkpoint status"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(checkpointStatus)
}

// AttemptCheckpoint handles checkpoint problem submission
// POST /api/checkpoints/attempt
func (h *CheckpointHandler) AttemptCheckpoint(w http.ResponseWriter, r *http.Request) {
	// Get Firebase UID from context (set by auth middleware)
	firebaseUID, ok := r.Context().Value("firebase_uid").(string)
	if !ok {
		http.Error(w, `{"error":"Unauthorized"}`, http.StatusUnauthorized)
		return
	}

	var req models.CheckpointAttemptRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"Invalid request body"}`, http.StatusBadRequest)
		return
	}

	// Validate tier number
	if req.TierNumber < 0 || req.TierNumber > 6 {
		http.Error(w, `{"error":"Invalid tier number (must be 0-6)"}`, http.StatusBadRequest)
		return
	}

	// Validate code is provided
	if req.Code == "" {
		http.Error(w, `{"error":"Code is required"}`, http.StatusBadRequest)
		return
	}

	// Attempt checkpoint
	result, err := h.checkpointService.AttemptCheckpoint(firebaseUID, &req)
	if err != nil {
		log.Printf("Failed to attempt checkpoint: %v", err)
		// Check if it's a validation error (can't attempt yet)
		if err.Error() == "cannot attempt checkpoint: complete all tier topics first" ||
		   err.Error()[:len("cannot attempt checkpoint")] == "cannot attempt checkpoint" {
			http.Error(w, `{"error":"Cannot attempt checkpoint yet. Complete all tier topics first."}`, http.StatusForbidden)
			return
		}
		http.Error(w, `{"error":"Failed to judge checkpoint"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}
