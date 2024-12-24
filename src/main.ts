// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const logger = new Logger('Bootstrap');

    await app.listen(3000);
    logger.log(`🚀 Application is running on: http://localhost:3000`);

    // Display all routes
    const httpAdapterHost = app.get(HttpAdapterHost);
    const httpServer = httpAdapterHost.httpAdapter.getHttpServer();

    const router = httpServer._events.request._router; // Express router access

    console.log('📚 List of API Routes:');
    router.stack
        .filter((r: any) => r.route)
        .forEach((r: any) => {
            const methods = Object.keys(r.route.methods)
                .map((method) => method.toUpperCase())
                .join(', ');
            console.log(`${methods} -> ${r.route.path}`);
        });
}
bootstrap();
