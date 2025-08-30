// File Location: /lib/firebaseAdmin.js
// This file securely initializes the Firebase Admin SDK for backend use.

import admin from 'firebase-admin';

// This is the secure way to handle your service account key.
// The code will now ONLY work if the FIREBASE_SERVICE_ACCOUNT_KEY is set in your environment.
if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set.');
}

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

// Function to initialize the admin app, preventing re-initialization
function initializeAdminApp() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }
}

// Export the initialized app and the admin firestore instance
const adminDb = admin.firestore();

export { initializeAdminApp, adminDb };
