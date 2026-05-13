import { planEnum } from "../db/schema";

export interface AccessTokenJwtPayloadType {
  userId: string;
  email: string;
}

export interface RefreshTokenJwtPayloadType {
  userId: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user: {
        userId: string;
        plan: "free" | "premium";
      };
    }
  }
}
