// src/app/actions/manage-application.ts
"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { applications, organizationRepresentatives } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Строгий тип ответа
export type ManageAppActionState = {
  success: boolean;
  message: string;
};

export async function processApplication(
  applicationId: number,
  newStatus: "approved" | "rejected",
  responseMessage: string
): Promise<ManageAppActionState> {
  const session = await auth();

  // 1. Проверка авторизации
  if (!session?.user?.id || session.user.role !== "organization_representative") {
    return { success: false, message: "Нет прав для выполнения операции." };
  }

  const userId = parseInt(session.user.id);

  // 2. Находим организацию текущего пользователя
  const representative = await db.query.organizationRepresentatives.findFirst({
    where: eq(organizationRepresentatives.userId, userId),
  });

  if (!representative) {
    return { success: false, message: "Организация не найдена." };
  }

  // 3. Проверка безопасности:
  // Принадлежит ли заявка вакансии, которая принадлежит организации пользователя?
  // Мы делаем это через JOIN запрос для максимальной надежности.
  const application = await db.query.applications.findFirst({
    where: eq(applications.id, applicationId),
    with: {
      vacancy: true, // Подгружаем вакансию
    },
  });

  if (!application) {
    return { success: false, message: "Заявка не найдена." };
  }

  // Сравниваем ID организации в вакансии с ID организации пользователя
  if (application.vacancy.organizationId !== representative.organizationId) {
    return { success: false, message: "Вы не можете управлять заявками чужой организации." };
  }

  try {
    // 4. Обновляем статус и сообщение
    await db
      .update(applications)
      .set({
        status: newStatus,
        responseMessage: responseMessage,
      })
      .where(eq(applications.id, applicationId));

    revalidatePath("/dashboard/applications"); // Обновим страницу заявок (создадим её далее)
    return { success: true, message: "Статус заявки успешно обновлен." };
  } catch (error) {
    console.error("Error processing application:", error);
    return { success: false, message: "Ошибка сервера." };
  }
}