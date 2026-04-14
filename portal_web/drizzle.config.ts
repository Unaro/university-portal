import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";
import { join } from "path";

dotenv.config({ path: join(__dirname, "../.env") });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined. Check your .env file.");
}

export default defineConfig({
  schema: join(__dirname, "src/db/schema.ts"),
  out: join(__dirname, "drizzle"),
  dialect: "postgresql",
  dbCredentials: {
    url: connectionString,
  },
  verbose: true,
  strict: true,
});