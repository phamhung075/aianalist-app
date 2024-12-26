import { INestApplication } from "@node_modules/@nestjs/common";
import { CorsOptions } from "@node_modules/@nestjs/common/interfaces/external/cors-options.interface";

export function setupCors(app: INestApplication) {
    const devOrigins = [`http://localhost:${process.env.PORT}`];
    const prodOrigins = [`http://localhost:${process.env.PORT}`]; // Change this to your production domains

    const corsOptions: CorsOptions = {
        origin: process.env.NODE_ENV === 'development' ? devOrigins : prodOrigins,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
        allowedHeaders: [
            'Authorization', 
            'Content-Type', 
            'X-Requested-With',
            'X-Requires-Auth'
        ],
        exposedHeaders: ['Content-Range', 'X-Content-Range'],
        credentials: true,
        preflightContinue: false,
        optionsSuccessStatus: 204
    };

    app.enableCors(corsOptions);
}