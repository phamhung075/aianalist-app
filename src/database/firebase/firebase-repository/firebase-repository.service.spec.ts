// src/database/firebase/firebase-repository/firebase-repository.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { FirebaseRepositoryService } from './firebase-repository.service';
import { FirebaseService } from '../firebase.service';

describe('FirebaseRepositoryService', () => {
    let repositoryService: FirebaseRepositoryService;
    let firebaseService: FirebaseService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FirebaseRepositoryService,
                {
                    provide: FirebaseService,
                    useValue: {
                        getFirestore: jest.fn().mockReturnValue({
                            collection: jest.fn().mockReturnThis(),
                            doc: jest.fn().mockReturnThis(),
                            get: jest.fn().mockResolvedValue({
                                exists: true,
                                data: () => ({ id: '123', name: 'Test' }),
                            }),
                            set: jest.fn().mockResolvedValue(true),
                            delete: jest.fn().mockResolvedValue(true),
                        }),
                    },
                },
            ],
        }).compile();

        repositoryService = module.get<FirebaseRepositoryService>(
            FirebaseRepositoryService
        );
        firebaseService = module.get<FirebaseService>(FirebaseService);
    });

    it('should be defined', () => {
        expect(repositoryService).toBeDefined();
    });

    it('should get a document', async () => {
        const result = await repositoryService.getDocument('users', '123');
        expect(result).toEqual({ id: '123', name: 'Test' });
        expect(firebaseService.getFirestore).toHaveBeenCalled();
    });

    it('should set a document', async () => {
        const result = await repositoryService.setDocument('users', '123', {
            name: 'Test',
        });
        expect(result).toEqual({ success: true });
        expect(firebaseService.getFirestore).toHaveBeenCalled();
    });

    it('should delete a document', async () => {
        const result = await repositoryService.deleteDocument('users', '123');
        expect(result).toEqual({ success: true });
        expect(firebaseService.getFirestore).toHaveBeenCalled();
    });
});
