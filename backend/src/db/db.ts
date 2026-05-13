import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import appConfig from "../config/appConfig";

const db = drizzle(appConfig.DATABASE_URL);

export default db;
