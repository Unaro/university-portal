// src/app/actions/organization-settings.ts
"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { organizations, organizationRepresentatives } from "@/db/schema";
import { eq } from "drizzle-orm";
import { uploadFile } from "@/lib/s3";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateOrgSchema = z.object({
  description: z.string().optional(),
  website: z.string().optional(),
  contacts: z.string().min(5),
});

export type OrgSettingsState = {
  success: boolean;
  message: string;
};

export async function updateOrganization(
  prevState: OrgSettingsState,
  formData: FormData
): Promise<OrgSettingsState> {
  const session = await auth();
  if (!session?.user) return { success: false, message: "Не авторизован" };

  // 1. Ищем организацию пользователя
  const rep = await db.query.organizationRepresentatives.findFirst({
    where: eq(organizationRepresentatives.userId, parseInt(session.user.id)),
  });

  if (!rep) return { success: false, message: "Организация не найдена" };

  // 2. Валидация
  const rawData = {
    description: formData.get("description"),
    website: formData.get("website"),
    contacts: formData.get("contacts"),
  };

  const validated = updateOrgSchema.safeParse(rawData);
  if (!validated.success) {
    return { success: false, message: "Ошибка в полях формы" };
  }

  // 3. Обработка файла (Логотип)
  const logoFile = formData.get("logo") as File;
  let logoKey = undefined;

  if (logoFile && logoFile.size > 0) {
    if (!logoFile.type.startsWith("image/")) {
      return { success: false, message: "Логотип должен быть изображением" };
    }
    logoKey = await uploadFile(logoFile, "logos");
  }

  try {
    // 4. Обновление в БД
    await db
      .update(organizations)
      .set({
        description: validated.data.description,
        website: validated.data.website,
        contacts: validated.data.contacts,
        ...(logoKey ? { logo: logoKey } : {}), // Обновляем лого только если загрузили новое
      })
      .where(eq(organizations.id, rep.organizationId));

    revalidatePath("/dashboard");
    return { success: true, message: "Данные организации обновлены" };
  } catch (error) {
    console.error("Update org error:", error);
    return { success: false, message: "Ошибка сервера" };
  }
}