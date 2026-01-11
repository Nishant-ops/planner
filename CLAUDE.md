# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**SkillTree** is a full-stack web application for mastering data structures and algorithms through a Directed Acyclic Graph (DAG) architecture. The app gamifies DSA learning by enforcing prerequisites—users must master foundational concepts before unlocking advanced topics.

**Architecture**: Vite + React frontend | Golang + MySQL backend | Firebase Auth | Gemini AI

## Tech Stack

### Frontend
- **Framework**: Vite + React
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Auth**: Firebase Authentication (Google OAuth)
- **HTTP Client**: Axios with auth interceptors
- **State**: React Context API (AuthContext, MasteryContext)

### Backend
- **Language**: Go 1.21+
- **Router**: chi/v5
- **Database**: MySQL 8.0+
- **Migrations**: golang-migrate
- **Auth**: Firebase Admin SDK (token validation)
- **AI**: Gemini 2.5 Flash API

### Database Schema
- `users`: Firebase UID, email, name, photo URL
- `user_mastery`: topic_key, confidence (0-100), solved_problems (JSON array)

## Running the Application

### Backend
```bash
cd backend
make deps          # Install dependencies
make migrate-up    # Run migrations
make run           # Start server (port 8080)
```

### Frontend
```bash
cd frontend
npm install
npm run dev        # Start dev server (port 5173)
```

See `SETUP_GUIDE.md` for complete setup instructions.

## Core Architecture

### DAG Structure
The learning path spans 22 topics across 8 tiers (0-7):
- **Tier 0**: Array Scan, Recursion Roots
- **Tier 1**: Sorting, Hashing, Stacks
- **Tier 2**: Prefix Sum, Two Pointers, Queues, Linked Lists
- **Tier 3**: Sliding Window, Binary Search, Monotonic Stack
- **Tier 4**: Binary Trees, Intervals, Greedy
- **Tier 5**: DFS/BFS, Backtracking, Tries
- **Tier 6**: Topological Sort, Union Find, Bit Manipulation
- **Tier 7**: Dynamic Programming

**Data Location**:
- Frontend: `frontend/src/data/dagStructure.js`
- Backend: `backend/internal/data/dag.go` (stub, not currently used)

### Progression Logic
- **Unlocking**: Topic unlocks when ALL prerequisites reach ≥70% confidence
- **Mastery**: Confidence = (solved_count / 3) × 100%, capped at 100%
- **Persistence**: Stored in `user_mastery` table (MySQL)
- **Logic Location**: `frontend/src/utils/dagLogic.js:getStatus()`

### AI Integration (Gemini API)

All AI features run through backend proxy for security:

1. **Architect Chat** (`POST /api/ai/chat`)
   - Topic-specific AI persona provides conceptual guidance
   - No code solutions, only Socratic questioning
   - Chat history resets per session (not persisted)

2. **Complexity Analysis** (`POST /api/ai/complexity`)
   - Analyzes Time/Space complexity of user code
   - Returns markdown-formatted analysis

3. **Judge Audit** (`POST /api/ai/judge`)
   - Validates code uses correct pattern/invariant
   - Returns `{ verdict: "ADVANCE" | "REPEAT", feedback }`
   - Auto-updates `user_mastery` on ADVANCE
   - Backend location: `backend/internal/service/gemini_service.go`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register/login user, initialize mastery

### Mastery (Protected)
- `GET /api/mastery` - Get all user mastery data
- `PUT /api/mastery/:topicKey` - Update mastery for topic

### AI Proxy (Protected)
- `POST /api/ai/chat` - Chat with topic Architect
- `POST /api/ai/complexity` - Analyze code complexity
- `POST /api/ai/judge` - Judge code submission

**Auth**: All protected endpoints require `Authorization: Bearer <firebase_token>` header

## Frontend Components

### Key Pages
- `HomePage` - Hero section (logged out) or Dashboard (logged in)
- `TreeView` - DAG visualization with all 22 topics by tier
- `HubView` - Topic detail (theory + Architect chat + problem list)
- `IDEView` - Code editor with problem description + judge

