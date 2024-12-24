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

    @Get('script2')
    async runScriptTwo(
        @Query('arg1') arg1: string,
        @Query('arg2') arg2: string
    ) {
        return await this.pythonService.runScriptTwo(arg1, arg2);
    }

    @Get('script3')
    async runScriptThree() {
        return await this.pythonService.runScriptThree();
    }
}
