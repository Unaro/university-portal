// src/db/index.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Если переменной нет (во время билда), используем заглушку, чтобы не падать
const connectionString = process.env.DATABASE_URL || "postgres://portal_user:LocalDev_Password_2024_Secure!@localhost:5432/portal_db";

let connection: postgres.Sql;

if (process.env.NODE_ENV === "production") {
  // lazy connect (postgres-js делает это по умолчанию)
  connection = postgres(connectionString, { prepare: false });
} else {
  // ... dev logic
  const globalConnection = global as typeof globalThis & {
    postgres: postgres.Sql;
  };
  if (!globalConnection.postgres) {
    globalConnection.postgres = postgres(connectionString);
  }
  connection = globalConnection.postgres;
}

export const db = drizzle(connection, { schema });