### State Management
- **AuthContext**: Firebase user, sign in/out methods
- **MasteryContext**: User mastery data, update/refresh methods
- **Location**: `frontend/src/contexts/`

### Routing
```
/ → HomePage
/tree → TreeView (protected)
/hub/:topicKey → HubView (protected)
/ide/:topicKey/:problemId → IDEView (protected)
```

## Backend Architecture

### Project Structure
```
backend/
├── cmd/api/main.go           # Entry point
├── internal/
│   ├── config/               # Environment config
│   ├── middleware/           # Auth, CORS, logging
│   ├── models/               # Data models
│   ├── repository/           # Database queries
│   ├── service/              # Business logic
│   ├── handler/              # HTTP handlers
│   ├── router/               # Route definitions
│   └── database/             # MySQL connection
├── migrations/               # SQL migrations
└── pkg/firebase/             # Firebase Admin SDK
```

### Critical Files

**Backend**:
- `backend/internal/middleware/auth.go` - Firebase token validation
- `backend/internal/repository/mastery_repo.go` - JSON column handling for solved_problems
- `backend/internal/service/gemini_service.go` - AI integration with retry logic

**Frontend**:
- `frontend/src/services/api.js` - Axios interceptor adds auth token
- `frontend/src/utils/dagLogic.js` - Prerequisite checking + status calculation
- `frontend/src/data/dagStructure.js` - All 22 topics definition
- `frontend/src/data/problemsDB.js` - All 66 problems (3 per topic)

## Making Changes

### Adding a New Topic
1. **Frontend**: Add to `frontend/src/data/dagStructure.js` and `problemsDB.js`
2. **Backend**: Add topic key to `backend/internal/config/topics.go:AllTopics`
3. Tree view and unlocking logic auto-update

### Modifying Prerequisites
- Edit `reqs` array in `dagStructure.js`
- Unlock logic in `dagLogic.js:getStatus()` automatically propagates changes

### Adjusting AI Prompts
- **Chat**: Modify system prompt in `backend/internal/handler/ai_handler.go:Chat()`
- **Judge**: Modify system prompt in `backend/internal/service/gemini_service.go:JudgeAudit()`

### Database Migrations
```bash
cd backend
make migrate-create name=add_new_table  # Create new migration
make migrate-up                          # Apply migrations
make migrate-down                        # Rollback migrations
```

## Important Implementation Details

### Authentication Flow
1. User signs in with Google (Firebase Auth)
2. Frontend receives Firebase ID token
3. Frontend calls `POST /api/auth/register` with token in body
4. Backend validates token, creates user + initializes 22 mastery records
5. All subsequent requests include token in `Authorization` header
6. Backend middleware validates token on every protected route

### Mastery Update Flow
1. User solves problem → Frontend submits to `POST /api/ai/judge`
2. Backend judges code → Returns verdict
3. If ADVANCE: Backend auto-updates `user_mastery` table
4. Frontend calls `GET /api/mastery` to refresh local state
5. UI updates to show new progress

### Confidence Calculation
- Formula: `Math.floor((solvedCount / 3) * 100)`
- Each problem worth ~33.3%
- Implemented in:
  - Frontend: `frontend/src/utils/dagLogic.js:calculateConfidence()`
  - Backend: `backend/internal/handler/ai_handler.go:Judge()` (lines ~60-70)

### Security Notes
- **Firebase tokens** validated server-side via Firebase Admin SDK
- **Gemini API key** never exposed to frontend (backend proxy only)
- **CORS** whitelist configured in `backend/.env:CORS_ALLOWED_ORIGINS`
- **SQL injection** prevented by parameterized queries

## Deployment

See `SETUP_GUIDE.md` for complete deployment instructions.

**Quick reference**:
- Backend: Build with `make build`, deploy binary + MySQL
- Frontend: Build with `npm run build`, deploy to Vercel/Netlify
- Update Firebase authorized domains for production URL
