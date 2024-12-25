// src/config/firebase-client.config.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from './firebase.config';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Auth instance
export const firebaseAuth = getAuth(app);