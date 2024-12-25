// src/database/firebase/firebase.service.ts
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';

@Injectable()
export class FirebaseService implements OnModuleInit {
    private readonly logger = new Logger(FirebaseService.name);
    private adminAuth: admin.auth.Auth;

    onModuleInit() {
        // this.initializeFirebaseAdmin();
    }

    private initializeFirebaseAdmin() {
        if (!admin.apps.length) {
            try {
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
                this.adminAuth = getAuth(admin.app());
                this.logger.log('✅ Firebase Admin SDK initialized successfully');
            } catch (error) {
                this.logger.error('Failed to initialize Firebase Admin SDK:', error);
                throw error;
            }
        } else {
            this.adminAuth = getAuth(admin.app());
            this.logger.debug('⚡ Using existing Firebase Admin instance');
        }
    }

    async verifyToken(token: string): Promise<admin.auth.DecodedIdToken> {
        try {
            return await this.adminAuth.verifyIdToken(token);
        } catch (error) {
            this.logger.error('Token verification failed:', error);
            throw error;
        }
    }

    async getUser(uid: string): Promise<admin.auth.UserRecord> {
        try {
            return await this.adminAuth.getUser(uid);
        } catch (error) {
            this.logger.error(`Failed to get user with UID ${uid}:`, error);
            throw error;
        }
    }

     getFirestore(): admin.firestore.Firestore {
        return admin.firestore();
    }
}