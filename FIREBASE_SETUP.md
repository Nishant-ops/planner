# Firebase Setup Instructions

Your Firebase project **noter-a6094** has been integrated into the application.

## ✅ Frontend Configuration Complete

The Firebase config is already hardcoded in `frontend/src/services/authService.js`:
- API Key: AIzaSyDk8E7Z4RoX0jUmtgNHnDUG9ilxyvMoDkQ
- Auth Domain: noter-a6094.firebaseapp.com
- Project ID: noter-a6094

## 🔧 Required: Backend Configuration

You need to download the Firebase Admin SDK service account key for the backend:

### Step 1: Download Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **noter-a6094**
3. Click the gear icon → **Project Settings**
4. Go to **Service Accounts** tab
5. Click **Generate New Private Key**
6. Save the downloaded JSON file as:
   ```
   backend/firebase-service-account.json
   ```

### Step 2: Enable Google Sign-In

1. In Firebase Console, go to **Authentication**
2. Click **Get Started** (if not already enabled)
3. Go to **Sign-in method** tab
4. Click **Google** provider
5. Toggle **Enable**
6. Add your support email
7. Click **Save**

### Step 3: Add Authorized Domains

1. Still in **Authentication** → **Settings** tab
2. Scroll to **Authorized domains**
3. Add these domains:
   - `localhost` (should already be there)
   - Your production domain (when you deploy)

## 🚀 Backend Environment Setup

Edit `backend/.env` and update:
```env
FIREBASE_PROJECT_ID=noter-a6094  # Already set
FIREBASE_SERVICE_ACCOUNT_KEY=./firebase-service-account.json
```

## ✅ Verification Checklist

- [ ] Firebase project: noter-a6094
- [ ] Google Sign-In enabled in Firebase Console
- [ ] Service account JSON downloaded to `backend/firebase-service-account.json`
- [ ] Backend `.env` file updated with FIREBASE_PROJECT_ID
- [ ] `localhost` added to authorized domains

## 🧪 Test Authentication

1. Start backend: `cd backend && make run`
2. Start frontend: `cd frontend && npm run dev`
3. Open http://localhost:5173
4. Click "Sign in with Google"
5. Complete Google OAuth
6. You should be redirected to the dashboard

## 🔒 Security Note

**IMPORTANT**: The Firebase config in the frontend is public (this is normal and safe). The sensitive part is the **service account key** in the backend, which should NEVER be committed to git.

Add to `.gitignore`:
```
backend/firebase-service-account.json
backend/.env
frontend/.env
```

## 📝 What's Already Done

✅ Firebase SDK installed in frontend
✅ Firebase config integrated
✅ Google Auth provider setup in code
✅ Firebase Admin SDK integration in backend
✅ Auth middleware for token validation

## 🆘 Troubleshooting

**"Auth domain not authorized"**
- Add `localhost` to authorized domains in Firebase Console

**"Failed to initialize Firebase"**
- Ensure service account JSON is in the correct location
- Verify FIREBASE_PROJECT_ID matches in `.env`

**"Invalid API key"**
- Check the API key in `authService.js` matches your project

## 🎯 Next Steps

1. Download service account key (see Step 1 above)
2. Place it in `backend/firebase-service-account.json`
3. Enable Google Sign-In in Firebase Console
4. You're ready to run the app!

See `SETUP_GUIDE.md` for complete application setup.
