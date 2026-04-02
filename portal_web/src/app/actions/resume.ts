// src/app/actions/resume.ts
"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { resumes, students } from "@/db/schema";
import { eq } from "drizzle-orm";
import { uploadFile } from "@/lib/s3";
import { revalidatePath } from "next/cache";

export type ResumeActionState = {
  success: boolean;
  message: string;
};

export async function saveResume(
  prevState: ResumeActionState,
  formData: FormData
): Promise<ResumeActionState> {
  const session = await auth();

  // 1. Проверка прав
  if (!session?.user?.id || session.user.role !== "student") {
    return { success: false, message: "Только студенты могут создавать резюме." };
  }

  const userId = parseInt(session.user.id);

  try {
    // 2. Находим профиль студента
    const studentProfile = await db.query.students.findFirst({
      where: eq(students.userId, userId),
    });

    if (!studentProfile) {
      return { success: false, message: "Профиль студента не найден. Заполните данные в настройках." };
    }

    // 3. Данные формы
    const bio = formData.get("bio") as string;
    const file = formData.get("file") as File;

    // 4. Загрузка файла
    let fileUrl: string | undefined = undefined;
    if (file && file.size > 0) {
      if (file.type !== "application/pdf") {
        return { success: false, message: "Разрешены только PDF файлы." };
      }
      fileUrl = await uploadFile(file, "resumes");
    }

    // 5. Сохранение (Upsert)
    await db
      .insert(resumes)
      .values({
        studentId: studentProfile.id,
        bio: bio,
        fileUrl: fileUrl,
      })
      .onConflictDoUpdate({
        target: resumes.studentId,
        set: {
          bio: bio,
          ...(fileUrl ? { fileUrl } : {}),
          updatedAt: new Date(),
        },
      });

    revalidatePath("/dashboard/resume");
    return { success: true, message: "Резюме успешно сохранено!" };
  } catch (error) {
    console.error("Resume save error:", error);
    return { success: false, message: "Ошибка при сохранении резюме." };
  }
}