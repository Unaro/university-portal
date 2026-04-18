// src/app/actions/manage-university-application.ts
"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { applications, universityStaff } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type ManageUniversityAppActionState = {
  success: boolean;
  message: string;
};

export async function processUniversityApplication(
  applicationId: number,
  newStatus: "approved" | "rejected",
  responseMessage: string
): Promise<ManageUniversityAppActionState> {
  const session = await auth();

  // 1. Проверка авторизации
  if (!session?.user?.id || (session.user.role !== "university_staff" && session.user.role !== "admin")) {
    return { success: false, message: "Нет прав для выполнения операции." };
  }

  const userId = parseInt(session.user.id);

  // 2. Находим профиль сотрудника
  const staffProfile = await db.query.universityStaff.findFirst({
    where: eq(universityStaff.userId, userId),
  });

  if (!staffProfile) {
     return { success: false, message: "Профиль сотрудника ВУЗа не найден." };
  }

  const application = await db.query.applications.findFirst({
    where: eq(applications.id, applicationId),
    with: {
      vacancy: true,
    },
  });

  if (!application) {
    return { success: false, message: "Заявка не найдена." };
  }

  if (application.vacancy.type !== "practice") {
     return { success: false, message: "ВУЗ одобряет только заявки на практику." };
  }

  // 3.5 Проверка комментария при отказе
  if (newStatus === "rejected" && (!responseMessage || responseMessage.trim().length === 0)) {
    return { success: false, message: "При отказе необходимо указать причину." };
  }

  try {
    // 4. Обновляем статус и сообщение
    await db
      .update(applications)
      .set({
        universityApprovalStatus: newStatus,
        universityComment: responseMessage,
        universityStaffId: staffProfile.id,
        // Если отклонено ВУЗом, то общая заявка тоже отклоняется, иначе компания ее никогда не увидит
        ...(newStatus === "rejected" ? { status: "rejected" } : {})
      })
      .where(eq(applications.id, applicationId));

    revalidatePath("/dashboard/admin/applications");
    revalidatePath("/dashboard");
    return { success: true, message: "Решение ВУЗа успешно сохранено." };
  } catch (error) {
    console.error("Error processing university application:", error);
    return { success: false, message: "Ошибка сервера." };
  }
}
