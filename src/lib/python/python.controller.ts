// src/python/python.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { PythonService } from './python.service';

@Controller('python')
export class PythonController {
    constructor(private readonly pythonService: PythonService) {}

    @Get('run-test')
    async runTest(@Query('arg') arg: string) {
        return await this.pythonService.runTest(arg);
    }

}
