// src/config/firebase-admin.config.ts
import * as admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';

// Initialize Firebase Admin if it hasn't been initialized yet
export function initializeFirebaseAdmin() {
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.applicationDefault(),
            // Or use service account:
            // credential: admin.credential.cert({
            //     projectId: process.env.FIREBASE_PROJECT_ID,
            //     clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            //     privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            // }),
            databaseURL: process.env.FIREBASE_DATABASE_URL,
        });
        console.log('✅ Firebase Admin SDK Initialized');
    }
    return admin;
}

// Export the admin instance
export const firebaseAdmin = initializeFirebaseAdmin();

// Export the auth instance
export const firebaseAdminAuth = getAuth(firebaseAdmin.app());