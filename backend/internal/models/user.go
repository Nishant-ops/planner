package models

import (
	"database/sql"
)

type User struct {
	ID          int64        `json:"id"`
	FirebaseUID string       `json:"firebase_uid"`
	Email       string       `json:"email"`
	Name        string       `json:"name"`
	PhotoURL    string       `json:"photo_url"`
	CreatedAt   sql.NullTime `json:"created_at"`
	UpdatedAt   sql.NullTime `json:"updated_at"`
}

type CreateUserRequest struct {
	FirebaseUID string `json:"firebase_uid"`
	Email       string `json:"email"`
	Name        string `json:"name"`
	PhotoURL    string `json:"photo_url"`
}
