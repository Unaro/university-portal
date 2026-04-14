// src/lib/validators/organization.ts
import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const registerOrganizationSchema = z.object({
  name: z.string().min(2, "Название должно быть длиннее 2 символов"),
  iin: z.string().length(12, "ИИН должен состоять из 12 цифр").regex(/^\d+$/, "ИИН должен содержать только цифры"),
  description: z.string().optional(),
  website: z.string().url("Введите корректкий URL").optional().or(z.literal("")),
  contacts: z.string().min(5, "Укажите контактные данные"),
  logo: z
    .any()
    .refine(
      (file) => file === null || file === undefined || file instanceof File || (file?.size && file?.type),
      { message: "Требуется файл изображения" }
    )
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, `Максимальный размер файла 5MB.`)
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Поддерживаются только форматы .jpg, .jpeg, .png and .webp."
    )
    .optional()
    .nullable(),
});