import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

let firebaseApp = null;

try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    let serviceAccount;
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY.trim().startsWith('{')) {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    } else {
      // Path to file
      serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    }

    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('🔥 Firebase Admin initialized successfully.');
  } else {
    // Development fallback without credentials for local stubbing
    if (!admin.apps.length) {
      firebaseApp = admin.initializeApp({
        projectId: 'florascan-ai-dev'
      });
      console.log('🔥 Firebase Admin initialized with local dev default credentials.');
    } else {
      firebaseApp = admin.app();
    }
  }
} catch (error) {
  console.warn('⚠️ Firebase Admin initialization notice:', error.message);
}

export const firebaseAdmin = admin;
export default firebaseApp;
