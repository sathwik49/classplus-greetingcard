import { Router } from "express";
import {
  getAllTemplatesController,
  getTemplateByIdController,
} from "../controllers/template.controller";

export const templateRouter = Router();

templateRouter.get("/all", getAllTemplatesController);
templateRouter.get("/:id", getTemplateByIdController);
