# Firebase Firestore Setup Guide

This guide walks you through setting up and using Firebase Firestore with Avis Fleet.

## Quick Start

### 1. Get Firebase Config from Console

1. Go to your Firebase project: https://console.firebase.google.com/u/0/project/avis-574f3/firestore
2. Click **Project Settings** (gear icon)
3. Go to **Your apps** and select your web app
4. Copy the Firebase config
5. Update `.env.local`:

```env
VITE_FIREBASE_API_KEY=<your-api-key>
VITE_FIREBASE_AUTH_DOMAIN=avis-574f3.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=avis-574f3
VITE_FIREBASE_STORAGE_BUCKET=avis-574f3.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=<your-sender-id>
VITE_FIREBASE_APP_ID=<your-app-id>
```

### 2. Install Dependencies

```powershell
npm install firebase firebase-admin
npm install -g firebase-tools
```

### 3. Seed Data to Firestore

1. Download service account key:
   - Firebase Console > Project Settings > **Service Accounts** tab > **Generate new private key**
   - Save as `serviceAccountKey.json` in the project root

2. Run seed script:

```powershell
node scripts/seed-firestore.js
```

This creates:
- **clients** collection (from `src/data/clients.json`)
- **vehicles** collection (from `src/data/vehicles.json`)
- **assignments** collection (empty, created on first assignment in app)

### 4. Set Firestore Security Rules

1. Go to Firebase Console > **Firestore Database** > **Rules** tab
2. Replace with content from `firestore.rules`
3. Click **Publish**

### 5. Create Composite Indexes

1. Go to **Firestore Database** > **Indexes** tab
2. Upload `firestore.indexes.json` or manually create indexes for:
   - vehicles: `status` ASC, `addedDate` DESC
   - clients: `status` ASC, `addedDate` DESC
   - assignments: `vehicleId` ASC, `assignedDate` DESC

## Local Development with Emulator

Run the Firebase Emulator Suite locally to test without connecting to production:

```powershell
# Start emulator UI and all services
firebase emulators:start

# In another terminal, set env var and start your app
$env:VITE_FIREBASE_EMULATOR_HOST = "localhost:8080"
npm run dev
```

Emulator UI: http://localhost:4000

To seed the emulator, set the same env var before running the seed script:

```powershell
$env:FIRESTORE_EMULATOR_HOST = "localhost:8080"
node scripts/seed-firestore.js serviceAccountKey.json
```

## Using Firestore in Components

### Fetch all vehicles:

```javascript
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebaseClient'

const fetchVehicles = async () => {
  const snap = await getDocs(collection(db, 'vehicles'))
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}
```

### Fetch with filters:

```javascript
import { collection, query, where, getDocs } from 'firebase/firestore'

const fetchActiveVehicles = async () => {
  const q = query(
    collection(db, 'vehicles'),
    where('status', '==', 'Active')
  )
  const snap = await getDocs(q)
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}
```

### Real-time updates (subscribe):

```javascript
import { collection, onSnapshot } from 'firebase/firestore'

const unsubscribe = onSnapshot(collection(db, 'vehicles'), (snap) => {
  const vehicles = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  console.log('Vehicles updated:', vehicles)
})

// Unsubscribe when component unmounts
// unsubscribe()
```

### Add a document:

```javascript
import { collection, addDoc } from 'firebase/firestore'

const createAssignment = async (vehicleId, clientId, purpose) => {
  const docRef = await addDoc(collection(db, 'assignments'), {
    vehicleId,
    clientId,
    assignedDate: new Date(),
    purpose,
    returnDate: null,
  })
  return docRef.id
}
```

## Data Structure

### Clients Collection
```
{
  id: string (auto-generated or from src/data/clients.json),
  name: string,
  email: string,
  phone: string,
  address: string,
  city: string,
  industry: string,
  status: string ('Active', 'Inactive', etc.),
  addedDate: Timestamp
}
```

### Vehicles Collection
```
{
  id: string,
  registrationNo: string (unique),
  model: string,
  year: number,
  mileage: number,
  status: string ('Active', 'In Service', 'Maintenance', 'Retired'),
  addedDate: Timestamp
}
```

### Assignments Collection
```
{
  id: string (auto-generated),
  vehicleId: string (reference to vehicles doc),
  clientId: string (reference to clients doc),
  assignedDate: Timestamp,
  startDate: Timestamp (optional),
  endDate: Timestamp (optional),
  returnDate: Timestamp (optional),
  purpose: string
}
```

## Security Rules Notes

- **Current rules** (firestore.rules):
  - All reads allowed (for development)
  - Writes require authentication
  - Adjust before production: consider row-level access, user ownership, roles, etc.

- **Example: User-owned documents**:
  ```
  match /assignments/{doc} {
    allow read: if true;
    allow write: if request.auth.uid == resource.data.userId;
  }
  ```

## Troubleshooting

- **"Firebase config incomplete"**: Check `.env.local` has all required keys
- **"CORS errors"**: Firestore should auto-allow localhost. For custom domains, configure in Firebase Console > Settings > Authorized domains
- **Emulator not connecting**: Ensure `VITE_FIREBASE_EMULATOR_HOST` is set and emulator is running
- **Seed script fails**: Verify `serviceAccountKey.json` path and has `FIRESTORE_EMULATOR_HOST` set if seeding to emulator

## Next Steps

- Migrate Dashboard to fetch live data from Firestore
- Add real-time subscriptions for live updates
- Implement Firebase Auth for user management
- Set up Cloud Functions for backend logic (assignments, reports, etc.)
