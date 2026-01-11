package repository

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/yourusername/skilltree/internal/models"
)

type CheckpointRepository struct {
	db *sql.DB
}

func NewCheckpointRepository(db *sql.DB) *CheckpointRepository {
	return &CheckpointRepository{db: db}
}

// GetAllByFirebaseUID retrieves all checkpoint records for a user
func (r *CheckpointRepository) GetAllByFirebaseUID(firebaseUID string) ([]models.TierCheckpoint, error) {
	query := `
		SELECT tc.id, tc.user_uid, tc.tier_number, tc.is_passed, tc.attempts,
		       tc.last_attempt_at, tc.passed_at, tc.submitted_code, tc.created_at, tc.updated_at
		FROM tier_checkpoints tc
		WHERE tc.user_uid = ?
		ORDER BY tc.tier_number ASC
	`

	rows, err := r.db.Query(query, firebaseUID)
	if err != nil {
		return nil, fmt.Errorf("failed to get checkpoints: %w", err)
	}
	defer rows.Close()

	var checkpoints []models.TierCheckpoint
	for rows.Next() {
		var checkpoint models.TierCheckpoint
		err := rows.Scan(
			&checkpoint.ID,
			&checkpoint.UserID,
			&checkpoint.TierNumber,
			&checkpoint.IsPassed,
			&checkpoint.Attempts,
			&checkpoint.LastAttemptAt,
			&checkpoint.PassedAt,
			&checkpoint.SubmittedCode,
			&checkpoint.CreatedAt,
			&checkpoint.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan checkpoint: %w", err)
		}
		checkpoints = append(checkpoints, checkpoint)
	}

	return checkpoints, nil
}

// GetByFirebaseUIDAndTier retrieves a specific tier checkpoint for a user
func (r *CheckpointRepository) GetByFirebaseUIDAndTier(firebaseUID string, tier int) (*models.TierCheckpoint, error) {
	query := `
		SELECT tc.id, tc.user_uid, tc.tier_number, tc.is_passed, tc.attempts,
		       tc.last_attempt_at, tc.passed_at, tc.submitted_code, tc.created_at, tc.updated_at
		FROM tier_checkpoints tc
		WHERE tc.user_uid = ? AND tc.tier_number = ?
	`

	var checkpoint models.TierCheckpoint
	err := r.db.QueryRow(query, firebaseUID, tier).Scan(
		&checkpoint.ID,
		&checkpoint.UserID,
		&checkpoint.TierNumber,
		&checkpoint.IsPassed,
		&checkpoint.Attempts,
		&checkpoint.LastAttemptAt,
		&checkpoint.PassedAt,
		&checkpoint.SubmittedCode,
		&checkpoint.CreatedAt,
		&checkpoint.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, nil // Checkpoint not found
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get checkpoint: %w", err)
	}

	return &checkpoint, nil
}

// RecordAttempt increments attempt counter and updates timestamp
func (r *CheckpointRepository) RecordAttempt(firebaseUID string, tier int, code string) error {
	query := `
		UPDATE tier_checkpoints
		SET attempts = attempts + 1,
		    last_attempt_at = ?,
		    submitted_code = ?
		WHERE user_uid = ? AND tier_number = ?
	`

	now := time.Now()
	_, err := r.db.Exec(query, now, code, firebaseUID, tier)
	if err != nil {
		return fmt.Errorf("failed to record attempt: %w", err)
	}

	return nil
}

// MarkAsPassed updates checkpoint to passed status
func (r *CheckpointRepository) MarkAsPassed(firebaseUID string, tier int) error {
	query := `
		UPDATE tier_checkpoints
		SET is_passed = TRUE,
		    passed_at = ?
		WHERE user_uid = ? AND tier_number = ?
	`

	now := time.Now()
	_, err := r.db.Exec(query, now, firebaseUID, tier)
	if err != nil {
		return fmt.Errorf("failed to mark checkpoint as passed: %w", err)
	}

	return nil
}

// InitializeCheckpoints creates all 7 checkpoint records for a new user
func (r *CheckpointRepository) InitializeCheckpoints(firebaseUID string) error {
	// Create 7 checkpoint records (tier 0-6)
	query := `
		INSERT INTO tier_checkpoints (user_uid, tier_number, is_passed)
		VALUES (?, ?, FALSE)
		ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP
	`

	for tier := 0; tier <= 6; tier++ {
		_, err := r.db.Exec(query, firebaseUID, tier)
		if err != nil {
			return fmt.Errorf("failed to initialize checkpoint for tier %d: %w", tier, err)
		}
	}

	return nil
}

// BatchMarkAsPassed marks multiple checkpoints as passed (for migration/backfill)
func (r *CheckpointRepository) BatchMarkAsPassed(firebaseUID string, tiers []int) error {
	query := `
		UPDATE tier_checkpoints
		SET is_passed = TRUE,
		    passed_at = ?
		WHERE user_uid = ? AND tier_number = ?
	`

	now := time.Now()
	for _, tier := range tiers {
		_, err := r.db.Exec(query, now, firebaseUID, tier)
		if err != nil {
			return fmt.Errorf("failed to mark checkpoint %d as passed: %w", tier, err)
		}
	}

	return nil
}
