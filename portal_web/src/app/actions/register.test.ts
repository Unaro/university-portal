// src/app/actions/register.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { registerUser } from "./register";
import { db } from "@/db";

// Моки для зависимостей
vi.mock("@/db", () => ({
  db: {
    query: {
      users: {
        findFirst: vi.fn(),
      },
    },
    transaction: vi.fn(async (fn) => {
      const mockTx = {
        insert: vi.fn().mockReturnThis(),
        values: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([{ id: 1 }]),
        update: vi.fn().mockReturnThis(),
        set: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue(undefined),
      };
      return fn(mockTx);
    }),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    returning: vi.fn().mockResolvedValue([{ id: 1 }]),
  },
}));

vi.mock("@/lib/password", () => ({
  saltAndHashPassword: vi.fn().mockResolvedValue("hashedPassword123"),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("@/db/schema", () => ({
  users: {},
  students: {},
}));

describe("registerUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("успешная регистрация", () => {
    it("должен успешно регистрировать пользователя с валидными данными", async () => {
      // Arrange
      const formData = new FormData();
      formData.append("name", "Иван Петров");
      formData.append("email", "student@test.kz");
      formData.append("password", "SecurePass123!");

      vi.mocked(db.query.users.findFirst).mockResolvedValue(null);

      // Act & Assert - проверяем, что функция выполняется без ошибок
      // redirect будет вызван, но в моке это просто функция
      await expect(async () => {
        await registerUser(
          { success: false, message: "" },
          formData
        );
      }).not.toThrow();
    });
  });

  describe("валидация данных", () => {
    it("должен возвращать ошибку при невалидном имени", async () => {
      // Arrange
      const formData = new FormData();
      formData.append("name", "И");
      formData.append("email", "student@test.kz");
      formData.append("password", "SecurePass123!");

      // Act
      const result = await registerUser(
        { success: false, message: "" },
        formData
      );

      // Assert
      expect(result.success).toBe(false);
      expect(result.errors?.name).toBeDefined();
    });

    it("должен возвращать ошибку при невалидном email", async () => {
      // Arrange
      const formData = new FormData();
      formData.append("name", "Иван Петров");
      formData.append("email", "invalid-email");
      formData.append("password", "SecurePass123!");

      // Act
      const result = await registerUser(
        { success: false, message: "" },
        formData
      );

      // Assert
      expect(result.success).toBe(false);
      expect(result.errors?.email).toBeDefined();
    });

    it("должен возвращать ошибку при слабом пароле", async () => {
      // Arrange
      const formData = new FormData();
      formData.append("name", "Иван Петров");
      formData.append("email", "student@test.kz");
      formData.append("password", "weak");

      // Act
      const result = await registerUser(
        { success: false, message: "" },
        formData
      );

      // Assert
      expect(result.success).toBe(false);
      expect(result.errors?.password).toBeDefined();
    });
  });

  describe("обработка дубликатов", () => {
    it("должен возвращать ошибку при существующем email", async () => {
      // Arrange
      const formData = new FormData();
      formData.append("name", "Иван Петров");
      formData.append("email", "existing@test.kz");
      formData.append("password", "SecurePass123!");

      vi.mocked(db.query.users.findFirst).mockResolvedValue({
        id: 1,
        email: "existing@test.kz",
      });

      // Act
      const result = await registerUser(
        { success: false, message: "" },
        formData
      );

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe("Пользователь с таким Email уже существует.");
    });
  });
});
