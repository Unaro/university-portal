import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitest.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    // Использовать jsdom для эмуляции браузера
    environment: "jsdom",
    // Глобальные API (describe, it, expect) без импорта
    globals: true,
    // Автоматически импортировать matchers из Testing Library
    setupFiles: ["./src/tests/setup.ts"],
    // Путь к тестам
    include: ["src/**/*.{test,spec}.{js,ts,jsx,tsx}"],
    // Исключения
    exclude: ["**/node_modules/**", "**/dist/**", "**/.next/**"],
    // Покрытие кода
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.d.ts", "src/**/*.{test,spec}.{ts,tsx}", "src/tests/**"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
