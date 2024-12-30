import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from '../../app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getHello', () => {
    it('should return welcome message', () => {
      expect(service.getHello()).toBe('Welcome to AIanalist!');
    });

    it('should return a string', () => {
      expect(typeof service.getHello()).toBe('string');
    });

    it('should not return empty string', () => {
      expect(service.getHello()).not.toBe('');
    });
  });
});