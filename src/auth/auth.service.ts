// src/auth/auth.service.ts

import {
    Injectable,
    ConflictException,
    UnauthorizedException,
    InternalServerErrorException,
} from '@nestjs/common';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from 'firebase/auth';
import * as admin from 'firebase-admin';
import { firebaseAuth } from '../config/firebase.config'; // Firebase Client SDK Auth instance
import { getAuth } from 'firebase-admin/auth'; // Firebase Admin SDK Auth instance

@Injectable()
export class AuthService {
    private readonly firebaseAdminAuth = getAuth(admin.app());

    /**
     * Register a new user with Firebase Authentication (Client SDK).
     * @param email User's email address.
     * @param password User's password.
     * @returns User ID Token.
     */
    async register(email: string, password: string): Promise<string> {
        try {
            const userCredential = await createUserWithEmailAndPassword(
                firebaseAuth,
                email,
                password
            );
            const token = await userCredential.user.getIdToken();
            return token;
        } catch (error: any) {
            console.error('Firebase Auth Register Error:', error);
            if (error.code === 'auth/email-already-in-use') {
                throw new ConflictException('Email is already in use');
            }
            throw new InternalServerErrorException('Failed to register user');
        }
    }

    /**
     * Authenticate an existing user with Firebase Authentication (Client SDK).
     * @param email User's email address.
     * @param password User's password.
     * @returns User ID Token.
     */
    async login(email: string, password: string): Promise<string> {
        try {
            const userCredential = await signInWithEmailAndPassword(
                firebaseAuth,
                email,
                password
            );
            const token = await userCredential.user.getIdToken();
            return token;
        } catch (error: any) {
            console.error('Firebase Auth Login Error:', error);
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                throw new UnauthorizedException('Invalid email or password');
            }
            throw new UnauthorizedException('Failed to login');
        }
    }

    /**
     * Verify a user's ID Token using Firebase Admin SDK.
     * @param token User's ID Token.
     * @returns Decoded token payload.
     */
    async verifyToken(token: string): Promise<admin.auth.DecodedIdToken> {
        try {
            const decodedToken = await this.firebaseAdminAuth.verifyIdToken(token);
            return decodedToken;
        } catch (error) {
            console.error('Firebase Auth VerifyToken Error:', error);
            throw new UnauthorizedException('Invalid token');
        }
    }

    /**
     * Retrieve User Information using Firebase Admin SDK.
     * @param uid User ID.
     * @returns User Record.
     */
    async getUser(uid: string): Promise<admin.auth.UserRecord> {
        try {
            const userRecord = await this.firebaseAdminAuth.getUser(uid);
            return userRecord;
        } catch (error) {
            console.error('Firebase Auth GetUser Error:', error);
            throw new UnauthorizedException('Failed to retrieve user information');
        }
    }
}
