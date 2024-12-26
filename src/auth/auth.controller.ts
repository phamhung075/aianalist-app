// src/auth/auth.controller.ts
import { Controller, Post, Body, UseGuards, Req, Get, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FirebaseAuthGuard } from './firebase-auth.guard';
import _SUCCESS from '@/_core/http-status/success';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(
        @Body('email') email: string,
        @Body('password') password: string,
        @Req() req,
        @Res() res
    ) {
        const result = await this.authService.register(email, password);
        const message = 'User registered successfully';
        new _SUCCESS.SuccessResponse({ message, data: result }).setResponseTime(req.startTime).send(res);
    }

    @Post('login')
    async login(
        @Body('email') email: string,
        @Body('password') password: string,
        @Req() req,
        @Res() res
    ) {
        const result = await this.authService.login(email, password);
        const message = 'User logged in successfully';
        new _SUCCESS.SuccessResponse({ message, data: result }).setResponseTime(req.startTime).send(res);
    }

    @Get('me')
    @UseGuards(FirebaseAuthGuard)
    async getCurrentUser(@Req() req, @Res() res) {
        const result = await this.authService.getUser(req.user.uid);
        const message = 'User fetched successfully';
        console.log(req.startTime);
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