package middleware

import (
	"context"
	"net/http"
	"strings"

	"firebase.google.com/go/auth"
)

type contextKey string

const (
	// UserIDKey is the context key for the Firebase UID
	UserIDKey contextKey = "firebaseUID"
)

// AuthMiddleware validates Firebase ID tokens
func AuthMiddleware(authClient *auth.Client) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				http.Error(w, `{"error":"Missing authorization header"}`, http.StatusUnauthorized)
				return
			}

			// Extract token from "Bearer <token>"
			parts := strings.Split(authHeader, " ")
			if len(parts) != 2 || parts[0] != "Bearer" {
				http.Error(w, `{"error":"Invalid authorization header format"}`, http.StatusUnauthorized)
				return
			}

			tokenString := parts[1]

			// Verify the ID token
			token, err := authClient.VerifyIDToken(context.Background(), tokenString)
			if err != nil {
				http.Error(w, `{"error":"Invalid or expired token"}`, http.StatusUnauthorized)
				return
			}

			// Add Firebase UID to request context
			ctx := context.WithValue(r.Context(), UserIDKey, token.UID)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

// GetFirebaseUID retrieves the Firebase UID from the request context
func GetFirebaseUID(ctx context.Context) (string, bool) {
	uid, ok := ctx.Value(UserIDKey).(string)
	return uid, ok
}
