// src/app/actions/application.ts
"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { applications, students, vacancies } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// 1. Строгий тип ответа (никаких any)
export type ApplicationActionState = {
  success: boolean;
  message: string;
};

// 2. Функция принимает ID вакансии (number) и возвращает строгий Promise
export async function applyToVacancy(vacancyId: number): Promise<ApplicationActionState> {
  const session = await auth();

  // Проверка сессии
  if (!session?.user?.id) {
    return { success: false, message: "Вы не авторизованы." };
  }

  // Проверка роли
  if (session.user.role !== "student") {
    return { success: false, message: "Только студенты могут откликаться на вакансии." };
  }

  // Поиск профиля студента
  const studentProfile = await db.query.students.findFirst({
    where: eq(students.userId, parseInt(session.user.id)),
  });

  if (!studentProfile) {
    return { success: false, message: "Профиль студента не найден. Обратитесь к администратору." };
  }

  // Проверка существования вакансии
  const vacancy = await db.query.vacancies.findFirst({
    where: eq(vacancies.id, vacancyId),
  });

  if (!vacancy || !vacancy.isActive) {
    return { success: false, message: "Вакансия не найдена или неактивна." };
  }

  // Проверка дубликатов (уже откликался?)
  const existingApplication = await db.query.applications.findFirst({
    where: and(
      eq(applications.studentId, studentProfile.id),
      eq(applications.vacancyId, vacancyId)
    ),
  });

  if (existingApplication) {
    return { success: false, message: "Вы уже отправили заявку на эту вакансию." };
  }

  try {
    // Создание заявки
    await db.insert(applications).values({
      studentId: studentProfile.id,
      vacancyId: vacancyId,
      status: "pending",
    });

    revalidatePath("/dashboard");
    return { success: true, message: "Заявка успешно отправлена!" };
  } catch (error) {
    console.error("Application error:", error);
    return { success: false, message: "Внутренняя ошибка сервера при создании заявки." };
  }
}

export async function deleteApplication(applicationId: number) {
  const session = await auth();
  if (!session?.user) return { success: false, message: "Не авторизован" };

  try {
    // Проверяем, что удаляет владелец (студент)
    const student = await db.query.students.findFirst({
      where: eq(students.userId, parseInt(session.user.id)),
    });

    if (!student) return { success: false, message: "Профиль не найден" };

    const app = await db.query.applications.findFirst({
      where: eq(applications.id, applicationId),
    });

    if (!app || app.studentId !== student.id) {
      return { success: false, message: "Заявка не найдена или нет прав" };
    }

    await db.delete(applications).where(eq(applications.id, applicationId));

    revalidatePath("/dashboard");
    revalidatePath("/profile");
    return { success: true, message: "Отклик отозван" };
  } catch (error) {
    console.error("Delete app error:", error);
    return { success: false, message: "Ошибка при удалении" };
  }
}