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
      providers: [
        {
          provide: PythonService,
          useValue: {
            runPythonScript: jest
              .fn()
              .mockResolvedValue('Mocked Python Output'),
          },
        },
      ],
    }).compile();

    controller = module.get<PythonController>(PythonController);
    service = module.get<PythonService>(PythonService);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call runPythonScript and return output', async () => {
    const result = await controller.runScript('test');
    expect(service.runPythonScript).toHaveBeenCalledWith('test');
    expect(result).toEqual({
      success: true,
      output: 'Mocked Python Output',
    });
  });
});
