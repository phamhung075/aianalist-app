// src/_core/utils/response.handler.ts
import { Response } from 'express';
import { HttpStatusCode, ApiResponse, ApiError, PaginationResult } from '../http-status/common/HttpStatusCode';
const { StatusCodes, ReasonPhrases } = HttpStatusCode;


export interface MetaData<T> {
    code?: number;
    status?: string;
    message?: string;
    path?: string;
    timestamp: string;
    pagination?: PaginationResult<T>;
    request?: RequestMeta;
    responseTime?: string;
    links?: {
        self: string;
        first?: string;
        prev?: string;
        next?: string;
        last?: string;
    };
}

export interface RestResponse<T = any> {
    level?: string;
    data: T | null;
    metadata: MetaData<T>;    
    errors?: Array<{
        code: string;
        message: string;
        field?: string;
    }>;
}


export interface RequestMeta {
    id: string;
    timestamp: string;
    method: string;
    url: string;
}

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
        pagination?: PaginationResult<T>;
        metadata?: Record<string, any>;
    }
): Response {
    const response: ApiResponse<T> = {
        success: true,
        code,
        message,
        data,
        metadata: {
            timestamp: new Date().toISOString(),
            status: this.getStatusText(code),
            path: res.req.originalUrl,
            ...metadata,
            ...pagination            
        }
    };

    return res.status(code).json(response);
}


    static error(
        req: Request,
        res: Response, 
        {
            code = StatusCodes.INTERNAL_SERVER_ERROR,
            message = ReasonPhrases.INTERNAL_SERVER_ERROR,
            errors = []
        }: {
            code: number;
            message: string;
            errors: ApiError[];            
        }
    ): Response {
        const response: ApiResponse<null> = {
            success: false,
            code,
            message,
            metadata: {
                responseTime: `${Date.now() - req['startTime']}ms`,
                timestamp: new Date().toISOString(),
                status: this.getStatusText(code),
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