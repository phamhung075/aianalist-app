// src\config\firebase-admin.config.ts
import * as admin from 'firebase-admin';

const firebaseAdminConfig = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(firebaseAdminConfig),
    });
}

export const firebaseAdminAuth = admin.auth();