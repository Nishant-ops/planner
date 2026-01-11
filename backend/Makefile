.PHONY: help run build test migrate-up migrate-down migrate-create migrate-version clean

# Variables
DB_USER ?= skilltree_user
DB_PASSWORD ?= password
DB_HOST ?= localhost
DB_PORT ?= 3306
DB_NAME ?= skilltree_db
DB_DSN := "mysql://$(DB_USER):$(DB_PASSWORD)@tcp($(DB_HOST):$(DB_PORT))/$(DB_NAME)?multiStatements=true"

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

run: ## Run the application
	@echo "Starting server..."
	go run cmd/api/main.go

build: ## Build the application
	@echo "Building..."
	go build -o bin/api cmd/api/main.go
	@echo "Build complete: bin/api"

test: ## Run tests
	go test -v ./...

migrate-up: ## Run all up migrations
	@echo "Running migrations..."
	migrate -database $(DB_DSN) -path migrations up
	@echo "Migrations complete"

migrate-down: ## Rollback all migrations
	@echo "Rolling back migrations..."
	migrate -database $(DB_DSN) -path migrations down
	@echo "Rollback complete"

migrate-create: ## Create a new migration (usage: make migrate-create name=create_table_name)
	@if [ -z "$(name)" ]; then \
		echo "Error: name parameter is required"; \
		echo "Usage: make migrate-create name=create_table_name"; \
		exit 1; \
	fi
	migrate create -ext sql -dir migrations -seq $(name)

migrate-version: ## Show current migration version
	migrate -database $(DB_DSN) -path migrations version

deps: ## Install Go dependencies
	go mod download
	go mod tidy

clean: ## Clean build artifacts
	rm -rf bin/
	@echo "Clean complete"

dev: ## Run with hot reload (requires air: go install github.com/cosmtrek/air@latest)
	air

.DEFAULT_GOAL := help
