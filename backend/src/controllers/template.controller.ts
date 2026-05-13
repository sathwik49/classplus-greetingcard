import { Request, Response } from "express";
import asyncHandler from "../middleware/asyncHandler";
import {
  getAllTemplatesService,
  getTemplateByIdService,
} from "../services/template.service";
import { ApiResponse } from "../utils/ApiResponse";
import httpStatusCodes from "../constants/httpCodes";
import { AppError, ValidationError } from "../utils/error";

const validCategories = [
  "birthday",
  "anniversary",
  "festival",
  "wedding",
  "congratulations",
  "other",
];

export const getAllTemplatesController = asyncHandler(
  async (req: Request, res: Response) => {
    const templateCategory = req.query["category"];

    if (
      templateCategory &&
      typeof templateCategory === "string" &&
      templateCategory !== "all" &&
      !validCategories.includes(templateCategory)
    ) {
      throw new ValidationError("Invalid category");
    }

    const templates = await getAllTemplatesService(templateCategory as string);

    return ApiResponse.ok(
      res,
      templates,
      "Fetched templates successfully",
      httpStatusCodes.OK,
      null,
    );
  },
);

export const getTemplateByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const templateId = req.params["id"];
    if (!templateId || typeof templateId !== "string") {
      throw new AppError("Template not found");
    }
    const template = await getTemplateByIdService(templateId);
    return ApiResponse.ok(
      res,
      template,
      "fetched template successfully",
      httpStatusCodes.OK,
      null,
    );
  },
);
