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
		SELECT id, firebase_uid, email, name, photo_url, created_at, updated_at
		FROM users
		WHERE firebase_uid = ?
	`

	var user models.User
	err := r.db.QueryRow(query, firebaseUID).Scan(
		&user.ID,
		&user.FirebaseUID,
		&user.Email,
		&user.Name,
		&user.PhotoURL,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, nil // User not found
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get user: %w", err)
	}

	return &user, nil
}

// Create creates a new user
func (r *UserRepository) Create(req *models.CreateUserRequest) (*models.User, error) {
	query := `
		INSERT INTO users (firebase_uid, email, name, photo_url)
		VALUES (?, ?, ?, ?)
	`

	result, err := r.db.Exec(query, req.FirebaseUID, req.Email, req.Name, req.PhotoURL)
	if err != nil {
		return nil, fmt.Errorf("failed to create user: %w", err)
	}

	id, err := result.LastInsertId()
	if err != nil {
		return nil, fmt.Errorf("failed to get last insert id: %w", err)
	}

	// Fetch the created user
	return r.GetByID(id)
}

// GetByID finds a user by their ID
func (r *UserRepository) GetByID(id int64) (*models.User, error) {
	query := `
		SELECT id, firebase_uid, email, name, photo_url, created_at, updated_at
		FROM users
		WHERE id = ?
	`

	var user models.User
	err := r.db.QueryRow(query, id).Scan(
		&user.ID,
		&user.FirebaseUID,
		&user.Email,
		&user.Name,
		&user.PhotoURL,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		return nil, fmt.Errorf("failed to get user by id: %w", err)
	}

	return &user, nil
}
