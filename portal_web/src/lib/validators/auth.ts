// src/lib/validators/auth.ts
import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Имя должно быть длиннее 2 символов"),
  email: z.string().email("Некорректный Email"),
  password: z.string().min(6, "Пароль должен быть не менее 6 символов"),
});

export type RegisterSchema = z.infer<typeof registerSchema>;