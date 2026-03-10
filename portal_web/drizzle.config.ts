import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// 1. Указываем путь на папку выше (в корень university-portal)
dotenv.config({ path: "../.env" });

const localDbUrl = `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@localhost:5432/${process.env.DB_NAME}`;

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: localDbUrl,
  },
  verbose: true,
  strict: true,
});