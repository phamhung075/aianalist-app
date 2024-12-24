// src/auth/auth.controller.ts

import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

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

    @Post('verify')
    @UseGuards(JwtAuthGuard)
    verify(@Req() req) {
        return req.user;
    }
}
