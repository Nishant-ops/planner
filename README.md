# SkillTree Frontend

React + Vite frontend for the SkillTree DSA learning platform.

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your Firebase credentials and API URL
```

### 3. Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Google Authentication in Firebase Console
3. Copy your Firebase config values to `.env`

### 4. Run Development Server

```bash
npm run dev
```

Frontend will start on `http://localhost:5173`

## Build for Production

```bash
npm run build
```
