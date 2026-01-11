package repository

import (
	"database/sql"
	"encoding/json"
	"fmt"

	"github.com/yourusername/skilltree/internal/models"
)

type MasteryRepository struct {
	db *sql.DB
}

func NewMasteryRepository(db *sql.DB) *MasteryRepository {
	return &MasteryRepository{db: db}
}

// GetAllByUserID retrieves all mastery records for a user
func (r *MasteryRepository) GetAllByUserID(userID int64) ([]models.UserMastery, error) {
	query := `
		SELECT id, user_id, topic_key, confidence, solved_problems, updated_at
		FROM user_mastery
		WHERE user_id = ?
		ORDER BY topic_key
	`

	rows, err := r.db.Query(query, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to query mastery: %w", err)
	}
	defer rows.Close()

	var masteries []models.UserMastery
	for rows.Next() {
		var m models.UserMastery
		var solvedJSON []byte

		err := rows.Scan(&m.ID, &m.UserID, &m.TopicKey, &m.Confidence, &solvedJSON, &m.UpdatedAt)
		if err != nil {
			return nil, fmt.Errorf("failed to scan mastery: %w", err)
		}

		// Parse JSON array
		if err := json.Unmarshal(solvedJSON, &m.SolvedProblems); err != nil {
			return nil, fmt.Errorf("failed to unmarshal solved_problems: %w", err)
		}

		masteries = append(masteries, m)
	}

	return masteries, nil
}

// GetByUserAndTopic retrieves mastery for a specific user and topic
func (r *MasteryRepository) GetByUserAndTopic(userID int64, topicKey string) (*models.UserMastery, error) {
	query := `
		SELECT id, user_id, topic_key, confidence, solved_problems, updated_at
		FROM user_mastery
		WHERE user_id = ? AND topic_key = ?
	`

	var m models.UserMastery
	var solvedJSON []byte

	err := r.db.QueryRow(query, userID, topicKey).Scan(
		&m.ID, &m.UserID, &m.TopicKey, &m.Confidence, &solvedJSON, &m.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get mastery: %w", err)
	}

	if err := json.Unmarshal(solvedJSON, &m.SolvedProblems); err != nil {
		return nil, fmt.Errorf("failed to unmarshal solved_problems: %w", err)
	}

	return &m, nil
}

// Upsert creates or updates a mastery record
func (r *MasteryRepository) Upsert(mastery *models.UserMastery) error {
	solvedJSON, err := json.Marshal(mastery.SolvedProblems)
	if err != nil {
		return fmt.Errorf("failed to marshal solved_problems: %w", err)
	}

	query := `
		INSERT INTO user_mastery (user_id, topic_key, confidence, solved_problems)
		VALUES (?, ?, ?, ?)
		ON DUPLICATE KEY UPDATE
			confidence = VALUES(confidence),
			solved_problems = VALUES(solved_problems)
	`

	_, err = r.db.Exec(query, mastery.UserID, mastery.TopicKey, mastery.Confidence, solvedJSON)
	if err != nil {
		return fmt.Errorf("failed to upsert mastery: %w", err)
	}

	return nil
}

// InitializeUserMastery creates all mastery records for a new user (all at 0% confidence)
func (r *MasteryRepository) InitializeUserMastery(userID int64, topics []string) error {
	tx, err := r.db.Begin()
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback()

	query := `
		INSERT INTO user_mastery (user_id, topic_key, confidence, solved_problems)
		VALUES (?, ?, 0, '[]')
	`

	stmt, err := tx.Prepare(query)
	if err != nil {
		return fmt.Errorf("failed to prepare statement: %w", err)
	}
	defer stmt.Close()

	for _, topicKey := range topics {
		if _, err := stmt.Exec(userID, topicKey); err != nil {
			return fmt.Errorf("failed to initialize mastery for %s: %w", topicKey, err)
		}
	}

	if err := tx.Commit(); err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}

	return nil
}
