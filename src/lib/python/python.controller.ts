// src/python/python.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { PythonService } from './python.service';

@Controller('python')
export class PythonController {
    constructor(private readonly pythonService: PythonService) {}

    @Get('run')
    async runScript(@Query('arg') arg: string) {
        try {
            const result = await this.pythonService.runPythonScript(
                arg || 'default'
            );
            return { success: true, output: result };
        } catch (error) {
            return { success: false, error };
        }
    }
}
