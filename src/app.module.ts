import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContactModule } from './modules/contact/contact.module';
import { PythonModule } from './lib/python/python.module';
import { FirebaseModule } from './database/firebase/firebase.module';
import { FirebaseTestController } from './database/firebase/firebase-test/firebase-test.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth/auth.controller';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true, // Make it globally available
        }),
        ContactModule,
        PythonModule,
        FirebaseModule,
    ],
    controllers: [AppController, FirebaseTestController, AuthController],
    providers: [AppService],
})
export class AppModule {}
