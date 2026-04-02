// src/app/actions/register.ts
"use server";

import { db } from "@/db";
import { users, students } from "@/db/schema";
import { registerSchema } from "@/lib/validators/auth";
import { saltAndHashPassword } from "@/lib/password";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export type RegisterActionState = {
  success: boolean;
  message: string | null;
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
};

export async function registerUser(
  prevState: RegisterActionState,
  formData: FormData
): Promise<RegisterActionState> {
  // 1. Валидация данных
  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const validated = registerSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      message: validated.error.message,
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = validated.data;

  try {
    // 2. Проверка: существует ли такой email
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return {
        success: false,
        message: "Пользователь с таким Email уже существует.",
      };
    }

    // 3. Хеширование пароля
    const hashedPassword = await saltAndHashPassword(password);

    // 4. Транзакция: Создаем User + Student Profile
    await db.transaction(async (tx) => {
      // А. Создаем пользователя
      const [newUser] = await tx
        .insert(users)
        .values({
          name,
          email,
          password: hashedPassword,
          role: "student", // По умолчанию все новые — студенты
        })
        .returning();

      // Б. Создаем пустой профиль студента
      await tx.insert(students).values({
        userId: newUser.id,
      });
    });

  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: "Ошибка сервера при регистрации.",
    };
  }

  // 5. Успех -> Редирект на логин
  redirect("/login");
}