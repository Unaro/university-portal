// src/lib/validators/auth.ts
import { z } from "zod";

// Валидация сложности пароля:
// - Минимум 8 символов
// - Хотя бы 1 цифра
// - Хотя бы 1 заглавная буква
// - Хотя бы 1 строчная буква
// - Хотя бы 1 спецсимвол
const passwordSchema = z
  .string()
  .min(8, "Пароль должен быть не менее 8 символов")
  .regex(/[0-9]/, "Пароль должен содержать хотя бы одну цифру")
  .regex(/[a-z]/, "Пароль должен содержать хотя бы одну строчную букву")
  .regex(/[A-Z]/, "Пароль должен содержать хотя бы одну заглавную букву")
  .regex(/[^a-zA-Z0-9]/, "Пароль должен содержать хотя бы один спецсимвол");

export const registerSchema = z.object({
  name: z.string().min(2, "Имя должно быть длиннее 2 символов"),
  email: z.string().email("Некорректный Email"),
  password: passwordSchema,
});

export type RegisterSchema = z.infer<typeof registerSchema>;