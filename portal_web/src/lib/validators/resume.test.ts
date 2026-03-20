// src/lib/validators/resume.test.ts
import { describe, it, expect } from "vitest";
import { z } from "zod";

// Схема валидации резюме (упрощённая версия для тестирования)
const resumeSchema = z.object({
  bio: z.string().optional(),
  file: z.instanceof(File).refine(
    (file) => file.type === "application/pdf",
    "Разрешены только PDF файлы"
  ).optional(),
});

describe("resumeSchema", () => {
  const createMockPdfFile = () => {
    // Создаём мок PDF файла для тестирования
    const file = new File(["content"], "resume.pdf", { type: "application/pdf" });
    return file;
  };

  const createMockDocxFile = () => {
    // Создаём_mock DOCX файла для тестирования
    const file = new File(["content"], "resume.docx", { type: "application/msword" });
    return file;
  };

  describe("валидация корректных данных", () => {
    it("должен принимать корректное резюме с PDF", () => {
      const validData = {
        bio: "О себе: опытный разработчик",
        file: createMockPdfFile(),
      };

      const result = resumeSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });
  });

  describe("валидация файла", () => {
    it("должен отклонять резюме с неподдерживаемым форматом", () => {
      const invalidData = {
        bio: "О себе: опытный разработчик",
        file: createMockDocxFile(),
      };

      const result = resumeSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.file).toContain(
          "Разрешены только PDF файлы"
        );
      }
    });

    it("должен принимать резюме без файла", () => {
      const validData = {
        bio: "О себе: опытный разработчик",
      };

      const result = resumeSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it("должен принимать резюме только с биографией", () => {
      const validData = {
        bio: "О себе: опытный разработчик с 5-летним стажем",
      };

      const result = resumeSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });
  });

  describe("валидация биографии", () => {
    it("должен принимать резюме без биографии", () => {
      const validData = {
        file: createMockPdfFile(),
      };

      const result = resumeSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it("должен принимать резюме с биографией", () => {
      const validData = {
        bio: "О себе: опытный разработчик",
        file: createMockPdfFile(),
      };

      const result = resumeSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it("должен принимать пустую биографию", () => {
      const validData = {
        bio: "",
        file: createMockPdfFile(),
      };

      const result = resumeSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });
  });
});
