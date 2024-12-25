// src/auth/firebase-auth.guard.ts
import { FirebaseService } from '@/database/firebase/firebase.service';
import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
    constructor(private readonly firebaseService: FirebaseService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.split(' ')[1];

        if (!token) {
            throw new UnauthorizedException('No token provided');
        }

        try {
            const decodedToken = await this.firebaseService.verifyToken(token);
            request.user = decodedToken; // Attach user to request
            return true;
        } catch (error) {
            console.error('Firebase Auth Error:', error);
            throw new UnauthorizedException('Unauthorized');
        }
    }
}
