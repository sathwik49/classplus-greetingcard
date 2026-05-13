import jwt from "jsonwebtoken";
import appConfig from "../config/appConfig";

export const generateTokens = (payload: any) => {
  const accessToken = jwt.sign(payload, appConfig.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: appConfig.JWT_ACCESS_TOKEN_EXPIRY,
  });

  const refreshToken = jwt.sign(payload, appConfig.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: appConfig.JWT_REFRESH_TOKEN_EXPIRY,
  });

  return { accessToken, refreshToken };
};

