// src/main.ts
import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { NextFunction, Response } from '@node_modules/@types/express';
import { config } from 'dotenv';
import express from 'express';
import { asyncHandlerFn } from './_core/async-handler/async-handler';
import { ExtendedFunctionRequest } from './_core/async-handler/interfaces/ExtendedFunctionRequest.interface';
import { isRunningWithNodemon } from './_core/check-nodemon';
import { setupCors } from './_core/cors';
import { responseLogger } from './_core/responseLogger';
import { showRequestUrl } from './_core/showRequestUrl';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    setupCors(app);
	app.use(express.json({ limit: '50mb' }));
	app.use(express.urlencoded({ limit: '50mb', extended: true }));
    app.use(showRequestUrl);
    app.use(responseLogger);
    // app.use((req: ExtendedFunctionRequest, res: Response, next: NextFunction) => {
    //     asyncHandlerFn(next)(req, res, next);
    // });
    isRunningWithNodemon()

    // Load environment variables based on NODE_ENV
    // console.log('NODE_ENV:', process.env);
    const environment = process.env.NODE_ENV || 'development';
    config({ path: `.env.${environment}` });
    const logger = new Logger('Bootstrap');
    const isDevelopment = process.env.NODE_ENV !== 'production';
    const port = process.env.PORT || 3000;
    // Global pipes
    app.useGlobalPipes(new ValidationPipe());
    
    // Start the server
    await app.listen(port);

    // Display all routes
    const httpAdapterHost = app.get(HttpAdapterHost);
    const httpServer = httpAdapterHost.httpAdapter.getHttpServer();
    const router = httpServer._events.request._router;
    logger.log(`🚀 Application is running on: http://localhost:${port}`);
    logger.log(`🌍 Environment: ${isDevelopment ? 'Development' : 'Production'}`);
    logger.log('📚 List of API Routes:');
    router.stack
        .filter((r: any) => r.route)
        .forEach((r: any) => {
            const methods = Object.keys(r.route.methods)
                .map((method) => method.toUpperCase())
                .join(', ');
            logger.log(`${methods} -> ${r.route.path}`);
        });
    
    
    
}

bootstrap().catch((error) => {
    const logger = new Logger('Bootstrap');
    logger.error('Failed to start application:', error);
});


