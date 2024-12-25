// src/firebase/firebase.service.ts
import * as serviceAccount from '@environment/ai-analyst-14876-firebase-adminsdk-euw8h-703ddf3555.json';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getApp } from '@node_modules/firebase-admin/lib/app';
import { yellow } from 'colorette';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
    private readonly logger = new Logger(FirebaseService.name);

    constructor(private readonly configService: ConfigService) {}

      onModuleInit() {
        try {
            if (!admin.apps.length) {
                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
                    databaseURL: this.configService.get<string>('FIREBASE_DATABASE_URL') || "https://ai-analyst-14876.firebaseio.com",
                });
                this.logger.log(yellow('✅ Firebase Admin initialized'));
            } else {
                const firebaseAdminApp = getApp();
                this.logger.warn(yellow('⚠️ Firebase Admin already initialized'));
            }
        } catch (error) {
            this.logger.error('❌ Failed to initialize Firebase Admin', error);
            throw error;
        }
    }

    getFirestore(): admin.firestore.Firestore {
        return admin.firestore();
    }

    /**
     * Get Firebase Auth instance
     */
    getAuth(): admin.auth.Auth {
        return admin.auth();
    }

    /**
     * Get Firebase Realtime Database instance
     */
    getDatabase(): admin.database.Database {
        return admin.database();
    }

    /**
     * Verify Firebase Auth Token
     */
    async verifyToken(token: string): Promise<admin.auth.DecodedIdToken> {
        try {
            return await admin.auth().verifyIdToken(token);
        } catch (error) {
            console.error('Error verifying token:', error);
            throw new Error('Invalid or expired token:');
        }
    }

    /**
     * Get Auth User
     */
    async getUser(uid: string): Promise<admin.auth.UserRecord> {
        return await admin.auth().getUser(uid);
    }
}
