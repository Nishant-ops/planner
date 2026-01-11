package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/yourusername/skilltree/internal/config"
	"github.com/yourusername/skilltree/internal/database"
	"github.com/yourusername/skilltree/internal/handler"
	"github.com/yourusername/skilltree/internal/middleware"
	"github.com/yourusername/skilltree/internal/repository"
	"github.com/yourusername/skilltree/internal/router"
	"github.com/yourusername/skilltree/internal/service"
	"github.com/yourusername/skilltree/pkg/firebase"
)

func main() {
	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// Initialize database
	db, err := database.NewMySQLConnection(cfg.GetDSN(), cfg.DBMaxConnections)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()
	log.Println("Database connection established")

	// Initialize Firebase
	ctx := context.Background()
	firebaseApp, err := firebase.InitializeApp(ctx, cfg.FirebaseServiceAccountKey)
	if err != nil {
		log.Fatalf("Failed to initialize Firebase: %v", err)
	}

	firebaseAuth, err := firebase.GetAuthClient(ctx, firebaseApp)
	if err != nil {
		log.Fatalf("Failed to get Firebase Auth client: %v", err)
	}
	log.Println("Firebase initialized")

	// Initialize repositories
	userRepo := repository.NewUserRepository(db)
	masteryRepo := repository.NewMasteryRepository(db)
	checkpointRepo := repository.NewCheckpointRepository(db)

	// Initialize services
	authService := service.NewAuthService(userRepo, masteryRepo, checkpointRepo)
	masteryService := service.NewMasteryService(masteryRepo, userRepo)
	geminiService := service.NewGeminiService(cfg.GeminiAPIKey, cfg.GeminiAPIURL)
	checkpointService := service.NewCheckpointService(checkpointRepo, masteryRepo, geminiService)

	// Initialize handlers
	authHandler := handler.NewAuthHandler(authService)
	masteryHandler := handler.NewMasteryHandler(masteryService)
	aiHandler := handler.NewAIHandler(geminiService, masteryService)
	checkpointHandler := handler.NewCheckpointHandler(checkpointService)

	// Initialize middleware
	corsMiddleware := middleware.CORSMiddleware(cfg.CORSAllowedOrigins)

	// Setup router
	r := router.NewRouter(authHandler, masteryHandler, aiHandler, checkpointHandler, firebaseAuth, corsMiddleware)

	// Create server
	srv := &http.Server{
		Addr:         fmt.Sprintf(":%s", cfg.Port),
		Handler:      r,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// Start server in a goroutine
	go func() {
		log.Printf("Server starting on port %s", cfg.Port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server failed to start: %v", err)
		}
	}()

	// Graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("Server is shutting down...")

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}

	log.Println("Server exited properly")
}
