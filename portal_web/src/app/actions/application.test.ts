// src/app/actions/application.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { applyToVacancy, deleteApplication } from "./application";

// Моки для зависимостей
vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("@/db", () => ({
  db: {
    query: {
      students: {
        findFirst: vi.fn(),
      },
      vacancies: {
        findFirst: vi.fn(),
      },
      applications: {
        findFirst: vi.fn(),
      },
    },
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockResolvedValue([]),
    delete: vi.fn().mockReturnThis(),
    where: vi.fn().mockResolvedValue(undefined),
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import { auth } from "@/auth";
import { db } from "@/db";

describe("applyToVacancy", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("успешный отклик", () => {
    it("должен успешно создавать отклик на вакансию", async () => {
      // Arrange
      vi.mocked(auth).mockResolvedValue({
        user: { id: "1", role: "student" },
      });

      vi.mocked(db.query.students.findFirst).mockResolvedValue({ id: 1 });
      vi.mocked(db.query.vacancies.findFirst).mockResolvedValue({ id: 1, isActive: true });
      vi.mocked(db.query.applications.findFirst).mockResolvedValue(null);

      // Act
      const result = await applyToVacancy(1);

      // Assert
      expect(result.success).toBe(true);
      expect(result.message).toBe("Заявка успешно отправлена!");
    });
  });

  describe("проверка авторизации", () => {
    it("должен отклонять отклик без авторизации", async () => {
      // Arrange
      vi.mocked(auth).mockResolvedValue(null);

      // Act
      const result = await applyToVacancy(1);

      // Assert
      expect(result.success).toBe(false);
      expect(result.code).toBe("UNAUTHORIZED");
      expect(result.message).toBe("Вы не авторизованы.");
    });
  });

  describe("проверка роли", () => {
    it("должен отклонять отклик пользователем не студентом", async () => {
      // Arrange
      vi.mocked(auth).mockResolvedValue({
        user: { id: "1", role: "organization_representative" },
      });

      // Act
      const result = await applyToVacancy(1);

      // Assert
      expect(result.success).toBe(false);
      expect(result.code).toBe("FORBIDDEN");
      expect(result.message).toContain("Только студенты могут откликаться");
    });
  });

  describe("проверка вакансии", () => {
    it("должен отклонять отклик на несуществующую вакансию", async () => {
      // Arrange
      vi.mocked(auth).mockResolvedValue({
        user: { id: "1", role: "student" },
      });
      vi.mocked(db.query.students.findFirst).mockResolvedValue({ id: 1 });
      vi.mocked(db.query.vacancies.findFirst).mockResolvedValue(null);

      // Act
      const result = await applyToVacancy(999);

      // Assert
      expect(result.success).toBe(false);
      expect(result.code).toBe("NOT_FOUND");
      expect(result.message).toBe("Вакансия не найдена или неактивна.");
    });

    it("должен отклонять отклик на неактивную вакансию", async () => {
      // Arrange
      vi.mocked(auth).mockResolvedValue({
        user: { id: "1", role: "student" },
      });
      vi.mocked(db.query.students.findFirst).mockResolvedValue({ id: 1 });
      vi.mocked(db.query.vacancies.findFirst).mockResolvedValue({ id: 1, isActive: false });

      // Act
      const result = await applyToVacancy(1);

      // Assert
      expect(result.success).toBe(false);
      expect(result.code).toBe("NOT_FOUND");
      expect(result.message).toBe("Вакансия не найдена или неактивна.");
    });
  });

  describe("проверка дубликатов", () => {
    it("должен отклонять дублирующийся отклик", async () => {
      // Arrange
      vi.mocked(auth).mockResolvedValue({
        user: { id: "1", role: "student" },
      });
      vi.mocked(db.query.students.findFirst).mockResolvedValue({ id: 1 });
      vi.mocked(db.query.vacancies.findFirst).mockResolvedValue({ id: 1, isActive: true });
      vi.mocked(db.query.applications.findFirst).mockResolvedValue({ id: 1 });

      // Act
      const result = await applyToVacancy(1);

      // Assert
      expect(result.success).toBe(false);
      expect(result.code).toBe("CONFLICT");
      expect(result.message).toBe("Вы уже отправили заявку на эту вакансию.");
    });
  });

  describe("проверка профиля студента", () => {
    it("должен отклонять отклик без профиля студента", async () => {
      // Arrange
      vi.mocked(auth).mockResolvedValue({
        user: { id: "1", role: "student" },
      });
      vi.mocked(db.query.students.findFirst).mockResolvedValue(null);

      // Act
      const result = await applyToVacancy(1);

      // Assert
      expect(result.success).toBe(false);
      expect(result.code).toBe("NOT_FOUND");
      expect(result.message).toContain("Профиль студента не найден");
    });
  });
});

describe("deleteApplication", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("успешный отзыв", () => {
    it("должен успешно отзывать отклик", async () => {
      // Arrange
      vi.mocked(auth).mockResolvedValue({
        user: { id: "1", role: "student" },
      });
      vi.mocked(db.query.students.findFirst).mockResolvedValue({ id: 1 });
      vi.mocked(db.query.applications.findFirst).mockResolvedValue({ id: 1, studentId: 1 });

      // Act
      const result = await deleteApplication(1);

      // Assert
      expect(result.success).toBe(true);
      expect(result.message).toBe("Отклик отозван");
    });
  });

  describe("проверка авторизации", () => {
    it("должен отклонять отзыв без авторизации", async () => {
      // Arrange
      vi.mocked(auth).mockResolvedValue(null);

      // Act
      const result = await deleteApplication(1);

      // Assert
      expect(result.success).toBe(false);
      expect(result.code).toBe("UNAUTHORIZED");
    });
  });

  describe("проверка прав", () => {
    it("должен отклонять отзыв чужого отклика", async () => {
      // Arrange
      vi.mocked(auth).mockResolvedValue({
        user: { id: "1", role: "student" },
      });
      vi.mocked(db.query.students.findFirst).mockResolvedValue({ id: 1 });
      vi.mocked(db.query.applications.findFirst).mockResolvedValue({ id: 1, studentId: 2 });

      // Act
      const result = await deleteApplication(1);

      // Assert
      expect(result.success).toBe(false);
      expect(result.code).toBe("FORBIDDEN");
    });
  });
});
