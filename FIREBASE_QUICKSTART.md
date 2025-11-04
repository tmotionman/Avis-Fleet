# Firebase Firestore Setup - Quick Actions for You

Your Firebase project is ready: https://console.firebase.google.com/u/0/project/avis-574f3/firestore

## Step-by-Step Setup (5 min)

### 1️⃣ Get Firebase Web Config

1. Go to Firebase Console > **Project Settings** (⚙️)
2. Scroll to **Your apps** and click on your web app
3. Copy the config object:
   - `apiKey`
   - `authDomain` (already filled: avis-574f3.firebaseapp.com)
   - `projectId` (already filled: avis-574f3)
   - `storageBucket`
   - `messagingSenderId`
   - `appId`

### 2️⃣ Fill `.env.local`

Paste into `.env.local` in the repo root:

```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=avis-574f3.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=avis-574f3
VITE_FIREBASE_STORAGE_BUCKET=avis-574f3.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id-here
VITE_FIREBASE_APP_ID=your-app-id-here
```

### 3️⃣ Deploy Security Rules & Indexes

1. Go to Firebase Console > **Firestore Database** > **Rules** tab
2. Click **Edit rules** and paste the content from `firestore.rules` (in your repo)
3. Click **Publish**

For indexes (optional now, required when you add complex queries):
- Go to **Indexes** tab
- Import `firestore.indexes.json` or they'll auto-create when needed

### 4️⃣ Seed Your Data

Download service account key and seed Firestore:

```powershell
# 1. Download service account key from Firebase Console:
# Project Settings > Service Accounts > Generate new private key

# 2. Place it at project root as: serviceAccountKey.json

# 3. Install dependencies (if not already done)
npm install

# 4. Seed the data
npm run firebase:seed
```

This creates:
- **clients** collection (3 records from src/data/clients.json)
- **vehicles** collection (8 records from src/data/vehicles.json)

### 5️⃣ Verify in Firebase Console

1. Go to https://console.firebase.google.com/u/0/project/avis-574f3/firestore
2. Click **Data** tab
3. You should see `clients` and `vehicles` collections with data ✅

## Done!

Now your Firestore database is ready to use. The client is initialized in `src/lib/firebaseClient.js` and ready to be imported in components.

Example usage:

```javascript
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebaseClient'

// Fetch all vehicles
const snap = await getDocs(collection(db, 'vehicles'))
const vehicles = snap.docs.map(d => ({ id: d.id, ...d.data() }))
```

## Next Steps (Optional)

- **Migrate Dashboard to Firestore** (replace JSON imports with live queries)
- **Add real-time listeners** for live updates
- **Implement Firebase Auth** for user management
- **Deploy to Firebase Hosting**

See `docs/FIREBASE_SETUP.md` for detailed examples and troubleshooting.
