import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FirebaseService } from '@/database/firebase/firebase.service';
import _SUCCESS from '@/_core/async-handler/success';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn().mockResolvedValue('mock-token'),
            login: jest.fn().mockResolvedValue('mock-token'),
            verifyToken: jest.fn().mockResolvedValue({ uid: 'mock-uid' }),
            getUser: jest.fn().mockResolvedValue({ uid: 'mock-uid', email: 'test@example.com' }),
          }
        },
        {
          provide: FirebaseService,
          useValue: {
            verifyIdToken: jest.fn().mockResolvedValue({ uid: 'mock-uid' }),
            getAuth: jest.fn(),
          }
        }
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call authService.register with correct params', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'password123'
      };

      await controller.register(registerDto.email, registerDto.password);

      expect(authService.register).toHaveBeenCalledWith(
        registerDto.email,
        registerDto.password
      );
    });
  });

  describe('login', () => {
    it('should call authService.login with correct params', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123'
      };

      await controller.login(loginDto.email, loginDto.password);

      expect(authService.login).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password
      );
    });
  });

  describe('verify', () => {
    it('should return success response with user data', async () => {
      const mockUser = { uid: 'mock-uid', email: 'test@example.com' };
      const mockReq = { 
        user: mockUser,
        startTime: Date.now()
      };
      const mockRes = createMockRes();

      await controller.verify(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'User verified successfully',
          data: mockUser,
          metadata: expect.objectContaining({
            code: 200,
            status: 'Ok',
            responseTime: expect.any(String),
            timestamp: expect.any(String)
          })
        })
      );

      expect(mockRes.setHeader).toHaveBeenCalledWith(
        'X-Response-Time',
        expect.stringMatching(/^\d+ms$/)
      );
    });
  });

  describe('getCurrentUser', () => {
    it('should return success response with user data', async () => {
      const mockUser = { uid: 'mock-uid' };
      const mockUserData = { uid: 'mock-uid', email: 'test@example.com' };
      const mockReq = { 
        user: mockUser,
        startTime: Date.now()
      };
      const mockRes = createMockRes();

      await controller.getCurrentUser(mockReq, mockRes);

      expect(authService.getUser).toHaveBeenCalledWith(mockUser.uid);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'User fetched successfully',
          data: mockUserData,
          metadata: expect.objectContaining({
            code: 200,
            status: 'Ok',
            responseTime: expect.any(String),
            timestamp: expect.any(String)
          })
        })
      );

      expect(mockRes.setHeader).toHaveBeenCalledWith(
        'X-Response-Time',
        expect.stringMatching(/^\d+ms$/)
      );
    });
  });
});