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
import { ErrorResponse } from '../async-handler/error';
import { ApiResponse } from '../async-handler/common/HttpStatusCode';
import { Request } from '@node_modules/@types/express';
import { LoggerService } from '../async-handler/logger.service';

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
    const baseUrl = `${request.protocol}://${request.headers.host}`;
    const resourceUrl = `${baseUrl}${request.url}`;

    return {
      data,
      links: {
        self: resourceUrl,
      },
    };
  }

  private handleError(
    request: Request,
    response: Response,
    error: Error,
    startTime: number,
  ): Observable<never> {
    this.logger.logError(this.logger.createErrorLog(request, error, startTime));

    if (error instanceof ErrorResponse) {
      return throwError(() => new HttpException(
        {
          error: {
            code: error.status,
            message: error.message,
            errors: error.errors?.map((err) => ({
              code: err.code || 'UNKNOWN_ERROR',
              message: err.message,
              field: err.field,
            })),
            startTime: request['startTime'],
          },
        },
        error.status,
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
          startTime: request['startTime'],
        },
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    ));
  }
}