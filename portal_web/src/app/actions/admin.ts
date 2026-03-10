// src/app/actions/admin.ts
"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { organizations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function verifyOrganization(orgId: number, status: "approved" | "rejected") {
  const session = await auth();

  // 1. Проверка прав (Только сотрудник ВУЗа)
  if (!session?.user || session.user.role !== "university_staff") {
    return { success: false, message: "Нет прав доступа." };
  }

  try {
    // 2. Обновляем статус
    await db
      .update(organizations)
      .set({ verificationStatus: status })
      .where(eq(organizations.id, orgId));

    revalidatePath("/dashboard/admin");
    return { success: true, message: `Организация ${status === 'approved' ? 'одобрена' : 'отклонена'}` };
  } catch (error) {
    console.error("Verification error:", error);
    return { success: false, message: "Ошибка сервера." };
  }
}