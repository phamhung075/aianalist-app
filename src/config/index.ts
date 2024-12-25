// src/_core/config/dotenv.ts

import dotenv from 'dotenv';
import path from 'path';
import { version, name } from '../../package.json';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { isEmpty } from 'lodash';

// ✅ Load Base .env
const env = process.env.NODE_ENV || 'development';
dotenv.config();

// ✅ Load Environment-Specific .env
const envFile = path.resolve(process.cwd(), `environment/.env.${env}`);
dotenv.config({ path: envFile });

// ✅ General Application Configuration
export const config = {
    appName: name || 'Unknown App',
    appVersion: version || 'Unknown Version',
    baseApi: process.env.BASE_API || '/undefined',
    env: env || 'development',
    mode: process.env.MODE || 'development',
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
    dbUri: process.env.DATABASE_URI || 'mongodb://localhost:27017/mydatabase',
    dbName: process.env.DATABASE_NAME || 'mydatabase',
};

// ✅ Firebase Configuration
export const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};


