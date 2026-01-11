package handler

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/yourusername/skilltree/internal/data"
	"github.com/yourusername/skilltree/internal/middleware"
	"github.com/yourusername/skilltree/internal/models"
	"github.com/yourusername/skilltree/internal/service"
)

type AIHandler struct {
	geminiService  *service.GeminiService
	masteryService *service.MasteryService
}

func NewAIHandler(geminiService *service.GeminiService, masteryService *service.MasteryService) *AIHandler {
	return &AIHandler{
		geminiService:  geminiService,
		masteryService: masteryService,
	}
}

type ChatRequest struct {
	TopicKey string `json:"topic_key"`
	Message  string `json:"message"`
}

type ComplexityRequest struct {
	Code string `json:"code"`
}

type JudgeRequest struct {
	TopicKey  string `json:"topic_key"`
	ProblemID string `json:"problem_id"`
	Code      string `json:"code"`
}

// Chat handles AI chat requests
// POST /api/ai/chat
func (h *AIHandler) Chat(w http.ResponseWriter, r *http.Request) {
	var req ChatRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"Invalid request body"}`, http.StatusBadRequest)
		return
	}

	// Get topic info for system prompt
	topicInfo, ok := data.DAGStructure[req.TopicKey]
	if !ok {
		http.Error(w, `{"error":"Invalid topic"}`, http.StatusBadRequest)
		return
	}

	systemPrompt := fmt.Sprintf(`You are the %s Architect.
Your goal is to help the user understand the CONCEPT of %s using analogies and Socratic questioning.
DO NOT write code. Focus on the intuition, the "why", and the trade-offs.
Be concise, wise, and slightly cryptic but helpful. Keep responses under 50 words unless asked for detail.`,
		topicInfo.Label, topicInfo.Label)

	response, err := h.geminiService.ChatCompletion(req.Message, systemPrompt)
	if err != nil {
		http.Error(w, `{"error":"Failed to get AI response"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"response": response})
}

// Complexity analyzes code complexity
// POST /api/ai/complexity
func (h *AIHandler) Complexity(w http.ResponseWriter, r *http.Request) {
	var req ComplexityRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"Invalid request body"}`, http.StatusBadRequest)
		return
	}

	if req.Code == "" {
		http.Error(w, `{"error":"code is required"}`, http.StatusBadRequest)
		return
	}

	analysis, err := h.geminiService.ComplexityAnalysis(req.Code)
	if err != nil {
		http.Error(w, `{"error":"Failed to analyze complexity"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"analysis": analysis})
}

// Judge validates code and updates mastery
// POST /api/ai/judge
func (h *AIHandler) Judge(w http.ResponseWriter, r *http.Request) {
	firebaseUID, ok := middleware.GetFirebaseUID(r.Context())
	if !ok {
		http.Error(w, `{"error":"Unauthorized"}`, http.StatusUnauthorized)
		return
	}

	var req JudgeRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"Invalid request body"}`, http.StatusBadRequest)
		return
	}

	// Get problem info
	problems, ok := data.ProblemsDB[req.TopicKey]
	if !ok {
		http.Error(w, `{"error":"Invalid topic"}`, http.StatusBadRequest)
		return
	}

	var problem *data.Problem
	for _, p := range problems {
		if p.ID == req.ProblemID {
			problem = &p
			break
		}
	}

	if problem == nil {
		http.Error(w, `{"error":"Invalid problem"}`, http.StatusBadRequest)
		return
	}

	// Call Gemini judge
	result, err := h.geminiService.JudgeAudit(req.Code, req.TopicKey, problem.Title, problem.Invariant)
	if err != nil {
		http.Error(w, `{"error":"Failed to judge code"}`, http.StatusInternalServerError)
		return
	}

	// If verdict is ADVANCE, update mastery
	verdict, _ := result["verdict"].(string)
	if verdict == "ADVANCE" || verdict == "Optimal" {
		// Get current mastery
		masteryResp, err := h.masteryService.GetMasteryByFirebaseUID(firebaseUID)
		if err != nil {
			http.Error(w, `{"error":"Failed to get mastery"}`, http.StatusInternalServerError)
			return
		}

		currentMastery, ok := masteryResp.Mastery[req.TopicKey]
		if !ok {
			currentMastery = models.MasteryData{Confidence: 0, Solved: []string{}}
		}

		// Add problem to solved list if not already there
		solved := currentMastery.Solved
		alreadySolved := false
		for _, id := range solved {
			if id == req.ProblemID {
				alreadySolved = true
				break
			}
		}

		if !alreadySolved {
			solved = append(solved, req.ProblemID)
		}

		// Calculate new confidence (33% per problem, max 100%)
		newConfidence := (len(solved) * 100) / 3
		if newConfidence > 100 {
			newConfidence = 100
		}

		// Update mastery
		updateReq := &models.UpdateMasteryRequest{
			Confidence:     newConfidence,
			SolvedProblems: solved,
		}

		if err := h.masteryService.UpdateMastery(firebaseUID, req.TopicKey, updateReq); err != nil {
			http.Error(w, `{"error":"Failed to update mastery"}`, http.StatusInternalServerError)
			return
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}
