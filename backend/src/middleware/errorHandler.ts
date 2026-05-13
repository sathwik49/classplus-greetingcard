import { ErrorRequestHandler } from "express";
import { AppError } from "../utils/error";
import { ApiResponse } from "../utils/ApiResponse";
import httpStatusCodes from "../constants/httpCodes";
import errorCodes from "../constants/errorCodes";

const errorHandler: ErrorRequestHandler = (err, _req, res, _next): any => {
  console.log(err);
  if (err instanceof AppError) {
    return ApiResponse.error(
      res,
      err.details ?? null,
      err.message,
      err.statusCode,
      err.errorCode ?? null,
    );
  }

  if (err instanceof SyntaxError) {
    return ApiResponse.error(
      res,
      null,
      "Invalid data format",
      httpStatusCodes.BAD_REQUEST,
      errorCodes.INVALID_FORMAT,
    );
  }

  return ApiResponse.error(
    res,
    null,
    "Internal server error",
    httpStatusCodes.INTERNAL_SERVER_ERROR,
    errorCodes.SERVER_ERROR,
  );
};

export default errorHandler;
