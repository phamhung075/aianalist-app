// src/lib/python/python.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { PythonController } from './python.controller';
import { PythonService } from './python.service';

describe('PythonController', () => {
  let controller: PythonController;
  let service: PythonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PythonController],
      providers: [{
        provide: PythonService,
        useValue: {
          runTest: jest.fn(),
          runScriptTwo: jest.fn(),
          runScriptThree: jest.fn(),
        }
      }],
    }).compile();

    controller = module.get<PythonController>(PythonController);
    service = module.get<PythonService>(PythonService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('runTest', () => {
    it('should call PythonService.runTest with argument', async () => {
      const testArg = 'test-argument';
      await controller.runTest(testArg);
      expect(service.runTest).toHaveBeenCalledWith(testArg);
    });

    it('should handle undefined argument', async () => {
      await controller.runTest(undefined);
      expect(service.runTest).toHaveBeenCalledWith(undefined);
    });
  });


});