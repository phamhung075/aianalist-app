// src/auth/auth.controller.ts
import { Controller, Post, Body, UseGuards, Req, Get, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FirebaseAuthGuard } from './firebase-auth.guard';
import _SUCCESS from '@/_core/async-handler/success';

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
    async getCurrentUser(@Req() req, @Res() res) {
        const result = await this.authService.getUser(req.user.uid);
        console.log('🚀 ~ file: auth.controller.ts:34 ~ AuthController ~ getCurrentUser ~ result:', result);
        const message = 'User fetched successfully';
        new _SUCCESS.SuccessResponse({ message, data: result }).setResponseTime(req.startTime).send(res);
    }

    @Post('verify')
    @UseGuards(FirebaseAuthGuard)
    verify(@Req() req, @Res() res) {
        const result = req.user;
        const message = 'User verified successfully';
        new _SUCCESS.SuccessResponse({ message, data: result }).setResponseTime(req.startTime).send(res);
    }    
}