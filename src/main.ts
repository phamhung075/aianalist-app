// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { config } from 'dotenv';

async function bootstrap() {
    // Load environment variables based on NODE_ENV
    // console.log('NODE_ENV:', process.env);
    const environment = process.env.NODE_ENV || 'development';
    config({ path: `.env.${environment}` });
    const app = await NestFactory.create(AppModule);
    const logger = new Logger('Bootstrap');
    const isDevelopment = process.env.NODE_ENV !== 'production';
    const port = process.env.PORT || 3000;
    // Global pipes
    app.useGlobalPipes(new ValidationPipe());
    
    // Start the server
    await app.listen(3000);

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


