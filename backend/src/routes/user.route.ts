import { Router } from "express";
import { getMeController } from "../controllers/user.controller";
import { verifyAuth } from "../middleware/verifyAuth";

export const userRouter = Router();

userRouter.get("/me", verifyAuth, getMeController);
