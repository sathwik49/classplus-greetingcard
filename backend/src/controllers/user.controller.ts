import { Request, Response } from "express";
import asyncHandler from "../middleware/asyncHandler";
import { getUserById } from "../utils/user";
import { ApiResponse } from "../utils/ApiResponse";
import httpStatusCodes from "../constants/httpCodes";

export const getMeController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    const user = await getUserById(userId);

    return ApiResponse.ok(
      res,
      user,
      "Fetched profile successfully",
      httpStatusCodes.OK,
      null,
    );
  },
);
