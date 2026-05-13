import httpStatusCodes from "../constants/httpCodes";
import errorCodes from "../constants/errorCodes";

export class AppError extends Error {
  public statusCode: number;
  public details?: any;
  public errorCode?: string;

  constructor(
    message = "Internal Server Error",
    statusCode: number = httpStatusCodes.INTERNAL_SERVER_ERROR,
    details?: any,
    errorCode?: string,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.errorCode = errorCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Invalid Data", details?: any) {
    super(
      message,
      httpStatusCodes.BAD_REQUEST,
      details,
      errorCodes.VALIDATION_ERROR,
    );
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad Request", details?: any) {
    super(
      message,
      httpStatusCodes.BAD_REQUEST,
      details,
      errorCodes.BAD_REQUEST,
    );
  }
}

export class AuthError extends AppError {
  constructor(message = "Unauthorized") {
    super(
      message,
      httpStatusCodes.UNAUTHORIZED,
      undefined,
      errorCodes.AUTH_ERROR,
    );
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, httpStatusCodes.FORBIDDEN, undefined, errorCodes.FORBIDDEN);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource Not Found") {
    super(message, httpStatusCodes.NOT_FOUND, undefined, errorCodes.NOT_FOUND);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict", details?: any) {
    super(message, httpStatusCodes.CONFLICT, details, errorCodes.CONFLICT);
  }
}

export class RateLimitError extends AppError {
  constructor(message = "Too Many Requests") {
    super(
      message,
      httpStatusCodes.TOO_MANY_REQUESTS,
      undefined,
      errorCodes.RATE_LIMIT_ERROR,
    );
  }
}

export class DatabaseError extends AppError {
  constructor(message = "Database Error", details?: any) {
    super(
      message,
      httpStatusCodes.INTERNAL_SERVER_ERROR,
      details,
      errorCodes.DATABASE_ERROR,
    );
  }
}
