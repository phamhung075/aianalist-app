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
                        runScriptOne: jest
                            .fn()
                            .mockResolvedValue(
                                'Python mock executed successfully!'
                            ),
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

    it('should call runScriptOne and return output', async () => {
        const result = await controller.runScriptOne('testArg');
        expect(service.runScriptOne).toHaveBeenCalledWith('testArg');
        expect(result).toEqual('Python mock executed successfully!');
    });
});
