import { Router } from "express";
import authRouter from "./auth.route";
import { userRouter } from "./user.route";
import { templateRouter } from "./template.route";

const mainRouter = Router();

mainRouter.use("/auth", authRouter);
mainRouter.use("/user", userRouter);
mainRouter.use("/template", templateRouter);

export default mainRouter;
