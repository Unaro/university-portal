// src/app/actions/auth.ts
"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

// 1. Создаем строгий тип состояния
export type AuthState = {
  message?: string | null;
  success?: boolean;
  errors?: Record<string, string[]>; 
};

export async function authenticate(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  try {
    // 2. УБРАЛИ { redirect: false }. 
    // Теперь функция сигнатурно правильная.
    // Мы передаем redirectTo, чтобы NextAuth знал, куда мы хотим (хотя мы перехватим это).
    await signIn("credentials", formData, { redirectTo: "/dashboard" });
    
    // Этот код недостижим, так как signIn выбросит ошибку при успехе.
    return { success: true, message: "Вход выполнен успешно!" };

  } catch (error) {
    // 3. Обработка ошибок авторизации (неверный пароль)
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, message: "Неверный логин или пароль." };
        default:
          return { success: false, message: "Произошла ошибка входа." };
      }
    }

    // 4. ВАЖНЕЙШИЙ МОМЕНТ:
    // Если ошибка НЕ является AuthError, значит это успешный редирект от Next.js (NEXT_REDIRECT).
    // Мы намеренно "ловим" его здесь и возвращаем JSON-успех клиенту.
    // Это позволяет клиентскому коду (login-form) выполнить router.refresh() и обновить хедер.
    return { success: true, message: "Вход выполнен успешно!" };
  }
}