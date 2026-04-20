// src/app/actions/vacancy.ts
"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { 
  vacancies, 
  organizationRepresentatives, 
  vacancySkills, 
  vacancyAllowedMajors 
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Расширенная схема валидации
const createVacancySchema = z.object({
  title: z.string().min(3, "Минимум 3 символа"),
  description: z.string().min(10, "Опишите вакансию подробнее"),
  requirements: z.string().optional(),
  // Новые поля
  salary: z.string().optional(),
  minCourse: z.coerce.number().min(1).max(6),
  availableSpots: z.preprocess((val) => (val === "" ? null : val), z.coerce.number().min(1, "Должно быть минимум 1 место").optional().nullable()),
  startDate: z.preprocess((val) => (val === "" ? null : val), z.coerce.date().optional().nullable()),
  endDate: z.preprocess((val) => (val === "" ? null : val), z.coerce.date().optional().nullable()),
  type: z.enum(["practice", "internship", "job"]),
  // Массивы ID для связей
  skillIds: z.array(z.number()),
  majorIds: z.array(z.number()),
});

export type CreateVacancyState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function createVacancy(
  prevState: CreateVacancyState, 
  formData: FormData
): Promise<CreateVacancyState> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, message: "Не авторизован" };

  // 1. Проверяем представителя
  const representative = await db.query.organizationRepresentatives.findFirst({
    where: eq(organizationRepresentatives.userId, parseInt(session.user.id)),
  });

  if (!representative) {
    return { success: false, message: "Вы не являетесь представителем организации." };
  }

  // 2. Парсим сложные данные из FormData
  const rawSkills = formData.get("skills") as string;
  const rawMajors = formData.get("majors") as string;
  
  const rawData = {
    title: formData.get("title"),
    description: formData.get("description"),
    requirements: formData.get("requirements"),
    salary: formData.get("salary"),
    minCourse: formData.get("minCourse"),
    availableSpots: formData.get("availableSpots") ? formData.get("availableSpots") : null,
    startDate: formData.get("startDate") ? formData.get("startDate") : null,
    endDate: formData.get("endDate") ? formData.get("endDate") : null,
    type: formData.get("type"),
    skillIds: rawSkills ? JSON.parse(rawSkills).map(Number) : [],
    majorIds: rawMajors ? JSON.parse(rawMajors).map(Number) : [],
  };

  // 3. Валидация
  const validated = createVacancySchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      message: "Ошибка валидации. Проверьте введенные данные.",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const { data } = validated;

  try {
    // 4. ТРАНЗАКЦИЯ: Создаем вакансию и связи
    await db.transaction(async (tx) => {
      // А. Сама вакансия
      const [newVacancy] = await tx.insert(vacancies).values({
        title: data.title,
        description: data.description,
        requirements: data.requirements,
        organizationId: representative.organizationId,
        salary: data.salary || null,
        minCourse: data.minCourse,
        availableSpots: data.availableSpots || null,
        startDate: data.startDate || null,
        endDate: data.endDate || null,
        type: data.type,
      }).returning();

      // Б. Связь с навыками
      if (data.skillIds.length > 0) {
        await tx.insert(vacancySkills).values(
          data.skillIds.map(skillId => ({
            vacancyId: newVacancy.id,
            skillId: skillId
          }))
        );
      }

      // В. Связь со специальностями
      if (data.majorIds.length > 0) {
        await tx.insert(vacancyAllowedMajors).values(
          data.majorIds.map(majorId => ({
            vacancyId: newVacancy.id,
            majorId: majorId
          }))
        );
      }
    });

    revalidatePath("/practices");
    revalidatePath("/dashboard");
    return { success: true, message: "Вакансия успешно создана!" };
  } catch (error) {
    console.error("Create vacancy error:", error);
    return { success: false, message: "Ошибка при сохранении в базу данных." };
  }
}

export async function deleteVacancy(vacancyId: number) {
  const session = await auth();
  if (!session?.user) return { success: false, message: "Не авторизован" };

  try {
    // Проверка прав: Вакансия должна принадлежать организации пользователя
    const rep = await db.query.organizationRepresentatives.findFirst({
      where: eq(organizationRepresentatives.userId, parseInt(session.user.id)),
    });

    if (!rep) return { success: false, message: "Вы не представитель организации" };

    const vacancy = await db.query.vacancies.findFirst({
      where: eq(vacancies.id, vacancyId),
    });

    if (!vacancy || vacancy.organizationId !== rep.organizationId) {
      return { success: false, message: "Вакансия не найдена или нет прав" };
    }

    // Удаляем (каскадно удалятся и отклики, и связи с навыками благодаря onDelete: cascade в схеме)
    await db.delete(vacancies).where(eq(vacancies.id, vacancyId));

    revalidatePath("/dashboard");
    return { success: true, message: "Вакансия удалена" };
  } catch (error) {
    console.error("Delete vacancy error:", error);
    return { success: false, message: "Ошибка при удалении" };
  }
}

export async function toggleVacancyStatus(vacancyId: number) {
  const session = await auth();
  if (!session?.user) return { success: false, message: "Не авторизован" };

  try {
    const rep = await db.query.organizationRepresentatives.findFirst({
      where: eq(organizationRepresentatives.userId, parseInt(session.user.id)),
    });

    if (!rep) return { success: false, message: "Вы не представитель организации" };

    const vacancy = await db.query.vacancies.findFirst({
      where: eq(vacancies.id, vacancyId),
    });

    if (!vacancy || vacancy.organizationId !== rep.organizationId) {
      return { success: false, message: "Вакансия не найдена или нет прав" };
    }

    await db.update(vacancies)
      .set({ isActive: !vacancy.isActive })
      .where(eq(vacancies.id, vacancyId));

    revalidatePath("/dashboard");
    return { success: true, message: vacancy.isActive ? "Вакансия скрыта" : "Вакансия опубликована" };
  } catch (error) {
    console.error("Toggle vacancy status error:", error);
    return { success: false, message: "Ошибка при обновлении статуса" };
  }
}
