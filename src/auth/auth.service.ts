// src/auth/auth.service.ts

import {
    Injectable,
    ConflictException,
    UnauthorizedException,
} from '@nestjs/common';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from 'firebase/auth';
import { firebaseAuth } from '../config/firebase.config';
import { firebaseAdminAuth } from '../config/firebase-admin.config';

@Injectable()
export class AuthService {
    // User Registration with Firebase Client SDK
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
            if (error.code === 'auth/email-already-in-use') {
                throw new ConflictException('Email is already in use');
            }
            throw new UnauthorizedException('Failed to register user');
        }
    }

    // User Login with Firebase Client SDK
    async login(email: string, password: string): Promise<string> {
        try {
            const userCredential = await signInWithEmailAndPassword(
                firebaseAuth,
                email,
                password
            );
            const token = await userCredential.user.getIdToken();
            return token;
        } catch (error) {
            console.error(error);
            throw new UnauthorizedException('Invalid credentials');
        }
    }

    // Verify JWT with Firebase Admin SDK
    async verifyToken(token: string): Promise<any> {
        try {
            const decodedToken = await firebaseAdminAuth.verifyIdToken(token);
            return decodedToken;
        } catch (error) {
            console.error(error);
            throw new UnauthorizedException('Invalid token');
        }
    }
}
