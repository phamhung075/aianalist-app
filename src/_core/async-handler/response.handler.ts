// src/_core/utils/response.handler.ts
import { Response } from 'express';
import { ApiError, ApiResponse, ApiSuccess, HttpStatusCode, PaginationResult } from './common/HttpStatusCode';
import { PaginationMeta } from './interfaces/rest.interface';


const { StatusCodes, ReasonPhrases } = HttpStatusCode;

export class RestHandler {
    static success<T>(
    res: Response, 
    {
        data,
        code = StatusCodes.OK,
        message = ReasonPhrases.OK,
        pagination,
        metadata = {}
    }: {
        data: T;
        code?: number;
        message?: string;
        pagination?: PaginationResult<T>['meta']; // Changed this line
        metadata?: Record<string, any>;
    }
): Response {
    const response: ApiSuccess<T> = {  // Changed to ApiSuccess<T>
        success: true,
        status: code,  // Added status field
        message,
        data,
        metaData: {
            timestamp: new Date().toISOString(),
            path: res.req.originalUrl,
            ...metadata,
            ...(pagination && { pagination })
        }
    };

    return res.status(code).json(response);
}

    static error(
        res: Response, 
        {
            code = StatusCodes.INTERNAL_SERVER_ERROR,
            message = ReasonPhrases.INTERNAL_SERVER_ERROR,
            errors = []
        }: {
            code: number;
            message: string;
            errors: ApiError<null>[];
        }
    ): Response {
        const response: ApiResponse<null> = {
            success: false,
            code,
            message,            
            metaData: {
                timestamp: new Date().toISOString(),
                path: res.req.originalUrl,
            },
            errors
        };

        return res.status(code).json(response);
    }

    private static getStatusText(code: number): string {
        return Object.entries(StatusCodes)
            .find(([_, value]) => value === code)?.[0] 
            || 'UNKNOWN_STATUS';
    }
}