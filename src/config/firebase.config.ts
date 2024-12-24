// src/config/firebase.config.ts

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { ConfigService } from '@nestjs/config';

export const firebaseConfig = (configService: ConfigService) => ({
    projectId: configService.get<string>('FIREBASE_PROJECT_ID'),
    privateKey: configService
        .get<string>('FIREBASE_PRIVATE_KEY')
        ?.replace(/\\n/g, '\n'),
    clientEmail: configService.get<string>('FIREBASE_CLIENT_EMAIL'),
    databaseURL: configService.get<string>('FIREBASE_DATABASE_URL'),
    storageBucket: configService.get<string>('FIREBASE_STORAGE_BUCKET'),
});

const firebaseApp = initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
});

export const firebaseAuth = getAuth(firebaseApp);
