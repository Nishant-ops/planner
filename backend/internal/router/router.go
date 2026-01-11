package router

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"firebase.google.com/go/auth"

	"github.com/yourusername/skilltree/internal/handler"
	"github.com/yourusername/skilltree/internal/middleware"
)

func NewRouter(
	authHandler *handler.AuthHandler,
	masteryHandler *handler.MasteryHandler,
	aiHandler *handler.AIHandler,
	firebaseAuth *auth.Client,
	corsMiddleware *cors.Cors) *chi.Mux {

	r := chi.NewRouter()

	// Global middleware
	r.Use(middleware.LoggingMiddleware)
	r.Use(corsMiddleware.Handler)

	// Health check
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("OK"))
	})

	// API routes
	r.Route("/api", func(r chi.Router) {
		// Public routes (no auth required)
		r.Post("/auth/register", authHandler.Register)

		// Protected routes (require Firebase auth)
		r.Group(func(r chi.Router) {
			r.Use(middleware.AuthMiddleware(firebaseAuth))

			// Mastery endpoints
			r.Get("/mastery", masteryHandler.GetMastery)
			r.Put("/mastery/{topicKey}", masteryHandler.UpdateMastery)

			// AI endpoints
			r.Post("/ai/chat", aiHandler.Chat)
			r.Post("/ai/complexity", aiHandler.Complexity)
			r.Post("/ai/judge", aiHandler.Judge)
		})
	})

	return r
}
