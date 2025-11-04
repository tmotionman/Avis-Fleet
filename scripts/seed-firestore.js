#!/usr/bin/env node

/**
 * Seed Firestore with data from JSON files
 * Usage: node scripts/seed-firestore.js [path/to/serviceAccountKey.json]
 *
 * Get service account key from: Firebase Console > Project Settings > Service Accounts > Generate new private key
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Get service account key path from CLI argument or default
const keyPath = process.argv[2] || path.join(process.cwd(), 'serviceAccountKey.json');

// Check if key exists
if (!fs.existsSync(keyPath)) {
  console.error(`❌ Service account key not found at: ${keyPath}`);
  console.error('Download it from: Firebase Console > Project Settings > Service Accounts > Generate new private key');
  process.exit(1);
}

try {
  // Initialize Firebase Admin SDK
  const serviceAccount = require(path.resolve(keyPath));
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'avis-574f3',
  });
} catch (e) {
  console.error('❌ Failed to initialize Firebase Admin SDK:', e.message);
  process.exit(1);
}

const db = admin.firestore();

// Load JSON data
let clients = [];
let vehicles = [];

try {
  clients = require('../src/data/clients.json');
  vehicles = require('../src/data/vehicles.json');
  console.log(`✓ Loaded ${clients.length} clients and ${vehicles.length} vehicles`);
} catch (e) {
  console.error('❌ Failed to load JSON data:', e.message);
  process.exit(1);
}

async function seed() {
  try {
    console.log('\n📝 Seeding Firestore...\n');

    // Seed clients
    console.log('→ Clients...');
    const clientBatch = db.batch();
    for (const client of clients) {
      const docRef = db.collection('clients').doc(client.id || undefined);
      clientBatch.set(docRef, {
        name: client.name,
        email: client.email || null,
        phone: client.phone || null,
        address: client.address || null,
        city: client.city || null,
        industry: client.industry || null,
        status: client.status || 'Active',
        addedDate: client.addedDate ? admin.firestore.Timestamp.fromDate(new Date(client.addedDate)) : admin.firestore.FieldValue.serverTimestamp(),
      });
    }
    await clientBatch.commit();
    console.log(`  ✓ Seeded ${clients.length} clients`);

    // Seed vehicles
    console.log('→ Vehicles...');
    const vehicleBatch = db.batch();
    for (const vehicle of vehicles) {
      const docRef = db.collection('vehicles').doc(vehicle.id || undefined);
      vehicleBatch.set(docRef, {
        registrationNo: vehicle.registrationNo,
        model: vehicle.model,
        year: vehicle.year || null,
        mileage: vehicle.mileage || 0,
        status: vehicle.status || 'Active',
        addedDate: vehicle.addedDate ? admin.firestore.Timestamp.fromDate(new Date(vehicle.addedDate)) : admin.firestore.FieldValue.serverTimestamp(),
      });
    }
    await vehicleBatch.commit();
    console.log(`  ✓ Seeded ${vehicles.length} vehicles`);

    console.log('\n✅ Firestore seeding complete!\n');
    process.exit(0);
  } catch (e) {
    console.error('❌ Seeding failed:', e.message);
    process.exit(1);
  }
}

seed();
