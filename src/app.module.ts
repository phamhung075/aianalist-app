import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContactModule } from './modules/contact/contact.module';
import { PythonModule } from './lib/python/python.module';
import { FirebaseModule } from './database/firebase/firebase.module';
import { FirebaseTestController } from './database/firebase/firebase-test/firebase-test.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth/auth.controller';
import { initializeFirebaseClient } from './config/firebase-client.config';
import { initializeFirebaseAdmin } from './config/firebase-admin.config';

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
    controllers: [AppController, FirebaseTestController, AuthController],
    providers: [AppService],
})
export class AppModule {
    constructor() {
        console.log('🔥 Initializing Firebase Client...');
        initializeFirebaseClient(); // Must be called first
        initializeFirebaseAdmin(); // Must be called second
    }
}