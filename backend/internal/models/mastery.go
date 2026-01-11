package models

import "time"

type UserMastery struct {
	ID             int64     `json:"id"`
	UserID         int64     `json:"user_id"`
	TopicKey       string    `json:"topic_key"`
	Confidence     int       `json:"confidence"`
	SolvedProblems []string  `json:"solved_problems"`
	UpdatedAt      time.Time `json:"updated_at"`
}

type UpdateMasteryRequest struct {
	Confidence     int      `json:"confidence"`
	SolvedProblems []string `json:"solved_problems"`
}

// MasteryResponse represents the mastery data sent to frontend
type MasteryResponse struct {
	Mastery map[string]MasteryData `json:"mastery"`
}

type MasteryData struct {
	Confidence int      `json:"confidence"`
	Solved     []string `json:"solved"`
}
