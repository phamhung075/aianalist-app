// src/auth/auth.controller.ts
import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FirebaseAuthGuard } from './firebase-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(
        @Body('email') email: string,
        @Body('password') password: string
    ) {
        return this.authService.register(email, password);
    }

    @Post('login')
    async login(
        @Body('email') email: string,
        @Body('password') password: string
    ) {
        return this.authService.login(email, password);
    }

    @Get('me')
    @UseGuards(FirebaseAuthGuard)
    async getCurrentUser(@Req() req) {
        return this.authService.getUser(req.user.uid);
    }

    @Post('verify')
    @UseGuards(FirebaseAuthGuard)
    verify(@Req() req) {
        return req.user;
    }
}