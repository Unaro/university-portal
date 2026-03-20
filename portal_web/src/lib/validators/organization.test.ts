// src/lib/validators/organization.test.ts
import { describe, it, expect } from "vitest";
import { registerOrganizationSchema } from "./organization";

describe("registerOrganizationSchema", () => {
  const createMockFile = (size: number, type: string) => ({
    size,
    type,
  });

  describe("валидация корректных данных", () => {
    it("должен принимать корректные данные организации", () => {
      const validData = {
        name: "ООО Ромашка",
        iin: "123456789012",
        contacts: "тел: +7-777-123-45-67",
        description: "Описание компании",
        website: "https://example.kz",
      };

      const result = registerOrganizationSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });
  });

  describe("валидация названия", () => {
    it("должен отклонять название короче 2 символов", () => {
      const invalidData = {
        name: "О",
        iin: "123456789012",
        contacts: "тел: +7-777-123-45-67",
      };

      const result = registerOrganizationSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.name).toContain(
          "Название должно быть длиннее 2 символов"
        );
      }
    });

    it("должен принимать название от 2 символов", () => {
      const validData = {
        name: "ОО",
        iin: "123456789012",
        contacts: "тел: +7-777-123-45-67",
      };

      const result = registerOrganizationSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });
  });

  describe("валидация ИИН", () => {
    it("должен отклонять ИИН не из 12 цифр", () => {
      const invalidData = {
        name: "ООО Ромашка",
        iin: "123456",
        contacts: "тел: +7-777-123-45-67",
      };

      const result = registerOrganizationSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.iin).toContain(
          "ИИН должен состоять из 12 цифр"
        );
      }
    });

    it("должен отклонять ИИН с буквами", () => {
      const invalidData = {
        name: "ООО Ромашка",
        iin: "12345678901A",
        contacts: "тел: +7-777-123-45-67",
      };

      const result = registerOrganizationSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.iin).toContain(
          "ИИН должен содержать только цифры"
        );
      }
    });

    it("должен принимать ИИН из 12 цифр", () => {
      const validData = {
        name: "ООО Ромашка",
        iin: "123456789012",
        contacts: "тел: +7-777-123-45-67",
      };

      const result = registerOrganizationSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });
  });

  describe("валидация контактов", () => {
    it("должен отклонять контакты короче 5 символов", () => {
      const invalidData = {
        name: "ООО Ромашка",
        iin: "123456789012",
        contacts: "тел",
      };

      const result = registerOrganizationSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.contacts).toContain(
          "Укажите контактные данные"
        );
      }
    });

    it("должен принимать контакты от 5 символов", () => {
      const validData = {
        name: "ООО Ромашка",
        iin: "123456789012",
        contacts: "тел: +7-777-123-45-67",
      };

      const result = registerOrganizationSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });
  });

  describe("валидация URL сайта", () => {
    it("должен принимать корректный URL сайта", () => {
      const validData = {
        name: "ООО Ромашка",
        iin: "123456789012",
        contacts: "тел: +7-777-123-45-67",
        website: "https://example.kz",
      };

      const result = registerOrganizationSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it("должен отклонять некорректный URL сайта", () => {
      const invalidData = {
        name: "ООО Ромашка",
        iin: "123456789012",
        contacts: "тел: +7-777-123-45-67",
        website: "not-a-url",
      };

      const result = registerOrganizationSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
    });

    it("должен принимать пустой URL сайта", () => {
      const validData = {
        name: "ООО Ромашка",
        iin: "123456789012",
        contacts: "тел: +7-777-123-45-67",
        website: "",
      };

      const result = registerOrganizationSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });
  });

  describe("валидация логотипа", () => {
    it("должен отклонять логотип больше 5MB", () => {
      const invalidData = {
        name: "ООО Ромашка",
        iin: "123456789012",
        contacts: "тел: +7-777-123-45-67",
        logo: createMockFile(6 * 1024 * 1024, "image/png"),
      };

      const result = registerOrganizationSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        // refine ошибки для поля logo находятся в fieldErrors.logo
        expect(result.error.flatten().fieldErrors.logo).toBeDefined();
      }
    });

    it("должен отклонять логотип неподдерживаемого формата", () => {
      const invalidData = {
        name: "ООО Ромашка",
        iin: "123456789012",
        contacts: "тел: +7-777-123-45-67",
        logo: createMockFile(1024, "image/gif"),
      };

      const result = registerOrganizationSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.logo).toContain(
          "Поддерживаются только форматы .jpg, .jpeg, .png and .webp."
        );
      }
    });

    it("должен принимать логотип формата JPEG", () => {
      const validData = {
        name: "ООО Ромашка",
        iin: "123456789012",
        contacts: "тел: +7-777-123-45-67",
        logo: createMockFile(1024, "image/jpeg"),
      };

      const result = registerOrganizationSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it("должен принимать логотип формата PNG", () => {
      const validData = {
        name: "ООО Ромашка",
        iin: "123456789012",
        contacts: "тел: +7-777-123-45-67",
        logo: createMockFile(1024, "image/png"),
      };

      const result = registerOrganizationSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it("должен принимать логотип формата WEBP", () => {
      const validData = {
        name: "ООО Ромашка",
        iin: "123456789012",
        contacts: "тел: +7-777-123-45-67",
        logo: createMockFile(1024, "image/webp"),
      };

      const result = registerOrganizationSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });
  });
});
