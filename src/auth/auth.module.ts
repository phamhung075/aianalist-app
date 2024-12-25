// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { FirebaseService } from '../database/firebase/firebase.service';
import { FirebaseAuthGuard } from './firebase-auth.guard';

@Module({
    controllers: [AuthController],
    providers: [
        AuthService,
        FirebaseService,
        FirebaseAuthGuard
    ],
    exports: [AuthService, FirebaseAuthGuard],
})
export class AuthModule {}