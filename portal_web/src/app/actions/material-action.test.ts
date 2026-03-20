// src/app/actions/material-action.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createMaterial, deleteMaterial } from "./material";

// Моки для зависимостей
vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("@/db", () => ({
  db: {
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockResolvedValue([]),
    delete: vi.fn().mockReturnThis(),
    where: vi.fn().mockResolvedValue(undefined),
  },
}));

vi.mock("@/lib/s3", () => ({
  uploadFile: vi.fn().mockResolvedValue("https://s3.example.com/materials/file.pdf"),
  deleteFile: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import { auth } from "@/auth";
import { db } from "@/db";
import { uploadFile } from "@/lib/s3";

describe("createMaterial", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("успешное создание", () => {
    it("должен успешно создавать материал с валидными данными", async () => {
      // Arrange
      vi.mocked(auth).mockResolvedValue({
        user: { id: "1", role: "university_staff" },
      });

      const formData = new FormData();
      formData.append("title", "Шаблон договора");
      formData.append("description", "Типовой договор на практику");
      formData.append("category", "template");
      formData.append("file", new File(["content"], "document.pdf", { type: "application/pdf" }));

      // Act
      const result = await createMaterial(
        { success: false, message: "" },
        formData
      );

      // Assert
      expect(result.success).toBe(true);
      expect(result.message).toBe("Материал успешно добавлен!");
    });
  });

  describe("проверка прав доступа", () => {
    it("должен отклонять создание материала без авторизации", async () => {
      // Arrange
      vi.mocked(auth).mockResolvedValue(null);

      const formData = new FormData();
      formData.append("title", "Шаблон договора");
      formData.append("category", "template");
      formData.append("file", new File(["content"], "document.pdf"));

      // Act
      const result = await createMaterial(
        { success: false, message: "" },
        formData
      );

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe("Нет прав доступа.");
    });

    it("должен отклонять создание материала студентом", async () => {
      // Arrange
      vi.mocked(auth).mockResolvedValue({
        user: { id: "1", role: "student" },
      });

      const formData = new FormData();
      formData.append("title", "Шаблон договора");
      formData.append("category", "template");
      formData.append("file", new File(["content"], "document.pdf"));

      // Act
      const result = await createMaterial(
        { success: false, message: "" },
        formData
      );

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe("Нет прав доступа.");
    });

    it("должен отклонять создание материала организацией", async () => {
      // Arrange
      vi.mocked(auth).mockResolvedValue({
        user: { id: "1", role: "organization_representative" },
      });

      const formData = new FormData();
      formData.append("title", "Шаблон договора");
      formData.append("category", "template");
      formData.append("file", new File(["content"], "document.pdf"));

      // Act
      const result = await createMaterial(
        { success: false, message: "" },
        formData
      );

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe("Нет прав доступа.");
    });
  });

  describe("валидация данных", () => {
    it("должен отклонять материал без файла", async () => {
      // Arrange
      vi.mocked(auth).mockResolvedValue({
        user: { id: "1", role: "university_staff" },
      });

      const formData = new FormData();
      formData.append("title", "Шаблон договора");
      formData.append("category", "template");

      // Act
      const result = await createMaterial(
        { success: false, message: "" },
        formData
      );

      // Assert - сначала валидация схемы, потом файла
      expect(result.success).toBe(false);
      expect(result.message).toBe("Ошибка валидации полей.");
    });

    it("должен отклонять материал с пустым файлом", async () => {
      // Arrange
      vi.mocked(auth).mockResolvedValue({
        user: { id: "1", role: "university_staff" },
      });

      const formData = new FormData();
      formData.append("title", "Шаблон договора");
      formData.append("category", "template");
      formData.append("file", new File([], "empty.pdf"));

      // Act
      const result = await createMaterial(
        { success: false, message: "" },
        formData
      );

      // Assert - сначала валидация схемы, потом файла
      expect(result.success).toBe(false);
      expect(result.message).toBe("Ошибка валидации полей.");
    });
  });

  describe("валидация названия", () => {
    it("должен отклонять материал с коротким названием", async () => {
      // Arrange
      vi.mocked(auth).mockResolvedValue({
        user: { id: "1", role: "university_staff" },
      });

      const formData = new FormData();
      formData.append("title", "Шб");
      formData.append("category", "template");
      formData.append("file", new File(["content"], "document.pdf"));

      // Act
      const result = await createMaterial(
        { success: false, message: "" },
        formData
      );

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe("Ошибка валидации полей.");
    });
  });

  describe("категории материалов", () => {
    it("должен принимать категорию regulatory", async () => {
      // Arrange
      vi.mocked(auth).mockResolvedValue({
        user: { id: "1", role: "university_staff" },
      });

      const formData = new FormData();
      formData.append("title", "Закон об образовании");
      formData.append("description", "Нормативный документ");
      formData.append("category", "regulatory");
      formData.append("file", new File(["content"], "document.pdf"));

      // Act
      const result = await createMaterial(
        { success: false, message: "" },
        formData
      );

      // Assert
      expect(result.success).toBe(true);
    });

    it("должен принимать категорию template", async () => {
      // Arrange
      vi.mocked(auth).mockResolvedValue({
        user: { id: "1", role: "university_staff" },
      });

      const formData = new FormData();
      formData.append("title", "Шаблон договора");
      formData.append("description", "Типовой договор");
      formData.append("category", "template");
      formData.append("file", new File(["content"], "document.pdf"));

      // Act
      const result = await createMaterial(
        { success: false, message: "" },
        formData
      );

      // Assert
      expect(result.success).toBe(true);
    });

    it("должен принимать категорию material", async () => {
      // Arrange
      vi.mocked(auth).mockResolvedValue({
        user: { id: "1", role: "university_staff" },
      });

      const formData = new FormData();
      formData.append("title", "Методичка");
      formData.append("description", "Полезные материалы");
      formData.append("category", "material");
      formData.append("file", new File(["content"], "document.pdf"));

      // Act
      const result = await createMaterial(
        { success: false, message: "" },
        formData
      );

      // Assert
      expect(result.success).toBe(true);
    });
  });
});

describe("deleteMaterial", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("успешное удаление", () => {
    it("должен успешно удалять материал", async () => {
      // Arrange
      vi.mocked(auth).mockResolvedValue({
        user: { id: "1", role: "university_staff" },
      });

      // Act
      const result = await deleteMaterial(1);

      // Assert
      expect(result.success).toBe(true);
    });
  });

  describe("проверка прав доступа", () => {
    it("должен отклонять удаление без авторизации", async () => {
      // Arrange
      vi.mocked(auth).mockResolvedValue(null);

      // Act
      const result = await deleteMaterial(1);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe("Нет прав.");
    });

    it("должен отклонять удаление студентом", async () => {
      // Arrange
      vi.mocked(auth).mockResolvedValue({
        user: { id: "1", role: "student" },
      });

      // Act
      const result = await deleteMaterial(1);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe("Нет прав.");
    });
  });
});
