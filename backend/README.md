# SkillTree Backend

Go backend for the SkillTree DSA learning platform.

## Prerequisites

- Go 1.21+
- MySQL 8.0+
- [golang-migrate CLI](https://github.com/golang-migrate/migrate/tree/master/cmd/migrate)
- Firebase project with service account credentials
- Gemini API key

## Setup

### 1. Install Dependencies

```bash
make deps
```

### 2. Install golang-migrate

**macOS:**
```bash
brew install golang-migrate
```

**Linux:**
```bash
curl -L https://github.com/golang-migrate/migrate/releases/download/v4.16.2/migrate.linux-amd64.tar.gz | tar xvz
sudo mv migrate /usr/local/bin/
```

### 3. Create Database

```bash
mysql -u root -p -e "CREATE DATABASE skilltree_db;"
mysql -u root -p -e "CREATE USER 'skilltree_user'@'localhost' IDENTIFIED BY 'your_password';"
mysql -u root -p -e "GRANT ALL PRIVILEGES ON skilltree_db.* TO 'skilltree_user'@'localhost';"
mysql -u root -p -e "FLUSH PRIVILEGES;"
```

### 4. Configure Environment

```bash
cp .env.example .env
# Edit .env with your actual credentials
```

### 5. Run Migrations

```bash
make migrate-up
```

### 6. Run the Server

```bash
make run
```

Server will start on `http://localhost:8080`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register/login user (requires Firebase token in body)

### Mastery (Protected)
- `GET /api/mastery` - Get all user mastery data
- `PUT /api/mastery/:topicKey` - Update mastery for a topic

### AI (Protected)
- `POST /api/ai/chat` - Chat with topic Architect
- `POST /api/ai/complexity` - Analyze code complexity
- `POST /api/ai/judge` - Judge code submission

## Development

### Run with hot reload
```bash
go install github.com/cosmtrek/air@latest
make dev
```

### Run tests
```bash
make test
```

### Create a new migration
```bash
make migrate-create name=add_new_table
```

## Database Migrations

### Run all migrations
```bash
make migrate-up
```

### Rollback all migrations
```bash
make migrate-down
```

### Check migration version
```bash
make migrate-version
```

## Build for Production

```bash
make build
./bin/api
```

## Project Structure

```
backend/
├── cmd/api/              # Application entry point
├── internal/
│   ├── config/           # Configuration management
│   ├── database/         # Database connection
│   ├── handler/          # HTTP handlers
│   ├── middleware/       # HTTP middleware
│   ├── models/           # Data models
│   ├── repository/       # Database queries
│   ├── router/           # Route definitions
│   └── service/          # Business logic
├── migrations/           # SQL migration files
└── pkg/firebase/         # Firebase integration
```
