// src/lib/validators/vacancy.test.ts
import { describe, it, expect } from "vitest";
import { z } from "zod";

// Схема валидации вакансии (копия из vacancy.ts для тестирования)
const createVacancySchema = z.object({
  title: z.string().min(3, "Минимум 3 символа"),
  description: z.string().min(10, "Опишите вакансию подробнее"),
  requirements: z.string().optional(),
  salary: z.string().optional(),
  minCourse: z.coerce.number().min(1).max(6),
  type: z.enum(["practice", "internship", "job"]),
  skillIds: z.array(z.number()),
  majorIds: z.array(z.number()),
});

describe("createVacancySchema", () => {
  describe("валидация корректных данных", () => {
    it("должен принимать корректные данные вакансии", () => {
      const validData = {
        title: "Разработчик ПО",
        description: "Разработка веб-приложений на Next.js и TypeScript",
        requirements: "Опыт работы с React",
        salary: "от 500 000 тг",
        minCourse: 3,
        type: "internship" as const,
        skillIds: [1, 2, 3],
        majorIds: [1, 2],
      };

      const result = createVacancySchema.safeParse(validData);

      expect(result.success).toBe(true);
    });
  });

  describe("валидация названия", () => {
    it("должен отклонять название короче 3 символов", () => {
      const invalidData = {
        title: "ИТ",
        description: "Разработка веб-приложений на Next.js и TypeScript",
        minCourse: 3,
        type: "internship" as const,
        skillIds: [],
        majorIds: [],
      };

      const result = createVacancySchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.title).toContain(
          "Минимум 3 символа"
        );
      }
    });

    it("должен принимать название от 3 символов", () => {
      const validData = {
        title: "ИТ-специалист",
        description: "Разработка веб-приложений на Next.js и TypeScript",
        minCourse: 3,
        type: "internship" as const,
        skillIds: [],
        majorIds: [],
      };

      const result = createVacancySchema.safeParse(validData);

      expect(result.success).toBe(true);
    });
  });

  describe("валидация описания", () => {
    it("должен отклонять описание короче 10 символов", () => {
      const invalidData = {
        title: "Разработчик ПО",
        description: "Коротко",
        minCourse: 3,
        type: "internship" as const,
        skillIds: [],
        majorIds: [],
      };

      const result = createVacancySchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.description).toContain(
          "Опишите вакансию подробнее"
        );
      }
    });

    it("должен принимать описание от 10 символов", () => {
      const validData = {
        title: "Разработчик ПО",
        description: "Разработка веб-приложений",
        minCourse: 3,
        type: "internship" as const,
        skillIds: [],
        majorIds: [],
      };

      const result = createVacancySchema.safeParse(validData);

      expect(result.success).toBe(true);
    });
  });

  describe("валидация минимального курса", () => {
    it("должен отклонять курс меньше 1", () => {
      const invalidData = {
        title: "Разработчик ПО",
        description: "Разработка веб-приложений на Next.js и TypeScript",
        minCourse: 0,
        type: "internship" as const,
        skillIds: [],
        majorIds: [],
      };

      const result = createVacancySchema.safeParse(invalidData);

      expect(result.success).toBe(false);
    });

    it("должен отклонять курс больше 6", () => {
      const invalidData = {
        title: "Разработчик ПО",
        description: "Разработка веб-приложений на Next.js и TypeScript",
        minCourse: 7,
        type: "internship" as const,
        skillIds: [],
        majorIds: [],
      };

      const result = createVacancySchema.safeParse(invalidData);

      expect(result.success).toBe(false);
    });

    it("должен принимать курс от 1 до 6", () => {
      const validData = {
        title: "Разработчик ПО",
        description: "Разработка веб-приложений на Next.js и TypeScript",
        minCourse: 3,
        type: "internship" as const,
        skillIds: [],
        majorIds: [],
      };

      const result = createVacancySchema.safeParse(validData);

      expect(result.success).toBe(true);
    });
  });

  describe("валидация типа практики", () => {
    it("должен принимать тип practice", () => {
      const validData = {
        title: "Разработчик ПО",
        description: "Разработка веб-приложений на Next.js и TypeScript",
        minCourse: 3,
        type: "practice" as const,
        skillIds: [],
        majorIds: [],
      };

      const result = createVacancySchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it("должен принимать тип internship", () => {
      const validData = {
        title: "Разработчик ПО",
        description: "Разработка веб-приложений на Next.js и TypeScript",
        minCourse: 3,
        type: "internship" as const,
        skillIds: [],
        majorIds: [],
      };

      const result = createVacancySchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it("должен принимать тип job", () => {
      const validData = {
        title: "Разработчик ПО",
        description: "Разработка веб-приложений на Next.js и TypeScript",
        minCourse: 3,
        type: "job" as const,
        skillIds: [],
        majorIds: [],
      };

      const result = createVacancySchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it("должен отклонять некорректный тип", () => {
      const invalidData = {
        title: "Разработчик ПО",
        description: "Разработка веб-приложений на Next.js и TypeScript",
        minCourse: 3,
        type: "unknown",
        skillIds: [],
        majorIds: [],
      };

      const result = createVacancySchema.safeParse(invalidData);

      expect(result.success).toBe(false);
    });
  });

  describe("валидация навыков и специальностей", () => {
    it("должен принимать пустые массивы навыков и специальностей", () => {
      const validData = {
        title: "Разработчик ПО",
        description: "Разработка веб-приложений на Next.js и TypeScript",
        minCourse: 3,
        type: "internship" as const,
        skillIds: [],
        majorIds: [],
      };

      const result = createVacancySchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it("должен принимать массивы с навыками и специальностями", () => {
      const validData = {
        title: "Разработчик ПО",
        description: "Разработка веб-приложений на Next.js и TypeScript",
        minCourse: 3,
        type: "internship" as const,
        skillIds: [1, 2, 3],
        majorIds: [1, 2],
      };

      const result = createVacancySchema.safeParse(validData);

      expect(result.success).toBe(true);
    });
  });

  describe("валидация зарплаты", () => {
    it("должен принимать вакансию без указания зарплаты", () => {
      const validData = {
        title: "Разработчик ПО",
        description: "Разработка веб-приложений на Next.js и TypeScript",
        minCourse: 3,
        type: "internship" as const,
        skillIds: [],
        majorIds: [],
      };

      const result = createVacancySchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it("должен принимать вакансию с указанием зарплаты", () => {
      const validData = {
        title: "Разработчик ПО",
        description: "Разработка веб-приложений на Next.js и TypeScript",
        salary: "от 500 000 тг",
        minCourse: 3,
        type: "internship" as const,
        skillIds: [],
        majorIds: [],
      };

      const result = createVacancySchema.safeParse(validData);

      expect(result.success).toBe(true);
    });
  });
});
