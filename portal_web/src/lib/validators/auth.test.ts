// src/lib/validators/auth.test.ts
import { describe, it, expect } from "vitest";
import { registerSchema } from "./auth";

describe("registerSchema", () => {
  describe("password validation", () => {
    it("должен принимать надёжный пароль", () => {
      const validData = {
        name: "Иван Иванов",
        email: "ivan@example.com",
        password: "SecurePass123!",
      };

      const result = registerSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it("должен отклонять пароль короче 8 символов", () => {
      const invalidData = {
        name: "Иван Иванов",
        email: "ivan@example.com",
        password: "Short1!",
      };

      const result = registerSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.password).toContain(
          "Пароль должен быть не менее 8 символов"
        );
      }
    });

    it("должен отклонять пароль без цифр", () => {
      const invalidData = {
        name: "Иван Иванов",
        email: "ivan@example.com",
        password: "NoDigitsHere!",
      };

      const result = registerSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.password).toContain(
          "Пароль должен содержать хотя бы одну цифру"
        );
      }
    });

    it("должен отклонять пароль без заглавных букв", () => {
      const invalidData = {
        name: "Иван Иванов",
        email: "ivan@example.com",
        password: "nouppercase1!",
      };

      const result = registerSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.password).toContain(
          "Пароль должен содержать хотя бы одну заглавную букву"
        );
      }
    });

    it("должен отклонять пароль без строчных букв", () => {
      const invalidData = {
        name: "Иван Иванов",
        email: "ivan@example.com",
        password: "NOLOWERCASE1!",
      };

      const result = registerSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.password).toContain(
          "Пароль должен содержать хотя бы одну строчную букву"
        );
      }
    });

    it("должен отклонять пароль без спецсимволов", () => {
      const invalidData = {
        name: "Иван Иванов",
        email: "ivan@example.com",
        password: "NoSpecial1A",
      };

      const result = registerSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.password).toContain(
          "Пароль должен содержать хотя бы один спецсимвол"
        );
      }
    });
  });

  describe("email validation", () => {
    it("должен принимать корректный email", () => {
      const validData = {
        name: "Иван Иванов",
        email: "test@example.com",
        password: "SecurePass123!",
      };

      const result = registerSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it("должен отклонять некорректный email", () => {
      const invalidData = {
        name: "Иван Иванов",
        email: "invalid-email",
        password: "SecurePass123!",
      };

      const result = registerSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
    });
  });

  describe("name validation", () => {
    it("должен принимать имя от 2 символов", () => {
      const validData = {
        name: "Ив",
        email: "test@example.com",
        password: "SecurePass123!",
      };

      const result = registerSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it("должен отклонять имя короче 2 символов", () => {
      const invalidData = {
        name: "И",
        email: "test@example.com",
        password: "SecurePass123!",
      };

      const result = registerSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
    });
  });
});
