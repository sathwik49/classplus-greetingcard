import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler";
import appConfig from "../config/appConfig";
import { AuthError } from "../utils/error";
import { AccessTokenJwtPayloadType } from "../types";
import { getUserById } from "../utils/user";

export const verifyAuth = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AuthError("Unauthorized");
    }

    const accessToken = authHeader.split(" ")[1];

    let decoded: AccessTokenJwtPayloadType;

    try {
      decoded = jwt.verify(
        accessToken,
        appConfig.JWT_ACCESS_TOKEN_SECRET,
      ) as AccessTokenJwtPayloadType;
    } catch {
      throw new AuthError("Unauthorized");
    }

    const user = await getUserById(decoded.userId);

    if (!user) {
      throw new AuthError("Unauthorized");
    }

    req.user = {
      userId: user.id,
      plan: user.plan,
    };

    next();
  },
);
