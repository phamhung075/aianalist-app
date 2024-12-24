// src/auth/auth.controller.ts
import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

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
