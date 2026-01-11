# SkillTree Quick Start Guide 🚀

Your Firebase project **noter-a6094** is already integrated! Follow these steps to run the app.

## ⚡ Quick Setup (10 minutes)

### 1. Download Firebase Service Account Key

1. Go to: https://console.firebase.google.com/project/noter-a6094/settings/serviceaccounts/adminsdk
2. Click **Generate New Private Key**
3. Save the JSON file as: `backend/firebase-service-account.json`

### 2. Enable Google Sign-In

1. Go to: https://console.firebase.google.com/project/noter-a6094/authentication/providers
2. Click **Google** → Toggle **Enable** → **Save**

### 3. Setup MySQL Database

```bash
# Login to MySQL
mysql -u root -p

# Run these commands:
CREATE DATABASE skilltree_db;
CREATE USER 'skilltree_user'@'localhost' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON skilltree_db.* TO 'skilltree_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 4. Configure Backend Environment

Edit `backend/.env`:
```bash
# Update these two values:
DB_PASSWORD=password123
GEMINI_API_KEY=your_gemini_api_key_here
```

**Get Gemini API Key**: https://ai.google.dev/gemini-api/docs/api-key

### 5. Install golang-migrate

**macOS:**
```bash
brew install golang-migrate
```

**Linux:**
```bash
curl -L https://github.com/golang-migrate/migrate/releases/download/v4.16.2/migrate.linux-amd64.tar.gz | tar xvz
sudo mv migrate /usr/local/bin/
```

### 6. Run Database Migrations

```bash
cd backend
make deps        # Install Go dependencies
make migrate-up  # Create database tables
```

### 7. Start Backend

```bash
cd backend
make run
```

Backend will start on http://localhost:8080

### 8. Start Frontend

Open a **new terminal**:
```bash
cd frontend
npm install      # Install dependencies
npm run dev
```

Frontend will start on http://localhost:5173

### 9. Test the Application

1. Open http://localhost:5173
2. Click **"Sign in with Google"**
3. Complete Google OAuth
4. You should see the Dashboard!

---

## ✅ Verification Checklist

- [ ] MySQL database created
- [ ] Firebase service account key downloaded
- [ ] Google Sign-In enabled in Firebase
- [ ] Backend `.env` configured (DB password + Gemini API key)
- [ ] golang-migrate installed
- [ ] Database migrations run successfully
- [ ] Backend running on port 8080
- [ ] Frontend running on port 5173
- [ ] Can sign in with Google

---

## 🎯 What Each Terminal Should Show

**Terminal 1 (Backend):**
```
Server starting on port 8080
Database connection established
Firebase initialized
```

**Terminal 2 (Frontend):**
```
VITE v5.x.x ready in xxx ms
➜  Local:   http://localhost:5173/
```

---

## 🐛 Common Issues

### "Failed to connect to database"
```bash
# Test MySQL connection:
mysql -u skilltree_user -p -h localhost
# If it fails, recreate the user with proper permissions
```

### "Failed to initialize Firebase"
```bash
# Check file exists:
ls -la backend/firebase-service-account.json
# Check FIREBASE_PROJECT_ID in backend/.env matches: noter-a6094
```

### "Gemini API failed"
```bash
# Get free API key: https://ai.google.dev
# Add to backend/.env: GEMINI_API_KEY=your_key_here
```

### "Port 8080 already in use"
```bash
# Kill the process:
lsof -ti:8080 | xargs kill -9
```

---

## 📊 After First Login

After signing in with Google, verify everything works:

1. **Check Database:**
   ```bash
   mysql -u skilltree_user -p skilltree_db -e "SELECT * FROM users;"
   # Should show your user record

   mysql -u skilltree_user -p skilltree_db -e "SELECT COUNT(*) FROM user_mastery;"
   # Should return: 22 (one for each topic)
   ```

2. **Test the Flow:**
   - Click **"View Full Skill Tree"** → Should see all 22 topics
   - Click **ARRAY_SCAN** or **RECURSION_ROOTS** → Should see topic detail
   - Click a problem → Should see code editor
   - Write some code → Click **"Submit & Judge"** → Should get AI feedback

3. **Check AI Integration:**
   - On Hub View, try the **Architect Chat**
   - On IDE View, click **"Analyze Complexity"**
   - Submit code and get **Judge verdict**

---

## 🚀 You're All Set!

The application is now running with:
- ✅ Firebase Authentication (Google OAuth)
- ✅ MySQL Database (persistent progress)
- ✅ Gemini AI (chat, judge, complexity analysis)
- ✅ Full-stack React + Golang app

## 📚 More Information

- **Complete Setup**: See `SETUP_GUIDE.md`
- **Firebase Details**: See `FIREBASE_SETUP.md`
- **Architecture**: See `CLAUDE.md`
- **Project Overview**: See `PROJECT_SUMMARY.md`

Happy coding! 🎉
