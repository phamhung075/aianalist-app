// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const logger = new Logger('Bootstrap');
    
    // Global pipes
    app.useGlobalPipes(new ValidationPipe());
    
    // Start the server
    await app.listen(3000);
    logger.log(`🚀 Application is running on: http://localhost:3000`);

    // Display all routes
    const httpAdapterHost = app.get(HttpAdapterHost);
    const httpServer = httpAdapterHost.httpAdapter.getHttpServer();
    const router = httpServer._events.request._router;

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