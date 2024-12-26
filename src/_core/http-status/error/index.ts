
import { HttpStatusCode } from "../common/HttpStatusCode"
const { StatusCodes, ReasonPhrases } = HttpStatusCode
// Interface for standardized error response
export interface ErrorDetails {
    code: string;
    message: string;
    field?: string;
}

export class ErrorResponse extends Error {
    status: number;
    code: string;
    field?: string;
    details?: any;
    errors?: Array<{ 
        field: string; 
        message: string;
        code?: string;
        details?: any;
    }>;

    constructor({
        message,
        status,
        code,
        field,
        details,
        errors
    }: {
        message: string;
        status: number;
        code: string;
        field?: string;
        details?: any;
        errors?: Array<{ 
            field: string; 
            message: string;
            code?: string;
        }>;
    }) {
        super(message);
        this.name = this.constructor.name;
        this.status = status;
        this.code = code;
        this.field = field;
        this.details = details;
        this.errors = errors;
    }
}

class BadRequestError extends ErrorResponse {
   constructor(data: {
        message?: string;
        field?: string;
        errors?: Array<{ field: string; message: string; code?: string }>;
    }) {
        super({
            message: data.message || ReasonPhrases.BAD_REQUEST,
            status: StatusCodes.BAD_REQUEST,
            code: 'BAD_REQUEST',
            field: data.field,
            errors: data.errors
        });
    }
}

class ValidationError extends ErrorResponse {
    constructor(data: {
        message?: string;
        field?: string;
        errors?: Array<{ field: string; message: string; code?: string }>;
    }) {
        super({
            message: data.message || "Validation Error",
            status: StatusCodes.CONFLICT,
            code: 'VALIDATION_ERROR',
            field: data.field,
            errors: data.errors
        });
    }
}

// Same pattern for other error classes
class UnprocessableEntityError extends ErrorResponse {
    constructor(data: {
        message?: string;
        field?: string;
        errors?: Array<{ field: string; message: string; code?: string }>;
    }) {
        super({
            message: data.message || ReasonPhrases.UNPROCESSABLE_ENTITY,
            status: StatusCodes.UNPROCESSABLE_ENTITY,
            code: 'UNPROCESSABLE_ENTITY',
            field: data.field,
            errors: data.errors
        });
    }
}

class NotFoundError extends ErrorResponse {
    constructor(data: {
        message?: string;
        field?: string;
        errors?: Array<{ field: string; message: string; code?: string }>;
    }) {
        super({
            message: data.message || ReasonPhrases.NOT_FOUND,
            status: StatusCodes.NOT_FOUND,
            code: 'NOT_FOUND',
            field: data.field,
            errors: data.errors
        });
    }
}

// Thêm các lớp lỗi khác theo nhu cầu...

const _ERROR = {
	BadRequestError, // 400
    ValidationError, // 409
	// UnauthorizedError, // 401
	// PaymentRequiredError, // 402
	// ForbiddenError, // 403
	NotFoundError, // 404
	// MethodNotAllowedError, // 405
	// NotAcceptableError, // 406
	// ProxyAuthenticationRequiredError, // 407
	// RequestTimeoutError, // 408
	// ConflictRequestError, // 409
	// GoneError, // 410
	// LengthRequiredError, // 411
	// PreconditionFailedError, // 412
	// RequestTooLongError, // 413
	// RequestUriTooLongError, // 414
	// UnsupportedMediaTypeError, // 415
	// RequestedRangeNotSatisfiableError, // 416
	// ExpectationFailedError, // 417
	// ImATeapotError, // 418
	// InsufficientStorageError, // 419
	// MethodFailureError, // 420
	// MisdirectedRequestError, // 421
	UnprocessableEntityError, // 422
	// LockedError, // 423
	// FailedDependencyError, // 424
	// PreconditionRequiredError, // 428
	// TooManyRequestsError, // 429
	// RequestHeaderFieldsTooLargeError, // 431
	// UnavailableForLegalReasonsError, // 451
	// InternalServerError, // 500
	// NotImplementedError, // 501
	// BadGatewayError, // 502
	// ServiceUnavailableError, // 503
	// GatewayTimeoutError, // 504
	// HttpVersionNotSupportedError, // 505
	// NetworkAuthenticationRequiredError // 511
};

export default _ERROR ;