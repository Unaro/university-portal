// src/app/actions/manage-application-action.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { processApplication } from "./manage-application";

// Моки для зависимостей
vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("@/db", () => ({
  db: {
    query: {
      organizationRepresentatives: {
        findFirst: vi.fn(),
      },
      applications: {
        findFirst: vi.fn(),
      },
    },
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    where: vi.fn().mockResolvedValue(undefined),
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import { auth } from "@/auth";
import { db } from "@/db";

describe("processApplication", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("успешная обработка", () => {
    it("должен успешно одобрять отклик", async () => {
      // Arrange
      vi.mocked(auth).mockResolvedValue({
        user: { id: "1", role: "organization_representative" },
      });

      vi.mocked(db.query.organizationRepresentatives.findFirst).mockResolvedValue({
        id: 1,
        organizationId: 1,
      });

      vi.mocked(db.query.applications.findFirst).mockResolvedValue({
        id: 1,
        vacancy: { organizationId: 1 },
      });

      // Act
      const result = await processApplication(1, "approved", "Отлично, вы приняты!");

      // Assert
      expect(result.success).toBe(true);
      expect(result.message).toBe("Статус заявки успешно обновлен.");
    });

    it("должен успешно отклонять отклик", async () => {
      // Arrange
      vi.mocked(auth).mockResolvedValue({
        user: { id: "1", role: "organization_representative" },
      });

      vi.mocked(db.query.organizationRepresentatives.findFirst).mockResolvedValue({
        id: 1,
        organizationId: 1,
      });

      vi.mocked(db.query.applications.findFirst).mockResolvedValue({
        id: 1,
        vacancy: { organizationId: 1 },
      });

      // Act
      const result = await processApplication(1, "rejected", "К сожалению, отказ.");

      // Assert
      expect(result.success).toBe(true);
      expect(result.message).toBe("Статус заявки успешно обновлен.");
    });
  });

  describe("проверка авторизации", () => {
    it("должен отклонять обработку без авторизации", async () => {
      // Arrange
      vi.mocked(auth).mockResolvedValue(null);

      // Act
      const result = await processApplication(1, "approved", "Сообщение");

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe("Нет прав для выполнения операции.");
    });

    it("должен отклонять обработку пользователем не представителем", async () => {
      // Arrange
      vi.mocked(auth).mockResolvedValue({
        user: { id: "1", role: "student" },
      });

      // Act
      const result = await processApplication(1, "approved", "Сообщение");

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe("Нет прав для выполнения операции.");
    });
  });

  describe("проверка организации", () => {
    it("должен отклонять обработку если представитель не найден", async () => {
      // Arrange
      vi.mocked(auth).mockResolvedValue({
        user: { id: "1", role: "organization_representative" },
      });

      vi.mocked(db.query.organizationRepresentatives.findFirst).mockResolvedValue(null);

      // Act
      const result = await processApplication(1, "approved", "Сообщение");

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe("Организация не найдена.");
    });
  });

  describe("проверка принадлежности отклика", () => {
    it("должен отклонять обработку чужого отклика", async () => {
      // Arrange
      vi.mocked(auth).mockResolvedValue({
        user: { id: "1", role: "organization_representative" },
      });

      vi.mocked(db.query.organizationRepresentatives.findFirst).mockResolvedValue({
        id: 1,
        organizationId: 1,
      });

      vi.mocked(db.query.applications.findFirst).mockResolvedValue({
        id: 1,
        vacancy: { organizationId: 2 }, // Другая организация
      });

      // Act
      const result = await processApplication(1, "approved", "Сообщение");

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe("Вы не можете управлять заявками чужой организации.");
    });
  });

  describe("проверка существования отклика", () => {
    it("должен отклонять обработку несуществующего отклика", async () => {
      // Arrange
      vi.mocked(auth).mockResolvedValue({
        user: { id: "1", role: "organization_representative" },
      });

      vi.mocked(db.query.organizationRepresentatives.findFirst).mockResolvedValue({
        id: 1,
        organizationId: 1,
      });

      vi.mocked(db.query.applications.findFirst).mockResolvedValue(null);

      // Act
      const result = await processApplication(999, "approved", "Сообщение");

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe("Заявка не найдена.");
    });
  });

  describe("валидация статуса", () => {
    it("должен принимать статус approved", async () => {
      // Arrange
      vi.mocked(auth).mockResolvedValue({
        user: { id: "1", role: "organization_representative" },
      });

      vi.mocked(db.query.organizationRepresentatives.findFirst).mockResolvedValue({
        id: 1,
        organizationId: 1,
      });

      vi.mocked(db.query.applications.findFirst).mockResolvedValue({
        id: 1,
        vacancy: { organizationId: 1 },
      });

      // Act
      const result = await processApplication(1, "approved", "Сообщение");

      // Assert
      expect(result.success).toBe(true);
    });

    it("должен принимать статус rejected", async () => {
      // Arrange
      vi.mocked(auth).mockResolvedValue({
        user: { id: "1", role: "organization_representative" },
      });

      vi.mocked(db.query.organizationRepresentatives.findFirst).mockResolvedValue({
        id: 1,
        organizationId: 1,
      });

      vi.mocked(db.query.applications.findFirst).mockResolvedValue({
        id: 1,
        vacancy: { organizationId: 1 },
      });

      // Act
      const result = await processApplication(1, "rejected", "Сообщение");

      // Assert
      expect(result.success).toBe(true);
    });
  });
});
