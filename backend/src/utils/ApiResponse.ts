import type { Response } from "express";

export class ApiResponse<T> {
  success: boolean;
  message: string;
  details: T | null;
  error_code: string | null;

  constructor(
    success: boolean,
    message: string,
    details: T | null = null,
    error_code: string | null = null,
  ) {
    this.success = success;
    this.message = message;
    this.details = details;
    this.error_code = error_code;
  }

  static ok<T>(
    res: Response,
    details: T | null,
    message = "Success",
    status = 200,
    error_code: string | null = null,
  ) {
    return res
      .status(status)
      .json(new ApiResponse(true, message, details, error_code));
  }

  static error<T>(
    res: Response,
    details: T | null,
    message: string,
    status = 400,
    error_code: string | null = null,
  ) {
    return res
      .status(status)
      .json(new ApiResponse(false, message, details, error_code));
  }
}
