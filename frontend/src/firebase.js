// src/firebase.js
// ─────────────────────────────────────────────────────────────────────────────
// SETUP INSTRUCTIONS (one-time):
// 1. Go to https://console.firebase.google.com
// 2. Click "Add project" → name it "payers" → disable Google Analytics → Create
// 3. In the project dashboard, click the </> (Web) icon to add a web app
// 4. Register app, then copy the firebaseConfig object shown to you
// 5. Replace the placeholder values below with your real config values
// 6. In the Firebase Console sidebar: Authentication → Get Started → Email/Password → Enable
// 7. In the Firebase Console sidebar: Firestore Database → Create database → Start in test mode → Choose region
// ─────────────────────────────────────────────────────────────────────────────

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db   = getFirestore(app);
