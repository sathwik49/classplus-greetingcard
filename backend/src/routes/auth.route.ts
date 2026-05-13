import { Router } from "express";
import {
  logOutController,
  refreshTokenController,
  userLoginController,
  userRegistrationController,
} from "../controllers/auth.controller";
import upload from "../middleware/upload";
import { verifyAuth } from "../middleware/verifyAuth";

const authRouter = Router();

authRouter.post(
  "/register",
  upload.single("profile_image"),
  userRegistrationController,
);
authRouter.post("/login", userLoginController);
authRouter.post("/refresh", refreshTokenController);
authRouter.post("/logout", logOutController);

export default authRouter;
