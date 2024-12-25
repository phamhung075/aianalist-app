import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FirebaseService } from '@/database/firebase/firebase.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

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
    it('should return the user from the request', async () => {
      const mockUser = { uid: 'mock-uid', email: 'test@example.com' };
      const mockReq = { user: mockUser };

      const result = await controller.verify(mockReq);

      expect(result).toEqual(mockUser);
    });
  });

  describe('getCurrentUser', () => {
    it('should call authService.getUser with correct uid from request', async () => {
      const mockUser = { uid: 'mock-uid' };
      const mockReq = { user: mockUser };

      await controller.getCurrentUser(mockReq);

      expect(authService.getUser).toHaveBeenCalledWith(mockUser.uid);
    });
  });
});