import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import appConfig from "./config/appConfig";
import httpStatusCodes from "./constants/httpCodes";
import errorHandler from "./middleware/errorHandler";
import { logger } from "./middleware/logger";
import mainRouter from "./routes/mainRouter";

const app = express();
const PORT = appConfig.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: appConfig.FRONTEND_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  }),
);
app.use(cookieParser());
app.use(logger);

app.get("/health", (req: Request, res: Response) => {
  return res.status(httpStatusCodes.OK).json();
});

app.use(appConfig.BASE_PATH, mainRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on localhost:${PORT}`);
});
