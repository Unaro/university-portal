// src/lib/validators/material.test.ts
import { describe, it, expect } from "vitest";
import { z } from "zod";

// Схема валидации материала (копия из material.ts для тестирования)
const materialSchema = z.object({
  title: z.string().min(3, "Название должно быть не менее 3 символов"),
  description: z.string().optional(),
  category: z.enum(["regulatory", "template", "material"]),
});

describe("materialSchema", () => {
  describe("валидация корректных данных", () => {
    it("должен принимать корректные данные материала", () => {
      const validData = {
        title: "Шаблон договора",
        description: "Типовой договор на практику",
        category: "template" as const,
      };

      const result = materialSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });
  });

  describe("валидация названия", () => {
    it("должен отклонять название короче 3 символов", () => {
      const invalidData = {
        title: "Шб",
        description: "Типовой договор на практику",
        category: "template" as const,
      };

      const result = materialSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.title).toContain(
          "Название должно быть не менее 3 символов"
        );
      }
    });

    it("должен принимать название от 3 символов", () => {
      const validData = {
        title: "Шаблон",
        description: "Типовой договор на практику",
        category: "template" as const,
      };

      const result = materialSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });
  });

  describe("валидация категории", () => {
    it("должен принимать категорию regulatory", () => {
      const validData = {
        title: "Закон об образовании",
        description: "Нормативный документ",
        category: "regulatory" as const,
      };

      const result = materialSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it("должен принимать категорию template", () => {
      const validData = {
        title: "Шаблон дневника",
        description: "Дневник практики",
        category: "template" as const,
      };

      const result = materialSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it("должен принимать категорию material", () => {
      const validData = {
        title: "Методичка",
        description: "Полезные материалы",
        category: "material" as const,
      };

      const result = materialSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it("должен отклонять некорректную категорию", () => {
      const invalidData = {
        title: "Документ",
        description: "Описание",
        category: "unknown",
      };

      const result = materialSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
    });
  });

  describe("валидация описания", () => {
    it("должен принимать материал без описания", () => {
      const validData = {
        title: "Шаблон договора",
        category: "template" as const,
      };

      const result = materialSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it("должен принимать материал с описанием", () => {
      const validData = {
        title: "Шаблон договора",
        description: "Типовой договор на производственную практику",
        category: "template" as const,
      };

      const result = materialSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });
  });
});
