// src/app/actions/register-partner.ts
"use server";

import { db } from "@/db";
import { users, organizations, organizationRepresentatives } from "@/db/schema";
import { saltAndHashPassword } from "@/lib/password";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";

// Схема валидации
const registerPartnerSchema = z.object({
  companyName: z.string().min(2),
  iin: z.string().length(12),
  contactName: z.string().min(2),
  phone: z.string().min(5),
  email: z.string().email(),
  password: z.string().min(6),
});

export type RegisterState = {
  success: boolean;
  message: string;
};

export async function registerPartner(
  prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  // 1. Собираем данные
  const rawData = {
    companyName: formData.get("companyName"),
    iin: formData.get("iin"),
    contactName: formData.get("contactName"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    password: formData.get("password"),
  };

  // 2. Валидация
  const validated = registerPartnerSchema.safeParse(rawData);
  if (!validated.success) {
    return { success: false, message: "Ошибка в полях формы. Проверьте данные." };
  }
  const data = validated.data;

  try {
    // 3. Проверка Email
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, data.email),
    });
    if (existingUser) return { success: false, message: "Email уже занят." };

    // 4. Проверка ИИН (Организации)
    const existingOrg = await db.query.organizations.findFirst({
      where: eq(organizations.iin, data.iin),
    });
    if (existingOrg) return { success: false, message: "Организация с таким ИИН уже существует." };

    const hashedPassword = await saltAndHashPassword(data.password);

    // 5. ТРАНЗАКЦИЯ
    await db.transaction(async (tx) => {
      // А. Создаем пользователя
      const [newUser] = await tx.insert(users).values({
        name: data.contactName,
        email: data.email,
        password: hashedPassword,
        role: "organization_representative",
      }).returning();

      // Б. Создаем организацию (pending)
      const [newOrg] = await tx.insert(organizations).values({
        name: data.companyName,
        iin: data.iin,
        contacts: data.phone,
        verificationStatus: "pending",
      }).returning();

      // В. Связываем
      await tx.insert(organizationRepresentatives).values({
        userId: newUser.id,
        organizationId: newOrg.id,
        position: "Admin",
      });
    });

  } catch (error) {
    console.error("Partner registration error:", error);
    return { success: false, message: "Ошибка сервера." };
  }

  redirect("/login?registered=true");
}