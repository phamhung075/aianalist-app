import { Controller, Get, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import _SUCCESS from './_core/async-handler/success';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get() 
        
    getHello(
        @Req() req,
        @Res() res
    ): any {
        const message = this.appService.getHello();        
        new _SUCCESS.SuccessResponse({ message }).setData("AIanalist").setResponseTime(req.startTime).send(res);
    }
}
