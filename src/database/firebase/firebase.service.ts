// src/firebase/firebase.service.ts
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FirebaseService implements OnModuleInit {
    private readonly logger = new Logger(FirebaseService.name);

    constructor(private readonly configService: ConfigService) {}

    onModuleInit() {
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: this.configService.get<string>(
                        'FIREBASE_PROJECT_ID'
                    ),
                    privateKey: this.configService
                        .get<string>('FIREBASE_PRIVATE_KEY')
                        ?.replace(/\\n/g, '\n'),
                    clientEmail: this.configService.get<string>(
                        'FIREBASE_CLIENT_EMAIL'
                    ),
                }),
                databaseURL: this.configService.get<string>(
                    'FIREBASE_DATABASE_URL'
                ),
                // storageBucket: this.configService.get<string>('FIREBASE_STORAGE_BUCKET'),
            });
            this.logger.log('Firebase Initialized Successfully');
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