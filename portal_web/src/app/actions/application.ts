// src/app/actions/application.ts
"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { applications, students, vacancies } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { ActionResponse } from "@/shared/types/action";

// 2. Функция принимает ID вакансии (number) и возвращает строгий Promise
export async function applyToVacancy(vacancyId: number): Promise<ActionResponse> {
  const session = await auth();

  // Проверка сессии
  if (!session?.user?.id) {
    return { success: false, message: "Вы не авторизованы.", code: "UNAUTHORIZED" };
  }

  // Проверка роли
  if (session.user.role !== "student") {
    return { success: false, message: "Только студенты могут откликаться на вакансии.", code: "FORBIDDEN" };
  }

  // Поиск профиля студента
  const studentProfile = await db.query.students.findFirst({
    where: eq(students.userId, parseInt(session.user.id)),
  });

  if (!studentProfile) {
    return { success: false, message: "Профиль студента не найден. Обратитесь к администратору.", code: "NOT_FOUND" };
  }

  // Проверка существования вакансии
  const vacancy = await db.query.vacancies.findFirst({
    where: eq(vacancies.id, vacancyId),
    with: { 
      organization: true,
      allowedMajors: true, // <--- НОВОЕ
      applications: {
        where: eq(applications.status, "approved"),
        columns: { id: true }
      }
    },
  });

  if (!vacancy || !vacancy.isActive || vacancy.organization.verificationStatus !== "approved") {
    return { success: false, message: "Вакансия не найдена, неактивна или организация не подтверждена.", code: "NOT_FOUND" };
  }

  // --- ПРОВЕРКА ОГРАНИЧЕНИЙ (НОВОЕ) ---
  const courseMatch = (studentProfile.course ?? 0) >= (vacancy.minCourse ?? 1);
  const allowedMajorIds = vacancy.allowedMajors.map(m => m.majorId);
  const majorMatch = allowedMajorIds.length === 0 || (studentProfile.majorId && allowedMajorIds.includes(studentProfile.majorId));

  if (!courseMatch) {
    return { success: false, message: `Для данной позиции требуется курс не ниже ${vacancy.minCourse}.`, code: "FORBIDDEN" };
  }
  if (!majorMatch) {
    return { success: false, message: "Ваша специальность не входит в список разрешенных для данной вакансии.", code: "FORBIDDEN" };
  }

  // Проверка лимита мест
  if (vacancy.availableSpots && vacancy.applications.length >= vacancy.availableSpots) {
    return { success: false, message: "Набор на данную вакансию уже закрыт (места закончились).", code: "FORBIDDEN" };
  }

  // Проверка дубликатов (уже откликался?)
  const existingApplication = await db.query.applications.findFirst({
    where: and(
      eq(applications.studentId, studentProfile.id),
      eq(applications.vacancyId, vacancyId)
    ),
  });

  if (existingApplication) {
    return { success: false, message: "Вы уже отправили заявку на эту вакансию.", code: "CONFLICT" };
  }

  try {
    // Создание заявки
    await db.insert(applications).values({
      studentId: studentProfile.id,
      vacancyId: vacancyId,
      status: "pending",
      universityApprovalStatus: vacancy.type === "practice" ? "pending" : "not_required",
      practiceType: vacancy.type === "practice" ? studentProfile.currentPracticeType : null,
      projectTheme: vacancy.type === "practice" ? studentProfile.projectTheme : null,
    });

    revalidatePath("/dashboard");
    return { success: true, message: "Заявка успешно отправлена!" };
  } catch (error) {
    console.error("Application error:", error);
    return { success: false, message: "Внутренняя ошибка сервера при создании заявки.", code: "DATABASE_ERROR" };
  }
}

export async function deleteApplication(applicationId: number): Promise<ActionResponse> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, message: "Не авторизован", code: "UNAUTHORIZED" };
  }

  try {
    // Проверяем, что удаляет владелец (студент)
    const student = await db.query.students.findFirst({
      where: eq(students.userId, parseInt(session.user.id)),
    });

    if (!student) {
      return { success: false, message: "Профиль не найден", code: "NOT_FOUND" };
    }

    const app = await db.query.applications.findFirst({
      where: eq(applications.id, applicationId),
    });

    if (!app || app.studentId !== student.id) {
      return { success: false, message: "Заявка не найдена или нет прав", code: "FORBIDDEN" };
    }

    await db.delete(applications).where(eq(applications.id, applicationId));

    revalidatePath("/dashboard");
    revalidatePath("/profile");
    return { success: true, message: "Отклик отозван" };
  } catch (error) {
    console.error("Delete app error:", error);
    return { success: false, message: "Ошибка при удалении", code: "DATABASE_ERROR" };
  }
}