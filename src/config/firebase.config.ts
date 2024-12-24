// src/config/firebase.config.ts

import { ConfigService } from '@nestjs/config';

export const firebaseConfig = (configService: ConfigService) => ({
  projectId: configService.get<string>('FIREBASE_PROJECT_ID'),
  privateKey: configService
    .get<string>('FIREBASE_PRIVATE_KEY')
    ?.replace(/\\n/g, '\n'),
  clientEmail: configService.get<string>('FIREBASE_CLIENT_EMAIL'),
  databaseURL: configService.get<string>('FIREBASE_DATABASE_URL'),
  storageBucket: configService.get<string>('FIREBASE_STORAGE_BUCKET'),
});
