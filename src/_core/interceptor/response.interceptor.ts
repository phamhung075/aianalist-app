import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ErrorResponse } from '../http-status/error';
import { ApiResponse } from '../http-status/common/HttpStatusCode';
import { Request, Response } from '@node_modules/@types/express';
import { LoggerService } from '../logger-service/logger.service';
import { RestHandler } from '../rest-handle';
import { StatusCodes } from '../http-status/common/StatusCodes';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
    constructor(private readonly logger: LoggerService) { }

    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<ApiResponse<T>> {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        const startTime = Date.now();
        request.startTime = startTime;

        return next.handle().pipe(
            map((data) => this.handleSuccess(request, data)), // Returns ApiResponse<T>
            catchError((error) => {
                const response = ctx.getResponse();
                return throwError(() => this.handleError(request, response, error, startTime));
            }),
        );
    }

    private handleSuccess(request: Request, data: T): ApiResponse<T> {
        const baseUrl = `${request.protocol}://${request.headers.host}`;
        const resourceUrl = `${baseUrl}${request.url}`;

        return {
            success: true,
            code: 200,
            message: 'Request successful',
            data,
            metadata: {
                timestamp: new Date().toISOString(),
                status: StatusCodes.OK,
                path: request.url,
                links: {
                    self: resourceUrl,
                }
            }
        };
    }



    private handleError(
        request: Request,
        response: Response,
        error: Error,
        startTime: number,
    ): Observable<never> {
        const responseTime = startTime ? `${Date.now() - startTime}ms` : '0ms';

        // Log the error
        this.logger.logError(this.logger.createErrorLog(request, error, startTime));
        console.error('ERROR:', error);

        // Handle custom ErrorResponse
        if (error instanceof ErrorResponse) {
            return throwError(() => new HttpException(
                {
                    code: error.status,
                    message: error.message,
                    errors: error.errors?.map((err) => ({
                        code: err.code || 'UNKNOWN_ERROR',
                        message: err.message,
                        field: err.field,
                    })),
                    responseTime,
                },
                error.status,
            ));
        }

        // Handle general errors
        if (error instanceof Error) {
            RestHandler.error(response, {
                code: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'An unexpected server error occurred',
                errors: [
                    {
                        code: 'INTERNAL_SERVER_ERROR',
                        message: error.message || 'Unknown error',
                    },
                ],
            });
        }

        // Catch-all for unhandled errors
        return throwError(() => new HttpException(
            {
                code: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'An unexpected error occurred',
                errors: [
                    {
                        code: 'INTERNAL_SERVER_ERROR',
                        message: error.message || 'Unknown error',
                    },
                ],
                responseTime,
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
        ));
    }
}