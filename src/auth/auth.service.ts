// src/auth/auth.service.ts
import {
    Injectable,
    ConflictException,
    UnauthorizedException,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from 'firebase/auth';
import * as admin from 'firebase-admin';
import { FirebaseService } from '../database/firebase/firebase.service';
import { getFirebaseAuth } from '@/config/firebase-client.config';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(private readonly firebaseService: FirebaseService) {}

    async register(email: string, password: string): Promise<string> {
        console.log('Registering user:', email, password);
        try {
            const userCredential = await createUserWithEmailAndPassword(
                getFirebaseAuth(),
                email,
                password
            );
            return await userCredential.user.getIdToken();
        } catch (error: any) {
            this.logger.error('Firebase Auth Register Error:', error);
            if (error.code === 'auth/email-already-in-use') {
                throw new ConflictException('Email is already in use');
            }
            throw new InternalServerErrorException('Failed to register user');
        }
    }

    async login(email: string, password: string): Promise<string> {
        try {
            const userCredential = await signInWithEmailAndPassword(
                getFirebaseAuth(),
                email,
                password
            );
            return await userCredential.user.getIdToken();
        } catch (error: any) {
            this.logger.error('Firebase Auth Login Error:', error);
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                throw new UnauthorizedException('Invalid email or password');
            }
            throw new UnauthorizedException('Failed to login');
        }
    }

    async verifyToken(token: string): Promise<admin.auth.DecodedIdToken> {
        return this.firebaseService.verifyToken(token);
    }

    async getUser(uid: string): Promise<admin.auth.UserRecord> {
        return this.firebaseService.getUser(uid);
    }
}