// src/shared/types/action.ts

/**
 * Базовый тип ответа для всех Server Actions
 * @template T - тип данных, возвращаемых при успехе
 */
export type ActionResponse<T = unknown> =
  | {
      success: true;
      data?: T;
      message?: string;
    }
  | {
      success: false;
      data?: never;
      message: string;
      errors?: Record<string, string[]>;
      code?:
        | "UNAUTHORIZED"
        | "FORBIDDEN"
        | "NOT_FOUND"
        | "VALIDATION_ERROR"
        | "DATABASE_ERROR"
        | "CONFLICT"
        | "SERVER_ERROR";
    };

/**
 * Упрощённый тип для действий без данных (только успех/ошибка)
 */
export type ActionResponseVoid = Omit<ActionResponse<never>, "data">;

/**
 * Тип для пагинации
 */
export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
};

/**
 * Helper для создания успешного ответа
 */
export function successResponse<T>(data?: T, message?: string): ActionResponse<T> {
  return { success: true, data, message };
}

/**
 * Helper для создания ответа с ошибкой
 */
export function errorResponse(
  message: string,
  options?: {
    code?: "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND" | "VALIDATION_ERROR" | "DATABASE_ERROR" | "CONFLICT" | "SERVER_ERROR";
    errors?: Record<string, string[]>;
  }
): ActionResponse<never> {
  return {
    success: false,
    message,
    code: options?.code,
    errors: options?.errors,
  };
}
