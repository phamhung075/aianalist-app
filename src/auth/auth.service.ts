import { Injectable, ConflictException, UnauthorizedException, InternalServerErrorException, Logger } from '@nestjs/common';
import { getFirebaseAuth } from '../config/firebase-client.config';
import { firebaseAdminAuth } from '../config/firebase-admin.config';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import * as admin from 'firebase-admin';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    // 🔐 User Registration (Firebase Client SDK)
    async register(email: string, password: string): Promise<string> {
        this.logger.log(`Registering user: ${email}`);
        try {
            const auth = getFirebaseAuth();
            // console.log('🔐 Registering auth:', auth);
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            this.logger.log(`User registered successfully: ${userCredential.user.uid}`);
            return await userCredential.user.getIdToken();
        } catch (error: any) {
            this.logger.error('Firebase Auth Register Error:', error.message || error);
            if (error.code === 'auth/email-already-in-use') {
                throw new ConflictException('Email is already in use');
            }
            throw new InternalServerErrorException('Failed to register user');
        }
    }

    // 🔐 User Login (Firebase Client SDK)
    async login(email: string, password: string): Promise<string> {
        this.logger.log(`Logging in user: ${email}`);
        try {
            const auth = getFirebaseAuth();
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            this.logger.log(`User logged in successfully: ${userCredential.user.uid}`);
            return await userCredential.user.getIdToken();
        } catch (error: any) {
            this.logger.error('Firebase Auth Login Error:', error.message || error);
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth\invalid-credential') {
                const unauthenticatedError = new UnauthorizedException('Invalid email or password');
                console.log('🔐 Unauthenticated Error:', unauthenticatedError);
                throw unauthenticatedError;
            }
            throw new UnauthorizedException('Failed to login');
        }
    }

    // 🔑 Verify Token (Firebase Admin SDK)
    async verifyToken(token: string): Promise<admin.auth.DecodedIdToken> {
        this.logger.log(`Verifying token`);
        try {
            const decodedToken = await firebaseAdminAuth.verifyIdToken(token);
            this.logger.log(`Token verified successfully: ${decodedToken.uid}`);
            return decodedToken;
        } catch (error: any) {
            this.logger.error('Token Verification Error:', error.message || error);
            throw new UnauthorizedException('Invalid or expired token');
        }
    }

    // 👤 Get User Details (Firebase Admin SDK)
    async getUser(uid: string): Promise<admin.auth.UserRecord> {
        this.logger.log(`Fetching user details for UID: ${uid}`);
        try {
            const userRecord = await firebaseAdminAuth.getUser(uid);
            this.logger.log(`User details fetched successfully: ${userRecord.email}`);
            return userRecord;
        } catch (error: any) {
            this.logger.error('Get User Error:', error.message || error);
            throw new UnauthorizedException('Failed to fetch user details');
        }
    }
}
