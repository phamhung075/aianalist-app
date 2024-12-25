// auth.service.spec.ts additions
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { FirebaseService } from '../database/firebase/firebase.service';

describe('AuthService', () => {
    let service: AuthService;
    let firebaseService: FirebaseService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: FirebaseService,
                    useValue: {
                        verifyToken: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        firebaseService = module.get<FirebaseService>(FirebaseService);
    });

    // Add test cases
});