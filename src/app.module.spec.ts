import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ContactModule } from './modules/contact/contact.module';
import { PythonModule } from './lib/python/python.module';
import { FirebaseModule } from './database/firebase/firebase.module';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth/auth.controller';

// Mock the Firebase initialization functions
jest.mock('./config/firebase-client.config', () => ({
  initializeFirebaseClient: jest.fn().mockImplementation(() => {
    console.log('Mocked Firebase Client initialization');
  }),
}));

jest.mock('./config/firebase-admin.config', () => ({
  initializeFirebaseAdmin: jest.fn().mockImplementation(() => {
    console.log('Mocked Firebase Admin initialization');
  }),
}));

describe('AppModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        AuthModule,
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        ContactModule,
        PythonModule,
        FirebaseModule,
      ],
      controllers: [AppController, AuthController],
      providers: [AppService],
    }).compile();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should have AppController', () => {
    const controller = module.get<AppController>(AppController);
    expect(controller).toBeDefined();
  });

  it('should have AuthController', () => {
    const controller = module.get<AuthController>(AuthController);
    expect(controller).toBeDefined();
  });

  it('should have AppService', () => {
    const service = module.get<AppService>(AppService);
    expect(service).toBeDefined();
  });

  describe('Firebase Initialization', () => {
    it('should initialize Firebase Client and Admin', () => {
      const { initializeFirebaseClient } = require('./config/firebase-client.config');
      const { initializeFirebaseAdmin } = require('./config/firebase-admin.config');

      // Create a new instance of AppModule to trigger constructor
      new AppModule();

      expect(initializeFirebaseClient).toHaveBeenCalled();
      expect(initializeFirebaseAdmin).toHaveBeenCalled();
      
      // Verify initialization order
      const clientCallIndex = initializeFirebaseClient.mock.invocationCallOrder[0];
      const adminCallIndex = initializeFirebaseAdmin.mock.invocationCallOrder[0];
      expect(clientCallIndex).toBeLessThan(adminCallIndex);
    });
  });

  describe('Module Imports', () => {
    it('should import AuthModule', () => {
      expect(module.get(AuthModule)).toBeDefined();
    });

    it('should import ContactModule', () => {
      expect(module.get(ContactModule)).toBeDefined();
    });

    it('should import PythonModule', () => {
      expect(module.get(PythonModule)).toBeDefined();
    });

    it('should import FirebaseModule', () => {
      expect(module.get(FirebaseModule)).toBeDefined();
    });

    it('should import ConfigModule as global', async () => {
      const configModule = module.get(ConfigModule);
      expect(configModule).toBeDefined();
      // Test if config is accessible from other modules
      const moduleRef = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();
      expect(moduleRef.get(ConfigModule)).toBeDefined();
    });
  });
});