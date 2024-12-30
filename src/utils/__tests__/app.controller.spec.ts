import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../../app.controller';
import { AppService } from '../../app.service';

describe('AppController', () => {
    let appController: AppController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [AppController],
            providers: [AppService],
        }).compile();

        appController = app.get<AppController>(AppController);
    });

      const createMockReq = () => ({
    startTime: Date.now(),
    user: { uid: 'mock-uid' }
  });

  // Helper to create mock response object
  const createMockRes = () => {
    const headers = {};
    return {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      setHeader: jest.fn().mockImplementation((key, value) => {
        headers[key] = value;
        return this;
      }),
      getHeader: jest.fn().mockImplementation((key) => headers[key]),
      headers,
    };
  };
         
      const mockReq = createMockReq();
      const mockRes = createMockRes();

    describe('root', () => {
        it('should return "Welcome to AIanalist!"', () => {
            expect(appController.getHello(mockReq, mockRes)).toBe('Welcome to AIanalist!');
        });
    });
});
