import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { initializeFirebaseAdmin } from './config/firebase-admin.config';
import { initializeFirebaseClient } from './config/firebase-client.config';
import { FirebaseModule } from './database/firebase/firebase.module';
import { PythonModule } from './lib/python/python.module';
import { ContactModule } from './modules/contact/contact.module';
import { LoggerService } from './_core/async-handler/logger.service';
import { APP_INTERCEPTOR } from '@node_modules/@nestjs/core';
import { ResponseInterceptor } from './_core/interceptor/response.interceptor';

@Module({
    imports: [
        AuthModule, 
        ConfigModule.forRoot({
            isGlobal: true, // Make it globally available
        }),
        ContactModule,
        PythonModule,
        FirebaseModule,
        AuthModule,        
    ],
    controllers: [AppController],
    providers: [
        AppService,
        LoggerService,
        {
            provide: APP_INTERCEPTOR,
            useClass: ResponseInterceptor,
        },
    ],
})
export class AppModule {
    constructor() {
        console.log('🔥 Initializing Firebase Client...');
        initializeFirebaseClient(); // Must be called first
        initializeFirebaseAdmin(); // Must be called second
    }
}