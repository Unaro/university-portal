// src/tests/setup.ts
import "@testing-library/jest-dom/vitest";
import { beforeAll, afterEach, vi } from "vitest";

// Глобальные моки для тестов
beforeAll(() => {
  // Моки для API, которые используются во всех тестах
  global.fetch = vi.fn();
});

afterEach(() => {
  // Очищаем моки после каждого теста
  vi.clearAllMocks();
});
