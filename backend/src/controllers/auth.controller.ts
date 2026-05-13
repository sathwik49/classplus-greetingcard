import { Request, Response } from "express";
import asyncHandler from "../middleware/asyncHandler";
import {
  userLoginSchema,
  userRegistrationSchema,
} from "../validations/auth.validation";
import {
  logOutService,
  refreshTokenService,
  userLoginService,
  userRegistrationService,
} from "../services/auth.service";
import { AuthError, ValidationError } from "../utils/error";
import { ApiResponse } from "../utils/ApiResponse";
import httpStatusCodes from "../constants/httpCodes";
import { setCookies } from "../utils/setCookies";
import appConfig from "../config/appConfig";
import jwt from "jsonwebtoken";
import { RefreshTokenJwtPayloadType } from "../types";

export const userRegistrationController = asyncHandler(
  async (req: Request, res: Response) => {
    const validation = userRegistrationSchema.safeParse(req.body);
    if (!validation.success) {
      throw validation.error;
    }
    if (!req.file) {
      throw new ValidationError("Profile picture in required");
    }
    if (!req.file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      throw new ValidationError("Only JPG,JPEG,PNG images are allowed");
    }
    const result = await userRegistrationService(
      validation.data,
      req.file.buffer,
    );

    setCookies(res, result.refreshToken);

    return ApiResponse.ok(
      res,
      {
        accessToken: result.accessToken,
      },
      "Registration successfull",
      httpStatusCodes.CREATED,
      null,
    );
  },
);

export const userLoginController = asyncHandler(
  async (req: Request, res: Response) => {
    const validation = userLoginSchema.safeParse(req.body);
    if (!validation.success) {
      throw validation.error;
    }

    const result = await userLoginService(validation.data);

    setCookies(res, result.refreshToken);

    return ApiResponse.ok(
      res,
      {
        accessToken: result.accessToken,
      },
      "Logged in successfully",
      httpStatusCodes.OK,
      null,
    );
  },
);

export const refreshTokenController = asyncHandler(
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies[appConfig.JWT_COOKIE_NAME];

    if (!refreshToken) {
      throw new AuthError("Unauthorized");
    }

    let decoded;

    try {
      decoded = jwt.verify(
        refreshToken,
        appConfig.JWT_REFRESH_TOKEN_SECRET,
      ) as RefreshTokenJwtPayloadType;
    } catch {
      throw new AuthError("Unauthorized");
    }

    const result = await refreshTokenService(refreshToken, decoded.userId);

    setCookies(res, result.newRefreshToken);

    return ApiResponse.ok(
      res,
      { accessToken: result.newAccessToken },
      "Success",
      httpStatusCodes.OK,
      null,
    );
  },
);

export const logOutController = asyncHandler(
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies[appConfig.JWT_COOKIE_NAME];
    if (refreshToken) {
      await logOutService(refreshToken);
    }

    res.clearCookie(appConfig.JWT_COOKIE_NAME);
    return ApiResponse.ok(
      res,
      null,
      "Logged out successfully",
      httpStatusCodes.OK,
      null,
    );
  },
);
