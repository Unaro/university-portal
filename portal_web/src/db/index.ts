// src/db/index.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

// Типизация для базы данных
export type Database = PostgresJsDatabase<typeof schema>;

// Настройки connection pool для оптимизации соединений
const poolOptions = {
  max: 10,              // Максимум 10 одновременных соединений
  idle_timeout: 20,     // Закрывать idle соединения через 20 секунд
  connect_timeout: 5,   // Таймаут подключения 5 секунд
};

// Ленивая инициализация подключения
// Подключение создаётся только при первом обращении к БД, а не при импорте модуля
function createConnection() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not defined. Check your .env file or Docker environment."
    );
  }

  if (process.env.NODE_ENV === "production") {
    return postgres(connectionString, poolOptions);
  } else {
    // Для разработки: сохраняем соединение в globalThis для hot-reload
    const globalConnection = globalThis as typeof globalThis & {
      postgresConnection?: postgres.Sql;
    };

    if (!globalConnection.postgresConnection) {
      globalConnection.postgresConnection = postgres(connectionString, poolOptions);
    }
    return globalConnection.postgresConnection;
  }
}

// Proxy для ленивой инициализации
// Подключение к БД будет создано при первом реальном использовании
const handler = {
  get(target: { _connection?: postgres.Sql; _drizzle?: Database }, prop: string) {
    if (!target._connection) {
      target._connection = createConnection();
      target._drizzle = drizzle(target._connection, { schema });
    }
    if (!target._drizzle) {
      throw new Error("Database connection not initialized");
    }
    return target._drizzle[prop as keyof Database];
  },
};

export const db = new Proxy({} as { _connection?: postgres.Sql; _drizzle?: Database }, handler) as Database;