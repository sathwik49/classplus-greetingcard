import { CookieOptions, Response } from "express";
import appConfig from "../config/appConfig";

const cookieConfig: CookieOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: appConfig.NODE_ENV === "prod",
  sameSite: appConfig.NODE_ENV === "prod" ? "none" : "lax",
};

export const setCookies = (res: Response, value: any) => {
  res.cookie(appConfig.JWT_COOKIE_NAME, value, cookieConfig);
};
