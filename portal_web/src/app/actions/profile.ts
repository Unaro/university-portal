// src/app/actions/profile.ts
"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { students, studentSkills } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type ProfileState = {
  success: boolean;
  message: string;
};

export async function updateStudentProfile(
  prevState: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  const session = await auth();
  if (!session?.user || session.user.role !== "student") {
    return { success: false, message: "Нет прав доступа." };
  }

  const userId = parseInt(session.user.id);

  // 1. Собираем данные из формы
  const group = formData.get("group") as string;
  const majorId = parseInt(formData.get("majorId") as string);
  const course = parseInt(formData.get("course") as string);
  
  // Навыки приходят как JSON-строка (ID навыков), так как FormData плохо работает с массивами напрямую из JS-компонентов
  const skillsJson = formData.get("skills") as string; 
  const skillIds = skillsJson ? JSON.parse(skillsJson) as string[] : [];

  if (!majorId || !course) {
    return { success: false, message: "Заполните специальность и курс." };
  }

  try {
    await db.transaction(async (tx) => {
      // 2. Находим ID профиля студента
      const student = await tx.query.students.findFirst({
        where: eq(students.userId, userId),
      });

      if (!student) throw new Error("Student profile not found");

      // 3. Обновляем основные поля
      await tx
        .update(students)
        .set({
          group,
          majorId,
          course,
        })
        .where(eq(students.id, student.id));

      // 4. Обновляем навыки (Удалить старые -> Добавить новые)
      await tx.delete(studentSkills).where(eq(studentSkills.studentId, student.id));

      if (skillIds.length > 0) {
        await tx.insert(studentSkills).values(
          skillIds.map((skillId) => ({
            studentId: student.id,
            skillId: parseInt(skillId),
          }))
        );
      }
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/profile");
    return { success: true, message: "Профиль успешно обновлен!" };
    
  } catch (error) {
    console.error("Profile update error:", error);
    return { success: false, message: "Ошибка при сохранении профиля." };
  }
}