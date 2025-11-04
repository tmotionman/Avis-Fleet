// src/lib/firebaseClient.js
// Initialize Firebase and export Firestore client

import { initializeApp } from 'firebase/app'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getAuth, connectAuthEmulator } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Validate required config
if (!firebaseConfig.projectId || !firebaseConfig.authDomain) {
  console.warn('Firebase config incomplete. Check .env.local')
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)

// Connect to emulator if environment variable is set (local development)
if (import.meta.env.VITE_FIREBASE_EMULATOR_HOST) {
  const [host, port] = import.meta.env.VITE_FIREBASE_EMULATOR_HOST.split(':')
  connectFirestoreEmulator(db, host, parseInt(port), { experimentalForceLongPolling: true })
  connectAuthEmulator(auth, `http://${import.meta.env.VITE_FIREBASE_EMULATOR_HOST}`, { disableWarnings: true })
}
