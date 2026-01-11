package models

import (
	"database/sql"
)

type TierCheckpoint struct {
	ID            int64        `json:"id"`
	UserID        int64        `json:"user_id"`
	TierNumber    int          `json:"tier_number"`
	IsPassed      bool         `json:"is_passed"`
	Attempts      int          `json:"attempts"`
	LastAttemptAt sql.NullTime `json:"last_attempt_at,omitempty"`
	PassedAt      sql.NullTime `json:"passed_at,omitempty"`
	SubmittedCode string       `json:"submitted_code,omitempty"`
	CreatedAt     sql.NullTime `json:"created_at"`
	UpdatedAt     sql.NullTime `json:"updated_at"`
}

type CheckpointAttemptRequest struct {
	TierNumber int    `json:"tier_number"`
	Code       string `json:"code"`
}

type CheckpointJudgeResponse struct {
	Verdict         string   `json:"verdict"`
	Feedback        string   `json:"feedback"`
	PatternsFound   []string `json:"patterns_found"`
	MissingPatterns []string `json:"missing_patterns"`
	IsPassed        bool     `json:"is_passed"`
	Attempts        int      `json:"attempts"`
}

type CheckpointStatus struct {
	TierNumber int  `json:"tier_number"`
	IsPassed   bool `json:"is_passed"`
	Attempts   int  `json:"attempts"`
	CanAttempt bool `json:"can_attempt"`
}

type CheckpointResponse struct {
	Checkpoints map[int]CheckpointStatus `json:"checkpoints"`
}
