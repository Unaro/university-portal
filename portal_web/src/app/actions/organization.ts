// src/app/actions/organization.ts
"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { organizations, organizationRepresentatives, users, roleEnum } from "@/db/schema";
import { registerOrganizationSchema } from "@/lib/validators/organization";
import { uploadFile } from "@/lib/s3";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type State = {
  errors?: {
    name?: string[];
    iin?: string[];
    contacts?: string[];
    logo?: string[];
  };
  message?: string | null;
};

export async function createOrganization(prevState: State, formData: FormData) {
  // 1. Проверка авторизации
  const session = await auth();
  if (!session?.user?.id) {
    return { message: "Вы не авторизованы." };
  }

  // 2. Извлекаем данные из FormData
  const rawData = {
    name: formData.get("name"),
    iin: formData.get("iin"),
    description: formData.get("description"),
    website: formData.get("website"),
    contacts: formData.get("contacts"),
    logo: formData.get("logo") as File,
  };

  // 3. Валидация Zod
  const validatedFields = registerOrganizationSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Ошибка в заполненных полях.",
    };
  }

  const { name, iin, description, website, contacts, logo } = validatedFields.data;

  try {
    // 4. Загрузка логотипа в S3 (если есть)
    let logoKey: string | null = null;
    if (logo && logo.size > 0) {
      console.log("Uploading logo to MinIO...");
      logoKey = await uploadFile(logo as File, "logos");
    }

    // 5. Транзакция в БД (Создаем организацию + Привязываем представителя)
    await db.transaction(async (tx) => {
      // А. Создаем организацию
      const [newOrg] = await tx
        .insert(organizations)
        .values({
          name,
          iin,
          description,
          website: website || null,
          contacts,
          logo: logoKey,
          verificationStatus: "pending", // Ждет модерации ВУЗа
        })
        .returning();

      // Б. Меняем роль пользователя на представителя
      // (В реальной системе может быть сложнее, но для MVP так)
      await tx
        .update(users)
        .set({ role: "organization_representative" })
        .where(eq(users.id, parseInt(session.user.id)));

      // В. Связываем пользователя с организацией
      await tx.insert(organizationRepresentatives).values({
        userId: parseInt(session.user.id),
        organizationId: newOrg.id,
        position: "Admin", // Значение по умолчанию
      });
    });

  } catch (error) {
    console.error("Database Error:", error);
    // Обработка дубликата ИИН (Postgres error code 23505)
    // @ts-expect-error error type is unknown
    if (error.code === "23505") {
      return {
        message: "Организация с таким ИИН уже существует.",
      };
    }
    return {
      message: "Не удалось создать организацию. Попробуйте позже.",
    };
  }

  // 6. Успех -> Редирект
  revalidatePath("/dashboard");
  redirect("/dashboard");
}