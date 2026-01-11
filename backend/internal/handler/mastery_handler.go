package handler

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/yourusername/skilltree/internal/middleware"
	"github.com/yourusername/skilltree/internal/models"
	"github.com/yourusername/skilltree/internal/service"
)

type MasteryHandler struct {
	masteryService *service.MasteryService
}

func NewMasteryHandler(masteryService *service.MasteryService) *MasteryHandler {
	return &MasteryHandler{masteryService: masteryService}
}

// GetMastery retrieves all mastery data for authenticated user
// GET /api/mastery
func (h *MasteryHandler) GetMastery(w http.ResponseWriter, r *http.Request) {
	firebaseUID, ok := middleware.GetFirebaseUID(r.Context())
	if !ok {
		http.Error(w, `{"error":"Unauthorized"}`, http.StatusUnauthorized)
		return
	}

	mastery, err := h.masteryService.GetMasteryByFirebaseUID(firebaseUID)
	if err != nil {
		http.Error(w, `{"error":"Failed to get mastery"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(mastery)
}

// UpdateMastery updates mastery for a specific topic
// PUT /api/mastery/:topicKey
func (h *MasteryHandler) UpdateMastery(w http.ResponseWriter, r *http.Request) {
	firebaseUID, ok := middleware.GetFirebaseUID(r.Context())
	if !ok {
		http.Error(w, `{"error":"Unauthorized"}`, http.StatusUnauthorized)
		return
	}

	topicKey := chi.URLParam(r, "topicKey")
	if topicKey == "" {
		http.Error(w, `{"error":"topic_key is required"}`, http.StatusBadRequest)
		return
	}

	var req models.UpdateMasteryRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"Invalid request body"}`, http.StatusBadRequest)
		return
	}

	if err := h.masteryService.UpdateMastery(firebaseUID, topicKey, &req); err != nil {
		http.Error(w, `{"error":"Failed to update mastery"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]bool{"success": true})
}
