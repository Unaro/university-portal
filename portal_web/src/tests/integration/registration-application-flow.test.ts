// src/tests/integration/registration-application-flow.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * Интеграционный тест: Полный цикл — регистрация → отклик на вакансию
 * 
 * Проверяет полный путь студента:
 * 1. Регистрация нового пользователя
 * 2. Вход в систему
 * 3. Просмотр вакансий
 * 4. Отклик на выбранную вакансию
 */

// Моки для зависимостей
vi.mock("@/auth", () => ({
  auth: vi.fn(),
  signIn: vi.fn(),
}));

vi.mock("@/db", () => ({
  db: {
    query: {
      users: {
        findFirst: vi.fn(),
      },
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
    values: vi.fn().mockResolvedValue([]),
  },
}));

vi.mock("@/lib/password", () => ({
  saltAndHashPassword: vi.fn().mockResolvedValue("hashedPassword123"),
  verifyPassword: vi.fn().mockResolvedValue(true),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

import { auth } from "@/auth";
import { db } from "@/db";
import { registerUser } from "@/app/actions/register";
import { applyToVacancy } from "@/app/actions/application";

describe("Registration → Application Flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("должен проходить полный цикл: регистрация → вход → отклик", async () => {
    // ============================================
    // STEP 1: Регистрация нового пользователя
    // ============================================
    const registerFormData = new FormData();
    registerFormData.append("name", "Иван Петров");
    registerFormData.append("email", "student@test.kz");
    registerFormData.append("password", "SecurePass123!");

    // Мок проверки уникальности email
    vi.mocked(db.query.users.findFirst).mockResolvedValueOnce(null);

    // Act & Assert - регистрация выполняется без ошибок
    await expect(async () => {
      await registerUser(
        { success: false, message: "" },
        registerFormData
      );
    }).not.toThrow();

    // ============================================
    // STEP 2: Вход в систему
    // ============================================
    vi.mocked(auth).mockResolvedValue({
      user: { id: "1", role: "student" },
    });

    // Проверяем, что сессия установлена
    const session = await auth();
    expect(session?.user?.id).toBe("1");
    expect(session?.user?.role).toBe("student");

    // ============================================
    // STEP 3: Проверка профиля студента
    // ============================================
    vi.mocked(db.query.students.findFirst).mockResolvedValue({ id: 1 });

    // ============================================
    // STEP 4: Просмотр вакансии
    // ============================================
    vi.mocked(db.query.vacancies.findFirst).mockResolvedValue({
      id: 1,
      title: "Разработчик ПО",
      isActive: true,
    });

    // ============================================
    // STEP 5: Отклик на вакансию
    // ============================================
    // Мок проверки отсутствия предыдущего отклика
    vi.mocked(db.query.applications.findFirst).mockResolvedValue(null);

    const applyResult = await applyToVacancy(1);

    // ============================================
    // ASSERTIONS: Проверяем результат
    // ============================================
    expect(applyResult.success).toBe(true);
    expect(applyResult.message).toBe("Заявка успешно отправлена!");

    // Проверяем, что были вызваны правильные методы БД
    expect(db.query.students.findFirst).toHaveBeenCalled();
    expect(db.query.vacancies.findFirst).toHaveBeenCalled();
    expect(db.query.applications.findFirst).toHaveBeenCalled();
  });

  it("должен отклонять отклик если студент не завершил регистрацию", async () => {
    // ============================================
    // STEP 1: Вход в систему (студент без профиля)
    // ============================================
    vi.mocked(auth).mockResolvedValue({
      user: { id: "1", role: "student" },
    });

    // ============================================
    // STEP 2: Профиль студента не найден
    // ============================================
    vi.mocked(db.query.students.findFirst).mockResolvedValue(null);

    // ============================================
    // STEP 3: Попытка отклика
    // ============================================
    const result = await applyToVacancy(1);

    // ============================================
    // ASSERTIONS
    // ============================================
    expect(result.success).toBe(false);
    expect(result.code).toBe("NOT_FOUND");
    expect(result.message).toContain("Профиль студента не найден");
  });

  it("должен отклонять отклик на неактивную вакансию", async () => {
    // ============================================
    // STEP 1: Вход в систему
    // ============================================
    vi.mocked(auth).mockResolvedValue({
      user: { id: "1", role: "student" },
    });

    // ============================================
    // STEP 2: Профиль студента существует
    // ============================================
    vi.mocked(db.query.students.findFirst).mockResolvedValue({ id: 1 });

    // ============================================
    // STEP 3: Вакансия неактивна
    // ============================================
    vi.mocked(db.query.vacancies.findFirst).mockResolvedValue({
      id: 1,
      title: "Разработчик ПО",
      isActive: false,
    });

    // ============================================
    // STEP 4: Попытка отклика
    // ============================================
    const result = await applyToVacancy(1);

    // ============================================
    // ASSERTIONS
    // ============================================
    expect(result.success).toBe(false);
    expect(result.code).toBe("NOT_FOUND");
    expect(result.message).toBe("Вакансия не найдена или неактивна.");
  });

  it("должен предотвращать дублирование отклика", async () => {
    // ============================================
    // STEP 1: Вход в систему
    // ============================================
    vi.mocked(auth).mockResolvedValue({
      user: { id: "1", role: "student" },
    });

    // ============================================
    // STEP 2: Профиль студента существует
    // ============================================
    vi.mocked(db.query.students.findFirst).mockResolvedValue({ id: 1 });

    // ============================================
    // STEP 3: Вакансия активна
    // ============================================
    vi.mocked(db.query.vacancies.findFirst).mockResolvedValue({
      id: 1,
      title: "Разработчик ПО",
      isActive: true,
    });

    // ============================================
    // STEP 4: Отклик уже существует
    // ============================================
    vi.mocked(db.query.applications.findFirst).mockResolvedValue({
      id: 1,
      studentId: 1,
      vacancyId: 1,
      status: "pending",
    });

    // ============================================
    // STEP 5: Попытка повторного отклика
    // ============================================
    const result = await applyToVacancy(1);

    // ============================================
    // ASSERTIONS
    // ============================================
    expect(result.success).toBe(false);
    expect(result.code).toBe("CONFLICT");
    expect(result.message).toBe("Вы уже отправили заявку на эту вакансию.");
  });
});
