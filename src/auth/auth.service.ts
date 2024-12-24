// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
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
            throw new UnauthorizedException('Invalid credentials');
        }
    }

    async verifyToken(token: string): Promise<any> {
        try {
            const decodedToken = await getAuth().verifyIdToken(token);
            return decodedToken;
        } catch (error) {
            console.log('error verify Token');
            throw new UnauthorizedException('Invalid token');
        }
    }
}
