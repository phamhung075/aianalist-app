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
import { Request } from '@node_modules/@types/express';
import { LoggerService } from '../logger-service/logger.service';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  constructor(private readonly logger: LoggerService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const startTime = Date.now();
    request.startTime = startTime;
    return next.handle().pipe(
      map((data) => this.handleSuccess(request, data)),
      catchError((error) => this.handleError(request, response, error, startTime)),
    );
  }

  private handleSuccess(request: Request, data: T): ApiResponse<T> {
    // const baseUrl = `${request.protocol}://${request.headers.host}`;
    // const resourceUrl = `${baseUrl}${request.url}`;

    return {
        success: true,
        message: "You need use _SUCCESS.methode for send response",
    };
}

  private handleError(
    request: Request,
    response: Response,
    error: Error,
    startTime: number,
  ): Observable<never> {
    this.logger.logError(this.logger.createErrorLog(request, error, startTime));
    const responseTime= Date.now() - startTime;

      if (error instanceof ErrorResponse) {
        return throwError(() => error);
      }
      
      if (error instanceof HttpException) {
      return throwError(() => new HttpException(
      {
          success: false,           
          code: error.getStatus(),
          message: error.cause,
          errors: error.getResponse(),
          metadata: {
              timestamp: new Date().toISOString(),
              responseTime: responseTime + "ms",
              path: request.url,              
          }
          //   stack: error.stack,
      },
      error.getStatus(),
    ));
    }

    return throwError(() => new HttpException(
      {
        error: {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'An unexpected error occurred',
          errors: [
            {
              code: 'INTERNAL_SERVER_ERROR',
              message: error.message || 'Unknown error',
            },
          ],
          responseTime: responseTime,
        },
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    ));
  }
}