// src/app/actions/material.ts
"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { materials } from "@/db/schema";
import { deleteFile, uploadFile } from "@/lib/s3";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { eq } from "drizzle-orm";

const materialSchema = z.object({
  title: z.string().min(3, "Название должно быть не менее 3 символов"),
  description: z.string().optional(),
  category: z.enum(["regulatory", "template", "material"]),
});

export type MaterialState = {
  success: boolean;
  message: string;
};

export async function createMaterial(
  prevState: MaterialState,
  formData: FormData
): Promise<MaterialState> {
  const session = await auth();

  if (!session?.user || session.user.role !== "university_staff") {
    return { success: false, message: "Нет прав доступа." };
  }

  const rawData = {
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
  };

  const validated = materialSchema.safeParse(rawData);
  if (!validated.success) {
    return { success: false, message: "Ошибка валидации полей." };
  }

  const file = formData.get("file") as File;
  if (!file || file.size === 0) {
    return { success: false, message: "Файл обязателен для загрузки." };
  }

  try {
    const fileUrl = await uploadFile(file, "materials");

    await db.insert(materials).values({
      title: validated.data.title,
      description: validated.data.description,
      fileUrl: fileUrl,
      category: validated.data.category,
      isPublic: true,
    });

    revalidatePath("/documents"); 
    revalidatePath("/dashboard/admin");
    
    return { success: true, message: "Материал успешно добавлен!" };
  } catch (error) {
    console.error("Material upload error:", error);
    return { success: false, message: "Ошибка сервера при загрузке." };
  }
}

export async function deleteMaterial(materialId: number) {
  const session = await auth();
  if (!session?.user || session.user.role !== "university_staff") {
    return { success: false, message: "Нет прав." };
  }

  try {
    await db.delete(materials).where(eq(materials.id, materialId));

    // Добавить удаление самого файла из S3 сервера

    revalidatePath("/documents");
    revalidatePath("/dashboard/admin");
    return { success: true };
  } catch (error) {
    console.error("Delete error:", error);
    return { success: false };
  }
}