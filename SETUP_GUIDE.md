# SkillTree Full-Stack Setup Guide

Complete setup instructions for running the SkillTree DSA learning platform.

## Prerequisites

- **Go 1.21+**
- **Node.js 18+** and npm
- **MySQL 8.0+**
- **Firebase Account** (free tier)
- **Gemini API Key** (free tier: https://ai.google.dev)

---

## Part 1: Backend Setup

### 1. Install golang-migrate

**macOS:**
```bash
brew install golang-migrate
```

**Linux:**
```bash
curl -L https://github.com/golang-migrate/migrate/releases/download/v4.16.2/migrate.linux-amd64.tar.gz | tar xvz
sudo mv migrate /usr/local/bin/
```

### 2. Setup MySQL Database

```bash
# Login to MySQL
mysql -u root -p

# Create database and user
CREATE DATABASE skilltree_db;
CREATE USER 'skilltree_user'@'localhost' IDENTIFIED BY 'your_password_here';
GRANT ALL PRIVILEGES ON skilltree_db.* TO 'skilltree_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Setup Firebase Admin SDK

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project (or use existing)
3. Go to Project Settings → Service Accounts
4. Click "Generate New Private Key"
5. Save the JSON file to `/backend/firebase-service-account.json`

### 4. Configure Backend Environment

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your actual values:
```env
PORT=8080
ENVIRONMENT=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=skilltree_user
DB_PASSWORD=your_password_here
DB_NAME=skilltree_db

# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_SERVICE_ACCOUNT_KEY=./firebase-service-account.json

# Gemini API
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### 5. Run Database Migrations

```bash
cd backend
make deps          # Install Go dependencies
make migrate-up    # Run migrations
```

Verify tables were created:
```bash
mysql -u skilltree_user -p skilltree_db -e "SHOW TABLES;"
```

You should see:
- `users`
- `user_mastery`
- `schema_migrations`

### 6. Start Backend Server

```bash
cd backend
make run
```

Backend will start on `http://localhost:8080`

Test health endpoint:
```bash
curl http://localhost:8080/health
# Should return: OK
```

---

## Part 2: Frontend Setup

### 1. Setup Firebase Authentication

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to Authentication → Sign-in method
4. Enable **Google** provider
5. Add authorized domain: `localhost`
6. Go to Project Settings → General
7. Copy your Firebase config values:
   - API Key
   - Auth Domain
   - Project ID

### 2. Configure Frontend Environment

```bash
cd frontend
cp .env.example .env
```

Edit `.env` with your Firebase config:
```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_API_BASE_URL=http://localhost:8080/api
```

### 3. Install Dependencies

```bash
cd frontend
npm install
```

### 4. Start Frontend Development Server

```bash
npm run dev
```

Frontend will start on `http://localhost:5173`

---

## Part 3: Testing the Full Stack

### 1. Test User Flow

1. Open browser: `http://localhost:5173`
2. You should see the Hero Section
3. Click "Sign in with Google"
4. Complete Google OAuth
5. You should be redirected to Dashboard
6. Click "View Full Skill Tree"
7. Click on any Tier 0 topic (ARRAY_SCAN or RECURSION_ROOTS)
8. You should see the Hub View with theory and problems
9. Click on a problem to open the IDE
10. Write code and click "Submit & Judge"

### 2. Verify Backend Database

```bash
# Check user was created
mysql -u skilltree_user -p skilltree_db -e "SELECT * FROM users;"

# Check mastery was initialized (should show 22 rows)
mysql -u skilltree_user -p skilltree_db -e "SELECT COUNT(*) FROM user_mastery WHERE user_id=1;"

# Check mastery for a specific topic
mysql -u skilltree_user -p skilltree_db -e "SELECT topic_key, confidence, solved_problems FROM user_mastery WHERE user_id=1 AND topic_key='ARRAY_SCAN';"
```

### 3. Test API Endpoints

Get a Firebase token from browser console:
```javascript
// In browser console after logging in
firebase.auth().currentUser.getIdToken().then(console.log)
```

Test API:
```bash
# Set your token
TOKEN="your_firebase_token_here"

# Test mastery endpoint
curl -H "Authorization: Bearer $TOKEN" http://localhost:8080/api/mastery

# Test chat endpoint
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"topic_key":"ARRAY_SCAN","message":"What is an array?"}' \
  http://localhost:8080/api/ai/chat
```

---

## Troubleshooting

### Backend Issues

**"Failed to connect to database"**
- Check MySQL is running: `mysql.server status`
- Verify credentials in `.env`
- Test connection: `mysql -u skilltree_user -p -h localhost`

**"Failed to initialize Firebase"**
- Check service account JSON file exists
- Verify FIREBASE_PROJECT_ID matches your project
- Ensure file path is correct in `.env`

**"Gemini API failed"**
- Verify GEMINI_API_KEY is correct
- Check API quota: https://ai.google.dev/pricing
- Test API key with curl

### Frontend Issues

**"Missing authorization header"**
- Ensure you're logged in with Google
- Check browser console for auth errors
- Verify Firebase config in `.env`

**"Network Error"**
- Verify backend is running on port 8080
- Check CORS settings in backend
- Ensure VITE_API_BASE_URL is correct

**Firebase Auth not working**
- Enable Google provider in Firebase Console
- Add `localhost` to authorized domains
- Check browser console for errors

---

## Production Deployment

### Backend Deployment

1. **Build binary:**
   ```bash
   cd backend
   make build
   ```

2. **Deploy to cloud provider** (AWS, DigitalOcean, Fly.io, etc.)

3. **Update environment variables** for production

4. **Run migrations** on production database

### Frontend Deployment

1. **Build production bundle:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to hosting** (Vercel, Netlify, Firebase Hosting)

3. **Update Firebase authorized domains**

4. **Update environment variables** with production API URL

---

## Next Steps

- [ ] Customize homepage copy
- [ ] Add more problems to topics
- [ ] Implement code syntax highlighting
- [ ] Add user analytics
- [ ] Deploy to production

## Support

- Backend README: `/backend/README.md`
- Frontend README: `/frontend/README.md`
- CLAUDE.md: `/CLAUDE.md` (for AI assistance)

Enjoy building with SkillTree!
