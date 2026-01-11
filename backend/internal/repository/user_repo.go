package repository

import (
	"database/sql"
	"fmt"

	"github.com/yourusername/skilltree/internal/models"
)

type UserRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{db: db}
}

// GetByFirebaseUID finds a user by their Firebase UID
func (r *UserRepository) GetByFirebaseUID(firebaseUID string) (*models.User, error) {
	query := `
		SELECT uid, email, name, created_at, updated_at
		FROM users
		WHERE uid = ?
	`

	var user models.User
	var photoURL sql.NullString
	err := r.db.QueryRow(query, firebaseUID).Scan(
		&user.FirebaseUID,
		&user.Email,
		&user.Name,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, nil // User not found
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get user: %w", err)
	}

	user.ID = 0 // Not used in this schema
	user.PhotoURL = photoURL.String

	return &user, nil
}

// Create creates a new user
func (r *UserRepository) Create(req *models.CreateUserRequest) (*models.User, error) {
	query := `
		INSERT INTO users (uid, email, name)
		VALUES (?, ?, ?)
	`

	_, err := r.db.Exec(query, req.FirebaseUID, req.Email, req.Name)
	if err != nil {
		return nil, fmt.Errorf("failed to create user: %w", err)
	}

	// Fetch the created user
	return r.GetByFirebaseUID(req.FirebaseUID)
}

// GetByID finds a user by their ID (kept for compatibility, but uid is the primary key)
func (r *UserRepository) GetByID(id int64) (*models.User, error) {
	// Since uid is the primary key, this method is not directly usable
	// Return error for now
	return nil, fmt.Errorf("GetByID not supported with uid-based schema")
}
