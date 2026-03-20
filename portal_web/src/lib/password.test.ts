// src/lib/password.test.ts
import { describe, it, expect } from "vitest";
import { saltAndHashPassword, verifyPassword } from "./password";

describe("password hashing", () => {
  describe("saltAndHashPassword", () => {
    it("должен хешировать пароль", async () => {
      // Arrange
      const password = "SecurePass123!";

      // Act
      const hash = await saltAndHashPassword(password);

      // Assert
      expect(hash).toBeDefined();
      expect(typeof hash).toBe("string");
      expect(hash).not.toBe(password);
    });

    it("должен возвращать разные хеши для одного пароля", async () => {
      // Arrange
      const password = "SecurePass123!";

      // Act
      const hash1 = await saltAndHashPassword(password);
      const hash2 = await saltAndHashPassword(password);

      // Assert
      expect(hash1).not.toBe(hash2);
    });

    it("должен хешировать разные пароли по-разному", async () => {
      // Arrange
      const password1 = "Password123!";
      const password2 = "Password456!";

      // Act
      const hash1 = await saltAndHashPassword(password1);
      const hash2 = await saltAndHashPassword(password2);

      // Assert
      expect(hash1).not.toBe(hash2);
    });
  });

  describe("verifyPassword", () => {
    it("должен возвращать true для правильного пароля", async () => {
      // Arrange
      const password = "SecurePass123!";
      const hash = await saltAndHashPassword(password);

      // Act
      const isValid = await verifyPassword(password, hash);

      // Assert
      expect(isValid).toBe(true);
    });

    it("должен возвращать false для неправильного пароля", async () => {
      // Arrange
      const password = "SecurePass123!";
      const wrongPassword = "WrongPass456!";
      const hash = await saltAndHashPassword(password);

      // Act
      const isValid = await verifyPassword(wrongPassword, hash);

      // Assert
      expect(isValid).toBe(false);
    });

    it("должен возвращать false для пустого пароля", async () => {
      // Arrange
      const password = "SecurePass123!";
      const hash = await saltAndHashPassword(password);

      // Act
      const isValid = await verifyPassword("", hash);

      // Assert
      expect(isValid).toBe(false);
    });

    it("должен быть устойчив к регистру", async () => {
      // Arrange
      const password = "SecurePass123!";
      const hash = await saltAndHashPassword(password);

      // Act
      const isValidLower = await verifyPassword("securepass123!", hash);
      const isValidUpper = await verifyPassword("SECUREPASS123!", hash);

      // Assert
      expect(isValidLower).toBe(false);
      expect(isValidUpper).toBe(false);
    });
  });
});
